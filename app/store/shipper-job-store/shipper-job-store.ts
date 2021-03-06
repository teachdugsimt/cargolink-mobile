import { types, flow, cast } from "mobx-state-tree"
import { ShipperJobAPI, GoogleMapAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import { decode } from "@mapbox/polyline";
import FavoriteJobStore from "./favorite-job-store";
import * as storage from "../../utils/storage"

const apiShipperJob = new ShipperJobAPI()
const apiGoogleMap = new GoogleMapAPI()

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
    }))
  })),
  status: types.maybeNull(types.number),
  quotationNumber: types.maybeNull(types.number),
  isLiked: types.maybeNull(types.optional(types.boolean, false)),
  price: types.maybeNull(types.number),
  priceType: types.maybeNull(types.string),
})

const Directions = types.model({
  latitude: types.number,
  longitude: types.number,
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

const ShipperJobStore = types
  .model({
    jobId: types.maybeNull(types.string),
    list: types.maybeNull(types.array(types.maybeNull(ShipperJob))),
    data: types.maybeNull(ShipperJob),
    profile: types.model(Profile),
    favoriteList: types.maybeNull(ShipperJob),
    previousListLength: types.optional(types.number, 0),
    directions: types.optional(types.array(types.array(Directions)), []),
    loading: types.boolean,
    mapLoading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    find: flow(function* find(filter: Types.ShipperJobRequest = {}) {

      if (!(yield isAutenticated())) {
        self.list = cast([])
      } else {
        yield apiShipperJob.setup()
        self.loading = true
        try {
          self.previousListLength = self.list.length
          const response = yield apiShipperJob.find(filter)
          console.log("Response call api get shipper jobs : : ", response)
          if (response.kind === 'ok') {
            // yield FavoriteJobStore.find()
            let arrMerge = []
            if (!filter.page) {
              arrMerge = [...response.data]
            } else {
              arrMerge = [...self.list, ...response.data]
            }
            // const favoriteList = JSON.parse(JSON.stringify(FavoriteJobStore.list))

            // if (favoriteList && favoriteList.length) {
            //   const result = yield Promise.all(arrMerge.map(attr => {
            //     return {
            //       ...attr,
            //       isLiked: favoriteList.some(val => val.id === attr.id)
            //     }
            //   }))
            //   self.list = JSON.parse(JSON.stringify(result))
            // } else {
            //   self.list = cast(arrMerge)
            // }
            self.list = JSON.parse(JSON.stringify(arrMerge))
            self.loading = false
          } else {
            self.loading = false
          }
        } catch (error) {
          console.error("Failed to fetch get shipper jobs : ", error)
          self.loading = false
          self.error = "error fetch api get shipper jobs"
        }
      }
    }),

    findOne: flow(function* findOne(id: string) {
      yield apiShipperJob.setup()
      self.loading = true
      try {
        if (Object.keys(self.data).length) {
          ShipperJobStore.setDefaultOfData()
        }
        const response = yield apiShipperJob.findOne(id)
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

    create: flow(function* create(data: Types.ShipperJobCreate) {
      yield apiShipperJob.setup()
      self.loading = true
      try {
        const response = yield apiShipperJob.create(data)
        console.log("Response call api get user : : ", response)
        if (response.kind === 'ok') {
          self.data = response.data || {}
        } else {
          self.error = response.data.message
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

    update: flow(function* update(id: string, data: Types.ShipperJobCreate) {
      yield apiShipperJob.setup()
      self.loading = true
      try {
        const response = yield apiShipperJob.update(id, data)
        console.log("Response call api get user : : ", response)
        if (response.kind === 'ok') {
          self.data = {
            ...self.data,
            from: data.from,
            productName: data.productName,
            productTypeId: data.productTypeId,
            requiredTruckAmount: data.truckAmount,
            truckType: data.truckType,
            weight: data.weight,
            // to: cast(data.to)
          }
        } else {
          self.error = response.data.message
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

    delete: flow(function* deleteJob(id: string) {
      yield apiShipperJob.setup()
      self.loading = true
      try {
        const response = yield apiShipperJob.delete(id)
        console.log("Response call api delete user : : ", response)
        if (response.kind === 'ok') {
          self.loading = false
        } else {
          self.error = response.data.message
          self.loading = false
        }
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch delete shipper job : ", error)
        // self.data = []
        self.loading = false
        self.error = "error fetch api delete shipper job"
      }
    }),

    rating: flow(function* rating(data: Types.RatingBody) {
      yield apiShipperJob.setup()
      self.loading = true
      try {
        const response = yield apiShipperJob.rating(data)
        console.log("Response call api rating user : : ", response)
        if (response.kind === 'ok') {
          self.loading = false
        } else {
          self.error = response.data.message
          self.loading = false
        }
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch rating shipper job : ", error)
        // self.data = []
        self.loading = false
        self.error = "error fetch api rating shipper job"
      }
    }),

    getDirections: flow(function* getDirections(coordinates: Array<Types.MapDirectionsRequest>) {
      yield apiGoogleMap.setup()
      self.mapLoading = true
      try {
        let arrDirections = []
        for (let index = 0; index < coordinates.length; index++) {
          if (index + 1 < coordinates.length) {
            const startLoc = `${coordinates[index].lat},${coordinates[index].lng}`
            const destinationLoc = `${coordinates[index + 1].lat},${coordinates[index + 1].lng}`
            const response = yield apiGoogleMap.getDirections(startLoc, destinationLoc)

            if (response.kind === 'ok') {
              const points = decode(response.data.routes[0].overview_polyline.points);
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

    setJobId: function setJobId(id: string | null) {
      self.jobId = id
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
        priceType: null
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

    clearDataByName(name) {
      // __DEV__ && console.tron.log('types of list :: ', typeof self[name]) // list => object 
      self[name] = []
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
    jobId: null,
    list: [],
    data: {},
    profile: {},
    previousListLength: 0,
    loading: false,
    mapLoading: false,
    error: "",
    directions: [],
  })

export default ShipperJobStore
// Type 2 : not persist store
