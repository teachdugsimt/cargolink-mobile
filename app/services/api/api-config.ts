// Use this import if you want to use "env.js" file
// const { API_URL } = require("../../config/env")
// Or just specify it directly like this:
// const API_URL = "https://jsonplaceholder.typicode.com/"
const { API_URL, API_URL_DEV } = require("../../config/env")

import { createServer } from "miragejs"

__DEV__ && createServer({
  routes() {
    // Now use this
    this.get(`${API_URL}todos/1`, () => [
      { id: "1", name: "Luke" },
      { id: "2", name: "Leia" },
      { id: "3", name: "Anakin" },
    ])

    this.get(`${API_URL}profile/v1`, (params) => {
      console.log("API CONFIG PARAMS :: ", params)
      return {
        first_name: 'John',
        last_name: 'Wick',
        age: 49,
        account_type: 'Premium Account',
        tel_no: '0929818252',
        work_zone: ['Suphanburee', 'Nakhonpathom'],
        vehicle_details: [{ id: 1, type: '6 truck dump', status: 'ACTIVE', number: 3 },
        { id: 2, type: '4 car dump crop cap', status: 'ACTIVE', number: 7 }]
      }
    })

    let newId = 3
    this.post(`${API_URL}api/v1/car`, (schema, request) => {
      console.log("Schema mock :: ", schema)
      console.log("Request mock :: ", request)
      let attrs = JSON.parse(request.requestBody)
      attrs.id = newId++

      return { reminder: attrs }
    })
  },
})
/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: API_URL || "https://jsonplaceholder.typicode.com/",
  timeout: 10000,
}
