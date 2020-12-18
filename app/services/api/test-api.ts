import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
// import * as Types from "./api.types"

import { GeneralApiProblem } from "./api-problem"

import { createServer } from "miragejs"
__DEV__ && createServer({
    routes() {
        this.get("https://jsonplaceholder.typicode.com/todos/", () => [
            { id: "1", name: "Luke" },
            { id: "2", name: "Leia" },
            { id: "3", name: "Anakin" },
        ])

        // Now use this
        this.get("https://jsonplaceholder.typicode.com/todos/1", () => [
            { id: "1", name: "Luke" },
            { id: "2", name: "Leia" },
            { id: "3", name: "Anakin" },
        ])

        this.post("https://jsonplaceholder.typicode.com/todos/post", (schema, request) => {
            let attrs = JSON.parse(request.requestBody)
            console.log(attrs)
            // debugger
            return { id: '4', name: "Fluke" }
        })
    },
})
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
        try {
            const response: ApiResponse<any> = await this.apisauce.get('todos/1')
            // the typical ways to die when calling an api
            console.log("Response call api get user (MOCK) : ", response)
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return problem
            }
            return response
            // transform the data into the format we are expecting
        } catch (error) {
            console.log("Error call api get user (MOCK): ", error)
            return error
        }

    }


}
