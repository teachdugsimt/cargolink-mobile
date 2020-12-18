import { types, flow } from "mobx-state-tree"
import { MyVehicleAPI } from '../../services/api'
const apiUsers = new MyVehicleAPI()

const Region = types.model({
    region: types.string,
    province: types.string
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

const CreateVehicleStore = types.model({
    data: types.maybeNull(VehicleNew),
    loading: types.boolean,
    error: types.maybeNull(types.string)
}).actions(self => ({
    createVehicleProfile: flow(function* createVehicleProfile(params) { // <- note the star, this a generator function!
        apiUsers.setup()
        self.loading = true
        try {
            // ... yield can be used in async/await style
            const response = yield apiUsers.createVehicleProfile(params)
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
})).views(self => ({
    get getProfileFunction() {
        return self.data
    }
}))
    .create({
        // IMPORTANT !!
        data: null,
        loading: false,
        error: ''
    })


export default CreateVehicleStore
// Type 2 : not persist store