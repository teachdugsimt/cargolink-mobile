import { GeneralApiProblem } from "./api-problem"

export interface User {
  id: number
  name: string
}

export interface AuthReponse {
  token: string
}

export interface AuthRequest {
  mobileNo: string
  userType: number
}

export interface OTPVerifyRequest {
  token: string
  otpCode: string
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
}

export interface VehicleRequest {
  registration_vehicle?: string
  car_type?: string
  from?: string
  to?: string
  status?: string
  image_car_type?: string
  owner?: object
  vehicle_height?: number
  have_dump?: boolean
  images?: {
    uri?: string,
    type?: string,
    name?: string,
    size?: number,
    tmp_name?: string
  }[]
  work_zone?: {
    region?: string,
    province?: string,
  }[]
}
export interface PatchDataRequest {
  car_type: string
  have_dump: boolean
  vehicle_height: string
  registration_vehicle: Array<string>
  images: Array<Object>
  work_zone: Array<Object>
}

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
