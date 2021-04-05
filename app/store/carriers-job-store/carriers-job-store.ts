import { types, flow, cast } from "mobx-state-tree"
import { CarriersJobAPI, GoogleMapAPI, MyVehicleAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import { decode } from "@mapbox/polyline";
import FavoriteJobStore from "./favorite-job-store";
import * as storage from "../../utils/storage"

const apiMyVehicle = new MyVehicleAPI()
const apiCarriersJob = new CarriersJobAPI()
const apiGoogleMap = new GoogleMapAPI()

const ImageModel = types.model({
  object: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
})

const truckModal = types.model({
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
  truckPhotos: types.maybeNull(types.model({
    front: types.maybeNull(ImageModel),
    back: types.maybeNull(ImageModel),
    left: types.maybeNull(ImageModel),
    right: types.maybeNull(ImageModel),
  })),
})

const QuotationField = types.model({
  id: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  bookingDatetime: types.maybeNull(types.string),
  truck: types.maybeNull(types.model({
    id: types.maybeNull(types.string),
    truckType: types.maybeNull(types.number),
    loadingWeight: types.maybeNull(types.number),
    stallHeight: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
    updatedAt: types.maybeNull(types.string),
    approveStatus: types.maybeNull(types.string),
    phoneNumber: types.maybeNull(types.string),
    registrationNumber: types.maybeNull(types.array(types.maybeNull(types.string))),
    truckPhotos: types.maybeNull(types.model({
      front: types.maybeNull(ImageModel),
      back: types.maybeNull(ImageModel),
      left: types.maybeNull(ImageModel),
      right: types.maybeNull(ImageModel),
    })),
    workingZones: types.maybeNull(types.array(types.maybeNull(types.model({
      region: types.maybeNull(types.number),
      province: types.maybeNull(types.number),
    })))),
    tipper: types.maybeNull(types.boolean),
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
  })),
  avatar: types.maybeNull(types.model({
    object: types.maybeNull(types.string),
    token: types.maybeNull(types.string),
  }))
})

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
  isLiked: types.maybeNull(types.optional(types.boolean, false)),
  quotations: types.maybeNull(types.array(QuotationField)),
  truck: types.maybeNull(truckModal),
  price: types.maybeNull(types.number),
  priceType: types.maybeNull(types.string),
})

