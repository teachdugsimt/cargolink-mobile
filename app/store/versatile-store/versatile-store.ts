import { types, flow, cast } from "mobx-state-tree"
import { TruckTypeApi, ProductTypeAPI } from "../../services/api"
import i18n from "i18n-js"
import { boolean } from "mobx-state-tree/dist/internal"

const truckTypeApi = new TruckTypeApi()
const productTypeApi = new ProductTypeAPI()

const InitialType = {
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
}

const TruckTypeGroup = types.model(InitialType)

const TruckTypeMapping = types.model({
  ...InitialType,
  subTypes: types.optional(types.array(types.model(InitialType)), [])
})

export const VersatileStore = types.model({
  language: types.string,
  fblink: 'https://www.facebook.com/cargolinkthailand/',
  lineOfficial: '',
  phoneNumber: '021065312',
  partnerPhoneNumber: '021065312',

  data: types.optional(types.model(InitialType), {}),
  list: types.optional(types.array(TruckTypeGroup), []),
  listGroup: types.optional(types.array(TruckTypeGroup), []),

  list_loading: types.boolean,
  list_group_loading: types.boolean,
  product_type_loading: types.boolean,


  listProductType: types.optional(types.array(TruckTypeGroup), []),
  loading: types.boolean,
  mappingLoding: types.boolean,
  listMapping: types.optional(types.array(TruckTypeMapping), []),
  error: types.maybeNull(types.string),
}).actions(self => ({
  setLanguage(lang) {
    self.language = lang
  },
  find: flow(function* find(filter: any = {}) {
    yield truckTypeApi.setup()
    self.list_loading = true
    try {
      const response = yield truckTypeApi.getTruckTypeDropdown(filter)
      console.log("Response call api get truck type : : ", response)
      self.list = response.data
      self.list_loading = false
    } catch (error) {
      console.error("Failed to fetch get truck type : ", error)
      self.list_loading = false
      self.error = "error fetch api get truck type"
    }
  }),

  findGroup: flow(function* findGroup(filter: any = {}) {
    yield truckTypeApi.setup()
    self.list_group_loading = true
    try {
      const response = yield truckTypeApi.getGroup(filter)
      console.log("Response call api get truck type group : : ", response)
      if (response.kind === 'ok') {
        self.listGroup = response.data
      } else {
        self.listGroup = cast([])
      }
      self.list_group_loading = false
    } catch (error) {
      console.error("Failed to fetch get truck type group : ", error)
      self.list_group_loading = false
      self.error = "error fetch api get truck type group"
    }

  }),

  mappingType() {
    // yield truckTypeApi.setup(i18n.locale)
    self.mappingLoding = true
    try {
      const mapping = JSON.parse(JSON.stringify(self.listGroup)).map(type => {
        const subTypes = JSON.parse(JSON.stringify(self.list)).filter(subType => subType.groupId === type.id)
        return {
          ...type,
          subTypes
        }
      })

      self.listMapping = mapping
      self.mappingLoding = false
    } catch (error) {
      console.error("Failed to fetch get truck type group : ", error)
      self.mappingLoding = false
      self.error = "error fetch api get truck type group"
    }
  },

  getTruckTypeById(id: number) {
    const truckType = self.list.filter(type => type.id === id)
    self.data = JSON.parse(JSON.stringify(truckType))[0]
  },

  findProductType: flow(function* findProductType(filter: any = {}) {
    yield productTypeApi.setup(i18n.locale)
    self.product_type_loading = true
    try {
      const response = yield productTypeApi.findAll(filter)
      console.log("Response call api get product type : : ", response)
      if (response.kind === 'ok') {
        self.listProductType = response.data
      } else {
        self.listProductType = cast([])
      }
      self.product_type_loading = false
    } catch (error) {
      console.error("Failed to fetch get product type : ", error)
      self.product_type_loading = false
      self.error = "error fetch api get product type"
    }
  }),

})).views(self => ({
  get getLanguage() {
    return self.language
  },
}))
