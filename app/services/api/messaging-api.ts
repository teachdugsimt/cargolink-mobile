import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import AuthStore from "../../store/auth-store/auth-store"
import { GeneralApiProblem } from "./api-problem"
import * as storage from "../../utils/storage"
/**
 * Manages all requests to the API.
 */
export class MessagingAPI {
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
    // console.log("Setup header token my-vehicle-api :: ", token)
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
  /**
   * Gets a list of users.
   */

  async addToken(params: any): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post(`/api/v1/messaging/notification/add-token`, params)
      return response
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api create POSTJOB : ", error)
      return error
    }
  }
}
