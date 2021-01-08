import React from "react"
import {
  ImageBackground,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { VehicleItemProps } from "./vehicle-item.prop"
import { color, images, spacing } from "../../theme"
import { Text } from ".."

const BORDER_RADIUS = { borderRadius: 4 }
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite,
  marginBottom: spacing[3],
  padding: spacing[3],
  shadowColor: color.disable,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 5,
  elevation: 3,
  ...BORDER_RADIUS,
}
const ROW: ViewStyle = {
  flexDirection: "row",
}
const STATUS_TEXT: TextStyle = {
  color: color.primary,
  paddingTop: spacing[1],
  paddingBottom: spacing[1],
  paddingLeft: spacing[3],
  paddingRight: spacing[3],
  fontSize: 12,
  fontFamily: 'Kanit-Medium',
}
const SUB_TOPIC: TextStyle = {
  paddingTop: spacing[1],
}
const INFORMATION_DATE: TextStyle = {
  color: color.disable,
  fontSize: 13,
  fontFamily: 'Kanit-Medium',
}
const IMAGE: ImageStyle = {
  position: "absolute",
  height: 85,
  right: spacing[2],
  bottom: spacing[1],
  aspectRatio: 4 / 2,
}

export function VehicleItem(props: VehicleItemProps) {
  const {
    topic,
    subTopic,
    updatedDate,
    status,
    image,
    containerStyle,
    topicStyle,
    subTopicStyle,
    statusStyle,
    imageStyle,
    onPress,
    ...rest
  } = props

  return (
    <TouchableOpacity testID={"list-vehicle"} {...rest} onPress={onPress || null} style={{ height: 150, flex: 1 }}>
      <View style={{ ...CONTAINER, ...containerStyle }}>
        <View style={{ ...ROW, justifyContent: "space-between" }}>
          <Text style={{ ...topicStyle }} text={topic} preset={'topicExtra'} numberOfLines={1} />
          <Text style={{ ...STATUS_TEXT, ...statusStyle }} text={status} />
        </View>
        <View style={ROW}>
          <Text
            style={{ ...SUB_TOPIC, ...subTopicStyle }}
            text={subTopic}
          />
        </View>
        <View style={{ ...ROW, flex: 3, alignItems: "flex-end" }}>
          <Text
            style={INFORMATION_DATE}
            text={updatedDate}
          />
        </View>
        <ImageBackground source={images[`truck${image}`]} resizeMode={'contain'} style={{ ...IMAGE, ...imageStyle }} />
      </View>
    </TouchableOpacity>
  )
}
