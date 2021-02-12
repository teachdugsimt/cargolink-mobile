import { types, flow, cast } from "mobx-state-tree"
import * as Types from "../../services/api/api.types"
import TruckTypeStore from "../truck-type-store/truck-type-store"
import { translate } from "../../i18n"
import i18n from 'i18n-js'
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
  from: types.maybeNull(types.string),
  page: types.optional(types.number, 0),
  productType: types.maybeNull(types.array(types.number)),
  rowsPerPage: types.maybe(types.number),
  sortBy: types.maybeNull(types.string),
  to: types.maybeNull(types.string),
  truckAmountMax: types.maybeNull(types.number),
  truckAmountMin: types.maybeNull(types.number),
  truckType: types.maybeNull(types.array(types.number)),
  weight: types.maybeNull(types.number),
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
    locale: types.string,
    loading: types.boolean,
    error: types.string
  })
  .actions((self) => ({
    setFilter: function setFilter(filter: Types.ShipperJobRequest = {}) {
      self.filter = cast(filter)
    },

    mapMenu: flow(function* mapMenu(menus?: Array<Types.AdvanceSearchMenu> | null) {
      if (menus && menus.length) {
        self.menu = cast(menus)
      } else {
        self.loading = true
        const oldMenu = JSON.parse(JSON.stringify(self.menu))
        yield TruckTypeStore.mappingType()
        yield AdvanceSearchStore.getProductTypes(oldMenu)
        if (TruckTypeStore.listMapping && TruckTypeStore.listMapping.length) {
          self.menu[0].showSubColumn = 2
          const data = TruckTypeStore.listMapping.map((type, index) => {
            const subMenu = type.subTypes.map((subType, indx) => ({
              ...subType,
              value: subType.id,
              isChecked: oldMenu[0]?.subMenu[index]?.subMenu[indx]?.isChecked || false
            }))
            return {
              ...type,
              value: type.id,
              isChecked: oldMenu[0]?.subMenu[index]?.isChecked || false,
              subMenu,
            }
          })

          if (oldMenu.length) {
            self.menu[0].isChecked = oldMenu.length ? !!oldMenu[0]?.isChecked : false

            if (oldMenu[1].isChecked) {
              self.menu[1].isChecked = true
              const indexActive = oldMenu[1].subMenu.findIndex(({ isChecked }) => isChecked)
              self.menu[1].subMenu[indexActive].isChecked = true
            }

            if (oldMenu[3].isChecked) {
              self.menu[3].isChecked = true
              const indexActive = oldMenu[3].subMenu.findIndex(({ isChecked }) => isChecked)
              self.menu[3].subMenu[indexActive].isChecked = true
            }
          }

          self.menu[0].subMenu = cast(data)
          self.menu = cast(self.menu)
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
        productType: null,
        truckAmountMax: null,
        truckAmountMin: null,
        truckType: null,
        weight: null,
      }
    },

    getProductTypes: flow(function* getProductTypes(oldMenu: any) {
      self.loading = true
      try {
        const productTypes = yield loadVersatileStore('listProductType')

        if (productTypes && productTypes.length) {
          const menu = AdvanceSearchStore.getMenu
          menu[2].showSubColumn = 2
          menu[2].isChecked = oldMenu.length ? !!oldMenu[2].isChecked : false
          const data = productTypes.map((val, index) => {
            return {
              ...val,
              value: val.id,
              isChecked: oldMenu.length ? !!oldMenu[2]?.subMenu[index].isChecked : false
            }
          })
          menu[2].subMenu = data
          self.menu = cast(menu)
        }

        self.loading = false
      } catch (error) {
        console.error("Failed to fetch get product types : ", error)
        self.loading = false
        self.error = "error fetch api get product types"
      }
    }),

    setLocale: function setLocale(locale) {
      self.locale = locale
    }
  }))
  .views((self) => ({
    get getFilter() {
      return self.filter
    },
    get getMenu() {
      let menu: Array<Types.AdvanceSearchMenu> = [
        {
          id: 1,
          type: 'truckType',
          topic: translate('jobDetailScreen.truckType'),
          showSubColumn: 3,
          isChecked: false,
          isMultiSelect: true,
          subMenu: []
        },
        {
          id: 2,
          type: 'truckAmount',
          topic: translate('common.amount'),
          showSubColumn: 3,
          isChecked: false,
          isMultiSelect: false,
          subMenu: [
            {
              id: 21,
              name: `1-2 ${translate('jobDetailScreen.unit')}`.trim(),
              value: [1, 2],
              isChecked: false,
            },
            {
              id: 22,
              name: `3-4 ${translate('jobDetailScreen.unit')}`.trim(),
              value: [3, 4],
              isChecked: false,
            },
            {
              id: 23,
              name: `${translate('searchJobScreen.moreThan')} 4 ${translate('jobDetailScreen.unit')}`.trim(),
              value: [4],
              isChecked: false,
            },
          ]
        },
        {
          id: 3,
          type: 'productType',
          topic: translate('jobDetailScreen.productType'),
          showSubColumn: 2,
          isChecked: false,
          isMultiSelect: true,
          subMenu: []
        },
        {
          id: 4,
          type: 'weight',
          topic: translate('jobDetailScreen.weightTon'),
          showSubColumn: 2,
          isChecked: false,
          isMultiSelect: false,
          subMenu: [
            {
              id: 41,
              name: `1-5 ${translate('searchJobScreen.ton')}`.trim(),
              value: 1,
              isChecked: false,
            },
            {
              id: 42,
              name: `5-10 ${translate('searchJobScreen.ton')}`.trim(),
              value: 5,
              isChecked: false,
            },
          ]
        },
      ]
      return menu
    }
  }))
  .create({
    // IMPORTANT !!
    filter: {},
    menu: [],
    productTypes: [],
    locale: i18n.locale,
    loading: false,
    error: ''
  })

export default AdvanceSearchStore
// Type 2 : not persist store
