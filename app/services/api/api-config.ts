// Use this import if you want to use "env.js" file
// const { API_URL } = require("../../config/env")
// Or just specify it directly like this:
// const API_URL = "https://jsonplaceholder.typicode.com/"
const { API_URL, API_URL_DEV } = require("../../config/env")

import { createServer, Model } from "miragejs"
import vehicleData from './mock-data/my-vehicle'

const makeId = (length: number) => {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

__DEV__ && createServer({
  models: {
    vehicle: Model
  },
  fixtures: {
    vehicles: vehicleData
  },
  seeds(server) {
    server.loadFixtures()
  },
  routes() {
    // Now use this
    this.get(`${API_URL}todos/1`, () => [
      { id: "1", name: "Luke" },
      { id: "2", name: "Leia" },
      { id: "3", name: "Anakin" },
    ])

    this.get(`https://test.callapi.com/listUser`, () => [
      { id: "1", name: "Luke" },
      { id: "2", name: "Leia" },
      { id: "3", name: "Anakin" },
    ])

    this.post(`${API_URL}/api/v1/users/auth/otp-request`, (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      console.log(attrs)
      // debugger
      return {
        refCode: makeId(4),
        expireTime: Math.floor(Date.now() / 1000).toString(),
      }
    })

    this.post(`${API_URL}/api/v1/users/auth/otp-verify`, (schema, request) => {
      const attrs = JSON.parse(request.requestBody)
      console.log(attrs)
      // debugger
      return {
        userProfile: {
          id: Math.floor(Date.now() / 1000).toString(),
          companyName: "Onelink space",
        },
        termOfService: {
          latestVersion: "0.0.1",
          latestVersionAgree: true,
        },
        token: {
          idToken: "string",
          accessToken: "string",
          refreshToken: "string",
        },
      }
    })

    this.get(`${API_URL}/api/v1/car`, (schema, request) => {
      console.log(JSON.parse(JSON.stringify(schema.vehicles.all().models)))
      return schema.vehicles.all().models
    })

    this.get(`${API_URL}/api/v1/car/:id`, (schema, request) => {
      console.log('request.params.id', request.params.id)
      const id = request.params.id
      return JSON.parse(JSON.stringify(schema.vehicles.find(id)))
    })

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
