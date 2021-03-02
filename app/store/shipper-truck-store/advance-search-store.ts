import { types, flow, cast } from "mobx-state-tree"
import * as Types from "../../services/api/api.types"
import TruckTypeStore from "../truck-type-store/truck-type-store"
import { translate } from "../../i18n"
import * as storage from "../../utils/storage"

const SubMenu = {
  id: (types.number),
  value: types.union(types.array(types.number), types.number),
  name: (types.string),
  isChecked: (types.boolean),
}

const Menu = types.model({
  id: (types.number),
  type: (types.string),
  topic: (types.string),
  showSubColumn: (types.number),
  writable: types.optional(types.boolean, true),
  isChecked: (types.boolean),
  isMultiSelect: (types.boolean),
  subMenu: types.array(types.model({
    ...SubMenu,
    subMenu: types.maybeNull(types.array(types.model(SubMenu)))
  }))
})

const Filter = types.model({
  descending: types.maybeNull(types.boolean),
  page: types.optional(types.number, 0),
  rowsPerPage: types.optional(types.number, 10),
  sortBy: types.maybeNull(types.string),
  // truckAmountMax: types.maybeNull(types.number),
  // truckAmountMin: types.maybeNull(types.number),
  truckAmount: types.maybeNull(types.number),
  truckTypes: types.maybeNull(types.array(types.number)),
  workingZones: types.maybeNull(types.array(types.number)),
  // weight: types.maybeNull(types.number),
})

const ProductType = types.model({
  id: types.number,
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
})

const loadVersatileStore = async (key) => {
  const root = await storage.load('root')
  return root?.versatileStore[key]
}

const AdvanceSearchStore = types
  .model({
    filter: Filter,
    menu: types.array(Menu),
    productTypes: types.array(ProductType),
    loading: types.boolean,
    error: types.string
  })
  .actions((self) => ({
    setFilter: function setFilter(filter: Types.ShipperTruckRequest = {}) {
      self.filter = cast(filter)
    },

    mapMenu: flow(function* mapMenu(menus?: Array<Types.AdvanceSearchMenu> | null) {
      if (menus && menus.length) {
        self.menu = cast(menus)
      } else {
        self.loading = true
        yield TruckTypeStore.mappingType()
        if (TruckTypeStore.listMapping && TruckTypeStore.listMapping.length) {
          const menu = AdvanceSearchStore.getMenu
          const oldMenu = JSON.parse(JSON.stringify(self.menu))
          menu[0].showSubColumn = 2
          menu[0].isChecked = oldMenu.length ? !!oldMenu[0]?.isChecked : false
          menu[0].subMenu = TruckTypeStore.listMapping.map((type, index) => {
            if (self.menu.length) {
              const subMenu = type.subTypes.map((subType, indx) => ({
                ...subType,
                showSubColumn: 2,
                value: subType.id,
                isChecked: oldMenu[0]?.subMenu[index]?.subMenu[indx]?.isChecked || false
              }))
              return {
                ...type,
                value: type.id,
                isChecked: oldMenu[0]?.subMenu[index]?.isChecked || false,
                subMenu,
              }
            } else {
              const subMenu = type.subTypes.map(subType => ({ ...subType, showSubColumn: 2, value: subType.id, isChecked: false }))
              return {
                ...type,
                value: type.id,
                isChecked: false,
                subMenu,
              }
            }
          })
          self.menu = cast(menu)
          self.loading = false
        }
        self.loading = false
      }
    }),

    clearMenu: function clearMenu() {
      const newMenu = self.menu?.length ? self.menu.map(menu => {
        menu.isChecked = false
        return {
          ...menu,
          subMenu: menu.subMenu.map(subMenu => {
            let childOfSubMenu = null
            if (subMenu?.subMenu?.length) {
              childOfSubMenu = subMenu.subMenu.map(childOfSubMenu => ({ ...childOfSubMenu, isChecked: false }))
            }
            return { ...subMenu, isChecked: false, subMenu: childOfSubMenu }
          })
        }
      }) : []
      self.menu = cast(JSON.parse(JSON.stringify(newMenu)))
      self.filter = {
        ...self.filter,
        truckAmount: null,
        truckTypes: null,
        workingZones: null
      }
    },

  }))
  .views((self) => ({
    get getFilter() {
      return self.filter
    },
    get getMenu() {
      const menu: Array<Types.AdvanceSearchMenu> = [
        {
          id: 1,
          type: 'truckTypes',
          topic: translate('jobDetailScreen.truckType'),
          showSubColumn: 3,
          isChecked: false,
          isMultiSelect: true,
          subMenu: []
        },
      ]
      return menu
    }
  }))
  .create({
    filter: {},
    menu: [],
    productTypes: [],
    loading: false,
    error: ''
  })

export default AdvanceSearchStore
