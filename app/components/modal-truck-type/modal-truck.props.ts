export interface ModalTruckProps {
  visible?: boolean

  onTouchOutside?: () => void

  selectedItems: Array<string>

  onChange?: () => void

  getStallHeight?: (val: any) => void
}
