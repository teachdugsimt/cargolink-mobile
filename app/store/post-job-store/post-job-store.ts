import { types, destroy, flow } from "mobx-state-tree"
import { TextPropTypes } from "react-native"
import { PostJobAPI } from '../../services/api'
const postjobAPI = new PostJobAPI()

const PostJob1 = types.model({
    "car-num": types.maybeNull(types.string),
    "item-name": types.maybeNull(types.string),
    "item-type": types.maybeNull(types.number),
    "item-weight": types.maybeNull(types.string),
    "vehicle-type": types.maybeNull(types.number)
})

const Shipping = types.model({
    "shipping-address": types.maybeNull(types.string),
    "shipping-date": types.maybeNull(types.string),
    "shipping-time": types.maybeNull(types.string),
    "shipping-name": types.maybeNull(types.string),
    "shipping-tel-no": types.maybeNull(types.string),
})

const PostJob2 = types.model({
    "receive-location": types.maybeNull(types.string),
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
    data_postjob: types.maybeNull(types.number)
})
    .actions(self => ({
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
                __DEV__ && console.tron.log("Response call create post job : : ", response)
                console.log("Response call create post job : : ", response)
                if (response.ok) {
                    self.data_postjob = response.data || {}
                    self.loading = false
                } else {
                    self.loading = false
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

        clearDataPostjob(){
            self.data_postjob = null
        }
    }))
    .views((self) => ({
        get MappingInitValue() {
            if (self.postjob1 && self.postjob2) {
                // return self.postjob2
                let tmpPostJob2 = self.postjob2
                __DEV__ && console.tron.log("RAW DATA POSTJOB2 :: ", tmpPostJob2)
                if (tmpPostJob2["shipping-information"]) {

                    self.postjob2["shipping-information"].forEach((e, i) => {
                        tmpPostJob2[`shipping-address-${i + 1}`] = e["shipping-address"]
                        tmpPostJob2[`shipping-time-${i + 1}`] = e["shipping-time"]
                        tmpPostJob2[`shipping-date-${i + 1}`] = e["shipping-date"]
                        tmpPostJob2[`shipping-name-${i + 1}`] = e["shipping-name"]
                        tmpPostJob2[`shipping-tel-no-${i + 1}`] = e["shipping-tel-no"]
                    })
                }
                __DEV__ && console.tron.log("After parse object MOBX :: ", tmpPostJob2)
                // delete tmpPostJob2["shipping-information"]


                let newPostJob2 = tmpPostJob2
                // delete newPostJob2["shipping-information"]
                __DEV__ && console.tron.log("Post job2 data in mobx :: ", newPostJob2)

                let initialVlaue = { ...self.postjob1, ...tmpPostJob2 }
                __DEV__ && console.tron.log("Final data in mobx :: ", initialVlaue)

                return initialVlaue
            } else return {}
        }

    }))
    .create({
        postjob1: {},
        postjob2: {}
    })

export default PostJobStore
// Type 2 : not persist store