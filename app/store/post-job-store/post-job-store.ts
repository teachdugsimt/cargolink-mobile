import { types, destroy } from "mobx-state-tree"
import { TextPropTypes } from "react-native"

const PostJob1 = types.model({
    "car-num": types.maybeNull(types.string),
    "item-name": types.maybeNull(types.string),
    "item-type": types.maybeNull(types.number),
    "item-weight": types.maybeNull(types.string),
    "vehicle-type": types.maybeNull(types.number)
})

const PostJobStore = types.model({
    postjob1: types.maybeNull(PostJob1),
})
    .actions(self => ({
        setPostJob(params: number, data: any){
            if(params == 1){
                self.postjob1 = data
            }
        }
    }))
    .create({
        postjob1: null
    })

export default PostJobStore
// Type 2 : not persist store