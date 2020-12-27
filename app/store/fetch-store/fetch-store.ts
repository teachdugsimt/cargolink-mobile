import { types, flow } from "mobx-state-tree"
import { MockApi } from '../../services/api'
const apiUsers = new MockApi()

const Profile = types.model({
    id: types.maybeNull(types.string),
    name: types.maybeNull(types.string)
})

const FetchStore = types.model({
    data: types.maybeNull(types.array(Profile)),
    loading: types.boolean,
    error: types.maybeNull(types.string)
}).actions(self => ({
    getUserRequest: flow(function* getUserRequest() { // <- note the star, this a generator function!
        apiUsers.setup()
        self.loading = true
        try {
            // ... yield can be used in async/await style
            const response = yield apiUsers.getUsers()
            console.log("Response call api get user : : ", response)
            if (response.ok) {
                self.data = response.data || []
                self.loading = false
            } else {
                self.loading = false
                self.error = "error fetch api get users"
            }
        } catch (error) {
            // ... including try/catch error handling
            console.error("Failed to fetch get users api : ", error)
            // self.data = []
            self.loading = false
            self.error = "set up state mobx error"
        }
    }),
})).views(self => ({
    get getUserData() {
        return self.data
    }
}))
    .create({
        // IMPORTANT !!
        data: [],
        loading: false,
        error: ''
    })


export default FetchStore
// Type 2 : not persist store