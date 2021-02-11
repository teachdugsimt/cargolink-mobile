import { types, flow, cast } from "mobx-state-tree"
import { GoogleMapAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"

const googleAPI = new GoogleMapAPI()

const Address_Component = types.model({
  long_name: types.maybeNull(types.string),
  short_name: types.maybeNull(types.string),
  types: types.maybeNull(types.array(types.maybeNull(types.string)))
})

const Viewport = types.model({
  northeast: types.maybeNull(types.model({
    lat: types.maybeNull(types.number),
    lng: types.maybeNull(types.number)
  })),
  southwest: types.maybeNull(types.model({
    lat: types.maybeNull(types.number),
    lng: types.maybeNull(types.number)
  }))
})

const Geometry = types.model({
  location: types.maybeNull(types.model({
    lat: types.maybeNull(types.number),
    lng: types.maybeNull(types.number),
  })),
  location_type: types.maybeNull(types.string),
  viewport: types.maybeNull(Viewport)
})
const Address = types.model({
  address_components: types.maybeNull(types.array(Address_Component)),
  formatted_address: types.maybeNull(types.string),
  geometry: types.maybeNull(Geometry),
  place_id: types.maybeNull(types.string),
  types: types.maybeNull(types.array(types.string))
})

const Location = types.model({
  results: types.maybeNull(types.array(Address)),
  status: types.maybeNull(types.string)
})

const GoogleStore = types.model({
  list: types.maybeNull(Location),
  loading: types.boolean,
  error: types.maybeNull(types.string),
})
  .actions((self) => ({
    
    getLocationMap: flow(function* getLocationMap(params: Types.GoogleLocationRequest = {}) {
      yield googleAPI.setup()
      self.loading = true
      try {
        const response = yield googleAPI.getLocationMap(params.latitude, params.longitude)
        if (response.kind === 'ok') {
          __DEV__ && console.tron.log("Response call api get google location : : ", response.data)
          self.list = response.data || {}
        }
        else {
          self.list = {}
          self.error = response.kind
        }
        self.loading = false
      } catch (error) {
        console.error("Failed to save data get google location : ", error)
        self.loading = false
        self.error = "error save data api get google location"
      }
    }),



  }))
  .views((self) => ({
    get getList() {
      return self.list
    },
  }))
  .create({
    list: {},
    loading: false,
    error: '',
  })

export default GoogleStore
