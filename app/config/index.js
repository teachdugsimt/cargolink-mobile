import env from 'react-native-config'

const config = {
  api: {
    host: env.API_URL
  },
  service: {
    googleApiKey: env.GOOGLE_API_KEY,
    appleUser: env.APPLE_USER
  }
};

const API_URL = config.api.host
const GOOGLE_API_KEY = config.service.googleApiKey
const APPLE_USER = config.service.appleUser

export {
  API_URL,
  GOOGLE_API_KEY,
  APPLE_USER
}

export default config
