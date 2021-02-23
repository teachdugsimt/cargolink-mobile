import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as storage from "../../utils/storage"
import i18n from 'i18n-js'
/**
 * Manages all requests to the API.
 */
export class TruckTypeApi {
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

  async setup(params = i18n.locale) {
    // let to
    let to = await this.getToken()
      .then(val => {
        return val?.tokenStore?.token?.accessToken || ''
      })


    // construct the apisauce instance
    // console.log("Setup token header truck-type-api :: ", token)
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "Accept-Language": params,
        Authorization: `Bearer ${to}`
      },
    })
  }
  /**
   * Gets a list of users.
   */
  async getTruckTypeDropdown(filter: any): Promise<any> {
    // make the api call
    // console.log("Filter truck type  :: ", filter)
    try {
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/mobile/mst/truck/truck-type')
      // the typical ways to die when calling an api
      console.log("Response :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return response

      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api getTruckTypeDropdown (MOCK): ", error)
      return error
    }
  }

  async getGroup(filter: any = {}): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/mobile/mst/truck/truck-type/group', filter)
      console.log("Response :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api getTruckTypeDropdown (MOCK): ", error)
      return error
    }
  }

}
