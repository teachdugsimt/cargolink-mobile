import { types, flow, cast } from "mobx-state-tree"
import * as Types from "../../services/api/api.types"
import TruckTypeStore from "../my-vehicle-store/truck-type-store"
import i18n from "i18n-js"
import { translate } from "../../i18n"
import { ProductTypeAPI } from "../../services/api"

const productTypeApi = new ProductTypeAPI()

const Menu = types.model({
    id: (types.number),
    type: (types.string),
    topic: (types.string),
    showSubColumn: (types.number),
    writable: types.optional(types.boolean, true),
    isChecked: (types.boolean),
    isMultiSelect: (types.boolean),
    subMenu: types.array(types.model({
        id: (types.number),
        value: types.union(types.array(types.number), types.number),
        name: (types.string),
        isChecked: (types.boolean),
    }))
})

const Filter = types.model({
    descending: types.maybeNull(types.boolean),
    from: types.maybeNull(types.string),
    page: types.maybeNull(types.number),
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

const MENUS: Array<Types.AdvanceSearchMenu> = [
    {
        id: 1,
        type: 'truckType',
        topic: translate('common.vehicleTypeField'),
        showSubColumn: 3,
        isChecked: false,
        isMultiSelect: true,
        subMenu: [
            {
                id: 11,
                name: 'รถ 4 ล้อ',
                value: 1,
                isChecked: false,
            },
            {
                id: 12,
                name: 'รถ 6 ล้อ',
                value: 2,
                isChecked: false,
            },
            {
                id: 13,
                name: 'รถ 10 ล้อ',
                value: 3,
                isChecked: false,
            },
        ]
    },
    {
        id: 2,
        type: 'weight',
        topic: 'น้ำหนัก',
        showSubColumn: 2,
        isChecked: false,
        isMultiSelect: false,
        subMenu: [
            {
                id: 41,
                name: '1-5 ตัน',
                value: 1,
                isChecked: false,
            },
            {
                id: 42,
                name: '5-10 ตัน',
                value: 5,
                isChecked: false,
            },
        ]
    },
]

const AdvanceSearchStore = types
    .model({
        filter: Filter,
        menu: types.array(Menu),
        productTypes: types.array(ProductType),
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
                yield TruckTypeStore.getTruckTypeDropdown(i18n.locale)
                if (TruckTypeStore.data && TruckTypeStore.data.length) {
                    MENUS[0].showSubColumn = 2
                    MENUS[0].subMenu = TruckTypeStore.data.map(val => {
                        return {
                            ...val,
                            value: val.id,
                            isChecked: false
                        }
                    })
                    self.menu = cast([...self.menu, ...MENUS])
                }
                self.loading = false
            }
        }),

        clearMenu: function clearMenu() {
            const newMenu = self.menu.length && self.menu.map(menu => {
                menu.isChecked = false
                return {
                    ...menu,
                    subMenu: menu.subMenu.map(subMenu => {
                        return { ...subMenu, isChecked: false }
                    })
                }
            })
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

    }))
    .views((self) => ({
        get getFilter() {
            return self.filter
        },
    }))
    .create({
        // IMPORTANT !!
        filter: {},
        menu: [],
        productTypes: [],
        loading: false,
        error: ''
    })

export default AdvanceSearchStore
// Type 2 : not persist store
