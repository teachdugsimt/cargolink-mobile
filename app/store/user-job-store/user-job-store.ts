import { types, flow, cast } from "mobx-state-tree"
import { UserJobAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import FavoriteJobStore from '../carriers-job-store/favorite-job-store'
import * as storage from "../../utils/storage"

const userJobApi = new UserJobAPI()

const CarriersJob = types.model({
  id: types.maybeNull(types.string),
  productTypeId: types.maybeNull(types.number),
  productName: types.maybeNull(types.string),
  truckType: types.maybeNull(types.string),
  weight: types.maybeNull(types.number),
  requiredTruckAmount: types.maybeNull(types.number),
  from: types.maybeNull(types.model({
    name: types.maybeNull(types.string),
    dateTime: types.maybeNull(types.string),
    contactName: types.maybeNull(types.string),
    contactMobileNo: types.maybeNull(types.string),
    lat: types.maybeNull(types.string),
    lng: types.maybeNull(types.string),
  })),
  to: types.maybeNull(types.array(types.model({
    name: types.maybeNull(types.string),
    dateTime: types.maybeNull(types.string),
    contactName: types.maybeNull(types.string),
    contactMobileNo: types.maybeNull(types.string),
    lat: types.maybeNull(types.string),
    lng: types.maybeNull(types.string),
  }))),
  owner: types.maybeNull(types.model({
    id: types.maybeNull(types.number),
    companyName: types.maybeNull(types.string),
    fullName: types.maybeNull(types.string),
    mobileNo: types.maybeNull(types.string),
    email: types.maybeNull(types.string)
  })),
  isLiked: types.maybeNull(types.optional(types.boolean, false))
})

const isAutenticated = async () => {
  const profile = await storage.load('root')
  return !!profile?.tokenStore?.token?.accessToken
}

const UserJobStore = types
  .model({
    list: types.maybeNull(types.array(types.maybeNull(CarriersJob))),
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    find: flow(function* find(filter: Types.UserJobFilter = {}) {
      userJobApi.setup()
      self.loading = true
      try {
        const response = yield userJobApi.find(filter)
        console.log("Response call api get list job of user : : ", response)
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

export default UserJobStore