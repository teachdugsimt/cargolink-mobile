import { types, flow } from "mobx-state-tree"
import { MyVehicleAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import { vehicleEn, vehicleTh } from '../../screens/home-screen/manage-vehicle/datasource'
const apiMyVehicle = new MyVehicleAPI()

const Region = types.model({
    region: types.string,
    province: types.string
})

const VehicleImage = types.model({
    url: types.maybeNull(types.string)
})

const vehicleModel = {
    id: types.maybeNull(types.string), // [PENDING] types.number
    registration_vehicle: types.maybeNull(types.string),
    car_type: types.maybeNull(types.string),
    from: types.maybeNull(types.string),
    to: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    image_car_type: types.maybeNull(types.string),
    owner: types.maybeNull(types.model({})),
}

const fullVehicleModel = {
    ...vehicleModel,
    vehicle_height: types.maybeNull(types.number),
    have_dump: types.maybeNull(types.boolean),
    images: types.maybeNull(types.array(VehicleImage)),
    work_zone: types.array(Region),
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
        findRequest: flow(function* findRequest(filter?: Types.VehicleFilterRequest | null) {
            // <- note the star, this a generator function!
            apiMyVehicle.setup()
            self.loading = true
            try {
                const response = yield apiMyVehicle.find(filter)
                console.log("Response call api get user : : ", response)
                self.list = response.data || []
                self.loading = false
            } catch (error) {
                // ... including try/catch error handling
                console.error("Failed to fetch get users api : ", error)
                // self.data = []
                self.loading = false
                self.error = "error fetch api get users"
            }
        }),

        findOneRequest: flow(function* findOneRequest(id: number) {
            apiMyVehicle.setup()
            self.loading = true
            try {
                const response = yield apiMyVehicle.findOne(id)
                console.log("Response call api get user : : ", response)
                self.data = response.data || {}
                self.loading = false
            } catch (error) {
                // ... including try/catch error handling
                console.error("Failed to fetch get users api : ", error)
                // self.data = []
                self.loading = false
                self.error = "error fetch api get users"
            }
        }),

        setDefaultOfData: flow(function* setDefaultOfData() {
            self.data = {
                id: '',
                registration_vehicle: '',
                car_type: '',
                from: '',
                to: '',
                status: '',
                image_car_type: '',
                owner: {},
                vehicle_height: 0,
                have_dump: false,
                images: [
                    { url: 'defaultImage' },
                    { url: 'defaultImage' },
                    { url: 'defaultImage' },
                    { url: 'defaultImage' }
                ]
            }
        }),
    }))
    .views((self) => ({
        get getVehicles() {
            return self.list
        },
        get MappingData() {
            console.log("Data MOBXXXXXXXXXXXXXXXX :: ", self.data)
            if (self.data && self.data.car_type) {

                let dataInit = {
                    // "vehicle-type": self.data.car_type ? self.data.car_type : '',
                    "vehicle-height": self.data.vehicle_height ? self.data.vehicle_height.toString() : '',
                    "registration-0": self.data.registration_vehicle ? self.data.registration_vehicle : '',
                }
                const th_type = vehicleTh.find(e => e.label == self.data.car_type)
                const en_type = vehicleEn.find(e => e.label == self.data.car_type)
                let type_car = th_type.value || en_type.value
                dataInit["vehicle-type"] = type_car


                if (self.data.work_zone && self.data.work_zone.length) {
                    self.data.work_zone.forEach((item, index) => {
                        dataInit['controller-region-' + index] = item.region
                        dataInit['controller-province-' + index] = item.province
                    })
                }

                console.log("dataInite in MOBX :: ", dataInit)
                console.log("dataInite in MOBX :: ", dataInit)
                // dataInit["images"] = self.data.images
                // dataInit["have_dump"] = self.data.have_dump
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
