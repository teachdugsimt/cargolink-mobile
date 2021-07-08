import { GeneralApiProblem } from "./api-problem"

export interface User {
  id: number
  name: string
}

export interface AuthReponse {
  status: boolean
  tokenCheckPhone: string
  token: string
}

export interface AuthRequest {
  phoneNumber: string
  countryCode: string
  userType?: number
}

export interface OTPVerifyRequest {
  // token: string
  // otp: string
  phoneNumber: string
  countryCode: string
  variant: string
}

export interface OTPVerifyResponse {
  userProfile: {
    id: string // [PENDING] number
    companyName: string
  }
  termOfService: {
    latestVersion: string
    latestVersionAgree: boolean
  }
  token: {
    idToken: string
    accessToken: string
    refreshToken: string
  }
}

export interface VehicleFilterRequest {
  page?: number | {}
  // where?: {
  //   from?: string
  //   to?: string
  //   start_time?: string
  //   end_time?: string
  //   car_type?: string
  // } | {}
}

export interface TermAndService {
  accept: boolean
  version: string
}
export interface AppleSignin {
  email: string
  password: string
}


export interface VehicleRequest {
  registrationNumber?: string[] | string
  car_type?: string
  createdAt?: string
  updatedAt?: string
  approveStatus?: string
  image_car_type?: string
  owner?: object
  stallHeight?: number
  tipper?: boolean
  loadingWeight?: number
  truckType?: number
  images?: {
    uri?: string,
    type?: string,
    name?: string,
    size?: number,
    tmp_name?: string
  }[]
  workingZones?: {
    region?: string,
    province?: string,
  }[]
}

// export interface CreateDataRequest {
//   car_type: string
//   tipper: boolean
//   stallHeight: string
//   registrationNumber: Array<string>
//   images: Array<Object>
//   workingZones: Array<Object>
// }

export interface PatchDataRequest {
  car_type: string
  tipper: boolean
  stallHeight: string
  registrationNumber: Array<string>
  images: Array<Object>
  workingZones: Array<Object>
}

export interface PolicyReponse {
  version: string
  accepted: boolean
  acceptedAt: string
  data: string
}

export interface ShipperJobRequest {
  descending?: boolean
  from?: string
  page?: number
  productType?: number[]
  rowsPerPage?: number
  sortBy?: string
  to?: string
  truckAmountMax?: number
  truckAmountMin?: number
  truckType?: number[]
  weight?: number,
  type?: number,
}

export interface ShipperTruckRequest {
  approveStatus?: number,
  descending?: boolean,
  loadingWeight?: number,
  owner?: string,
  page?: number,
  registrationNumber?: string,
  rowsPerPage?: number,
  sortBy?: string,
  stallHeight?: string,
  truckAmount?: number,
  truckTypes?: number[],
  workingZones?: number[]
}

export interface GoogleLocationRequest {
  latitude?: string
  longitude?: string
  language?: string
}

export interface ShipperJobCreate {
  expiredTime: string
  from: {
    contactMobileNo: string
    contactName: string
    dateTime: string
    lat: string
    lng: string
    name: string
  }
  note: string
  productName: string
  productTypeId: number
  to: {
    contactMobileNo: string
    contactName: string
    dateTime: string
    lat: string
    lng: string
    name: string
  }[]
  truckAmount: number
  truckType: string
  weight: number
}

export interface AdvanceSearchMenu {
  id?: number
  type?: string
  topic?: string
  showSubColumn?: number
  isChecked?: boolean
  isMultiSelect?: boolean
  subMenu?: {
    id?: number
    value?: number | Array<number>
    name?: string
    isChecked?: boolean
  }[]
}

export interface MapDirectionsRequest {
  contactMobileNo?: string
  contactName?: string
  dateTime?: string
  lat: string
  lng: string
  name?: string
}

export interface ShipperTruckFilter {
  truckAmount?: number,
  truckType?: number,
  zoneIds?: number[]
}

export interface TruckType {
  id: number
  name?: string
  image?: string
  groupId?: number
}

export interface CarriersJobRequest {
  descending?: boolean
  from?: string
  page?: number
  productType?: number[]
  rowsPerPage?: number
  sortBy?: string
  to?: string
  truckAmountMax?: number
  truckAmountMin?: number
  truckType?: number[]
  weight?: number
}

export interface ProductType {
  id: number
  name?: string
  image?: string
  groupId?: number
}

export interface CarriersHistoryCallAdd {
  jobId: string
}

export interface ShippersHistoryCallAdd {
  truckId: string
}

export interface UserJobFilter {
  from?: string
  productType?: number[]
  to?: string
  truckAmountMax?: number
  truckAmountMin?: number
  truckType?: number[]
  type?: number
  userId?: string
  weight?: number
  page?: number
  rowsPerPage?: number
}

export interface UserTruckFilter {
  truckAmount?: number
  truckTypes?: number[]
  userId?: string
  zoneIds?: number[]
  page?: number
  rowsPerPage?: number
}

export interface BookingBody {
  jobId: string
  truckId: string
  accepterUserId?: string | undefined | number
}

export interface RatingBody {
  jobId: string
  doneFrom: "CARGOLINK" | "OTHER" | "CANCELJOB"
  rating?: number
  dealingPrice?: number
  opinion?: string
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
