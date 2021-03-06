import { types } from "mobx-state-tree"

const ObjectToken = types.model({
  idToken: types.maybeNull(types.string),
  accessToken: types.maybeNull(types.string),
  refreshToken: types.maybeNull(types.string),
})

const UserProfile = types.maybeNull(
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
    documentStatus: types.maybeNull(types.string)
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
    self.profile = null
  }
})).views(self => ({
  get tokenData() {
    return self.token
  }
}))
