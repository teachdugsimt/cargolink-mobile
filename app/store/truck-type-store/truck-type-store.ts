import { types, flow, cast } from "mobx-state-tree"
import { TruckTypeApi } from "../../services/api"
import i18n from "i18n-js"

const truckTypeApi = new TruckTypeApi()

const TruckType = {
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
    groupId: types.maybeNull(types.number),
}

const TruckTypeGroup = types.model(TruckType)

const TruckTypeMapping = types.model({
    ...TruckType,
    subTypes: types.optional(types.array(types.model(TruckType)), [])
})

const TruckTypeStore = types
    .model({
        // list: types.array(types.maybeNull(TruckTypeGroup)),
        list: types.optional(types.array(TruckTypeGroup), []),
        listGroup: types.optional(types.array(TruckTypeGroup), []),
        listMapping: types.optional(types.array(TruckTypeMapping), []),
        loading: types.boolean,
        mappingLoding: types.boolean,
        error: types.maybeNull(types.string),
    })
    .actions((self) => ({
        find: flow(function* find(filter: any = {}) {
            yield truckTypeApi.setup(i18n.locale)
            self.loading = true
            try {
                const response = yield truckTypeApi.getGroup(filter)
                console.log("Response call api get truck type group : : ", response)
                if (response.kind === 'ok') {
                    self.list = response.data
                } else {
                    self.list = cast([])
                }
                self.loading = false
            } catch (error) {
                console.error("Failed to fetch get truck type group : ", error)
                self.loading = false
                self.error = "error fetch api get truck type group"
            }
        }),

        findGroup: flow(function* findGroup(filter: any = {}) {
            yield truckTypeApi.setup(i18n.locale)
            self.loading = true
            try {
                const response = yield truckTypeApi.getTruckTypeDropdown(filter)
                console.log("Response call api get truck type group : : ", response)
                self.listGroup = response.data
                self.loading = false
            } catch (error) {
                console.error("Failed to fetch get truck type group : ", error)
                self.loading = false
                self.error = "error fetch api get truck type group"
            }
        }),

        mappingType: flow(function* mappingType() {
            // yield truckTypeApi.setup(i18n.locale)
            self.mappingLoding = true
            try {
                // yield TruckTypeStore.find()
                // yield TruckTypeStore.findGroup()
                const mapping = JSON.parse(JSON.stringify(self.list)).map(type => {
                    const subTypes = JSON.parse(JSON.stringify(self.listGroup)).filter(subType => subType.groupId === type.id)
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
        }),

    }))
    .views((self) => ({
        get getList() {
            return self.list
        },
    }))
    .create({
        list: [],
        listGroup: [],
        listMapping: [],
        loading: false,
        mappingLoding: false,
        error: "",
    })

export default TruckTypeStore