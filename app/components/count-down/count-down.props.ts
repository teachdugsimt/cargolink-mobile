export interface CountDownProps {
  id?: string

  digitStyle?: object

  digitTxtStyle?: object

  timeLabelStyle?: object

  separatorStyle?: object

  timeToShow?: Array<string>

  showSeparator?: boolean

  size?: number

  style?: object

  until?: number

  running?: boolean

  timeLabels?: {
    d?: string
    h?: string
    m?: string
    s?: string
  }

  onChange?: (newValue?: any) => void

  onPress?: (newValue?: any) => void

  onFinish?: (newValue?: any) => void
}
