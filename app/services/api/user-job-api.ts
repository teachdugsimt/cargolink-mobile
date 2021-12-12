import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as storage from "../../utils/storage"
import * as Types from "./api.types"
/**
 * Manages all requests to the API.
 */
export class UserJobAPI {
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
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }
  /**
   * Gets a list job of users.
   */
  async find(filter: Types.UserJobFilter = {}): Promise<any> {
    try {
      const tmp: any = filter
      if (tmp?.type) {
        tmp.status = filter.type == 1 ? "INPROGRESS" : (filter.type == 2 ? "DONE" : "NEW")
        // tmp.rowsPerPage = 500
        // tmp.page = 1
      }
      // const response: ApiResponse<any> = await this.apisauce.post('/api/v1/mobile/job/list/user', filter)
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/jobs/list/user', tmp)
      console.log("User job list api [find] :", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
    } catch (error) {
      console.log("Error call api find all user job list :", error)
      return error
    }
  }

  async findUserJob(filter: Types.UserJobListFilter = {}): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.apisauce.get('/api/v1/jobs/list/user', filter)
      console.log("User job list api [find] :", response)
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      return { kind: "ok", data: response.data }
    } catch (error) {
      console.log("Error call api find all user job list :", error)
      return error
    }
  }
}
