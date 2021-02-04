import { ImageStyle, TextStyle, ViewStyle } from "react-native";

export interface BookerItemProps {

  imageUrl?: string

  topic?: string

  detail?: string

  btnTxt?: string

  containerStyle?: ViewStyle

  imageStyle?: ImageStyle

  topicStyle?: TextStyle

  detailStyle?: TextStyle

  btnStyle?: ViewStyle

  btnTextStyle?: TextStyle

  materialCommunityIconsName?: string

  iconSize?: number

  iconColor?: string

  onToggle?: () => void

}
