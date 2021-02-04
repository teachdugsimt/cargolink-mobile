import { TextStyle, ViewStyle } from 'react-native'

export interface RoundedButtonProps {
  containerStyle?: ViewStyle
  textStyle?: TextStyle
  text?: string
  leftIconName?: string
  rightIconName?: string
  rightIconcolor?: string
  leftIconColor?: string
  rightIconStyle?: ViewStyle
  leftIconStyle?: ViewStyle
  rightIconSize?: number
  leftIconSize?: number
  onPress?: () => void

}
