import { types, flow, cast } from "mobx-state-tree"
import { CarriersHistoryCallAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"

const carriersHistoryCallApi = new CarriersHistoryCallAPI()

const History = types.model({
  callTime: types.maybeNull(types.string),
  carrierEmail: types.maybeNull(types.string),
  carrierName: types.maybeNull(types.string),
  carrierPhone: types.maybeNull(types.string),
  from: types.model({
    contactMobileNo: types.maybeNull(types.string),
    contactName: types.maybeNull(types.string),
    dateTime: types.maybeNull(types.string),
    lat: types.maybeNull(types.string),
    lng: types.maybeNull(types.string),
    name: types.maybeNull(types.string)
  }),
  productName: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  requiredTruckAmount: types.maybeNull(types.number),
  to: types.array(types.model({
    contactMobileNo: types.maybeNull(types.string),
    contactName: types.maybeNull(types.string),
    dateTime: types.maybeNull(types.string),
    lat: types.maybeNull(types.string),
    lng: types.maybeNull(types.string),
    name: types.maybeNull(types.string)
  })),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number)
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
      yield carriersHistoryCallApi.setup()
      self.loading = true
      try {
        const response = yield carriersHistoryCallApi.find(filter)

        if (response.kind === 'ok') {
          self.list = response.data
        } else {
          self.error = response?.data?.message || response?.kind
        }

        self.loading = false
      } catch (error) {
        console.error("Failed to fetch get carriers history call : ", error)
        self.loading = false
        self.error = "error fetch api get carriers history call"
      }
    }),

    add: flow(function* add(data: Types.CarriersHistoryCallAdd) {
      yield carriersHistoryCallApi.setup()
      self.loading = true
      try {
        const response = yield carriersHistoryCallApi.add(data)

        if (response.kind === 'ok') {
          // self.data = response.data
        } else {
          self.error = response?.data?.message || response?.kind
        }

        self.loading = false
      } catch (error) {
        console.error("Failed to fetch add carriers history call : ", error)
        self.loading = false
        self.error = "error fetch api add carriers history call"
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
