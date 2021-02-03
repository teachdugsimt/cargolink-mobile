export interface ModalNormalProps {
  visible?: boolean

  onTouchOutside?: () => void
  onSwipeOut?: () => void

  onPressLeft?: () => void
  onPressRight?: () => void
  imageTopic?: 'workYellowIcon' | 'truckYellowIcon' | 'successTask'
  title?: string
  subTitle?: string
}
