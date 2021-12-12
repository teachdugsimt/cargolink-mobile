import { ViewStyle } from "react-native";

export interface NormalDropdownProps {
  items?: Array<Object>
  value?: string
  keyer?: number
  onValueChange?: (val: any) => any
  onChange?: any
  placeholder?: string
  underline?: boolean | number
  border?: boolean
  containerStyle?: ViewStyle
}
