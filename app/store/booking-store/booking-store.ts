import { types, flow, cast } from "mobx-state-tree"
import { boolean } from "mobx-state-tree/dist/internal"
import { type } from "ramda"
import { BookingApi, ShipperJobAPI } from "../../services/api"
import * as Types from "../../services/api/api.types"
import * as storage from "../../utils/storage"
import _ from 'lodash'

const bookingAPI = new BookingApi()
const apiShipperJob = new ShipperJobAPI()
const tabStatus = {
  first: 0,
  second: 3,
  third: 2
}

const mapActionsStatus = (data) => {
  let tmp = data
  tmp.map(e => {
    let slot = e
    if (e.status == 1 && e.type == "REQUEST_FROM_SHIPPER") { // (ฉันเป็นเจ้าของรถและมีงานมาขอจอง)
      slot.actionStatus = "IM_OWN_CAR_AND_HAVE_JOB_ASK_FOR_BOOKING"
    }
    else if (e.status == 3 && !e.type && Number(e?.quotationNumber) >= 1) {  // (ฉันเป็นเจ้าของงานและมีคนมาขอจอง)
      slot.actionStatus = "IM_OWN_JOB_AND_HAVE_CAR_ASK_FOR_BOOKING"
    }
    else if (e.status == 3 && e.type == "WAITING_FOR_APPROVAL") { //  (ฉันเป็นเจ้าของรถและไปขอจองงานคนอื่น)
      slot.actionStatus = "IM_OWN_CAR_AND_ASK_FOR_BOOKING_HIM_JOB"
    }
    else if (e.status == 1 && !e.type && !e.quotationNumber) { // (ฉันเป็นเจ้าของงาน ไม่มีใครมาขอจอง)
      slot.actionStatus = "IM_OWN_JOB"
    }
    else if (e.status == 1 && !e.type && Number(e?.quotationNumber) >= 1) { // (ฉันเป็นเจ้าของงานและไปขอจองรถ)
      slot.actionStatus = "IM_OWN_JOB_AND_ASK_FOR_BOOKING_HIM_CAR"
    }
    return slot
  })
  // console.log("Tmp after mapping :: ", tmp)
  return tmp
}

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
  quotations: types.maybeNull(types.array(types.maybeNull(Quotation))),
  status: types.maybeNull(types.number),
  quotationNumber: types.maybeNull(types.number),
  isLiked: types.maybeNull(types.optional(types.boolean, false)),
  actionStatus: types.maybeNull(types.string)
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
    error_approve_booking: types.maybeNull(types.string),

    list: types.maybeNull(types.array(types.maybeNull(ShipperJob))),
    loading: types.boolean,
    error: types.maybeNull(types.string),

    finish_job: types.maybeNull(types.number),
    loading_finish_job: types.maybeNull(types.boolean),
    error_finish_job: types.maybeNull(types.string),

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
    clearDataApproveBooking() {
      self.data_approve_booking = null
    },

    finishJob: flow(function* finishJob(id: string) {
      yield bookingAPI.setup()
      self.loading_finish_job = true
      try {
        const response = yield bookingAPI.finishJob(id)
        console.log("Response call api findCarrierMyJob : : ", response)
        if (response.kind === 'ok') {
          self.finish_job = response.data || null
        } else {
          self.error_finish_job = response?.data?.message || response.kind
        }
        self.loading_finish_job = false

      } catch (error) {
        console.error("error for save data findCarrierMyJob : ", error)
        self.loading_finish_job = false
        self.error_finish_job = "error for save data findCarrierMyJob"
      }
    }),


    findSummaryJob: flow(function* findSummaryJob(filter: Types.ShipperJobRequest = {}) {

      yield apiShipperJob.setup()
      yield bookingAPI.setup()
      self.loading = true
      try {
        const response = yield apiShipperJob.find(filter)
        let otherList: any = []
        if (filter.type == tabStatus.first) otherList = yield bookingAPI.findCarrierMyJob()
        else if (filter.type == tabStatus.second) otherList = yield bookingAPI.findCarrierJob({ type: 1, page: filter.page })
        console.log("++ Response normal list : : ", response)
        console.log("++ Response my carrier list :: ", otherList)
        if (response.kind === 'ok') {


          let carrierList = []
          if (filter.type == tabStatus.second) {
            carrierList = otherList.data && otherList.data.content && Array.isArray(otherList.data.content) ?
              JSON.parse(JSON.stringify(otherList.data.content)) : []
          } else if (filter.type == tabStatus.first) {
            carrierList = otherList.data && otherList.data && Array.isArray(otherList.data) ?
              JSON.parse(JSON.stringify(otherList.data)) : []
          }

          let arrMerge = []
          if (!filter.page) {
            arrMerge = _.unionBy(response.data, carrierList, 'id')
          } else {
            let parseSelfList = JSON.parse(JSON.stringify(self.list))
            let parseShipperList = JSON.parse(JSON.stringify(response.data))
            arrMerge = _.unionBy(parseSelfList, _.unionBy(parseShipperList, carrierList, 'id'), 'id')
            // arrMerge = _.unionBy(arrMerge, carrierList, 'id')
          }
          console.log("Summary List :: ", arrMerge)
          self.list = mapActionsStatus(JSON.parse(JSON.stringify(arrMerge)))
          self.loading = false
        } else {
          self.loading = false
        }
      } catch (error) {
        console.error("Failed to fetch findSummaryJob : ", error)
        self.loading = false
        self.error = "error fetch api findSummaryJob"
      }
    }),
    clearList() {
      self.list = cast([])
    }
  }))
  .views((self) => ({

  }))
  .create({
    list: null,
    loading: false,
    error: '',

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

    finish_job: null,
    loading_finish_job: false,
    error_finish_job: "",

  })

export default BookingStore
