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

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
