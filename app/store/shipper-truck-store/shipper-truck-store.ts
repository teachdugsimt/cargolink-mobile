import { types, flow, cast } from "mobx-state-tree"
import { ShipperTruckAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import FavoriteTruckStore from "./favorite-truck-store"

const shipperTruckApi = new ShipperTruckAPI()

const defaultModel = {
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
  })), [])
}

const ShipperJob = types.model(defaultModel)

const ShipperJobFull = types.model({
  ...defaultModel,
  truckPhotos: types.maybeNull(types.model({
    front: types.maybeNull(types.string),
    back: types.maybeNull(types.string),
    left: types.maybeNull(types.string),
    right: types.maybeNull(types.string),
  })),
  truckTypeName: types.maybeNull(types.string),
  owner: types.maybeNull(types.model({
    id: types.maybeNull(types.number),
    companyName: types.maybeNull(types.string),
    fullName: types.maybeNull(types.string),
    mobileNo: types.maybeNull(types.string),
    email: types.maybeNull(types.string)
  })),
})

const ShipperTruckStore = types
  .model({
    list: types.maybeNull(types.array(ShipperJob)),
    data: types.maybeNull(ShipperJobFull),
    previousListLength: types.optional(types.number, 0),
    truckTypeName: types.maybeNull(types.string),
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    find: flow(function* find(filter: Types.ShipperJobRequest = {}) {
      shipperTruckApi.setup()
      self.loading = true
      try {
        self.previousListLength = self.list.length
        const response = yield shipperTruckApi.find(filter)
        console.log("Response call api get shipper jobs : : ", response)
        if (response.kind === 'ok') {
          yield FavoriteTruckStore.find()
          let arrMerge = []
          if (!filter.page) {
            arrMerge = [...response.data]
          } else {
            arrMerge = [...self.list, ...response.data]
          }
          // let arrMerge = [...self.list, ...response.data] || []
          const favoriteList = JSON.parse(JSON.stringify(FavoriteTruckStore.list))

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
          self.loading = false
        } else {
          self.loading = false
        }
      } catch (error) {
        console.error("Failed to fetch get shipper trucks : ", error)
        self.loading = false
        self.error = "error fetch api get shipper trucks"
      }
    }),

    findOne: flow(function* findOne(id: string) {
      shipperTruckApi.setup()
      self.loading = true
      try {
        yield FavoriteTruckStore.find()
        const response = yield shipperTruckApi.findOne(id)
        console.log("Response call api get shipper truck : : ", JSON.stringify(response))
        if (response.kind === 'ok') {
          const result = response.data || {}
          const isLiked = FavoriteTruckStore.list.find(({ id }) => id === result.id)?.isLiked
          self.data = { ...result, isLiked: isLiked || false, truckTypeName: self.truckTypeName }
        } else {
          self.error = response?.data?.message || response.kind
        }
        self.loading = false
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch get shipper truck : ", error)
        // self.data = []
        self.loading = false
        self.error = "error fetch api get shipper truck"
      }
    }),

    updateFavoriteInList: function updateFavoriteInList(id: string, isLiked: boolean) {
      if (id.length) {
        const newList = JSON.parse(JSON.stringify(self.list))
        const index = self.list.findIndex(({ id: idx }) => idx === id)
        const oldData = JSON.parse(JSON.stringify(newList[index]))
        self.list.splice(index, 1, { ...oldData, isLiked })
      }
    },

    setDefaultOfData: function setDefaultOfData() {
      self.data = {
        id: '',
        truckType: 0,
        loadingWeight: 2,
        stallHeight: null,
        createdAt: '',
        updatedAt: '',
        approveStatus: '',
        phoneNumber: '',
        registrationNumber: cast([
          ''
        ]),
        truckPhotos: {
          front: null,
          back: null,
          left: null,
          right: null
        },
        workingZones: cast([
          {
            region: 1,
            province: null
          }
        ]),
        owner: {
          id: 0,
          companyName: null,
          fullName: null,
          mobileNo: '',
          email: null
        },
        tipper: false,
        isLiked: false,
        truckTypeName: null,
      }
    },

    setDefaultOfList: function setDefaultOfList() {
      self.list = cast([])
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
    data: {},
    previousListLength: 0,
    loading: false,
    error: "",
  })

export default ShipperTruckStore
