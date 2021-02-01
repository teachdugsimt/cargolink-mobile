import { types, flow, cast } from "mobx-state-tree"
import { MyVehicleAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import { vehicleEn, vehicleTh } from '../../screens/home-screen/manage-vehicle/datasource'
import _ from 'lodash'
const apiMyVehicle = new MyVehicleAPI()

const Region = types.model({
  region: types.maybeNull(types.number),
  province: types.maybeNull(types.number)
})

const VehicleImage = types.model({
  back: types.maybeNull(types.string),
  front: types.maybeNull(types.string),
  left: types.maybeNull(types.string),
  right: types.maybeNull(types.string),
})

const vehicleModel = {
  approveStatus: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  id: types.maybeNull(types.string), // [PENDING] types.number
  updatedAt: types.maybeNull(types.string),
  registrationNumber: types.maybeNull(types.array(types.string)),
  truckType: types.maybeNull(types.number),
  stallHeight: types.maybeNull(types.string),
  tipper: types.maybeNull(types.boolean),
  loadingWeight: types.maybeNull(types.number),
}

const fullVehicleModel = {
  ...vehicleModel,
  truckPhotos: types.maybeNull(VehicleImage),
  workingZones: types.maybeNull(types.array(Region))
}

const Vehicle = types.model(vehicleModel)
const VehicleDetail = types.model(fullVehicleModel)

const MyVehicleStore = types
  .model({
    list: types.maybeNull(types.array(Vehicle)),
    data: types.maybeNull(VehicleDetail),
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    findRequest: flow(function* findRequest(filter?: Types.VehicleFilterRequest | {}) {
      // <- note the star, this a generator function!
      yield apiMyVehicle.setup()
      self.loading = true
      try {
        const response = yield apiMyVehicle.find(filter)
        console.log("Response call api find My Vehicle Request ::  ", response)
        const parseResponse = response.data || []
        let tmp
        
        if (filter.page == 1) {
          tmp = parseResponse
        } else tmp = _.unionBy(self.list, parseResponse, 'id')

        __DEV__ && console.tron.log("Parse list response >>>> :: ", tmp)
        self.list = tmp
        self.loading = false
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch find My Vehicle Request api : ", error)
        // self.data = []
        self.loading = false
        self.error = "error fetch api find My Vehicle Request"
      }
    }),

    findOneRequest: flow(function* findOneRequest(id: string) {
      yield apiMyVehicle.setup()
      self.loading = true
      try {
        const response = yield apiMyVehicle.findOne(id)
        console.log("Response call api findOneRequest : : ", response)
        if (response.kind === 'ok') {
          // const images = response.data.truckPhotos &&
          //     Object.keys(response.data.truckPhotos).length ?
          //     Object.entries(response.data.truckPhotos).map(img => {
          //         return { url: img[1] }
          //     }) : []
          const data = {
            ...response.data,
            // imageTransform: images
          }
          self.data = data || {}
        } else {
          self.error = response.data.message
        }
        self.loading = false
      } catch (error) {
        // ... including try/catch error handling
        console.error("Failed to fetch findOneRequest api : ", error)
        // self.data = []
        self.loading = false
        self.error = "error fetch api findOneRequest"
      }
    }),

    setDefaultOfData: flow(function* setDefaultOfData() {
      self.data = {
        id: '',
        registrationNumber: cast(['']),
        truckType: null,
        loadingWeight: 0,
        createdAt: '',
        updatedAt: '',
        approveStatus: '',
        stallHeight: 'LOW',
        tipper: false,
        truckPhotos: {
          back: 'defaultImage',
          front: 'defaultImage',
          left: 'defaultImage',
          right: 'defaultImage',
        },
        workingZones: cast([{
          region: 1,
          province: 1
        }])
      }
    }),

    clearListData() {
      self.list = []
    }
  }))
  .views((self) => ({
    get getVehicles() {
      return self.list
    },
    get MappingData() {
      if (self.data && self.data) {
        console.log("Self data mapping to EDIT :: ", self.data)
        let dataInit = {
          "vehicle-height": self.data.stallHeight ? self.data.stallHeight.toString() : '',
          "vehicle-type": self.data.truckType
        }

        if (self.data.registrationNumber && self.data.registrationNumber.length) {
          self.data.registrationNumber.forEach((e, i) => {
            dataInit[`registration-${i}`] = e
          })
        }

        // const th_type = vehicleTh.find(e => e.value == self.data.truckType)
        // const en_type = vehicleEn.find(e => e.value == self.data.truckType)
        // let type_car = th_type.value || en_type.value
        // dataInit["vehicle-type"] = type_car

        if (self.data.workingZones && self.data.workingZones.length) {
          self.data.workingZones.forEach((item, index) => {
            dataInit['controller-region-' + index] = item.region
            dataInit['controller-province-' + index] = item.province
          })
        }

        console.log("dataInite in MOBX :: ", dataInit)
        return dataInit;
      }

      else return {};


    }
  }))
  .create({
    // IMPORTANT !!
    list: [],
    data: {},
    loading: false,
    error: "",
  })

export default MyVehicleStore
// Type 2 : not persist store
