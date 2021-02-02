import { types, flow, cast } from "mobx-state-tree"
import { CarriersJobAPI, GoogleMapAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import { decode } from "@mapbox/polyline";
import FavoriteJobStore from "./favorite-job-store";

const apiCarriersJob = new CarriersJobAPI()
const apiGoogleMap = new GoogleMapAPI()

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

const CarriersJobStore = types
  .model({
    list: types.maybeNull(types.array(types.maybeNull(CarriersJob))),
    data: types.maybeNull(CarriersJob),
    previousListLength: types.optional(types.number, 0),
    favoriteList: types.maybeNull(CarriersJob),
    directions: types.optional(types.array(types.array(Directions)), []),
    distances: types.optional(types.array(Distances), []),
    summaryDistances: types.maybeNull(SummaryDistances),
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
          yield FavoriteJobStore.find()
          let arrMerge = []
          if (!filter.page) {
            arrMerge = [...response.data]
          } else {
            arrMerge = [...self.list, ...response.data]
          }
          // let arrMerge = [...self.list, ...response.data] || []
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
        yield FavoriteJobStore.find()
        const response = yield apiCarriersJob.findOne(id)
        console.log("Response call api get shipper job : : ", JSON.stringify(response))
        if (response.kind === 'ok') {
          const result = response.data || {}
          const isLiked = FavoriteJobStore.list.find(({ id }) => id === result.id)?.isLiked
          self.data = { ...result, isLiked: isLiked || false }
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

    getDirections: flow(function* getDirections(coordinates: Array<Types.MapDirectionsRequest>) {
      yield apiGoogleMap.setup()
      self.mapLoading = true
      try {
        let arrDirections = []
        let arrDistances = []
        let summaryDistance = 0
        let summaryDuration = 0
        for (let index = 0; index < coordinates.length; index++) {
          if (index + 1 < coordinates.length) {
            const startLoc = `${coordinates[index].lat},${coordinates[index].lng}`
            const destinationLoc = `${coordinates[index + 1].lat},${coordinates[index + 1].lng}`
            const response = yield apiGoogleMap.getDirections(startLoc, destinationLoc)

            if (response.kind === 'ok') {
              const mapData = response.data.routes[0]
              const distanceValue = mapData.legs[0].distance.value
              const durationValue = mapData.legs[0].duration.value

              summaryDistance += distanceValue
              summaryDuration += durationValue

              arrDistances.push({
                from: startLoc,
                to: destinationLoc,
                distance: distanceValue,
                duration: durationValue,
              })

              const points = decode(mapData.overview_polyline.points);
              const coords = points.map(point => {
                return {
                  latitude: point[0],
                  longitude: point[1]
                };
              });
              arrDirections[index] = coords
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
        }
      })
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
    // IMPORTANT !!
    list: [],
    data: {},
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
