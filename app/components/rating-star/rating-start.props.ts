export interface RatingStartProps {

    size?: number

    colorActive?: string

    colorInActive?: string

    space?: number

    countIcon?: number

    isHorizontal?: boolean

    onToggle: (count: number) => void

}