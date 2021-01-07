import { ViewStyle } from "react-native"

export interface SearchItemProps {
  fromText?: string

  toText?: string

  count?: string | number

  detail?: string

  productName?: string

  truckType?: string

  packaging?: string

  viewDetail?: boolean

  viewDetailToRight?: boolean

  backgroundImage?: string

  isLike?: boolean

  iconOnBottom?: boolean

  isRecommened?: boolean

  rexommenedOnTop?: true

  postBy?: string

  isVerified?: boolean

  rating?: string

  ratingCount?: string

  isCrown?: boolean

  logo?: string

  containerStyle?: ViewStyle

  onToggle?: (data: object) => void

  onPress?: (data: object) => void
}
