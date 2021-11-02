import { types, flow, cast } from "mobx-state-tree"
import { AuthAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import ProfileStore from "../profile-store/profile-store"
const apiAuth = new AuthAPI()

const InvalidPhone = "Invalid entry for your phone number"

const SignIn = types.model({
  status: types.maybeNull(types.boolean),
  tokenCheckPhone: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
})

const RefCode = types.model({
  refCode: types.maybeNull(types.string)
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

const RoleObject = types.maybeNull(types.model({
  "value": types.maybeNull(types.number),
  "stringValue": types.maybeNull(types.string),
  "label": types.maybeNull(types.string),
  "link": types.maybeNull(types.string),
  "description": types.maybeNull(types.string),
  "version": types.maybeNull(types.number),
  "groupId": types.maybeNull(types.number),
  "orderNumber": types.maybeNull(types.number),
}))

const RoleAttribute = types.maybeNull(types.array(RoleObject))

const AppleProfile = types.maybeNull(types.model({
  "title": types.maybeNull(types.string),
  "id": types.maybeNull(types.number),
  "loginId": types.maybeNull(types.string),
  "status": types.maybeNull(types.boolean),
  "fullName": types.maybeNull(types.string),
  "phoneNumber": types.maybeNull(types.string),
  "role": types.maybeNull(types.string),
  "avatar": types.maybeNull(types.union(types.string, types.model({}))),
  "ratingPoint": types.maybeNull(types.number),
  "multipleAccount": types.maybeNull(types.boolean),
  "commissionFee": types.maybeNull(types.number),
  "types": types.maybeNull(types.model({
    USER_BUSINESS: RoleAttribute,
    CONTACT_US_STATUS: RoleAttribute,
    FREIGHT_OFFER_STATUS: RoleAttribute,
    QUOTATION_TYPE: RoleAttribute,
    ROLE: RoleAttribute,
    CARGO: RoleAttribute,
    PAYMENT_STATUS: RoleAttribute,
    TRUCK_SHARING: RoleAttribute,
    ISSUE_STATUS: RoleAttribute,
    TYPE_OF_PRICE: RoleAttribute,
    UNIT: RoleAttribute,
    PAYMENT_TRANSPORT_FEE: RoleAttribute,
    WAYBILL_STATUS_SHIPPER: RoleAttribute,
    PAYMENT_ERROR_CODE: RoleAttribute,
    TRANSPORT_REQUEST_STATUS: RoleAttribute,
    WAYBILL_STATUS_CARRIER: RoleAttribute,
    NOTIFICATION_STATUS: RoleAttribute,
    SHIPMENT_STATUS: RoleAttribute,
    NOTIFICATION: RoleAttribute,
    GROUP_TRUCK: RoleAttribute,
    ISSUE_TYPE: RoleAttribute,
    PREFIX: RoleAttribute,
    QUOTATION_STATUS: RoleAttribute,
    TRUCK: RoleAttribute,
    ZONES: RoleAttribute,
    DRIVING_LICENSE_TYPE: RoleAttribute,
  })),
  token: types.maybeNull(types.string)
}))

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
      userId: types.maybeNull(types.string),
      companyName: types.maybeNull(types.string),
      fullName: types.maybeNull(types.string),
      mobileNo: types.maybeNull(types.string),
      email: types.maybeNull(types.string),
      attachCodeCitizenId: types.maybeNull(types.string),
      avatar: types.maybeNull(types.string),
      userType: types.maybeNull(types.string),
      document: types.maybeNull(types.map(types.string)),
      documentStatus: types.maybeNull(types.string)
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
    data: types.maybeNull(RefCode),
    // data: types.maybeNull(SignIn),
    profile: types.maybeNull(OTPVerify),
    phoneNumber: types.maybeNull(types.string),
    countryCode: types.string,
    policyData: types.maybeNull(Policy),
    loading: types.boolean,
    error: types.maybeNull(types.string),

    errorOtpVerify: types.maybeNull(types.string),

    dataApple: AppleProfile,
    loadingApple: types.boolean,
    errorApple: types.maybeNull(types.string),
  })
  .actions((self) => ({

    AppleSignin: flow(function* AppleSignin(data: Types.AppleSignin) {
      // <- note the star, this a generator function!
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.appleSignin(data)
        console.log("response AppleSignin :>> ", response)
        if (response.kind === 'ok') {
          // let tmpAppleData = response.data || {}
          // tmpAppleData.token = response.headers.authorization
          // self.dataApple = tmpAppleData
          // self.errorApple = ""
          if (response?.data?.userProfile?.id)
            response.data.userProfile.id = +response.data.userProfile.id
          self.profile = response.data || {}
          self.policyData = response.data.termOfService || {}
          self.error = '' // Clear error when signin success
          self.phoneNumber = null // Clear phoneNumber when signin success
        } else {
          self.error = response?.data?.message || response?.kind
        }
        self.loading = false
      } catch (error) {
        console.log('error AppleSignin :>> ', error);
        self.loading = false
        self.error = "error to save api AppleSignin"
      }
    }),

    signInRequest: flow(function* signInRequest(data: Types.AuthRequest) {
      // <- note the star, this a generator function!
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.signIn(data)
        console.log("response signInRequest :>> ", response)
        if (response.kind === 'ok') {
          self.data = response.data.data || {}
          self.error = ""
        } else {
          if (response.data && response.data.validMsgList && response.data.validMsgList['phoneNumber'] &&
            response.data.validMsgList['phoneNumber'][0] && response.data.validMsgList['phoneNumber'][0] == InvalidPhone) {
            self.error = InvalidPhone
          } else self.error = response?.data?.message || response?.kind
        }
        self.loading = false
      } catch (error) {
        console.log('error signInRequest :>> ', error);
        self.loading = false
        self.error = "error to save api sign in"
      }
    }),

    otpVerifyRequest: flow(function* otpVerifyRequest(data: Types.OTPVerifyRequest) {
      apiAuth.setup()
      self.loading = true
      try {
        const response = yield apiAuth.verifyOTP(data)
        console.log("response otpVerifyRequest :>> ", response)
        if (response.kind === 'ok') {
          __DEV__ && console.tron.log("OtpVerify.Data : ", response.data)
          self.profile = response.data || {}
          self.policyData = response.data?.termOfService || {}
          self.error = '' // Clear error when signin success
          self.errorOtpVerify = '' // Clear error when signin success
          self.phoneNumber = null // Clear phoneNumber when signin success
          // yield ProfileStore.getProfileRequest(response.data.userProfile.userId, response.data.token.accessToken)
        } else {
          self.error = response?.data?.message || response?.kind
          self.errorOtpVerify = response?.data?.message || response?.kind
        }
        self.loading = false
      } catch (error) {
        console.log('error otpVerifyRequest :>> ', error);
        self.loading = false
        self.error = "error fetch api otp verify"
        self.errorOtpVerify = "error fetch api otp verify"
      }
    }),
    clearErrorOtpVerify() {
      self.errorOtpVerify = ""
      self.error = ""
      self.loading = false
    },
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
    updatePolicyStatusRequest: flow(function* updatePolicyStatusRequest(accessToken: string, id: string, data: Types.TermAndService) {
      apiAuth.setup(accessToken)
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

    clearAuthProfile() {
      self.profile = cast({})
      self.policyData = cast({})
      self.error = ""
    },

    setPhoneNumber(phoneNumber: string, countryCode: string) {
      self.phoneNumber = phoneNumber
      self.countryCode = countryCode
    },

    clearError() {
      self.error = null
    }

  }))
  .views((self) => ({
    get getAuthData() {
      return self.data
    },
    get getOtpVerifyData() {
      return self.profile
    },
    get ProfileData() {

      let data_profile = {}
      let tmpDocument = self.profile.userProfile?.document ? self.profile.userProfile.document : null
      let parseTmpDocument = tmpDocument ? JSON.parse(JSON.stringify(tmpDocument)) : null

      data_profile['name-lastname'] = self.profile.userProfile?.fullName || ''
      data_profile['phone-number'] = self.profile.userProfile?.mobileNo || ''
      data_profile['email'] = self.profile.userProfile?.email || ''
      data_profile['avatar'] = self.profile.userProfile?.avatar || ''
      data_profile['user-type'] = self.profile.userProfile?.userType || ''
      data_profile['id-card'] = self.profile.userProfile?.attachCodeCitizenId || ''
      data_profile['accept-policies'] = self.profile.termOfService?.accepted || ''
      data_profile['document'] = self.profile.userProfile?.document ? self.profile.userProfile?.document : null
      data_profile['files'] = parseTmpDocument ? Object.values(parseTmpDocument) : null
      return data_profile
    }
  }))
  .create({
    // IMPORTANT !!
    data: {},
    profile: {},
    policyData: {},
    phoneNumber: null,
    countryCode: '',
    loading: false,
    error: "",
    errorOtpVerify: "",
    dataApple: null,
    loadingApple: false,
    errorApple: ''
  })

export default AuthStore
// Type 2 : not persist store
