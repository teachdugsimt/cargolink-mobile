import { types, flow, cast } from "mobx-state-tree"
import { ShipperJobAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"

const apiShipperJob = new ShipperJobAPI()

const ShipperJob = types.model({
    id: types.maybeNull(types.string),
    productTypeId: types.maybeNull(types.number),
    productName: types.maybeNull(types.string),
    truckType: types.maybeNull(types.string),
    weight: types.maybeNull(types.number),
    requiredTruckAmount: types.maybeNull(types.number),
    from: types.maybeNull(types.model({
        name: types.maybeNull(types.string),
        dateTime: types.maybeNull(types.string),
        contactName: types.maybeNull(types.string),
        contactMobileNo: types.maybeNull(types.string),
        lat: types.maybeNull(types.string),
        lng: types.maybeNull(types.string),
    })),
    to: types.maybeNull(types.array(types.model({
        name: types.maybeNull(types.string),
        dateTime: types.maybeNull(types.string),
        contactName: types.maybeNull(types.string),
        contactMobileNo: types.maybeNull(types.string),
        lat: types.maybeNull(types.string),
        lng: types.maybeNull(types.string),
    }))),
    owner: types.maybeNull(types.model({
        id: types.maybeNull(types.number),
        companyName: types.maybeNull(types.string),
        fullName: types.maybeNull(types.string),
        mobileNo: types.maybeNull(types.string),
        email: types.maybeNull(types.string)
    }))
})

const ShipperJobStore = types
    .model({
        list: types.maybeNull(types.array(types.maybeNull(ShipperJob))),
        data: types.maybeNull(ShipperJob),
        loading: types.boolean,
        error: types.maybeNull(types.string),
    })
    .actions((self) => ({
        find: flow(function* find(filter: Types.ShipperJobRequest = {}) {
            yield apiShipperJob.setup()
            self.loading = true
            try {
                const response = yield apiShipperJob.find(filter)
                console.log("Response call api get shipper jobs : : ", response)
                self.list = cast([...self.list, ...response.data] || [])
                self.loading = false
            } catch (error) {
                // ... including try/catch error handling
                console.error("Failed to fetch get shipper jobs : ", error)
                // self.data = []
                self.loading = false
                self.error = "error fetch api get shipper jobs"
            }
        }),

        findOne: flow(function* findOne(id: string) {
            yield apiShipperJob.setup()
            self.loading = true
            try {
                const response = yield apiShipperJob.findOne(id)
                console.log("Response call api get shipper job : : ", response)
                if (response.kind === 'ok') {
                    self.data = response.data || {}
                } else {
                    self.error = response.data.message
                }
                self.loading = false
            } catch (error) {
                // ... including try/catch error handling
                console.error("Failed to fetch get shipper job : ", error)
                // self.data = []
                self.loading = false
                self.error = "error fetch api get shipper job"
            }
        }),

        create: flow(function* create(data: Types.ShipperJobCreate) {
            yield apiShipperJob.setup()
            self.loading = true
            try {
                const response = yield apiShipperJob.create(data)
                console.log("Response call api get user : : ", response)
                if (response.kind === 'ok') {
                    self.data = response.data || {}
                } else {
                    self.error = response.data.message
                }
                self.loading = false
            } catch (error) {
                // ... including try/catch error handling
                console.error("Failed to fetch get shipper job : ", error)
                // self.data = []
                self.loading = false
                self.error = "error fetch api get shipper job"
            }
        }),

        update: flow(function* update(id: string, data: Types.ShipperJobCreate) {
            yield apiShipperJob.setup()
            self.loading = true
            try {
                const response = yield apiShipperJob.update(id, data)
                console.log("Response call api get user : : ", response)
                if (response.kind === 'ok') {
                    self.data = {
                        ...self.data,
                        from: data.from,
                        productName: data.productName,
                        productTypeId: data.productTypeId,
                        requiredTruckAmount: data.truckAmount,
                        truckType: data.truckType,
                        weight: data.weight,
                        // to: cast(data.to)
                    }
                } else {
                    self.error = response.data.message
                }
                self.loading = false
            } catch (error) {
                // ... including try/catch error handling
                console.error("Failed to fetch get shipper job : ", error)
                // self.data = []
                self.loading = false
                self.error = "error fetch api get shipper job"
            }
        }),

        setDefaultOfData: function setDefaultOfData() {
            self.data = cast({
                id: '',
                productTypeId: 0,
                productName: '',
                truckType: '',
                weight: 0,
                requiredTruckAmount: 0,
                from: {
                    name: '',
                    dateTime: '',
                    contactName: '',
                    contactMobileNo: '',
                    lat: '',
                    lng: ''
                },
                to: [
                    {
                        name: '',
                        dateTime: '',
                        contactName: '',
                        contactMobileNo: '',
                        lat: '',
                        lng: ''
                    }
                ],
                owner: {
                    id: 0,
                    companyName: null,
                    fullName: null,
                    mobileNo: '',
                    email: null
                }
            })
        },

        setDefaultOfList: function setDefaultOfList() {
            self.list = cast([])
        }
    }))
    .views((self) => ({
        get getList() {
            return self.list
        },
        get getData() {
            return self.data
        }
    }))
    .create({
        // IMPORTANT !!
        list: [],
        data: {},
        loading: false,
        error: "",
    })

export default ShipperJobStore
// Type 2 : not persist store
