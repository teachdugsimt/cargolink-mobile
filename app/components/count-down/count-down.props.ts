import { TextStyle, ViewStyle } from "react-native";

export interface CountDownProps {
  id?: string

  digitStyle?: ViewStyle

  digitTxtStyle?: TextStyle

  timeLabelStyle?: TextStyle

  separatorStyle?: ViewStyle

  timeToShow?: Array<string>

  showSeparator?: boolean

  size?: number

  style?: ViewStyle

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
