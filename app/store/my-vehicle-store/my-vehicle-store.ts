import { types, flow } from "mobx-state-tree"
import { MyVehicleAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"

const apiMyVehicle = new MyVehicleAPI()

const VehicleImage = types.model({
    url: types.maybeNull(types.string)
})

const vehicleModel = {
    id: types.maybeNull(types.string), // [PENDING] types.number
    vehicle_no: types.maybeNull(types.string),
    car_type: types.maybeNull(types.string),
    from: types.maybeNull(types.string),
    to: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    image_car_type: types.maybeNull(types.string),
    owner: types.maybeNull(types.model({})),
}

const fullVehicleModel = {
    ...vehicleModel,
    heigh: types.maybeNull(types.number),
    isDum: types.maybeNull(types.boolean),
    images: types.maybeNull(types.array(VehicleImage)),
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
        })
    }))
    .views((self) => ({
        get getVehicles() {
            return self.list
        },
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
