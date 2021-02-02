import { types, flow, cast } from "mobx-state-tree"
import { ShippersHistoryCallAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"

const shippersHistoryCallApi = new ShippersHistoryCallAPI()

const History = types.model({
  callTime: types.maybeNull(types.string),
  loadingWeight: types.maybeNull(types.number),
  registrationNumber: types.array(
    types.maybeNull(types.string)
  ),
  shipperEmail: types.maybeNull(types.string),
  shipperName: types.maybeNull(types.string),
  shipperPhone: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number)
})

const CarriersHistoryCallStore = types
  .model({
    list: types.array(History),
    data: types.maybeNull(types.model({})),
    loading: types.boolean,
    error: types.string
  })
  .actions((self) => ({

    find: flow(function* find(filter: object = {}) {
      yield shippersHistoryCallApi.setup()
      self.loading = true
      try {
        const response = yield shippersHistoryCallApi.find(filter)

        if (response.kind === 'ok') {
          self.list = response.data
        } else {
          self.error = response?.data?.message || response?.kind
        }

        self.loading = false
      } catch (error) {
        console.error("Failed to fetch get shipper history call : ", error)
        self.loading = false
        self.error = "error fetch api get shipper history call"
      }
    }),

    add: flow(function* add(data: Types.ShippersHistoryCallAdd) {
      yield shippersHistoryCallApi.setup()
      self.loading = true
      try {
        const response = yield shippersHistoryCallApi.add(data)

        if (response.kind === 'ok') {
          // self.data = response.data
        } else {
          self.error = response?.data?.message || response?.kind
        }

        self.loading = false
      } catch (error) {
        console.error("Failed to fetch add shipper history call : ", error)
        self.loading = false
        self.error = "error fetch api add shipper history call"
      }
    })

  }))
  .views((self) => ({
    get getList() {
      return self.list
    },
    get getData() {
      return self.data
    }
  }))
  .create({
    list: [],
    data: null,
    loading: false,
    error: ''
  })

export default CarriersHistoryCallStore
// Type 2 : not persist store
