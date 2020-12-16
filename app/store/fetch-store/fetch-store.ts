import { types, destroy } from "mobx-state-tree"
import { number } from "mobx-state-tree/dist/internal"
import { Api } from '../../services/api'
const apiUsers = new Api()


// const Profile = types.model('Profile', {
//     kind: types.number,
//     users: types.maybeNull(types.model())
// }).actions(self => ({
//     // toggleRead() {
//     //     self.read = !self.read
//     // }
// })).views(self => ({
//     getProfile() {
//         return self
//     }
// }))

const UserStore = types.model({
    data: types.model()
}).actions(self => ({
    async getUserRequest() {
        const response = await apiUsers.getUsers()
        console.log("Response call api get user : : ", response)
        if (response) {
            self.data = response
        }
    }
})).views(self => ({
    get getUserData() {
        return self.data
    }
}))
    .create({
        data: {}
    })


export default UserStore
// Type 2 : not persist store