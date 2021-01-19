import { types } from "mobx-state-tree"

const ObjectToken = types.model({
  idToken: types.maybeNull(types.string),
  accessToken: types.maybeNull(types.string),
  refreshToken: types.maybeNull(types.string),
})

const UserProfile = types.maybeNull(
  types.model({
    id: types.maybeNull(types.number),
    companyName: types.maybeNull(types.string),
    fullname: types.maybeNull(types.string),
    mobileNo: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    // language: types.maybeNull(types.string),
  }),
)

export const Token = types.model({
  token: types.maybeNull(ObjectToken),
  profile: UserProfile
}).actions(self => ({
  setToken(data: any) {
    self.token = data
  },
  setProfile(data: any) {
    self.profile = data
  },  
  clearToken() {
    self.token = null
  }
})).views(self => ({
  get tokenData() {
    return self.token
  }
}))