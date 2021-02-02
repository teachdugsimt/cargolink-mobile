import { ReactNode } from "react";
import { TextStyle, ViewStyle } from "react-native";

export interface ModalAlertProps {

  containerStyle?: ViewStyle

  iconStyle?: {
    color?: string
    size?: number
  }

  headerStyle?: TextStyle

  contentStyle?: TextStyle

  iconName?: string

  header?: string

  content?: string

  headerTranslate?: string

  contentTranslate?: string

  headerTranslateOptions?: object

  contentTranslateOptions?: object

  visible?: boolean

  buttonContainerStyle?: ViewStyle

  buttonComponent?: (props) => ReactNode

  imageComponent?: (props) => ReactNode

}
