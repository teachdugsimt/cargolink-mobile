import { types, flow, cast } from "mobx-state-tree"
import { FavoriteJobAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import * as storage from "../../utils/storage"

const favoriteJobApi = new FavoriteJobAPI()

const ShipperJob = types.model({
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
    userId: types.maybeNull(types.string),
    companyName: types.maybeNull(types.string),
    fullName: types.maybeNull(types.string),
    mobileNo: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    avatar: types.maybeNull(types.model({
      object: types.maybeNull(types.string),
      token: types.maybeNull(types.string),
    })),
  })),
  isLiked: types.maybeNull(types.optional(types.boolean, true)),
})

const isAutenticated = async () => {
  const profile = await storage.load('root')
  return !!profile?.tokenStore?.token?.accessToken
}

const FavoriteJobStore = types
  .model({
    list: types.maybeNull(types.array(types.maybeNull(ShipperJob))),
    id: types.maybeNull(types.string),
    liked: types.boolean,
    loading: types.boolean,
    loadingOfAdd: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    find: flow(function* find(filter: Types.ShipperJobRequest = {}) {
      if (!(yield isAutenticated())) {
        self.list = cast([])
      } else {
        self.loading = true
        yield favoriteJobApi.setup()
        try {
          const response = yield favoriteJobApi.find(filter)
          console.log("Response call api get favorite jobs : : ", response)
          if (response.kind === 'ok') {
            self.list = response.data.data || []
          } else if (response.kind === 'unauthorized') {
            self.list = cast([])
            self.error = response.kind
          }
          self.loading = false
        } catch (error) {
          console.error("Failed to fetch get favorite jobs : ", error)
          self.loading = false
          self.error = "error fetch api get favorite jobs"
        }
      }
    }),

    add: flow(function* add(id: string) {
      yield favoriteJobApi.setup()
      self.loadingOfAdd = true
      try {
        const response = yield favoriteJobApi.create({ id })
        console.log("Response call api add favorite job : : ", response)
        if (response.kind !== 'ok') {
          self.error = response?.data?.message || response.kind
        }
        self.loadingOfAdd = false
      } catch (error) {
        console.error("Failed to fetch get favorite job : ", error)
        self.loadingOfAdd = false
        self.error = "error fetch api get favorite job"
      }
    }),

    keepLiked: function keepLiked(id: string, liked: boolean) {
      self.id = id
      self.liked = liked
    },

    setList: function setList(list: any) {
      self.list = list
    }

  }))
  .views((self) => ({
    get getList() {
      return self.list
    },
  }))
  .create({
    list: [],
    id: '',
    liked: false,
    loadingOfAdd: false,
    loading: false,
    error: '',
  })

export default FavoriteJobStore
