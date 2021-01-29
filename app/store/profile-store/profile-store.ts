import { types, flow } from "mobx-state-tree"
import { ProfileApi } from '../../services/api'
const apiUsers = new ProfileApi()


const Vehicle = types.model({
  id: types.number,
  type: types.string,
  status: types.string,
  number: types.number
})

const Profile = types.model({
  "fullName": types.maybeNull(types.string),
  "phoneNumber": types.maybeNull(types.string),
  "approveStatus": types.maybeNull(types.string),
  "avatar": types.maybeNull(types.string)
})

const TruckSummary = types.model({
  trucks: types.maybeNull(types.number),
  zones: types.maybeNull(types.number)
})

const ProfileStore = types.model({
  data: types.maybeNull(Profile),
  loading: types.boolean,
  error: types.maybeNull(types.string),

  data_truck_summary: types.maybeNull(TruckSummary),
  loading_truck_summary: types.boolean,
  error_truck_summary: types.maybeNull(types.string)
}).actions(self => ({
  getProfileRequest: flow(function* getProfileRequest() { // <- note the star, this a generator function!
    yield apiUsers.setup()
    self.loading = true
    try {
      const response = yield apiUsers.getProfile()
      __DEV__ && console.tron.log("Response call getProfileRequest : : ", response)
      if (response.ok) {
        self.data = response.data || {}
        self.loading = false
      } else {
        self.loading = false
        self.error = "error fetch getProfileRequests"
      }
    } catch (error) {
      console.error("Failed to store value get profile : ", error)
      self.loading = false
      self.error = "set up state mobx error"
    }
  }),


  getTruckSummary: flow(function* getTruckSummary() { // <- note the star, this a generator function!
    yield apiUsers.setup()
    self.loading_truck_summary = true
    try {
      const response = yield apiUsers.getTruckSummary()
      __DEV__ && console.tron.log("Response call getTruckSummary : : ", response)
      if (response.ok) {
        self.data_truck_summary = response.data || {}
        self.loading_truck_summary = false
      } else {
        self.loading_truck_summary = false
        self.error = "error fetch getTruckSummarys"
      }
    } catch (error) {
      console.error("Failed to store value get profile : ", error)
      self.loading_truck_summary = false
      self.error = "set up state mobx error"
    }
  }),
})).views(self => ({
  get getProfileFunction() {
    return self.data
  }
}))
  .create({
    // IMPORTANT !!
    data: null,
    loading: false,
    error: '',

    data_truck_summary: null,
    loading_truck_summary: false,
    error_truck_summary: null,
  })


export default ProfileStore
// Type 2 : not persist store
