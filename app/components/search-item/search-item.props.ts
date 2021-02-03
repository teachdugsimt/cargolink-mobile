import { ReactNode } from "react";
import { ImageSourcePropType, ViewStyle } from "react-native"

export interface SearchItemProps {
  id?: number | string

  fromText?: string

  toText?: string

  count?: string | number

  detail?: string

  productName?: string

  truckType?: string

  packaging?: string

  viewDetail?: boolean

  viewDetailToRight?: boolean

  backgroundImage?: ImageSourcePropType

  isLike?: boolean

  showFavoriteIcon?: boolean

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

  bottomComponent?: (props) => ReactNode

  onToggleHeart?: (data: object) => void

  onPress?: (data: object) => void
}
