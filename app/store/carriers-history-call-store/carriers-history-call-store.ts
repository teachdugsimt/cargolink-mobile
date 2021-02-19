import { types, flow, cast } from "mobx-state-tree"
import { CarriersHistoryCallAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import * as storage from "../../utils/storage"

const carriersHistoryCallApi = new CarriersHistoryCallAPI()

const History = types.model({
  id: types.maybeNull(types.string),
  callTime: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
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

const isAutenticated = async () => {
  const profile = await storage.load('root')
  return !!profile?.tokenStore?.token?.accessToken
}

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
        if (!(yield isAutenticated())) {
          self.list = cast([])
        } else {
          const response = yield carriersHistoryCallApi.find(filter)

          if (response.kind === 'ok') {
            const data = response.data.map((history, index) => {
              return {
                id: (index + 1).toString(),
                ...history,
              }
            })
            self.list = data
          } else {
            self.error = response?.data?.message || response?.kind
          }
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
    }),

    setList: function setList(list: any) {
      self.list = list
    }

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
