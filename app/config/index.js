import env from 'react-native-config'

const config = {
  api: {
    host: env.API_URL
  },
  service: {
    googleApiKey: env.GOOGLE_API_KEY,
    appleUser: env.APPLE_USER,
    applePassword: env.APPLE_PASSWORD
  }
};

const API_URL = config.api.host
const GOOGLE_API_KEY = config.service.googleApiKey
const APPLE_USER = config.service.appleUser
const APPLE_PASSWORD = config.service.applePassword
console.log("FLUXXXER ENV :: ", env.APPLE_USER)
export {
  API_URL,
  GOOGLE_API_KEY,
  APPLE_USER,
  APPLE_PASSWORD
}

export default config
