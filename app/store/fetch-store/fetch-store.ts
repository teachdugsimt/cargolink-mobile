import { types, flow } from "mobx-state-tree"
import { TestApi } from '../../services/api'
const apiUsers = new TestApi()

const Profile = types.model({
    id: types.maybeNull(types.string),
    name: types.maybeNull(types.string)
})

const UserStore = types.model({
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
            self.data = response.data || []
            self.loading = false
        } catch (error) {
            // ... including try/catch error handling
            console.error("Failed to fetch get users api : ", error)
            // self.data = []
            self.loading = false
            self.error = "error fetch api get users"
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


export default UserStore
// Type 2 : not persist store