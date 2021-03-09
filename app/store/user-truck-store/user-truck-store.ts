import { types, flow, cast } from "mobx-state-tree"
import { UserTruckAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import FavoriteJobStore from '../shipper-truck-store/shipper-truck-store'
import * as storage from "../../utils/storage"

const userTruckApi = new UserTruckAPI()

const CarriersJob = types.model({
  id: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  loadingWeight: types.maybeNull(types.number),
  stallHeight: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.array(types.string)),
  tipper: types.maybeNull(types.boolean),
  phoneNumber: types.maybeNull(types.string),
  isLiked: types.optional(types.boolean, false),
  workingZones: types.optional(types.array(types.model({
    region: types.maybeNull(types.number),
    province: types.maybeNull(types.number),
  })), []),
  owner: types.maybeNull(types.model({
    id: types.maybeNull(types.number),
    userId: types.maybeNull(types.string),
    companyName: types.maybeNull(types.string),
    fullName: types.maybeNull(types.string),
    mobileNo: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    avatar: types.maybeNull(types.model({
      object: types.maybeNull(types.string),
      token: types.maybeNull(types.string),
    }))
  })),
})

const isAutenticated = async () => {
  const profile = await storage.load('root')
  return !!profile?.tokenStore?.token?.accessToken
}

const UserTruckStore = types
  .model({
    list: types.maybeNull(types.array(types.maybeNull(CarriersJob))),
    userId: types.maybeNull(types.string),
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    find: flow(function* find(filter: Types.UserJobFilter = {}) {
      userTruckApi.setup()
      self.loading = true
      try {
        const response = yield userTruckApi.find(filter)
        console.log("Response call api get list truck of user : : ", response)
        if (response.kind === 'ok') {
          // self.list = response.data

          let arrMerge = []
          if (!filter.page) {
            arrMerge = [...response.data]
          } else {
            arrMerge = [...self.list, ...response.data]
          }

          if (!(yield isAutenticated())) {
            self.list = cast(arrMerge)
          } else {
            yield FavoriteJobStore.find()

            const favoriteList = JSON.parse(JSON.stringify(FavoriteJobStore.list))

            if (favoriteList?.length) {
              const result = yield Promise.all(arrMerge.map(attr => {
                return {
                  ...attr,
                  isLiked: favoriteList.some(val => val.id === attr.id)
                }
              }))
              self.list = JSON.parse(JSON.stringify(result))
            } else {
              self.list = cast(arrMerge)
            }
          }

        } else {
          self.error = response?.data?.message || response.kind
        }
        self.loading = false
      } catch (error) {
        console.error("Failed to fetch get list job of user :", error)
        self.loading = false
        self.error = "error fetch api get list job of user"
      }
    }),

    clearList() {
      self.list = cast([])
    },

    setUserId(userId: string) {
      self.userId = userId
    }

  }))
  .views((self) => ({
    get getList() {
      return self.list
    },
  }))
  .create({
    list: [],
    loading: false,
    error: "",
  })

export default UserTruckStore
