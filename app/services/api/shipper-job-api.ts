import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import AuthStore from "../../store/auth-store/auth-store"
import * as storage from "../../utils/storage"

/**
 * Manages all requests to the API.
 */
export class ShipperJobAPI {
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
  /**
   * Gets a list of users.
   */
  async find(filter: Types.ShipperJobRequest | {} = {}): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post('/api/v1/mobile/shippers/jobs/list', filter)
      // the typical ways to die when calling an api
      console.log("Shipper job api [find] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api find all shipper job : ", error)
      return error
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/shippers/jobs/${id}`)

      console.log("Shipper job api [findOne] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api find one shipper job : ", error)
      return error
    }
  }

  async update(id: string, data?: Types.ShipperJobCreate): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.put(`/api/v1/mobile/shippers/jobs/${id}`, data)

      console.log("Shipper job api [update] : ", JSON.stringify(response))
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api update shipper job : ", error)
      return error
    }
  }

  async create(params: Types.ShipperJobCreate): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post(`/api/v1/mobile/shippers/jobs`, params)
      // the typical ways to die when calling an api
      console.log("Shipper job api [create] : ", JSON.stringify(response))
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api create shipper job : ", error)
      return error
    }
  }

  async delete(id: string): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.delete(`/api/v1/mobile/shippers/jobs/delete/${id}`)
      // the typical ways to die when calling an api
      console.log("Shipper job api [delete] : ", JSON.stringify(response))
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api delete shipper job : ", error)
      return error
    }
  }

  async rating(data: Types.RatingBody): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post(`/api/v1/mobile/shippers/jobs/rating`, data)
      // the typical ways to die when calling an api
      console.log("Shipper job api [rating] : ", JSON.stringify(response))
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api rating shipper job : ", error)
      return error
    }
  }
}
