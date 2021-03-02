import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { BookingBody } from './api.types'
import * as storage from "../../utils/storage"
import * as Types from "./api.types"
import i18n from 'i18n-js'
/**
 * Manages all requests to the API.
 */
export class BookingApi {
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
    let to = await this.getToken()
      .then(val => {
        return val?.tokenStore?.token?.accessToken || ''
      })

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

  async addCarrierJobBookingOne(body: BookingBody): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(`/api/v1/mobile/carriers/job/booking`, body)
      console.log("Response addCarrierJobBookingOne :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api addCarrierJobBookingOne : ", error)
      return error
    }
  }

  async findShipperJobOne(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/shippers/jobs/${id}`)
      console.log("Response findShipperJobOne :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api findShipperJobOne : ", error)
      return error
    }
  }

  async updateBooking(data: BookingBody): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(`/api/v1/mobile/shippers/truck/booking`, data)
      console.log("Response updateBooking :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api updateBooking : ", error)
      return error
    }
  }

  async findCarrierMyJob(): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/carriers/my-job`)
      console.log("Response findCarrierMyJob :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api findCarrierMyJob : ", error)
      return error
    }
  }
  async findCarrierMyJobOne(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/carriers/my-job/${id}`)
      console.log("Response findCarrierMyJobOne :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api findCarrierMyJobOne : ", error)
      return error
    }
  }



  async findShipperJobBookingAccept(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/shippers/jobs/booking/accept/${id}`)
      console.log("Response findShipperJobBookingAccept :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api findShipperJobBookingAccept : ", error)
      return error
    }
  }
  async findShipperJobBookingReject(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/shippers/jobs/booking/reject/${id}`)
      console.log("Response findShipperJobBookingReject :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api findShipperJobBookingReject : ", error)
      return error
    }
  }
  async findCarrierTruckBookingAccept(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/carriers/truck/booking/accept/${id}`)
      console.log("Response findCarrierTruckBookingAccept :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api findCarrierTruckBookingAccept : ", error)
      return error
    }
  }
  async findCarrierTruckBookingReject(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/carriers/truck/booking/reject/${id}`)
      console.log("Response findCarrierTruckBookingReject :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api findCarrierTruckBookingReject : ", error)
      return error
    }
  }

  async findCarrierJob(filter: Types.ShipperJobRequest | {} = {}): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(`/api/v1/mobile/carriers/job`, filter)
      console.log("Response findCarrierMyJob (carrier accept job booking) :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api findCarrierMyJob (carrier accept job booking) : ", error)
      return error
    }
  }

  async finishJob(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/shippers/jobs/finish/${id}`)
      console.log("Response finishJob (apisauce) :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: 'ok', data: response.data }
    } catch (error) {
      console.log("Error call api finishJob (apisauce) : ", error)
      return error
    }
  }



}
