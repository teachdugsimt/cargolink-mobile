import { types, flow, cast } from "mobx-state-tree"
import { TruckTypeApi } from "../../services/api"
import i18n from "i18n-js"
import * as Types from "../../services/api/api.types"

const TruckType = {
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
}

const TruckTypeGroup = types.model(TruckType)

const Unauthorized = types.model({
  ok: types.boolean
})

const HandleTokenStore = types
  .model({
    list: types.optional(types.array(TruckTypeGroup), []),
    loading: types.boolean,
    error: types.maybeNull(types.string),

    data_unauthorize: types.maybeNull(Unauthorized)
  })
  .actions((self) => ({
    find: flow(function* find(filter: any = {}) {
      const truckTypeApi = new TruckTypeApi()
      yield truckTypeApi.setup(i18n.locale)
      self.loading = true
      try {
        const response = yield truckTypeApi.getTruckTypeDropdown(filter)
        console.log("Response call api get truck type BY Handle Problem : : ", response)
        self.list = response.data
        self.loading = false
      } catch (error) {
        console.error("Failed to fetch get truck type BY Handle Problem : ", error)
        self.loading = false
        self.error = "error fetch api get truck type"
      }
    }),

    setResponseUnauthorize(response, lastFunction?: any) {
      __DEV__ && console.tron.logImportant("Case Unauthorize :: ", response)
      if (self.data_unauthorize == null)
        lastFunction
      self.data_unauthorize = response
    }


  }))
  .views((self) => ({
    get getList() {
      return self.list
    }
  }))
  .create({
    list: [],
    loading: false,
    error: "",

    data_unauthorize: null,
  })

export default HandleTokenStore
