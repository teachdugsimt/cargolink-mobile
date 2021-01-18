import { types, destroy } from "mobx-state-tree"
import { TextPropTypes } from "react-native"

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
    "shipper-name": types.maybeNull(types.string),
    "shipper-tel-no": types.maybeNull(types.string),
})

const PostJob2 = types.model({
    "receive-location": types.maybeNull(types.string),
    "receive-date": types.maybeNull(types.string),
    "receive-time": types.maybeNull(types.string),
    "receive-name": types.maybeNull(types.string),
    "receive-tel-no": types.maybeNull(types.string),
    "shipping-information": types.maybeNull(types.array(Shipping))
})

const PostJobStore = types.model({
    postjob1: types.maybeNull(PostJob1),
    postjob2: types.maybeNull(PostJob2)
})
    .actions(self => ({
        setPostJob(params: number, data: any) {
            if (params == 1) {
                self.postjob1 = data
            } else if(params == 2) {
                self.postjob2 = data
            }
        }
    }))
    .create({
        postjob1: null
    })

export default PostJobStore
// Type 2 : not persist store