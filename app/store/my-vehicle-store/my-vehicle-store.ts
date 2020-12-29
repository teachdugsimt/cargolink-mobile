import { types, flow, cast } from "mobx-state-tree"
import { MyVehicleAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import { vehicleEn, vehicleTh } from '../../screens/home-screen/manage-vehicle/datasource'
const apiMyVehicle = new MyVehicleAPI()

const Region = types.model({
    region: types.string,
    province: types.string
})

const VehicleImage = types.model({
    back: types.maybeNull(types.string),
    front: types.maybeNull(types.string),
    left: types.maybeNull(types.string),
    right: types.maybeNull(types.string),
})

const TransformVehicleImage = types.model({
    url: types.maybeNull(types.string)
})

const vehicleModel = {
    id: types.maybeNull(types.string), // [PENDING] types.number
    registrationNumber: types.maybeNull(types.array(types.string)),
    car_type: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
    updatedAt: types.maybeNull(types.string),
    approveStatus: types.maybeNull(types.string),
    image_car_type: types.maybeNull(types.string),
    owner: types.maybeNull(types.model({})),
}

const fullVehicleModel = {
    ...vehicleModel,
    stallHeight: types.maybeNull(types.number),
    tipper: types.maybeNull(types.boolean),
    truckPhotos: types.maybeNull(VehicleImage),
    workingZones: types.array(Region),
    loadingWeight: types.maybeNull(types.number),
    truckType: types.maybeNull(types.number),
    // imageTransform: types.maybeNull(types.array(TransformVehicleImage))
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
                console.error("Failed to fetch get users api : ", error)
                // self.data = []
                self.loading = false
                self.error = "error fetch api get users"
            }
        }),

        setDefaultOfData: flow(function* setDefaultOfData() {
            self.data = cast({
                id: '',
                registrationNumber: [''],
                car_type: '',
                createdAt: '',
                updatedAt: '',
                approveStatus: '',
                image_car_type: 'defaultImage',
                owner: {},
                stallHeight: 0,
                tipper: false,
                truckPhotos: {
                    back: 'defaultImage',
                    front: 'defaultImage',
                    left: 'defaultImage',
                    right: 'defaultImage',
                },
                // imageTransform: [
                //     { url: 'defaultImage' },
                //     { url: 'defaultImage' },
                //     { url: 'defaultImage' },
                //     { url: 'defaultImage' }
                // ]
            })
        }),
    }))
    .views((self) => ({
        get getVehicles() {
            return self.list
        },
        get MappingData() {
            if (self.data && self.data) {

                let dataInit = {
                    "vehicle-height": self.data.stallHeight ? self.data.stallHeight.toString() : '',
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
