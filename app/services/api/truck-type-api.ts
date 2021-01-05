import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"

/**
 * Manages all requests to the API.
 */
export class TruckTypeApi {
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
    setup(params) {
        // construct the apisauce instance
        this.apisauce = create({
            baseURL: this.config.url,
            timeout: this.config.timeout,
            headers: {
                Accept: "application/json",
                "Accept-Language": params
                // Authorization: AuthStore.profile.token.accessToken
            },
        })
    }
    /**
     * Gets a list of users.
     */
    async getTruckTypeDropdown(filter: any): Promise<any> {
        // make the api call
        console.log("Filter truck type  :: ", filter)
        try {
            const response: ApiResponse<any> = await this.apisauce.get('api/v1/mobile/carriers/truck/truck-type', filter)
            // the typical ways to die when calling an api
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return problem
            }

            // let tmp = JSON.parse(JSON.stringify(response.data))
            // if (response.data && response.data.length) {
            //     tmp.map(e => {
            //         e.label = e.name
            //         e.value = e.id
            //         e.ID = e.id
            //     })
            //     return tmp
            // } else return []

            return response

            // transform the data into the format we are expecting
        } catch (error) {
            console.log("Error call api getTruckTypeDropdown (MOCK): ", error)
            return error
        }
    }

}
