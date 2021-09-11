import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as storage from "../../utils/storage"
// import * as Types from "./api.types"

/**
 * Manages all requests to the API.
 */
export class ProfileApi {
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
        // Authorization: `Bearer ${to}`
        Authorization: `${to}`
      },
    })
  }

  async getProfile(params: any = null): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/users/me', { userId: params })
      __DEV__ && console.tron.log("Response call api get PROFILE : ", response)
      // if (!response.ok) {
      //   const problem = getGeneralApiProblem(response)
      //   if (problem) return problem
      // }
      return response
    } catch (error) {
      __DEV__ && console.tron.log("Error call api get PROFILE: ", error)
      return error
    }

  }

  async getTruckSummary(params: any = null): Promise<any> {
    // make the api call
    try {
      // const response: ApiResponse<any> = await this.apisauce.get('/api/v1/mobile/multi-roles/profile/truck-summary', params)
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/trucks/my-truck', params)
      console.log("Response call api get PROFILE : ", response)
      // if (!response.ok) {
      //   const problem = getGeneralApiProblem(response)
      //   if (problem) return problem
      // }
      return response
    } catch (error) {
      console.log("Error call api get PROFILE: ", error)
      return error
    }

  }


  async updateProfile(params: any = {}): Promise<any> {
    // make the api call
    try {
      // const response: ApiResponse<any> = await this.apisauce.post('/api/v1/mobile/multi-roles/profile', params)
      const response: ApiResponse<any> = await this.apisauce.patch('/api/v1/users/me', params)
      console.log("Response call api patch profile : ", response)
      // if (!response.ok) {
      //   const problem = getGeneralApiProblem(response)
      //   if (problem) return problem
      // }
      return response
    } catch (error) {
      console.log("Error call api get PROFILE: ", error)
      return error
    }

  }

  async getUserReport(id: string | number): Promise<any> {
    // make the api call
    try {
      // const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/user/profile/${id}`)
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/users/${id}/profile-trucks`)
      console.log("Response call api get getUserReport : ", response)
      // if (!response.ok) {
      //   const problem = getGeneralApiProblem(response)
      //   if (problem) return problem
      // }
      return response
    } catch (error) {
      console.log("Error call api get getUserReport: ", error)
      return error
    }
  }


  async getPartnerTermAndCondition(id: string): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/users/${id}/term-of-service-partner`)
      console.log("Response call api get getPartnerTermAndCondition : ", response)
      return response
    } catch (error) {
      console.log("Error call api get getUserReport: ", error)
      return error
    }
  }


}