const CarriersJobList = types.model({
  content: types.maybeNull(types.array(CarriersJob)),
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

const Directions = types.model({
  latitude: types.number,
  longitude: types.number,
})

const Distances = types.model({
  from: types.optional(types.string, ''),
  to: types.optional(types.string, ''),
  distance: types.optional(types.number, 0),
  duration: types.optional(types.number, 0),
})

const SummaryDistances = types.model({
  distance: types.optional(types.number, 0),
  duration: types.optional(types.number, 0),
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

const CarriersJobStore = types
  .model({
    mainList: types.maybeNull(CarriersJobList),
    list: types.maybeNull(types.array(CarriersJob)),
    data: types.maybeNull(CarriersJob),
    profile: types.model(Profile),
    previousListLength: types.optional(types.number, 0),
    favoriteList: types.maybeNull(CarriersJob),
    directions: types.optional(types.array(types.array(Directions)), []),
    distances: types.optional(types.array(Distances), []),
    summaryDistances: types.maybeNull(SummaryDistances),
    provinces: types.maybeNull(types.string),
    loading: types.boolean,
    mapLoading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    find: flow(function* find(filter: Types.CarriersJobRequest = {}) {
      apiCarriersJob.setup()
      self.loading = true
      try {
        self.previousListLength = self.list.length
        const response = yield apiCarriersJob.find(filter)
        console.log("Response call api get shipper jobs : : ", response)
        if (response.kind === 'ok') {

          self.mainList = response.data

          let arrMerge = []
          if (!filter.page) {
            arrMerge = [...response.data.content]
          } else {
            arrMerge = [...self.list, ...response.data.content]
          }

          if (!(yield isAutenticated())) {
            self.list = cast(arrMerge)
          } else {
            yield FavoriteJobStore.find()
            const favoriteList = JSON.parse(JSON.stringify(FavoriteJobStore.list))

            if (favoriteList && favoriteList.length) {
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
        console.error("Failed to fetch get shipper jobs : ", error)
        self.loading = false
        self.error = "error fetch api get shipper jobs"
      }
    }),

    findOne: flow(function* findOne(id: string) {
      apiCarriersJob.setup()
      self.loading = true
      try {
        if (Object.keys(self.data).length) {
          CarriersJobStore.setDefaultOfData()
        }
        const response = yield apiCarriersJob.findOne(id)
        console.log("Response call api get shipper job : : ", JSON.stringify(response))
        if (response.kind === 'ok') {
          const result = response.data || {}
          if (!(yield isAutenticated())) {
            self.data = response.data
          } else {
            yield FavoriteJobStore.find()
            const isLiked = FavoriteJobStore.list.find(({ id }) => id === result.id)?.isLiked
            self.data = { ...result, isLiked: isLiked || false }
          }
        } else {
          self.error = response?.data?.message || response.kind
        }
        self.loading = false
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch get shipper job : ", error)
        // self.data = []
        self.loading = false
        self.error = "error fetch api get shipper job"
      }
    }),


    getJobDetail: flow(function* getJobDetail(id: string) {
      yield apiMyVehicle.setup()
      self.loading = true
      try {
        const response = yield apiMyVehicle.getJobDetailByQuotationId(id)
        console.log("Response call api getJobDetail : : ", response)
        if (response.kind === 'ok') {
          self.data = response.data || null
        } else {
          self.error = response.data.message || 'fail to fetch getJobDetail api'
        }
        self.loading = false
      } catch (error) {
        console.error("Failed to fetch getJobDetail api : ", error)
        self.loading = false
        self.error = "error fetch api getJobDetail"
      }
    }),

    getDirections: flow(function* getDirections(coordinates: Array<Types.MapDirectionsRequest>) {
      yield apiGoogleMap.setup()
      self.mapLoading = true
      try {
        let arrDirections = []
        let arrDistances = []
        let summaryDistance = 0
        let summaryDuration = 0
        let province = {}
        CarriersJobStore.clearProvince()
        console.log('coordinates', JSON.parse(JSON.stringify(coordinates)))
        for (let index = 0; index < coordinates.length; index++) {
          if (index + 1 < coordinates.length) {
            const startLoc = `${coordinates[index].lat},${coordinates[index].lng}`
            const destinationLoc = `${coordinates[index + 1].lat},${coordinates[index + 1].lng}`
            const response = yield apiGoogleMap.getDirections(startLoc, destinationLoc)

            if (response.kind === 'ok') {
              const mapData = response.data.routes[0]
              const distanceValue = mapData?.legs[0]?.distance?.value || 0
              const durationValue = mapData?.legs[0]?.duration?.value || 0

              summaryDistance += distanceValue
              summaryDuration += durationValue

              province = {
                ...province,
                [startLoc]: mapData?.legs[0]?.start_address || '',
                [destinationLoc]: mapData?.legs[0]?.end_address || ''
              }

              arrDistances.push({
                from: startLoc,
                to: destinationLoc,
                distance: distanceValue,
                duration: durationValue,
              })

              if (mapData?.overview_polyline) {
                const points = decode(mapData.overview_polyline.points);
                const coords = points.map(point => {
                  return {
                    latitude: point[0],
                    longitude: point[1]
                  };
                });
                arrDirections[index] = coords
              }
            } else {
              self.error = response.data.message
            }
          }
        }
        self.distances = cast(arrDistances)
        self.summaryDistances = {
          distance: summaryDistance,
          duration: summaryDuration
        }
        self.provinces = JSON.stringify(province)
        // console.log('arrDirections', JSON.stringify(arrDirections))
        self.directions = cast(arrDirections)
        // const result = coordinates.reduce((prev, curr) => yield callApiMap(prev, curr))
        // const response = yield apiGoogleMap.getDirections(startLoc, destinationLoc)
        self.mapLoading = false
      } catch (error) {
        console.error("Failed to fetch google map : ", error)
        self.mapLoading = false
        self.error = "error fetch api google map"
      }
    }),

    updateFavoriteInList: function updateFavoriteInList(id: string, isLiked) {
      if (id.length) {
        const newList = JSON.parse(JSON.stringify(self.list))
        const index = self.list.findIndex(({ id: idx }) => idx === id)
        const oldData = newList[index]
        newList.splice(index, 1, { ...oldData, isLiked })
        self.list = newList
      }
    },

    setDefaultOfData: function setDefaultOfData() {
      self.data = cast({
        id: '',
        productTypeId: 0,
        productName: '',
        truckType: '',
        weight: 0,
        requiredTruckAmount: 0,
        from: {
          name: '',
          dateTime: '',
          contactName: '',
          contactMobileNo: '',
          lat: '',
          lng: ''
        },
        to: [
          {
            name: '',
            dateTime: '',
            contactName: '',
            contactMobileNo: '',
            lat: '',
            lng: ''
          }
        ],
        owner: {
          id: 0,
          companyName: null,
          fullName: null,
          mobileNo: '',
          email: null
        },
        price: 0,
        priceType: null,
      })
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
    },

    clearProvince: function clearProvince() {
      self.provinces = ''
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
    // IMPORTANT !!
    mainList: {},
    list: [],
    data: {},
    profile: {},
    provinces: '',
    previousListLength: 0,
    loading: false,
    mapLoading: false,
    error: "",
    directions: [],
    distances: [],
    summaryDistances: {},
  })

export default CarriersJobStore
// Type 2 : not persist store
