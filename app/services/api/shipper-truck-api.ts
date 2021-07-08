import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import * as storage from "../../utils/storage"

/**
 * Manages all requests to the API.
 */
export class ShipperTruckAPI {
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

  parseFilter(filter: any) {
    let newFilter = JSON.parse(JSON.stringify(filter))
    if (filter && Object.keys(filter).length > 0 && (newFilter.workingZones || newFilter.truckTypes)) {
      newFilter.workingZones = JSON.stringify(filter.workingZones)
      newFilter.truckTypes = JSON.stringify(filter.truckTypes)
    }
    return newFilter
  }
  /**
   * Gets a list of users.
   */
  async find(filter: Types.ShipperTruckFilter | {} = {}): Promise<any> {
    // make the api call
    try {
      const params = this.parseFilter(filter)
      console.log("Filter on api :: ", params)
      // const response: ApiResponse<any> = await this.apisauce.post('/api/v1/mobile/truck/list', filter)
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/trucks', params)
      console.log("Shipper truck api [find] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api find all shipper truck : ", error)
      return error
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      // const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/mobile/truck/${id}`)
      const response: ApiResponse<any> = await this.apisauce.get(`/api/v1/trucks/view/${id}`)
      console.log("Shipper truck api [findOne] : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api find one shipper truck : ", error)
      return error
    }
  }

}
