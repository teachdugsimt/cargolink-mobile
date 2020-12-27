// Use this import if you want to use "env.js" file
// const { API_URL } = require("../../config/env")
// Or just specify it directly like this:
// const API_URL = "https://jsonplaceholder.typicode.com/"
const { API_URL, API_URL_DEV } = require("../../config/env")

import { makeServer } from './server'

console.log('process.env.NODE_ENV :>> ', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  makeServer({ environment: 'development' })
}

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
