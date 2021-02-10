import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as storage from "../../utils/storage"
import * as Types from "./api.types"
/**
 * Manages all requests to the API.
 */
export class UserTruckAPI {
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
    // let to
    let to = await this.getToken()
      .then(val => {
        return val?.tokenStore?.token?.accessToken || ''
      })

    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${to}`
      },
    })
  }
  /**
   * Gets a list truck of users.
   */
  async find(filter: Types.UserTruckFilter = {}): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.post('/api/v1/mobile/truck/list/user', filter)
      console.log("User truck list api [find] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
    } catch (error) {
      console.log("Error call api find all user truck list : ", error)
      return error
    }
  }
}
