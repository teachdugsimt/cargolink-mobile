import { types, flow, cast } from "mobx-state-tree"
import * as Types from "../../services/api/api.types"
import TruckTypeStore from "../truck-type-store/truck-type-store"
import { translate } from "../../i18n"
import i18n from 'i18n-js'
import * as storage from "../../utils/storage"
import { provinceListEn, provinceListTh, regionListEn, regionListTh } from '../../screens/home-screen/manage-vehicle/datasource'

const SubMenu = {
  id: (types.number),
  value: types.union(types.array(types.number), types.number),
  name: (types.string),
  parentValue: types.maybeNull(types.number),
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
  minWeight: types.maybeNull(types.number),
  maxWeight: types.maybeNull(types.number),
})

const ProductType = types.model({
  id: types.number,
  name: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
})

const FilterTypeId = types.model({
  workZonesFrom: types.maybeNull(types.array(types.string)),
  workZonesTo: types.maybeNull(types.array(types.string)),
  truckTypes: types.maybeNull(types.array(types.string)),
  productTypes: types.maybeNull(types.array(types.string)),
  truckAmount: types.maybeNull(types.array(types.string)),
  weight: types.maybeNull(types.array(types.string)),
})

const FilterSelected = types.model({
  workZonesFrom: types.maybeNull(types.array(types.model(SubMenu))),
  workZonesTo: types.maybeNull(types.array(types.model(SubMenu))),
  truckTypes: types.maybeNull(types.array(types.model(SubMenu))),
  productTypes: types.maybeNull(types.array(types.model(SubMenu))),
  truckAmount: types.maybeNull(types.array(types.model(SubMenu))),
  weight: types.maybeNull(types.array(types.model(SubMenu))),
})

const loadVersatileStore = async (key) => {
  const root = await storage.load('root')
  return root?.versatileStore[key]
}

const mappingDefaultZone = (regions, provinces) => {
  return regions.map((reg: any, index: number) => {
    const resultProvinces = provinces
      .filter(prov => prov.region === reg.value)
      .map((prov, i) => ({
        id: prov.value,
        value: prov.value,
        parentValue: prov.region,
        name: prov.label,
        isChecked: false,
      }))
      .sort((a, b) => {
        if (a.name.charAt(0).toLowerCase() < b.name.charAt(0).toLowerCase()) { return -1; }
        if (a.name.charAt(0).toLowerCase() > b.name.charAt(0).toLowerCase()) { return 1; }
        return 0;
      })
    return {
      id: index + 1,
      value: index + 1,
      name: reg.label,
      isChecked: false,
      subMenu: resultProvinces
    }
  })
}

const sortArray = (list: any) => list.sort((a: any, b: any) => (a.value > b.value) ? 1 : -1)

