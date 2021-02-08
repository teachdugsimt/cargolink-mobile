import { types, flow, cast } from "mobx-state-tree"
import { ShipperTruckAPI } from "../../services/api"

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

const ShipperProfileStore = types
  .model({
    data: types.maybeNull(ShipperJobFull),
    previousListLength: types.optional(types.number, 0),
    truckTypeName: types.maybeNull(types.string),
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    findOne: flow(function* findOne(id: string) {
      shipperTruckApi.setup()
      self.loading = true
      try {
        const response = yield shipperTruckApi.findOne(id)
        console.log("Response call api get shipper profilie : : ", JSON.stringify(response))
        if (response.kind === 'ok') {
          self.data = response.data
        } else {
          self.error = response?.data?.message || response.kind
        }
        self.loading = false
      } catch (error) {
        console.error("Failed to fetch get shipper profilie : ", error)
        self.loading = false
        self.error = "error fetch api get shipper profilie"
      }
    }),

  }))
  .views((self) => ({
    get getData() {
      return self.data
    }
  }))
  .create({
    data: {},
    previousListLength: 0,
    loading: false,
    error: "",
  })

export default ShipperProfileStore
