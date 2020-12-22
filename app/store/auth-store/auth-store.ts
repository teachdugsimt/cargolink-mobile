import { types, flow } from "mobx-state-tree"
import { AuthAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"

const apiAuth = new AuthAPI()

const SignIn = types.model({
  token: types.maybeNull(types.string),
})

const OTPVerify = types.model({
  userProfile: types.maybeNull(
    types.model({
      id: types.maybeNull(types.string),
      companyName: types.maybeNull(types.string),
      fullname: types.maybeNull(types.string),
      mobileNo: types.maybeNull(types.string),
      email: types.maybeNull(types.string),
      language: types.maybeNull(types.string),
    }),
  ),
  termOfService: types.maybeNull(
    types.model({
      latestVersion: types.maybeNull(types.string),
      latestVersionAgree: types.maybeNull(types.boolean),
    }),
  ),
  token: types.maybeNull(
    types.model({
      idToken: types.maybeNull(types.string),
      accessToken: types.maybeNull(types.string),
      refreshToken: types.maybeNull(types.string),
    }),
  ),
})

const AuthStore = types
  .model({
    data: types.maybeNull(SignIn),
    otpData: types.maybeNull(OTPVerify),
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    signInRequest: flow(function* signInRequest(data: Types.AuthRequest) {
      // <- note the star, this a generator function!
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.signIn(data)
        console.log("Response call api get user : : ", response)
        self.data = response.data || {}
        self.loading = false
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch get users api : ", error)
        // self.data = []
        self.loading = false
        self.error = "error fetch api get users"
      }
    }),

    otpVerifyRequest: flow(function* otpVerifyRequest(data: Types.OTPVerifyRequest) {
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.verifyOTP(data)
        console.log("Response call api get user : : ", response)
        self.otpData = response.data || {}
        self.loading = false
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch get users api : ", error)
        // self.data = []
        self.loading = false
        self.error = "error fetch api get users"
      }
    }),
  }))
  .views((self) => ({
    get getAuthData() {
      return self.data
    },
    get getOtpVerifyData() {
      return self.otpData
    },
  }))
  .create({
    // IMPORTANT !!
    data: {},
    otpData: {},
    loading: false,
    error: "",
  })

export default AuthStore
// Type 2 : not persist store
