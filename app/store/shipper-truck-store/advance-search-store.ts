import { types, flow, cast } from "mobx-state-tree"
import * as Types from "../../services/api/api.types"
// import TruckTypeStore from "../my-vehicle-store/truck-type-store"
import TruckTypeStore from "../truck-type-store/truck-type-store"
import { translate } from "../../i18n"
// import { ProductTypeAPI } from "../../services/api"

// const productTypeApi = new ProductTypeAPI()

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
    truckType: types.maybeNull(types.array(types.number)),
    zoneIds: types.maybeNull(types.array(types.number)),
    // weight: types.maybeNull(types.number),
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
        subMenu: []
    },
    // {
    //     id: 2,
    //     type: 'weight',
    //     topic: 'น้ำหนัก',
    //     showSubColumn: 2,
    //     isChecked: false,
    //     isMultiSelect: false,
    //     subMenu: [
    //         {
    //             id: 41,
    //             name: '1-5 ตัน',
    //             value: 1,
    //             isChecked: false,
    //         },
    //         {
    //             id: 42,
    //             name: '5-10 ตัน',
    //             value: 5,
    //             isChecked: false,
    //         },
    //     ]
    // },
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
                yield TruckTypeStore.findGroup()
                yield TruckTypeStore.find()
                TruckTypeStore.mappingType()
                if (TruckTypeStore.listMapping && TruckTypeStore.listMapping.length) {
                    MENUS[0].showSubColumn = 2
                    MENUS[0].subMenu = TruckTypeStore.listMapping.map(type => {
                        const subMenu = type.subTypes.map(subType => ({ ...subType, showSubColumn: 2, value: subType.id, isChecked: false }))
                        return {
                            ...type,
                            value: type.id,
                            isChecked: false,
                            subMenu,
                        }
                    })
                    self.menu = cast([...self.menu, ...MENUS])
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
                truckType: null,
                zoneIds: null
            }
        },

    }))
    .views((self) => ({
        get getFilter() {
            return self.filter
        },
    }))
    .create({
        filter: {},
        menu: [],
        productTypes: [],
        loading: false,
        error: ''
    })

export default AdvanceSearchStore
