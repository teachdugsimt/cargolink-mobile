import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import i18n from 'i18n-js'
import { GOOGLE_API_KEY } from '../../config/env'
/**
 * Manages all requests to the API.
 */
export class GoogleMapAPI {
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

  async setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: 'https://maps.googleapis.com',
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async getDirections(startLoc: string, destinationLoc: string): Promise<any> {
    // make the api call
    try {
      const KEY = process.env.MAP_API_KEY || 'AIzaSyD_xZbQQVruH1NWLqCE2kgSWBPoWH7l3Sw'
      const response: ApiResponse<any> = await this.apisauce.get(`/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`)
      // the typical ways to die when calling an api
      console.log("Google map api [getDirections] : ", JSON.stringify(response))
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api get google map : ", error)
      return error
    }
  }

  async getLocationMap(latitude: string, longitude: string, language: string = i18n.locale): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=${language}`)
      // const response: ApiResponse<any> = await this.apisauce.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=13.736717,100.523186&radius=50&key=${GOOGLE_API_KEY}&language=${language}`)

      // the typical ways to die when calling an api
      __DEV__ && console.tron.log("Response call Google New API :: ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api get google map : ", error)
      return error
    }
  }



}
