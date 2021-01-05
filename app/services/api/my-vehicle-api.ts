import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import AuthStore from "../../store/auth-store/auth-store"

import { GeneralApiProblem } from "./api-problem"

/**
 * Manages all requests to the API.
 */
export class MyVehicleAPI {
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
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        // Authorization: AuthStore.profile.token.accessToken
      },
    })
  }
  /**
   * Gets a list of users.
   */
  async find(filter?: Types.VehicleFilterRequest | {}): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.get('api/v1/mobile/carriers/truck', filter)
      // the typical ways to die when calling an api
      console.log("Response call api get user (MOCK) : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api get user (MOCK): ", error)
      return error
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`api/v1/mobile/carriers/truck/${id}`)

      console.log("Response call api get user (MOCK) : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api get user (MOCK): ", error)
      return error
    }
  }
  /*
    async update(id: string, data?: Types.VehicleRequest): Promise<any> {
      try {
        const response: ApiResponse<any> = await this.apisauce.put(`api/v1/mobile/carriers/truck/edit/${id}`, data)
  
        console.log("Response call api get user (MOCK) : ", response)
        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }
        return { kind: "ok", data: response.data }
        // transform the data into the format we are expecting
      } catch (error) {
        console.log("Error call api get user (MOCK): ", error)
        return error
      }
    }
  
    async delete(id: number): Promise<any> {
      try {
        const response: ApiResponse<any> = await this.apisauce.delete(`api/v1/mobile/carriers/truck/${id}`)
  
        console.log("Response call api get user (MOCK) : ", response)
        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }
        return { kind: "ok", data: response.data }
        // transform the data into the format we are expecting
      } catch (error) {
        console.log("Error call api get user (MOCK): ", error)
        return error
      }
    }
  */
  async createVehicleProfile(params: any): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post(`api/v1/mobile/carriers/truck`, params)
      // the typical ways to die when calling an api
      console.log("Response call api create upload vehicle profile (MOCK) : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return response
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api create upload vehicle profile (MOCK): ", error)
      return error
    }
  }

  async patchMyVehicle(params: any): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.put(`api/v1/mobile/carriers/truck/edit/${params.id}`, params)
      // the typical ways to die when calling an api
      console.log("Response call api patch upload vehicle profile (MOCK) : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return response
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api patch upload vehicle profile (MOCK): ", error)
      return error
    }
  }
}
