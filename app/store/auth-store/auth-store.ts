import { types, flow } from "mobx-state-tree"
import { AuthAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
const apiAuth = new AuthAPI()

const SignIn = types.model({
  status: types.maybeNull(types.boolean),
  tokenCheckPhone: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
})

/**
  "message": "",
  "responseCode": 1,
  "userProfile": {
    "id": 611,
    "companyName": null,
    "fullName": null,
    "mobileNo": "0926270468",
    "email": null
  },
  "token": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2MTEiLCJBVVRIIjpbeyJhdXRob3JpdHkiOiJSRVNFVF9QV0QifSx7ImF1dGhvcml0eSI6IlZJRVdfVkVISUNMRSJ9LHsiYXV0aG9yaXR5IjoiQUREX09SREVSIn0seyJhdXRob3JpdHkiOiJMSVNUX1RSSVAifSx7ImF1dGhvcml0eSI6IlJFR19BQ0MifSx7ImF1dGhvcml0eSI6Ik1PRElGWV9EUklWRVIifSx7ImF1dGhvcml0eSI6IlJPTEVfU0hJUFBFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1JPVVRFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJTT0ZUX0RFTEVURV9ST1VURSJ9LHsiYXV0aG9yaXR5IjoiUk9MRV9DQVJSSUVSIn0seyJhdXRob3JpdHkiOiJDT05GSVJNX09SREVSIn0seyJhdXRob3JpdHkiOiJNT0RJRllfSU5GTyJ9LHsiYXV0aG9yaXR5IjoiU09GVF9ERUxFVEVfT1JERVIifSx7ImF1dGhvcml0eSI6IlNJR05PVVQifSx7ImF1dGhvcml0eSI6IlJFUExZX09SREVSIn0seyJhdXRob3JpdHkiOiJSRVBPUlRfVFJBTlMifSx7ImF1dGhvcml0eSI6IlZFUklGWV9DT05UQUNUIn0seyJhdXRob3JpdHkiOiJBRERfVFJJUCJ9LHsiYXV0aG9yaXR5IjoiTElTVF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJVUERBVEVfUFJPRklMRSJ9LHsiYXV0aG9yaXR5IjoiTElTVF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkFERF9EUklWRVIifSx7ImF1dGhvcml0eSI6IkNIQU5HRV9QV0QifSx7ImF1dGhvcml0eSI6IkRFVEFJTF9UUkFOUyJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX09SREVSIn0seyJhdXRob3JpdHkiOiJTSUdOSU4ifSx7ImF1dGhvcml0eSI6IlNPRlRfREVMRVRFX0RSSVZFUiJ9LHsiYXV0aG9yaXR5IjoiTU9ESUZZX1ZFSElDTEUifSx7ImF1dGhvcml0eSI6IlVQTE9BRF9ET0NTIn0seyJhdXRob3JpdHkiOiJBRERfVFJBTlMifSx7ImF1dGhvcml0eSI6IkFERF9WRUhJQ0xFIn0seyJhdXRob3JpdHkiOiJBU1NJR05fVkVISUNMRV9EUklWRVIifSx7ImF1dGhvcml0eSI6IkxJU1RfT1JERVIifSx7ImF1dGhvcml0eSI6IkFERF9ST1VURSJ9XSwiZXhwIjoxNjA5MTc5MDcyfQ.GfDTja_mCrqzVTXFYKLOTC5rY2IDFwl69XeGjzj39xPq56pmmNdx2z86bAcTspbQ57Qk9jUtXcnKiDaznEBpuw",
    "idToken": "",
    "refreshToken": ""
  },
  "termOfService": {
    "version": "0.0.1",
    "accepted": false,
    "acceptedAt": null,
    "data": "TERMS OF SERVICE AGREEMENT" 
  }
 */

const Policy = types.model({
  version: types.maybeNull(types.string),
  accepted: types.maybeNull(types.boolean),
  acceptedAt: types.maybeNull(types.string),
  data: types.maybeNull(types.string),
})

const OTPVerify = types.model({
  message: types.maybeNull(types.string),
  responseCode: types.maybeNull(types.number),
  userProfile: types.maybeNull(
    types.model({
      id: types.maybeNull(types.number),
      companyName: types.maybeNull(types.string),
      fullname: types.maybeNull(types.string),
      mobileNo: types.maybeNull(types.string),
      email: types.maybeNull(types.string),
      // language: types.maybeNull(types.string),
    }),
  ),
  termOfService: types.maybeNull(Policy),
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
        if (response.kind === 'ok') {
          self.data = response.data || {}
        } else {
          self.error = response.data.message
        }
        self.loading = false
      } catch (error) {
        console.log('error signInRequest :>> ', error);
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
        if (response.kind === 'ok') {
          self.profile = response.data || {}
          self.policyData = response.data.termOfService || {}
        } else {
          self.error = response.data.message
        }
        self.loading = false
      } catch (error) {
        console.log('error otpVerifyRequest :>> ', error);
        self.loading = false
        self.error = "error fetch api otp verify"
      }
    }),
    /*
        getPolicyRequest: flow(function* getPolicyRequest(id: number) {
          apiAuth.setup()
          self.loading = true
          try {
            const response = yield apiAuth.getPolicy(id)
            console.log('response getPolicyRequest :>> ', response);
            if (response.kind === 'ok') {
              self.policyData = response.data || {}
            } else {
              self.error = response.data.message
            }
            self.loading = false
          } catch (error) {
            console.log('error getPolicyRequest :>> ', error);
            self.loading = false
            self.error = "error fetch api get policy"
          }
        }),
    */
    updatePolicyStatusRequest: flow(function* updatePolicyStatusRequest(id: number, data: Types.TermAndService) {
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.updatePolicy(id, data)
        console.log('response updatePolicyStatusRequest :>> ', response);
        if (response.kind === 'ok') {
          self.policyData = {
            ...self.policyData,
            accepted: true
          }
        } else {
          self.error = response.data.message
        }
        self.loading = false
      } catch (error) {
        console.log('error updatePolicyStatusRequest :>> ', error);
        self.loading = false
        self.error = "error fetch api update policy status"
      }
    }),

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
