import { TextStyle, ViewStyle } from "react-native"

export interface SearchBarProps {
  fromText?: string

  toText?: string

  style?: ViewStyle

  navigationTo?: string

  buttonText?: string

  textStyle?: TextStyle

  onToggle?: (firstLocale: string, secondLocale: string) => void

  onSearch?: () => void
}