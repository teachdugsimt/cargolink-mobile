import { ImageStyle, TextStyle, ViewStyle } from "react-native"

export interface VehicleItemProps {
  /** */
  topic?: string
  /** */
  subTopic?: string
  /**
   * information of date now
   */
  updatedDate?: string
  /**
   * string of status on top right
   */

  onEdit?: (value: any) => void
  
  status?: string
  /**
   * name of image
   */
  image?: string

  // isChecked?: boolean
  /**
   * style of container
   */
  containerStyle?: ViewStyle
  /**
   * style of topic
   */
  topicStyle?: TextStyle
  /**
   * style of sub topic
   */
  subTopicStyle?: TextStyle
  /**
   * style of status
   */
  statusStyle?: TextStyle
  /**
   * style of image
   */
  imageStyle?: ImageStyle

  quotationNumber?: number

  onPress?: (value: any) => void
}
