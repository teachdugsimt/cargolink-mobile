import { types, flow, cast } from "mobx-state-tree"
import { FavoriteTruckAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import * as storage from "../../utils/storage"

const favoriteTruckApi = new FavoriteTruckAPI()

const ShipperTruck = types.model({
  id: types.maybeNull(types.string),
  truckType: types.maybeNull(types.number),
  loadingWeight: types.maybeNull(types.number),
  stallHeight: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  approveStatus: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.array(types.string)),
  tipper: types.maybeNull(types.boolean),
  isLiked: types.maybeNull(types.optional(types.boolean, true)),
})

const isAutenticated = async () => {
  const profile = await storage.load('root')
  return !!profile?.tokenStore?.token?.accessToken
}

const FavoriteTruckStore = types
  .model({
    list: types.maybeNull(types.array(types.maybeNull(ShipperTruck))),
    id: types.maybeNull(types.string),
    keepPreviousActivity: types.optional(types.boolean, false),
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
        yield favoriteTruckApi.setup()
        self.loading = true
        try {
          const response = yield favoriteTruckApi.find(filter)
          console.log("Response call api get favorite jobs : : ", response)
          self.list = response.data || []
          self.loading = false
        } catch (error) {
          console.error("Failed to fetch get favorite jobs : ", error)
          self.loading = false
          self.error = "error fetch api get favorite jobs"
        }
      }
    }),

    add: flow(function* add(id: string) {
      yield favoriteTruckApi.setup()
      self.loadingOfAdd = true
      try {
        const response = yield favoriteTruckApi.create({ id })
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
    /*
    unFollow: flow(function* unFollow(id: string) { // use of favorite screen
        yield favoriteTruckApi.setup()
        self.loading = true
        try {
            const response = yield favoriteTruckApi.create({ id })
            console.log("Response call api add favorite job : : ", response)
            if (response.kind !== 'ok') {
                self.error = response?.data?.message || response.kind
            } else {
                const newData = [...self.list]
                const index = self.list.findIndex(({ id }) => id === FavoriteTruckStore.id)
                if (index !== -1) {
                    delete newData[index]

                }
            }
            self.loading = false
        } catch (error) {
            console.error("Failed to fetch get favorite job : ", error)
            self.loading = false
            self.error = "error fetch api get favorite job"
        }
    }),
    */
    keepLiked: function keepLiked(id: string, liked: boolean) {
      self.id = id
      self.liked = liked
    },

    keepPreviousActivityFunc: function keepPreviousActivityFunc(data: boolean) {
      self.keepPreviousActivity = data
      console.log('self.keepPreviousActivity', self.keepPreviousActivity)
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
    keepPreviousActivity: false,
    loading: false,
    loadingOfAdd: false,
    error: "",
  })

export default FavoriteTruckStore
