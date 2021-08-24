import {
  types,
  flow
} from "mobx-state-tree";
import { MessagingAPI } from "../../services/api";

const messagingApi = new MessagingAPI()

const MessagingStore = types
  .model({
  })
  .actions((self) => ({
    addFcmToken: flow(function* addFcmToken(params: any) {
      console.log(params)
      yield messagingApi.setup()
      const result = yield messagingApi.addToken(params)
      console.log(result)
    })
  }))
  .create({
    // IMPORTANT !!
    //  status: ''
  })

export default MessagingStore
