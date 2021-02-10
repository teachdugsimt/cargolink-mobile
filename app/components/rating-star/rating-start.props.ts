export interface RatingStartProps {

  size?: number

  colorActive?: string

  colorInActive?: string

  space?: number

  countIcon?: number

  isHorizontal?: boolean

  disabled?: boolean

  indexActive?: number

  onToggle?: (count: number) => void

}
