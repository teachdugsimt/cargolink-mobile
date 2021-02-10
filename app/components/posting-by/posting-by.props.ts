import { ImageProps } from "react-native";

export interface PostingByProps {
  postBy?: string

  isVerified?: boolean

  isCrown?: boolean

  rating?: string

  ratingCount?: string

  image?: string | ImageProps

  onToggle?: (newValue?: any) => void
}
