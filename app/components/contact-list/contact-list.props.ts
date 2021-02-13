import { ReactNode } from "react";
import { ImageProps, ImageStyle, ViewStyle } from "react-native";

export interface ContactListProps {

  header?: string

  callTime?: string

  content?: (props) => ReactNode

  contentRight?: (props) => ReactNode

  footer?: (props) => ReactNode

  imageSource?: string | ImageProps

  containerStyle?: ViewStyle

  imageStyle?: ImageStyle

}
