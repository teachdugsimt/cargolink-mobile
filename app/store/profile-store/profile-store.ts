import { types, flow } from "mobx-state-tree"
import { ProfileApi } from '../../services/api'
const apiUsers = new ProfileApi()


const Vehicle = types.model({
    id: types.number,
    type: types.string,
    status: types.string,
    number: types.number
})

const Profile = types.model({
    first_name: types.string,
    last_name: types.string,
    age: types.number,
    account_type: types.string,
    tel_no: types.string,
    work_zone: types.array(types.string),
    vehicle_details: types.maybeNull(types.array(Vehicle))
})

const ProfileStore = types.model({
    data: types.maybeNull(Profile),
    loading: types.boolean,
    error: types.maybeNull(types.string)
}).actions(self => ({
    getProfileRequest: flow(function* getProfileRequest(params) { // <- note the star, this a generator function!
        apiUsers.setup()
        self.loading = true
        try {
            // ... yield can be used in async/await style
            const response = yield apiUsers.getProfile({ token: params })
            console.log("Response call api get user : : ", response)
            if (response.ok) {
                self.data = response.data || {}
                self.loading = false
            } else {
                self.loading = false
                self.error = "error fetch api get users"
            }
        } catch (error) {
            // ... including try/catch error handling
            console.error("Failed to store value get profile : ", error)
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


export default ProfileStore
// Type 2 : not persist store