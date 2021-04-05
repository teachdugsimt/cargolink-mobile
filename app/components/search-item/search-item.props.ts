import { ReactNode } from "react";
import { ImageProps, ImageSourcePropType, ViewStyle } from "react-native"

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

  image?: string | ImageProps

  containerStyle?: ViewStyle

  requiredTouchableOpacityGesture?: boolean

  price?: number

  priceType?: string

  customContent?: (props) => ReactNode

  bottomComponent?: (props) => ReactNode

  onToggleHeart?: (data: object) => void

  onPress?: () => void
}
