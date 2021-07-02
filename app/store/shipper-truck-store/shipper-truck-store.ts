import { types, flow, cast } from "mobx-state-tree"
import { ShipperTruckAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import FavoriteTruckStore from "./favorite-truck-store"
import * as storage from "../../utils/storage"
import _ from 'lodash'
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
}

const ShipperJob = types.model(defaultModel)

const ShippersJobList = types.model({
  content: types.maybeNull(types.array(ShipperJob)),
  pageable: types.maybeNull(types.model({
    sort: types.model({
      sorted: types.maybeNull(types.boolean),
      unsorted: types.maybeNull(types.boolean),
      empty: types.maybeNull(types.boolean),
    }),
    pageNumber: types.maybeNull(types.number),
    pageSize: types.maybeNull(types.number),
    offset: types.maybeNull(types.number),
    unpaged: types.maybeNull(types.boolean),
    paged: types.maybeNull(types.boolean),
  })),
  totalElements: types.maybeNull(types.number),
  totalPages: types.maybeNull(types.number),
  last: types.maybeNull(types.boolean),
  first: types.maybeNull(types.boolean),
  sort: types.maybeNull(types.model({
    sorted: types.maybeNull(types.boolean),
    unsorted: types.maybeNull(types.boolean),
    empty: types.maybeNull(types.boolean),
  })),
  numberOfElements: types.maybeNull(types.number),
  size: types.maybeNull(types.number),
  number: types.maybeNull(types.number),
  empty: types.maybeNull(types.boolean),
})

const ImageModel = types.model({
  object: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
})

const ShipperJobFull = types.model({
  ...defaultModel,
  truckPhotos: types.maybeNull(types.model({
    front: types.maybeNull(ImageModel),
    back: types.maybeNull(ImageModel),
    left: types.maybeNull(ImageModel),
    right: types.maybeNull(ImageModel),
  })),
  truckTypeName: types.maybeNull(types.string),
  createdFrom: types.maybeNull(types.number),
})

const Profile = {
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
  imageProps: types.maybeNull(types.string)
}

const isAutenticated = async () => {
  const profile = await storage.load('root')
  return !!profile?.tokenStore?.token?.accessToken
}

const ShipperTruckStore = types
  .model({
    mainList: types.maybeNull(ShippersJobList),
    list: types.maybeNull(types.array(ShipperJob)),
    data: types.maybeNull(ShipperJobFull),
    profile: types.model(Profile),
    previousListLength: types.optional(types.number, 0),
    truckTypeName: types.maybeNull(types.string),
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    find: flow(function* find(filter: Types.ShipperJobRequest = {}) {
      console.log("Filter find truck :: ", filter)
      shipperTruckApi.setup()
      self.loading = true
      try {
        self.previousListLength = self.list.length
        const response = yield shipperTruckApi.find(filter)
        console.log("Response call api get shipper jobs : : ", response)
        if (response.kind === 'ok') {

          self.mainList = response.data

          let arrMerge = []
          if (!filter.page) {
            arrMerge = [...response.data.data]
          } else {
            arrMerge = _.unionBy(JSON.parse(JSON.stringify(self.list)), response.data.data, 'id')
            // arrMerge = [...self.list, ...response.data.data]
          }

          if (!(yield isAutenticated())) {
            self.list = cast(arrMerge)
          } else {
            yield FavoriteTruckStore.find()

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
          userId: '',
          companyName: null,
          fullName: null,
          mobileNo: '',
          email: null,
          avatar: null,
        },
        tipper: false,
        isLiked: false,
        truckTypeName: null,
        createdFrom: null,
      }
    },

    setProfile: function setProfile(data) {
      self.profile = JSON.parse(JSON.stringify(data))
    },

    setDefaultOfProfile: function setDefaultOfProfile() {
      self.profile = {
        id: 0,
        userId: '',
        companyName: '',
        fullName: '',
        mobileNo: '',
        email: '',
        avatar: null,
        imageProps: null
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
    mainList: {},
    list: [],
    data: {},
    profile: {},
    previousListLength: 0,
    loading: false,
    error: "",
  })

export default ShipperTruckStore
