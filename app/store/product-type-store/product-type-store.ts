import { types, flow, cast } from "mobx-state-tree"
import { ProductTypeAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"

const productTypeApi = new ProductTypeAPI()

const ProductType = types.model({
  id: types.number,
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  groupId: types.maybeNull(types.number),
})

const ProductTypeStore = types
  .model({
    list: types.array(ProductType),
    loading: types.boolean,
    error: types.string
  })
  .actions((self) => ({

    find: flow(function* find(filter: object = {}) {
      yield productTypeApi.setup()
      self.loading = true
      try {
        const response = yield productTypeApi.findAll(filter)

        if (response.kind === 'ok') {
          self.list = response.data
        } else {
          self.error = response?.data?.message || response?.kind
        }

        self.loading = false
      } catch (error) {
        console.error("Failed to fetch get product types : ", error)
        self.loading = false
        self.error = "error fetch api get product types"
      }
    }),

    setList(list: Array<Types.ProductType> = []) {
      self.list = cast(list)
    }
  }))
  .views((self) => ({
    get getList() {
      return self.list
    },
  }))
  .create({
    list: [],
    loading: false,
    error: ''
  })

export default ProductTypeStore
// Type 2 : not persist store
