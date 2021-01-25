import { types, flow } from "mobx-state-tree"
import { MyVehicleAPI } from '../../services/api'
import * as Types from "../../services/api/api.types"
const apiMyVehicle = new MyVehicleAPI()

const Region = types.model({
    region: types.maybeNull(types.number),
    province: types.maybeNull(types.number)
})

const ImageType = types.model({
    back: types.maybeNull(types.string),
    front: types.maybeNull(types.string),
    left: types.maybeNull(types.string),
    right: types.maybeNull(types.string)
})

const VehicleNew = types.model({
    approveStatus: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
    id: types.maybeNull(types.string),

    loadingWeight: types.maybeNull(types.number),
    registrationNumber: types.maybeNull(types.array(types.string)),
    stallHeight: types.maybeNull(types.string),
    tipper: types.maybeNull(types.boolean),
    truckPhotos: types.maybeNull(ImageType),
    truckType: types.maybeNull(types.number),
    updatedAt: types.maybeNull(types.string),
    workingZones: types.array(Region)
    // carrierId: types.number,


    // carrierId: types.number,
    // loadingWeight: types.maybeNull(types.number),
    // registrationNumber: types.array(types.string),
    // stallHeight: types.number,
    // tipper: types.boolean,
    // truckPhotos: types.maybeNull(ImageType),
    // truckType: types.number,
    // workingZones: types.array(Region)
})

const VehiclePatch = types.model({
    carrierId: types.maybeNull(types.number),
    truckType: types.maybeNull(types.number),
    stallHeight: types.maybeNull(types.number),

    loadingWeight: types.maybeNull(types.number),
    tipper: types.maybeNull(types.boolean),
    registrationNumber: types.maybeNull(types.array(types.string)),
    truckPhotos: types.maybeNull(types.model({
        url: types.maybeNull(types.string),
        action: types.maybeNull(types.string)
    })),
    workingZones: types.maybeNull(types.array(Region))
})

const CreateVehicleStore = types.model({
    data: types.maybeNull(VehicleNew),
    loading: types.boolean,
    error: types.maybeNull(types.string),

    patchMyVehicle: types.maybeNull(types.number),
    loadingPatchMyVehicle: types.boolean,
    errorPatchMyVehicle: types.maybeNull(types.string)

}).actions(self => ({
    createVehicleProfile: flow(function* createVehicleProfile(params) { // <- note the star, this a generator function!
        yield apiMyVehicle.setup()
        self.loading = true
        try {
            // ... yield can be used in async/await style
            const response = yield apiMyVehicle.createVehicleProfile(params)
            console.log("Response call create upload vehicle : : ", response)
            if (response.ok) {
                self.data = response.data || {}
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
        __DEV__ && console.tron.logImportant(params)
        yield apiMyVehicle.setup()
        self.loadingPatchMyVehicle = true
        try {
            const response = yield apiMyVehicle.patchMyVehicle(params)
            console.log("Response call api patch my vehicle : : ", response)
            self.patchMyVehicle = response.data || {}
            self.loadingPatchMyVehicle = false
        } catch (error) {
            // ... including try/catch error handling
            console.error("Failed to fetch patch my vehicle api : ", error)
            // self.data = []
            self.loadingPatchMyVehicle = false
            self.errorPatchMyVehicle = "error fetch api patch my vehicles"
        }
    }),

    clearDataCreate() {
        self.data = null
    },
    clearDataPatchVehicle() {
        self.patchMyVehicle = null
    }

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