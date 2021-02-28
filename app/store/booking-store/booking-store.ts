import { types, flow, cast } from "mobx-state-tree"
import { boolean } from "mobx-state-tree/dist/internal"
import { type } from "ramda"
import { BookingApi } from "../../services/api"
import * as Types from "../../services/api/api.types"

const bookingAPI = new BookingApi()

const Quotation = types.model({
  id: types.maybeNull(types.string),
  fullName: types.maybeNull(types.string),
  bookingDatetime: types.maybeNull(types.string),
})

const JobModel = {
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
    userId: types.maybeNull(types.string),
    companyName: types.maybeNull(types.string),
    fullName: types.maybeNull(types.string),
    mobileNo: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    avatar: types.maybeNull(types.model({
      object: types.maybeNull(types.string),
      token: types.maybeNull(types.string),
    }))
  })),
}

const ShipperJob = types.maybeNull(types.model({
  ...JobModel,
  quotations: types.maybeNull(types.array(types.maybeNull(Quotation)))
}))

const CarrierMyjob = types.maybeNull(types.model({
  ...JobModel,
  type: types.maybeNull(types.string),
}))

const BookingStore = types
  .model({
    data_add_carrier_job_booking_one: types.maybeNull(types.number),
    loading_add_carrier_job_booking_one: types.boolean,
    error_add_carrier_job_booking_one: types.maybeNull(types.string),

    data_find_shipper_job_one: ShipperJob,
    loading_shipper_job_one: types.boolean,
    error_shipper_job_one: types.maybeNull(types.string),

    data_update_booking: types.maybeNull(types.number),
    loading_update_booking: types.boolean,
    error_update_booking: types.maybeNull(types.string),

    data_find_carrier_myjob: types.maybeNull(types.array(CarrierMyjob)),
    loading_find_carrier_myjob: types.boolean,
    error_find_carrier_myjob: types.maybeNull(types.string),

    data_find_carrier_myjob_one: types.maybeNull(CarrierMyjob),
    loading_find_carrier_myjob_one: types.boolean,
    error_find_carrier_myjob_one: types.maybeNull(types.string),

    data_approve_booking: types.maybeNull(types.number),
    loading_approve_booking: types.boolean,
    error_approve_booking: types.maybeNull(types.string)

  })
  .actions((self) => ({

    addCarrierJobBookingOne: flow(function* addCarrierJobBookingOne(body: Types.BookingBody) {
      yield bookingAPI.setup()
      self.loading_add_carrier_job_booking_one = true
      try {
        const response = yield bookingAPI.addCarrierJobBookingOne(body)
        console.log("Response call api addCarrierJobBookingOne : : ", response)
        if (response.kind === 'ok') {
          self.data_add_carrier_job_booking_one = response.data || null
        } else {
          self.error_add_carrier_job_booking_one = response?.data?.message || response.kind
        }
        self.loading_add_carrier_job_booking_one = false

      } catch (error) {
        console.error("error for save data addCarrierJobBookingOne : ", error)
        self.loading_add_carrier_job_booking_one = false
        self.error_add_carrier_job_booking_one = "error for save data addCarrierJobBookingOne"
      }
    }),

    findShipperJobOne: flow(function* findShipperJobOne(id: string) {
      yield bookingAPI.setup()
      self.loading_shipper_job_one = true
      try {
        const response = yield bookingAPI.findShipperJobOne(id)
        console.log("Response call api findShipperJobOne : : ", response)
        if (response.kind === 'ok') {
          self.data_find_shipper_job_one = response.data || null
        } else {
          self.error_shipper_job_one = response?.data?.message || response.kind
        }
        self.loading_shipper_job_one = false

      } catch (error) {
        console.error("error for save data findShipperJobOne : ", error)
        self.loading_shipper_job_one = false
        self.error_shipper_job_one = "error for save data findShipperJobOne"
      }
    }),

    updateBooking: flow(function* updateBooking(filter: Types.BookingBody) {
      yield bookingAPI.setup()
      self.loading_update_booking = true
      try {
        const response = yield bookingAPI.updateBooking(filter)
        console.log("Response call api updateBooking : : ", response)
        if (response.kind === 'ok') {
          self.data_update_booking = response.data || null
        } else {
          self.error_update_booking = response?.data?.message || response.kind
        }
        self.loading_update_booking = false

      } catch (error) {
        console.error("error for save data update booking : ", error)
        self.loading_update_booking = false
        self.error_update_booking = "error for save data update booking"
      }
    }),

    findCarrierMyJob: flow(function* findCarrierMyJob() {
      yield bookingAPI.setup()
      self.loading_find_carrier_myjob = true
      try {
        const response = yield bookingAPI.findCarrierMyJob()
        console.log("Response call api findCarrierMyJob : : ", response)
        if (response.kind === 'ok') {
          self.data_find_carrier_myjob = response.data || null
        } else {
          self.error_find_carrier_myjob = response?.data?.message || response.kind
        }
        self.loading_find_carrier_myjob = false

      } catch (error) {
        console.error("error for save data findCarrierMyJob : ", error)
        self.loading_find_carrier_myjob = false
        self.error_find_carrier_myjob = "error for save data findCarrierMyJob"
      }
    }),

    findCarrierMyJobOne: flow(function* findCarrierMyJobOne(id: string) {
      yield bookingAPI.setup()
      self.loading_find_carrier_myjob_one = true
      try {
        const response = yield bookingAPI.findCarrierMyJobOne(id)
        console.log("Response call api findCarrierMyJob : : ", response)
        if (response.kind === 'ok') {
          self.data_find_carrier_myjob_one = response.data || null
        } else {
          self.error_find_carrier_myjob_one = response?.data?.message || response.kind
        }
        self.loading_find_carrier_myjob_one = false

      } catch (error) {
        console.error("error for save data findCarrierMyJob : ", error)
        self.loading_find_carrier_myjob_one = false
        self.error_find_carrier_myjob_one = "error for save data findCarrierMyJob"
      }
    }),

    approveBooking: flow(function* approveBooking(who: string, status: string, id: string) {
      yield bookingAPI.setup()
      self.loading_approve_booking = true
      try {
        if (who == "shipper") {
          const response = status == "accept" ? yield bookingAPI.findShipperJobBookingAccept(id) : yield bookingAPI.findShipperJobBookingReject(id)
          console.log(`Response call api ${who} ${status}Booking :: `, response)
          if (response.kind === 'ok') {
            self.data_approve_booking = response.data || null
          } else {
            self.error_approve_booking = response?.data?.message || response.kind
          }
        } else if (who == "carrier") {
          const response = status == "accept" ? yield bookingAPI.findCarrierTruckBookingAccept(id) : yield bookingAPI.findCarrierTruckBookingReject(id)
          console.log(`Response call api ${who} ${status}Booking :: `, response)
          if (response.kind === 'ok') {
            self.data_approve_booking = response.data || null
          } else {
            self.error_approve_booking = response?.data?.message || response.kind
          }
        }

        self.loading_approve_booking = false

      } catch (error) {
        console.error("error for save data approveBooking : ", error)
        self.loading_approve_booking = false
        self.error_approve_booking = "error for save data approveBooking"
      }
    }),
  }))
  .views((self) => ({

  }))
  .create({
    data_add_carrier_job_booking_one: null,
    loading_add_carrier_job_booking_one: false,
    error_add_carrier_job_booking_one: "",

    data_find_shipper_job_one: null,
    loading_shipper_job_one: false,
    error_shipper_job_one: "",

    data_update_booking: null,
    loading_update_booking: false,
    error_update_booking: "",

    data_find_carrier_myjob: null,
    loading_find_carrier_myjob: false,
    error_find_carrier_myjob: "",

    data_find_carrier_myjob_one: null,
    loading_find_carrier_myjob_one: false,
    error_find_carrier_myjob_one: "",

    data_approve_booking: null,
    loading_approve_booking: false,
    error_approve_booking: "",

  })

export default BookingStore