const AdvanceSearchStore = types
  .model({
    filter: Filter,
    menu: types.array(Menu),
    productTypes: types.array(ProductType),
    selected: types.maybeNull(types.string),
    filterTypeId: types.maybeNull(FilterTypeId),
    filterCount: types.maybeNull(types.number),
    filterSelected: types.maybeNull(FilterSelected),
    parentTruckTypeSelected: types.maybeNull(types.string),
    locale: types.string,
    loading: types.boolean,
    error: types.string
  })
  .actions((self) => ({
    setFilter: function setFilter(filter: Types.ShipperJobRequest = {}) {
      self.filter = cast(filter)
    },

    mapMenu: flow(function* mapMenu(language: string = 'th') {
      // if (menus && menus.length) {
      //   self.menu = cast(menus)
      // } else {
      self.loading = true
      const oldMenu = JSON.parse(JSON.stringify(self.menu))
      yield TruckTypeStore.mappingType()
      yield AdvanceSearchStore.getProductTypes(oldMenu)
      if (TruckTypeStore.listMapping && TruckTypeStore.listMapping.length) {
        const menu = JSON.parse(JSON.stringify(self.menu))

        let newZone = null
        if (language === 'th') {
          const ascZones = sortArray(regionListTh)
          newZone = mappingDefaultZone(ascZones, provinceListTh)
        } else {
          const ascZones = sortArray(regionListEn)
          newZone = mappingDefaultZone(ascZones, provinceListEn)
        }
        menu[0].subMenu = newZone
        menu[1].subMenu = newZone

        // menu[0].showSubColumn = 2
        const data = TruckTypeStore.listMapping.map((type, index) => {
          const subMenu = type.subTypes.map((subType, indx) => ({
            ...subType,
            value: subType.id,
            isChecked: false
          }))
          return {
            ...type,
            value: type.id,
            isChecked: false,
            subMenu,
          }
        })

        menu[2].subMenu = data
        self.menu = cast(menu)
      }
      self.loading = false
      // }
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
          menu[4].showSubColumn = 2
          menu[4].isChecked = false
          const data = productTypes.map((val, index) => {
            return {
              ...val,
              value: val.id,
              isChecked: false
            }
          })
          menu[4].subMenu = data
          self.menu = cast(menu)
        }

        self.loading = false
      } catch (error) {
        console.error("Failed to fetch get product types : ", error)
        self.loading = false
        self.error = "error fetch api get product types"
      }
    }),

    setSelected: function (data: any) {
      const oldSelected = JSON.parse(self.selected)
      const newSelected = { ...oldSelected, ...data }
      self.selected = JSON.stringify(newSelected)
    },

    setFilterTypeId: function (data: any) {
      self.filterTypeId = data
    },

    setFilterCount: function (count: number) {
      self.filterCount = count
    },

    setParentTruckTypeSelected: function (truckTypeId: number, selected: boolean) {
      const truckSelected = JSON.parse(self.parentTruckTypeSelected)
      self.parentTruckTypeSelected = JSON.stringify({
        ...truckSelected,
        [truckTypeId]: selected
      })
    },

    replaceParentTruckTypeSelected: function (truckTypeString: string) {
      self.parentTruckTypeSelected = truckTypeString
    },

    setFilterSelected: function (data: any) {
      const newFilterSelected = self.filterSelected ? JSON.parse(JSON.stringify(self.filterSelected)) : {}
      self.filterSelected = { ...newFilterSelected, ...data }
    },

    clearFilterSelected: function () {
      self.filterSelected = null
    },

    clearSelected: function () {
      self.selected = null
    },

    clearFilterCount: function () {
      self.filterCount = 0
    },

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
          type: 'workZonesFrom',
          topic: translate('advanceSearchScreen.provinceUpProduct'),
          showSubColumn: 3,
          isChecked: false,
          isMultiSelect: true,
          subMenu: []
        },
        {
          id: 2,
          type: 'workZonesTo',
          topic: translate('advanceSearchScreen.provinceDownProduct'),
          showSubColumn: 3,
          isChecked: false,
          isMultiSelect: true,
          subMenu: []
        },
        {
          id: 3,
          type: 'truckTypes',
          topic: translate('jobDetailScreen.truckType'),
          showSubColumn: 3,
          isChecked: false,
          isMultiSelect: true,
          subMenu: []
        },
        {
          id: 4,
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
              value: [4, 9999999],
              isChecked: false,
            },
          ]
        },
        {
          id: 5,
          type: 'productTypes',
          topic: translate('jobDetailScreen.productType'),
          showSubColumn: 2,
          isChecked: false,
          isMultiSelect: true,
          subMenu: []
        },
        {
          id: 6,
          type: 'weight',
          topic: translate('advanceSearchScreen.weight'),
          showSubColumn: 2,
          isChecked: false,
          isMultiSelect: false,
          subMenu: [
            {
              id: 15,
              name: `1-5 ${translate('advanceSearchScreen.ton')}`.trim(),
              value: [1, 5],
              isChecked: false,
            },
            {
              id: 510,
              name: `5-10 ${translate('advanceSearchScreen.ton')}`.trim(),
              value: [5, 10],
              isChecked: false,
            },
            {
              id: 1000,
              name: `${translate('searchJobScreen.moreThan')} 10 ${translate('advanceSearchScreen.ton')}`.trim(),
              value: [11, 9999999],
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
    filterTypeId: null,
    filterCount: 0,
    filterSelected: null,
    parentTruckTypeSelected: null,
    selected: null,
    loading: false,
    error: ''
  })

export default AdvanceSearchStore
// Type 2 : not persist store
