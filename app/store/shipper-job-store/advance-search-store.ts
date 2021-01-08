import { types, flow, cast } from "mobx-state-tree"
import * as Types from "../../services/api/api.types"

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

const AdvanceSearchStore = types
    .model({
        filter: Filter
    })
    .actions((self) => ({
        setFilter: function setFilter(filter: Types.ShipperJobRequest = {}) {
            self.filter = cast(filter)
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
    })

export default AdvanceSearchStore
// Type 2 : not persist store
