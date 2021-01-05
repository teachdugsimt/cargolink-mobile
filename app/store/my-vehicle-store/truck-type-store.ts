import { types, flow } from "mobx-state-tree"
import { TruckTypeApi } from '../../services/api'
const apiTruckType = new TruckTypeApi()

const truckTypeModel = types.model({
    id: types.number,
    name: types.string,
    image: types.string
})

const TruckTypeStore = types.model({
    data: types.maybeNull(types.array(truckTypeModel)),
    loading: types.boolean,
    error: types.maybeNull(types.string),


}).actions(self => ({
    getTruckTypeDropdown: flow(function* getTruckTypeDropdown(params) { // <- note the star, this a generator function!
        apiTruckType.setup()
        self.loading = true
        try {
            console.log("Come to this api TRUCK TYPE ;: ", params)
            // ... yield can be used in async/await style
            const response = yield apiTruckType.getTruckTypeDropdown(params)
            console.log("Response call get truck type vehicle : : ", response)
            if (response.ok) {
                self.data = response.data || {}
                self.loading = false
            } else {
                self.loading = false
                self.error = "error fetch get truck type vehicles"
            }
        } catch (error) {
            // ... including try/catch error handling
            console.error("Failed to store value get truck type vehicles : ", error)
            // self.data = []
            self.loading = false
            self.error = "set up state mobx error"
        }
    })

}))
    .create({
        // IMPORTANT !!
        data: null,
        loading: false,
        error: ''
    })


export default TruckTypeStore
// Type 2 : not persist store