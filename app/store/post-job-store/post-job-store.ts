import { types, destroy, flow, unprotect } from "mobx-state-tree"
import { PostJobAPI } from '../../services/api'
const postjobAPI = new PostJobAPI()

const dateError: string = "Date of delivery should not be a date before the date of loading"
const dateError2: string = "วันที่ส่งมอบ ไม่สามารถลงวันที่ก่อนวันที่ทำการขนส่ง"
const RegionMap = types.model({
  longitudeDelta: types.maybeNull(types.number),
  longitude: types.maybeNull(types.number),
  latitudeDelta: types.maybeNull(types.number),
  latitude: types.maybeNull(types.number),
})

const PostJob1 = types.model({
  "car-num": types.maybeNull(types.string),
  "item-name": types.maybeNull(types.string),
  "item-type": types.maybeNull(types.number),
  "item-weight": types.maybeNull(types.string),
  "vehicle-type": types.maybeNull(types.number),
  "dump-field": types.maybeNull(types.number),
  "shipping-rate": types.maybeNull(types.string),
  "shipping-type": types.maybeNull(types.number)
})

const Shipping = types.model({
  "shipping-address": types.maybeNull(types.string),
  "shipping-date": types.maybeNull(types.string),
  "shipping-time": types.maybeNull(types.string),
  "shipping-name": types.maybeNull(types.string),
  "shipping-tel-no": types.maybeNull(types.string),
  "shipping-region": types.maybeNull(RegionMap)
})

const PostJob2 = types.model({
  id: types.maybeNull(types.string),
  "receive-location": types.maybeNull(types.string),
  "receive-region": types.maybeNull(RegionMap),
  "receive-date": types.maybeNull(types.string),
  "receive-time": types.maybeNull(types.string),
  // "receive-date": types.maybeNull(types.union(types.string, types.Date)),
  // "receive-time": types.maybeNull(types.union(types.string, types.Date)),
  "receive-name": types.maybeNull(types.string),
  "receive-tel-no": types.maybeNull(types.string),
  "shipping-information": types.maybeNull(types.array(Shipping))
})

const PostJobStore = types.model({
  postjob1: types.maybeNull(PostJob1),
  postjob2: types.maybeNull(PostJob2),

  loading: types.maybeNull(types.boolean),
  error: types.maybeNull(types.string),
  data_postjob: types.maybeNull(types.union(types.string, types.number)),

  job_id: types.maybeNull(types.string),
  vehicle_type: types.maybeNull(types.number)
})
  .actions(self => ({
    setVehicleType(params: number) {
      self.vehicle_type = params
    },
    setPostJob(params: number, data: any) {
      if (params == 1) {
        self.postjob1 = data
      } else if (params == 2) {
        self.postjob2 = data
      }
    },

    createPostJobRequest: flow(function* createPostJobRequest(params) { // <- note the star, this a generator function!
      yield postjobAPI.setup()
      self.loading = true
      try {
        // ... yield can be used in async/await style
        const response = yield postjobAPI.createPostJob(params)
        console.log("Response call create post job : : ", response)
        if (response.ok) {
          self.data_postjob = response.data?.id || "success"
          self.loading = false
        } else {
          self.loading = false
          if (response.data && response.data.validMsgList) {
            self.error = JSON.stringify(response.data.validMsgList)
          } else
            self.error = "error fetch create post job"
        }
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to store value create post job : ", error)
        // self.data = []
        self.loading = false
        self.error = "set up state mobx error"
      }
    }),

    updateJob: flow(function* updateJob(params) { // <- note the star, this a generator function!
      yield postjobAPI.setup()
      self.loading = true
      try {
        // ... yield can be used in async/await style
        const response = yield postjobAPI.updateJob(self.job_id, params)
        __DEV__ && console.tron.log("Response call update post job : : ", response)
        console.log("Response call update post job : : ", response)
        if (response.ok) {
          self.data_postjob = response.data || "success"
          self.loading = false
        } else {
          self.loading = false
          __DEV__ && console.tron.log("Response ERROR POST JOB :: ", response)
          if (response.data && response.data.validMsgList) {
            self.error = JSON.stringify(response.data.validMsgList)
          } else
            self.error = "error fetch update post job"
        }
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to store value update post job : ", error)
        // self.data = []
        self.loading = false
        self.error = "set up state mobx error"
      }
    }),

    clearDataPostjob() {
      self.data_postjob = null
      self.job_id = null
      self.error = null
      self.postjob1 = null
      self.postjob2 = null
    },
    setError() {
      self.error = null
    },

    setJobId(param) {
      self.job_id = param
    }
  }))
  .views((self) => ({
    get MappingInitValue() {
      if (self.postjob1 && self.postjob2) {
        // return self.postjob2
        let tmpPostJob2 = self.postjob2
        console.log("RAW DATA POSTJOB2 :: ", tmpPostJob2)
        if (tmpPostJob2["shipping-information"]) {

          self.postjob2["shipping-information"].forEach((e, i) => {
            tmpPostJob2[`shipping-address-${i + 1}`] = e["shipping-address"]
            tmpPostJob2[`shipping-time-${i + 1}`] = e["shipping-time"]
            tmpPostJob2[`shipping-date-${i + 1}`] = e["shipping-date"]
            tmpPostJob2[`shipping-name-${i + 1}`] = e["shipping-name"]
            tmpPostJob2[`shipping-tel-no-${i + 1}`] = e["shipping-tel-no"]
            tmpPostJob2[`shipping-region-${i + 1}`] = e["shipping-region"]
          })
        }
        console.log("After parse object MOBX :: ", tmpPostJob2)

        let newPostJob2 = tmpPostJob2
        console.log("Post job2 data in mobx :: ", newPostJob2)

        let initialVlaue = { ...self.postjob1, ...tmpPostJob2 }
        console.log("Final data in mobx :: ", initialVlaue)

        return initialVlaue
      } else return {}
    },
    get MappingPostjob2() {
      if (self.postjob2) {
        // return self.postjob2
        let tmpPostJob2 = self.postjob2
        if (tmpPostJob2["shipping-information"]) {

          self.postjob2["shipping-information"].forEach((e, i) => {
            tmpPostJob2[`shipping-address-${i + 1}`] = e["shipping-address"]
            tmpPostJob2[`shipping-time-${i + 1}`] = e["shipping-time"]
            tmpPostJob2[`shipping-date-${i + 1}`] = e["shipping-date"]
            tmpPostJob2[`shipping-name-${i + 1}`] = e["shipping-name"]
            tmpPostJob2[`shipping-tel-no-${i + 1}`] = e["shipping-tel-no"]
            tmpPostJob2[`shipping-region-${i + 1}`] = e["shipping-region"]
          })
        }
        let initialVlaue = { ...tmpPostJob2 }

        return initialVlaue
      } else return {}
    }

  }))
  .create({
    postjob1: null,
    postjob2: null,
    loading: false,
    error: '',
    data_postjob: null,
    vehicle_type: null,
  })

unprotect(PostJobStore)

export default PostJobStore
// Type 2 : not persist store
