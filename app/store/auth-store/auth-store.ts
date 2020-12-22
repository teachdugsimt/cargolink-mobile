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
      id: types.maybeNull(types.number),
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

const Policy = types.model({
  version: types.maybeNull(types.string),
  accepted: types.maybeNull(types.boolean),
  acceptedAt: types.maybeNull(types.string),
  data: types.maybeNull(types.string),
})

const AuthStore = types
  .model({
    data: types.maybeNull(SignIn),
    profile: types.maybeNull(OTPVerify),
    policyData: types.maybeNull(Policy),
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
        console.log("response signInRequest :>> ", response)
        self.data = response.data || {}
        self.loading = false
      } catch (error) {
        // ... including try/catch error handling
        console.log('error signInRequest :>> ', error);
        // self.data = []
        self.loading = false
        self.error = "error fetch api sign in"
      }
    }),

    otpVerifyRequest: flow(function* otpVerifyRequest(data: Types.OTPVerifyRequest) {
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.verifyOTP(data)
        console.log("response otpVerifyRequest :>> ", response)
        self.profile = response.data || {}
        self.loading = false
      } catch (error) {
        // ... including try/catch error handling
        console.log('error otpVerifyRequest :>> ', error);
        // self.data = []
        self.loading = false
        self.error = "error fetch api otp verify"
      }
    }),

    getPolicyRequest: flow(function* getPolicyRequest(id: number) {
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.getPolicy(id)
        console.log('response getPolicyRequest :>> ', response);
        self.policyData = response.data || {}
        self.loading = false
      } catch (error) {
        console.log('error getPolicyRequest :>> ', error);
        // self.data = []
        self.loading = false
        self.error = "error fetch api get policy"
      }
    }),

    updatePolicyStatusRequest: flow(function* updatePolicyStatusRequest(id: number, data: Types.TermAndService) {
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.updatePolicy(id, data)
        console.log('response updatePolicyStatusRequest :>> ', response);
        self.policyData = {
          ...self.policyData,
          accepted: true
        }
        self.loading = false
      } catch (error) {
        console.log('error updatePolicyStatusRequest :>> ', error);
        self.loading = false
        self.error = "error fetch api update policy status"
      }
    })
  }))
  .views((self) => ({
    get getAuthData() {
      return self.data
    },
    get getOtpVerifyData() {
      return self.profile
    },
  }))
  .create({
    // IMPORTANT !!
    data: {},
    profile: {},
    policyData: {},
    loading: false,
    error: "",
  })

export default AuthStore
// Type 2 : not persist store
