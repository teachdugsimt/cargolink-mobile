import { ViewStyle } from "react-native";

export interface ModalLoadingProps {

    containerStyle?: ViewStyle

    size?: 'small' | 'large'

    color?: string

    presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen'

    transparent?: boolean

    visible?: boolean
}