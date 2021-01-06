import { types, flow } from "mobx-state-tree"
import { TruckTypeApi } from '../../services/api'
const apiTruckType = new TruckTypeApi()

const truckTypeModel = types.model({
    id: types.number,
    name: types.string,

    // image: types.string,

    label: types.string,
    value: types.number,



    ID: types.maybeNull(types.number),
    key: types.maybeNull(types.number)
})

const TruckTypeStore = types.model({
    data: types.maybeNull(types.array(truckTypeModel)),
    loading: types.boolean,
    error: types.maybeNull(types.string),


}).actions(self => ({
    getTruckTypeDropdown: flow(function* getTruckTypeDropdown(params) { // <- note the star, this a generator function!
        apiTruckType.setup(params)
        self.loading = true
        try {
            console.log("Come to this api TRUCK TYPE ;: ", params)
            // ... yield can be used in async/await style
            const response = yield apiTruckType.getTruckTypeDropdown(params)
            console.log("Response call get truck type vehicle Mobx : : ", response)
            if (response.ok) {
                let tmp = JSON.parse(JSON.stringify(response.data)) || []
                let res = []
                tmp.forEach((e: any, i: any) => {
                    res.push({
                        label: e.name,
                        value: e.id,

                        id: e.id,
                        name: e.name
                    })
                })
                self.data = res
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
    }),

    setTruckTypeMapping(data) {
        self.data = data
    }

}))
    .create({
        // IMPORTANT !!
        data: null,
        loading: false,
        error: ''
    })


export default TruckTypeStore
// Type 2 : not persist store