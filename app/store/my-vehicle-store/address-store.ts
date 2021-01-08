import { types, flow } from "mobx-state-tree"
import { AddressApi } from '../../services/api'
const apiAddress = new AddressApi()

const regionModel = types.model({
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
})

const provinceModel = types.model({
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
})

const AddressStore = types.model({
    region: types.maybeNull(types.array(regionModel)),
    loading: types.boolean,
    error: types.maybeNull(types.string),

    province: types.maybeNull(types.array(provinceModel)),
    loadingProvince: types.boolean,
    errorProvince: types.maybeNull(types.string)
}).actions(self => ({
    
    getRegion: flow(function* getRegion(params) { 
        yield apiAddress.setup(params)
        self.loading = true
        try {
            const response = yield apiAddress.getRegion(params)
            console.log("Response call get region Mobx : : ", response)
            if (response.ok) {
                self.region = response.data || null
                self.loading = false
            } else {
                self.loading = false
                self.error = "error fetch get province"
            }
        } catch (error) {
            // ... including try/catch error handling => types in response failure 
            console.error("Failed to store value get province : ", error)
            self.loading = false
            self.error = "set up state mobx error"
        }
    }),

    getProvince: flow(function* getProvince(params) { 
        yield apiAddress.setup(params)
        self.loadingProvince = true
        try {
            const response = yield apiAddress.getProvince(params)
            console.log("Response call get province Mobx : : ", response)
            if (response.ok) {
                self.province = response.data || null
                self.loadingProvince = false
            } else {
                self.loadingProvince = false
                self.errorProvince = "error fetch get province"
            }
        } catch (error) {
            // ... including try/catch error handling => types in response failure 
            console.error("Failed to store value get province : ", error)
            self.loadingProvince = false
            self.errorProvince = "set up state mobx error"
        }
    }),


}))
    .create({
        // IMPORTANT !!
        region: null,
        loading: false,
        error: '',

        province: null,
        loadingProvince: false,
        errorProvince: '',
    })


export default AddressStore
// Type 2 : not persist store