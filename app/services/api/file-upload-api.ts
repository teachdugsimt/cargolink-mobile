import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as storage from "../../utils/storage"
/**
 * Manages all requests to the API.
 */
export class FileUploadApi {
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
    // construct the apisauce instance
    let to = await this.getToken()
      .then(val => {
        return val?.tokenStore?.token?.accessToken || ''
      })

    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        // "Content-Type": "multipart/form-data",
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${to}`
      },
    })
  }

  async uploadVehiclePicture(params: any): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post(`api/v1/media/upload`, params)
      console.log("Response call  upload documents : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return response
    } catch (error) {
      __DEV__ && console.tron.log("Error call api upload vehicle picture profile : ", error)
      return error
    }
  }

}
