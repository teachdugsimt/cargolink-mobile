import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
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

    async getProfile(params: any): Promise<any> {
        // make the api call
        try {
            const response: ApiResponse<any> = await this.apisauce.get('profile/v1', params)
            // the typical ways to die when calling an api
            console.log("Response call api get PROFILE (MOCK) : ", response)
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return problem
            }
            return response
            // transform the data into the format we are expecting
        } catch (error) {
            console.log("Error call api get PROFILE (MOCK): ", error)
            return error
        }

    }

}