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
  userType: number
}

export interface OTPVerifyRequest {
  token: string
  otp: string
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
  filter?: {
    where?: {
      from?: string
      to?: string
      start_time?: string
      end_time?: string
      car_type?: string
    } | {}
  } | {}
}

export interface TermAndService {
  accept: boolean
  version: string
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
  weight?: number
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

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
