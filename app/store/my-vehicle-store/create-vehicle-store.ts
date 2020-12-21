import { types, flow } from "mobx-state-tree"
import { MyVehicleAPI } from '../../services/api'
import * as Types from "../../services/api/api.types"
const apiMyVehicle = new MyVehicleAPI()

const Region = types.model({
    region: types.maybeNull(types.string),
    province: types.maybeNull(types.string)
})

const ImageVehicle = types.model({
    uri: types.string,
    type: types.string,
    name: types.string,
    size: types.number,
    tmp_name: types.string
})

const VehicleNew = types.model({
    car_type: types.string,
    have_dump: types.boolean,
    vehicle_height: types.string,
    registration_vehicle: types.array(types.string),
    images: types.maybeNull(types.array(ImageVehicle)),
    work_zone: types.array(Region)
})

const VehiclePatch = types.model({
    car_type: types.string,
    have_dump: types.boolean,
    vehicle_height: types.string,
    registration_vehicle: types.array(types.string),
    images: types.maybeNull(types.array(types.model({
        uri: types.string,
        type: types.maybeNull(types.string),
        name: types.maybeNull(types.string),
        size: types.maybeNull(types.number),
        tmp_name: types.maybeNull(types.string)
    }))),
    work_zone: types.array(Region)
})

const CreateVehicleStore = types.model({
    data: types.maybeNull(VehicleNew),
    loading: types.boolean,
    error: types.maybeNull(types.string),

    patchMyVehicle: types.maybeNull(VehiclePatch),
    loadingPatchMyVehicle: types.boolean,
    errorPatchMyVehicle: types.maybeNull(types.string)

}).actions(self => ({
    createVehicleProfile: flow(function* createVehicleProfile(params) { // <- note the star, this a generator function!
        apiMyVehicle.setup()
        self.loading = true
        try {
            // ... yield can be used in async/await style
            const response = yield apiMyVehicle.createVehicleProfile(params)
            console.log("Response call create upload vehicle : : ", response)
            if (response.ok) {
                self.data = response.data.reminder || {}
                self.loading = false
            } else {
                self.loading = false
                self.error = "error fetch create upload vehicles"
            }
        } catch (error) {
            // ... including try/catch error handling
            console.error("Failed to store value create upload vehicles : ", error)
            // self.data = []
            self.loading = false
            self.error = "set up state mobx error"
        }
    }),
    patchVehicleDetailsRequest: flow(function* findRequest(params: Types.PatchDataRequest) {
        // <- note the star, this a generator function!
        apiMyVehicle.setup()
        self.loadingPatchMyVehicle = true
        try {
            const response = yield apiMyVehicle.patchMyVehicle(params)
            console.log("Response call api patch my vehicle : : ", response)
            self.patchMyVehicle  = response.data.reminder || []
            self.loadingPatchMyVehicle = false
        } catch (error) {
            // ... including try/catch error handling
            console.error("Failed to fetch patch my vehicle api : ", error)
            // self.data = []
            self.loadingPatchMyVehicle = false
            self.errorPatchMyVehicle = "error fetch api patch my vehicles"
        }
    }),

})).views(self => ({
    get getProfileFunction() {
        return self.data
    }
}))
    .create({
        // IMPORTANT !!
        data: null,
        loading: false,
        error: '',
        patchMyVehicle: null,
        loadingPatchMyVehicle: false,
        errorPatchMyVehicle: null
    })


export default CreateVehicleStore
// Type 2 : not persist store