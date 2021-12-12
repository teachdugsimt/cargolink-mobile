import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import * as storage from "../../utils/storage"

interface FavoriteJob {
  id: string
}

/**
 * Manages all requests to the API.
 */
export class FavoriteTruckAPI {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance
  /**
   * Configurable options.
   */
  config: ApiConfig
  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }
  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */

  async getToken() {
    let data: any = await storage.load('root')
    return data
  }

  async setup() {
    let to = await this.getToken()
      .then(val => {
        return val?.tokenStore?.token?.accessToken || ''
      })

    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        Authorization: `${to}`
      },
    })
  }

  async find(filter: Types.ShipperJobRequest | {} = {}): Promise<any> {
    try {
      const newFilter: Types.ShipperJobRequest = filter
      newFilter.page = 1
      newFilter.rowsPerPage = 500

      // const response: ApiResponse<any> = await this.apisauce.get('/api/v1/mobile/shippers/truck/favorite', filter)
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/trucks/favorite', newFilter)
      console.log("Favorit job api [find] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
    } catch (error) {
      console.log("Error call api find all Favorit job : ", error)
      return error
    }
  }

  async create(params: FavoriteJob): Promise<any> {
    try {
      // const response: ApiResponse<any> = await this.apisauce.post(`/api/v1/mobile/shippers/truck/favorite/add`, params)
      const response: ApiResponse<any> = await this.apisauce.post(`/api/v1/trucks/favorite`, params)
      console.log("Favorit job api [create] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
    } catch (error) {
      console.log("Error call api create Favorit job : ", error)
      return error
    }
  }
}
