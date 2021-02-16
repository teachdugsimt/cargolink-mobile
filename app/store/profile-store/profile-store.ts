import { types, flow } from "mobx-state-tree"
import { ProfileApi, FileUploadApi } from '../../services/api'
import { Platform } from "react-native"
const apiUsers = new ProfileApi()
const fileUploadApi = new FileUploadApi()

const Profile = types.model({
  "fullName": types.maybeNull(types.string),
  "phoneNumber": types.maybeNull(types.string),
  "email": types.maybeNull(types.string),
  "approveStatus": types.maybeNull(types.string),
  "avatar": types.maybeNull(types.string),
  "id": types.maybeNull(types.number),
  "userId": types.maybeNull(types.string)
})

const TruckSummary = types.model({
  trucks: types.maybeNull(types.number),
  zones: types.maybeNull(types.number)
})

const DataUpdateProfile = types.model({
  "id": types.maybeNull(types.number),
  "userId": types.maybeNull(types.string),
  "fullName": types.maybeNull(types.string),
  "phoneNumber": types.maybeNull(types.string),
  "approveStatus": types.maybeNull(types.string),
  "avatar": types.maybeNull(types.string),
  "email": types.maybeNull(types.string),
})

const PictureProfile = types.model({
  fileName: types.maybeNull(types.string),
  fileUrl: types.maybeNull(types.string),
  fileType: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
  uploadedDate: types.maybeNull(types.string),
})

const TotalTruck = types.model({
  "total": types.maybeNull(types.number),
  "truckType": types.maybeNull(types.number)
})

const TotalRegion = types.model({
  "province": types.maybeNull(types.number),
  "region": types.maybeNull(types.number),
})

const ReportProfile = types.model({
  "avatar": types.maybeNull(types.model({
    "object": types.maybeNull(types.string), //url
    "token": types.maybeNull(types.string)
  })),
  "fullName": types.maybeNull(types.string),
  "phoneNumber": types.maybeNull(types.string),
  "totalJob": types.maybeNull(types.number),
  "trucks": types.maybeNull(types.array(TotalTruck)),
  "workingZones": types.maybeNull(types.array(TotalRegion))
})

const ProfileStore = types.model({
  data: types.maybeNull(Profile),
  loading: types.boolean,
  error: types.maybeNull(types.string),

  data_truck_summary: types.maybeNull(TruckSummary),
  loading_truck_summary: types.boolean,
  error_truck_summary: types.maybeNull(types.string),

  data_update_profile: types.maybeNull(DataUpdateProfile),
  loading_update_profile: types.boolean,
  error_update_profile: types.maybeNull(types.string),

  data_upload_picture: types.maybeNull(PictureProfile),
  loading_update_picture: types.boolean,
  error_update_picture: types.maybeNull(types.string),

  data_report_profile: types.maybeNull(ReportProfile),
  loading_report_profile: types.boolean,
  error_report_profile: types.maybeNull(types.string),


}).actions(self => ({
  getProfileRequest: flow(function* getProfileRequest() { // <- note the star, this a generator function!
    yield apiUsers.setup()
    self.loading = true
    try {
      const response = yield apiUsers.getProfile()
      __DEV__ && console.tron.log("Response call getProfileRequest : : ", response)
      if (response.ok) {
        self.data = response.data || null
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

  getProfileReporter: flow(function* getProfileReporter(id) { // <- note the star, this a generator function!
    yield apiUsers.setup()
    self.loading_report_profile = true
    try {
      const response = yield apiUsers.getUserReport(id)
      __DEV__ && console.tron.log("Response call getProfileReporter : : ", response)
      if (response.ok) {
        self.data_report_profile = response.data || null
        self.loading_report_profile = false
      } else {
        self.loading_report_profile = false
        self.error_report_profile = "error fetch getProfileReporters"
      }
    } catch (error) {
      console.error("Failed to store value get profile : ", error)
      self.loading_report_profile = false
      self.error_report_profile = "set up state mobx error"
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

  updateProfile: flow(function* updateProfile(params) { // <- note the star, this a generator function!
    yield apiUsers.setup()
    self.loading_update_profile = true
    try {
      const response = yield apiUsers.updateProfile(params)
      __DEV__ && console.tron.log("Response call updateProfile : : ", response)
      if (response.ok) {
        self.data_update_profile = response.data || null
        self.loading_update_profile = false
      } else {
        self.loading_update_profile = false
        self.error_update_profile = response?.data?.validMsgList?.email && response?.data?.validMsgList?.email[0] ? response.data.validMsgList.email[0] : "error to update profile"
      }
    } catch (error) {
      console.error("Failed to store value get profile : ", error)
      self.loading_update_profile = false
      self.error_update_profile = "set up state mobx error"
    }
  }),
  clearUpdateData(name) {
    self[name] = null
  },

  uploadPicture: flow(function* updateProfile(file) { // <- note the star, this a generator function!
    yield fileUploadApi.setup()
    self.loading_update_picture = true
    try {
      let formData = new FormData();
      formData.append("file", {
        name: file.fileName,
        uri: Platform.OS == 'ios' ? file.uri.replace("file://", "") : file.uri,
        type: file.type,
        width: file.width,
        size: file.fileSize
      })
      const response = yield fileUploadApi.uploadVehiclePicture(formData)
      __DEV__ && console.tron.log("Response call uploadPicture : : ", response)
      if (response.ok) {
        self.data_upload_picture = response.data || {}
      } else {
        self.error_update_profile = "error fetch uploadPictures"
      }
      self.loading_update_picture = false
    } catch (error) {
      console.error("Failed to store value get profile : ", error)
      self.loading_update_picture = false
      self.error_update_profile = "set up state mobx error"
    }
  }),

  clearData() {
    self.data_update_profile = null
    self.data_upload_picture = null
  },
  clearAllData() {
    self.data = null
    self.data_truck_summary = null
    self.data_update_profile = null
    self.data_upload_picture = null
    self.data_report_profile = null
  }


})).views(self => ({
  get getProfileFunction() {
    return self.data
  },
  get ProfileData() {
    let data_profile = {}
    data_profile['name-lastname'] = self.data?.fullName || ''
    data_profile['phone-number'] = self.data?.phoneNumber || ''
    data_profile['email'] = self.data?.email || ''
    data_profile['avatar'] = self.data?.avatar || ''
    return data_profile
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

    data_update_profile: null,
    loading_update_profile: false,
    error_update_profile: null,

    data_upload_picture: null,
    loading_update_picture: false,
    error_update_picture: null,

    data_report_profile: null,
    loading_report_profile: false,
    error_report_profile: null,
  })


export default ProfileStore
// Type 2 : not persist store
