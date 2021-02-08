import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import * as storage from "../../utils/storage"

/**
 * Manages all requests to the API.
 */
export class ShippersHistoryCallAPI {
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
        Authorization: `Bearer ${to}`
      },
    })
  }

  async find(filter: any = {}): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/mobile/shippers/history/call', filter)
      console.log("Shippers history api [find] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
    } catch (error) {
      console.log("Error call api find all shippers history : ", error)
      return error
    }
  }

  async add(data: Types.ShippersHistoryCallAdd): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.post('/api/v1/mobile/shippers/history/call/add', data)
      console.log("Shippers history api [Add] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
    } catch (error) {
      console.log("Error call api add shippers history : ", error)
      return error
    }
  }

}
