import { types, flow, cast } from "mobx-state-tree"
import TruckTypeStore from "./truck-type-store"

const TruckType = types.model({
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
    groupId: types.maybeNull(types.number),
})

const SearchTruckTypeStore = types
    .model({
        data: types.maybeNull(TruckType),
        loading: types.boolean,
        mappingLoding: types.boolean,
        error: types.maybeNull(types.string),
    })
    .actions((self) => ({

        getTruckTypeById: flow(function* getTruckType(id: number) {
            if (!TruckTypeStore.list?.length) {
                yield TruckTypeStore.find()
            }
            const truckType = TruckTypeStore.list.filter(type => type.id === id)[0]
            console.log('JSON.parse(JSON.stringify(truckType))', JSON.parse(JSON.stringify(truckType)))
            self.data = truckType || {
                id: null,
                name: null,
                image: null,
                groupId: null,
            }
        }),

    }))
    .views((self) => ({
        get getData() {
            return self.data
        },
    }))
    .create({
        data: {},
        loading: false,
        mappingLoding: false,
        error: "",
    })

export default SearchTruckTypeStore