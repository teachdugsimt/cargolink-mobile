import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

// import { GeneralApiProblem } from "./api-problem"

/**
 * Manages all requests to the API.
 */
export class AuthAPI {
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
      },
    })
  }

  /**
   * Signin
   */
  async signIn(data: Types.AuthRequest): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        'api/v1/users/auth/otp-request',
        data,
      )
      // the typical ways to die when calling an api
      console.log("Response call api get user (MOCK) : ", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const resultUser: Types.AuthReponse = {
        refCode: response.data.refCode,
        expireTime: response.data.expireTime,
      }
      return { kind: "ok", data: resultUser }
      // transform the data into the format we are expecting
    } catch (error) {
      console.log("Error call api get user (MOCK): ", error)
      return error
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(data: Types.OTPVerifyRequest): Promise<any> {
    // make the api call
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        'api/v1/users/auth/otp-verify',
        data,
      )
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
}
