export interface PostingByProps {
  postBy?: string

  isVerified?: boolean

  isCrown?: boolean

  rating?: string

  ratingCount?: string

  logo?: string

  onToggle?: (newValue?: any) => void
}
