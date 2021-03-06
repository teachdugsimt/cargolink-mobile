import { types, flow } from "mobx-state-tree"
import { AddressApi } from '../../services/api'
const apiAddress = new AddressApi()

const regionModel = types.model({
  // id: types.maybeNull(types.number),
  // name: types.maybeNull(types.string),
  // image: types.maybeNull(types.string),

  label: types.maybeNull(types.string),
  value: types.maybeNull(types.number)
})


const provinceModel = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  // label: types.maybeNull(types.string),
  // value: types.maybeNull(types.number)
})

const SubMenu = types.maybeNull(types.array(types.maybeNull(types.model({
  label: types.maybeNull(types.string),
  value: types.maybeNull(types.number),
  region: types.maybeNull(types.number),
  active: types.maybeNull(types.boolean),

}))))

const FullRegion = types.maybeNull(types.array(types.maybeNull(types.model({
  label: types.maybeNull(types.string),
  value: types.maybeNull(types.number),
  subMenu: SubMenu
}))))

const AddressStore = types.model({
  region: types.maybeNull(types.array(regionModel)),
  loading: types.boolean,
  error: types.maybeNull(types.string),

  province: types.maybeNull(types.array(provinceModel)),
  loadingProvince: types.boolean,
  errorProvince: types.maybeNull(types.string),

  workZone: FullRegion
}).actions(self => ({

  setWorkZone(data: any) {
    self.workZone = data
  },

  getRegion: flow(function* getRegion(params) {
    yield apiAddress.setup(params)
    self.loading = true
    try {
      const response = yield apiAddress.getRegion(params)
      console.log("Response call get region Mobx : : ", response)
      if (response.ok) {
        let tmp = JSON.parse(JSON.stringify(response.data)) || null
        let res = []
        tmp.forEach((e, i) => {
          res.push({
            label: e.name,
            value: e.id
          })
        })
        self.region = res
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

  getProvince: flow(function* getProvince(params, lang) {
    yield apiAddress.setup(lang)
    self.loadingProvince = true
    try {
      const response = yield apiAddress.getProvince(params)
      console.log("Response call get province Mobx : : ", response)
      if (response.ok) {
        // let tmp = JSON.parse(JSON.stringify(response.data)) || null
        // let res = []
        // tmp.forEach((e, i) => {
        //     res.push({
        //         label: e.name,
        //         value: e.id
        //     })
        // })
        // self.province = res

        let sortData = response.data.sort(function (a, b) {
          if (a.name.charAt(0).toLowerCase() < b.name.charAt(0).toLowerCase()) { return -1; }
          if (a.name.charAt(0).toLowerCase() > b.name.charAt(0).toLowerCase()) { return 1; }
          return 0;
        })

        self.province = sortData || null
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

    workZone: null
  })


export default AddressStore
// Type 2 : not persist store
