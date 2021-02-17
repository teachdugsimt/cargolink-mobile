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
        // Authorization: AuthStore.profile.token.accessToken
        // Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MTIiLCJBVVRIIjpbeyJhdXRob3JpdHkiOiJSRVNFVF9QV0QifSx7ImF1dGhvcml0eSI6IlZJRVdfVkVISUNMRSJ9LHsiYXV0aG9yaXR5IjoiQUREX09SREVSIn0seyJhdXRob3JpdHkiOiJMSVNUX1RSSVAifSx7ImF1dGhvcml0eSI6IlJFR19BQ0MifSx7ImF1dGhvcml0eSI6Ik1PRElGWV9EUklWRVIifSx7ImF1dGhvcml0eSI6IlJPTEVfU0hJUFBFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1JPVVRFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9ST1VURSJ9LHsiYXV0aG9yaXR5IjoiUk9MRV9DQVJSSUVSIn0seyJhdXRob3JpdHkiOiJDT05GSVJNX09SREVSIn0seyJhdXRob3JpdHkiOiJNT0RJRllfSU5GTyJ9LHsiYXV0aG9yaXR5IjoiU09GVF9ERUxFVEVfT1JERVIifSx7ImF1dGhvcml0eSI6IlNJR05PVVQifSx7ImF1dGhvcml0eSI6IlJFUExZX09SREVSIn0seyJhdXRob3JpdHkiOiJSRVBPUlRfVFJBTlMifSx7ImF1dGhvcml0eSI6IlZFUklGWV9DT05UQUNUIn0seyJhdXRob3JpdHkiOiJBRERfVFJJUCJ9LHsiYXV0aG9yaXR5IjoiTElTVF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJVUERBVEVfUFJPRklMRSJ9LHsiYXV0aG9yaXR5IjoiTElTVF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkFERF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkNIQU5HRV9QV0QifSx7ImF1dGhvcml0eSI6IkRFVEFJTF9UUkFOUyJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX09SREVSIn0seyJhdXRob3JpdHkiOiJTSUdOSU4ifSx7ImF1dGhvcml0eSI6IlNPRlRfREVMRVRFX0RSSVZFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1ZFSElDTEUifSx7ImF1dGhvcml0eSI6IlVQTE9BRF9ET0NTIn0seyJhdXRob3JpdHkiOiJBRERfVFJBTlMifSx7ImF1dGhvcml0eSI6IkFERF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJBU1NJR05fVkVISUNMRV9EUklWRVIifSx7ImF1dGhvcml0eSI6IkxJU1RfT1JERVIifSx7ImF1dGhvcml0eSI6IkFERF9ST1VURSJ9XSwiZXhwIjoxNjEwMDQ2MzUxfQ.dQT87bAXnrb0qbvwmcSwxXYiVXKh8EX0YbRg7csl6Lm9Qb7WLmQnjpLOOMAKJuEfwRCN7FONhyNF5F0yxZ94RA"
        // Authorization: `Bearer ${token}`
        Authorization: `Bearer ${to}`
      },
    })
  }
  /**
   * Gets a list of users.
   */
  async find(filter?: Types.VehicleFilterRequest | {}): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post('api/v1/mobile/carriers/truck/list', filter)
      // the typical ways to die when calling an api
      console.log("Response call api list my truck : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api list my truck: ", error)
      return error
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`api/v1/mobile/carriers/truck/${id}`)

      console.log("Response call api get truck ttype by id : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api get truck ttype by id: ", error)
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
      const response: ApiResponse<any> = await this.apisauce.put(`api/v1/mobile/carriers/truck/edit/${params.carrierId}`, params)
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
