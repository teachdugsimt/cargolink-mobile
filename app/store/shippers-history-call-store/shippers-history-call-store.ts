import { types, flow, cast } from "mobx-state-tree"
import { ShippersHistoryCallAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import * as storage from "../../utils/storage"

const shippersHistoryCallApi = new ShippersHistoryCallAPI()

const History = types.model({
  id: types.maybeNull(types.string),
  callTime: types.maybeNull(types.string),
  loadingWeight: types.maybeNull(types.number),
  registrationNumber: types.array(
    types.maybeNull(types.string)
  ),
  email: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  avatar: types.maybeNull(types.model({
    object: types.maybeNull(types.string),
    token: types.maybeNull(types.string),
  }))
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
      yield shippersHistoryCallApi.setup()
      self.loading = true
      try {
        if (!(yield isAutenticated())) {
          self.list = cast([])
        } else {
          const response = yield shippersHistoryCallApi.find(filter)

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
