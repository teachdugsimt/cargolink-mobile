import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
// import * as Types from "./api.types"

import { GeneralApiProblem } from "./api-problem"
interface User {
    id: number
    name: string
}
export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem




/**
 * Manages all requests to the API.
 */
export class TestApi {
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
     * Gets a list of users.
     */

    async getUsers(): Promise<any> {
        // make the api call
        const response: ApiResponse<any> = await this.apisauce.get('todos/1')
        console.log("Real response :: ", response)
        console.log("Real response :: ", response)

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        const convertUser = (raw) => {
            return {
                id: raw.id,
                name: raw.name,
            }
        }
        // transform the data into the format we are expecting
        try {
            const rawUsers = response.data
            const resultUsers: User[] = rawUsers.map(convertUser)
            return { kind: "ok", users: resultUsers }
        } catch {
            return { kind: "bad-data" }
        }
    }


}
