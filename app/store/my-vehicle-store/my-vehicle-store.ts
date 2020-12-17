// import { types, flow } from "mobx-state-tree"
// import { MyVehicleAPI } from "../../services/api"
// import * as Types from "../../services/api/api.types"

// const apiMyVehicle = new MyVehicleAPI()

// const Vehicle = types.model({
//   id: types.maybeNull(types.string),
//   topic: types.maybeNull(types.string),
//   subTopic: types.maybeNull(types.string),
//   updatedDate: types.maybeNull(types.string),
//   status: types.maybeNull(types.string),
//   image: types.maybeNull(types.string),
// })

// const MyVehicleStore = types
//   .model({
//     list: types.maybeNull(types.array(Vehicle)),
//     // data: {},
//     loading: types.boolean,
//     error: types.maybeNull(types.string),
//   })
//   .actions((self) => ({
//     findRequest: flow(function* findRequest(filter?: Types.AuthRequest | null) {
//       // <- note the star, this a generator function!
//       apiMyVehicle.setup()
//       self.loading = true
//       try {
//         const response = yield apiMyVehicle.find(filter)
//         console.log("Response call api get user : : ", response)
//         self.list = response.data || []
//         self.loading = false
//       } catch (error) {
//         // ... including try/catch error handling
//         console.error("Failed to fetch get users api : ", error)
//         // self.data = []
//         self.loading = false
//         self.error = "error fetch api get users"
//       }
//     }),
//   }))
//   .views((self) => ({
//     get getVehicles() {
//       return self.list
//     },
//   }))
//   .create({
//     // IMPORTANT !!
//     list: [],
//     // data: {},
//     loading: false,
//     error: "",
//   })

// export default MyVehicleStore
// // Type 2 : not persist store
