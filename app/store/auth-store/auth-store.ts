import { types, flow } from "mobx-state-tree"
import { AuthAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"

const apiAuth = new AuthAPI()

const SignIn = types.model({
  refCode: types.maybeNull(types.string),
  expireTime: types.maybeNull(types.string),
})

const AuthStore = types
  .model({
    data: types.maybeNull(SignIn),
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
        console.log("Response call api get user : : ", response.data)
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
  }))
  .views((self) => ({
    get getAuthData() {
      return self.data
    },
  }))
  .create({
    // IMPORTANT !!
    data: {},
    loading: false,
    error: "",
  })

export default AuthStore
// Type 2 : not persist store
