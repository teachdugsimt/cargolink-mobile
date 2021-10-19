import { types, flow } from "mobx-state-tree"
import { ProfileApi, FileUploadApi } from '../../services/api'
import { Platform } from "react-native"
import { zip } from 'react-native-zip-archive'

const apiUsers = new ProfileApi()
const fileUploadApi = new FileUploadApi()

const PartnerTermCondition = types.maybeNull(types.model({
  message: types.maybeNull(types.string),
  version: types.maybeNull(types.string),
  accepted: types.maybeNull(types.boolean),
  data: types.maybeNull(types.string)
}))

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
  attachCode: types.maybeNull(types.string),
  fileName: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  type: types.maybeNull(types.string),
  fileUrl: types.maybeNull(types.string),
  fileType: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
  uploadedDate: types.maybeNull(types.string),
})

const PartnerRegisterStore = types.model({
  data: PartnerTermCondition,
  loading: types.boolean,
  error: types.maybeNull(types.string),

  data_upload_document: types.maybeNull(PictureProfile),
  loading_upload_document: types.boolean,
  error_upload_document: types.maybeNull(types.string),

  data_update_profile: types.maybeNull(DataUpdateProfile),
  error_update_profile: types.maybeNull(types.string),


}).actions(self => ({
  getPartnerTermAndCondition: flow(function* getPartnerTermAndCondition(userId: string) { // <- note the star, this a generator function!
    yield apiUsers.setup()
    self.loading = true
    try {
      const response = yield apiUsers.getPartnerTermAndCondition(userId)
      console.log("Response call getPartnerTermAndCondition :: ", response)
      if (response.ok) {
        self.data = response.data || null
        self.loading = false
      } else {
        self.data = null
        self.loading = false
        self.error = "error fetch getPartnerTermAndConditions"
      }
    } catch (error) {
      console.error("Failed to store value get PartnerTermAndCondition : ", error)
      self.loading = false
      self.error = "set up state mobx error"
    }
  }),

  clearUpdateData(name) {
    self[name] = null
  },

  processDocumentFile: flow(function* processDocumentFile(documentFile: Array<any>, profile: any) { // <- note the star, this a generator function!
    self.loading_upload_document = true
    yield fileUploadApi.setup()
    try {
      if (documentFile.length > 1) {
        const file_name = "partner-document.zip"

        let minUri = ''
        let minLength = 9999
        const arrUri: Array<string> = documentFile.map(e => {
          const spliter = e.uri.split('/')
          spliter.splice(spliter.length - 1, 1)
          let joinUrl = spliter.join("/")

          if (spliter.length < minLength) {
            minUri = joinUrl
            minLength = spliter.length
          }

          return decodeURIComponent(e.uri)
        })
        console.log("Arr URI :: ", arrUri)
        console.log("Min path URI :: ", minUri)

        const result = yield zip(arrUri, minUri + `/${file_name}`)
          .then((path) => {
            console.log(`zip completed at : ${path}`)
            return path
          })
          .catch((error) => {
            console.error(`Error while zip : `, error)
            return error
          })

        const fileObj = {
          fileName: file_name,
          uri: result,
          type: "application/zip",
        }
        console.log("Zip file RESULT : ", result)
        yield PartnerRegisterStore.uploadZipDocument(fileObj, profile)
      } else {
        console.log("DOCUMENT HERE:: ", documentFile)
        if (documentFile.length == 1) {
          const fileObj = {
            fileName: documentFile[0]?.fileName || "unknowfile.png",
            uri: documentFile[0].uri,
            type: documentFile[0]?.type || 'image/png',
          }
          yield PartnerRegisterStore.uploadZipDocument(fileObj, profile)
        } else {
          yield PartnerRegisterStore.uploadZipDocument(null, profile)
        }
      }
    } catch (error) {
      console.error("Failed to store value get PartnerTermAndCondition : ", error)
    }
  }),

  uploadZipDocument: flow(function* uploadZipDocument(file, profile) { // <- note the star, this a generator function!
    yield fileUploadApi.setup()
    try {
      if (file) {
        let formData = new FormData();
        formData.append("file", {
          name: file.fileName,
          uri: Platform.OS == 'ios' ? file.uri.replace("file://", "") : file.uri,
          type: file.type,
        })

        formData.append("path", "USER_DOC/INPROGRESS/")
        const response = yield fileUploadApi.uploadVehiclePicture(formData)
        console.log("Response call uploadZipDocument : : ", response)
        if (response.ok) {

          // self.data_upload_document = response.data || {}
          let tmp_profile_data = profile
          tmp_profile_data.url = [response.data.attachCode]
          yield PartnerRegisterStore.updateProfile(tmp_profile_data)

        } else {
          self.loading_upload_document = false
          self.error_upload_document = "error fetch uploadPictures"
        }
      } else {
        let tmp_profile_data = profile
        tmp_profile_data.url = []
        yield PartnerRegisterStore.updateProfile(tmp_profile_data)
      }
    } catch (error) {
      console.error("Failed to store value get profile : ", error)
      self.loading_upload_document = false
      self.error_upload_document = "set up state mobx error"
    }
  }),

  updateProfile: flow(function* updateProfile(params) { // <- note the star, this a generator function!
    yield apiUsers.setup()
    try {
      const response = yield apiUsers.updateProfile(params)
      __DEV__ && console.tron.log("Response call updateProfile :: ", response)
      if (response.ok) {
        self.data_update_profile = response.data || null
      } else {
        self.data_update_profile = null
        self.error_update_profile = "error to update profile"
      }
      self.loading_upload_document = false
    } catch (error) {
      console.error("Failed to store value get profile : ", error)
      self.loading_upload_document = false
      self.error_update_profile = "set up state mobx error"
    }
  }),

  clearAllError() {
    self.error_update_profile = ""
    self.error_upload_document = ""
    self.error = ""
  }

})).views(self => ({
  // get ProfileData() {
  //   let data_profile = {}
  //   data_profile['name-lastname'] = self.data?.fullName || ''
  //   data_profile['phone-number'] = self.data?.phoneNumber || ''
  //   data_profile['email'] = self.data?.email || ''
  //   data_profile['avatar'] = self.data?.avatar || ''
  //   data_profile['user-type'] = self.data?.userType || ''
  //   data_profile['id-card'] = self.data?.attachCodeCitizenId || ''
  //   return data_profile
  // }
}))
  .create({
    // IMPORTANT !!
    data: null,
    loading: false,
    error: '',

    data_upload_document: null,
    loading_upload_document: false,
    error_upload_document: '',

    data_update_profile: null,
    error_update_profile: null,

  })


export default PartnerRegisterStore
// Type 2 : not persist store
