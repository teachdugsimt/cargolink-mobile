import React from "react"
import {
  ImageBackground,
  ImageStyle,
  Platform,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { VehicleItemProps } from "./vehicle-item.prop"
import { color, images, spacing } from "../../theme"
import { Text } from ".."
import { MapTruckImageName } from '../../utils/map-truck-image-name'

const BORDER_RADIUS = { borderRadius: 4 }
const COLOR_WHITE: TextStyle = { color: color.textWhite }
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite,
  marginBottom: spacing[3],
  padding: spacing[3],
  shadowColor: color.line,
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
  width: '70%',
}
const INFORMATION_DATE: TextStyle = {
  color: color.line,
  fontSize: 12,
  fontFamily: 'Kanit-Medium',
}
const IMAGE: ImageStyle = {
  position: "absolute",
  height: 90,
  right: Platform.OS == "ios" ? 0 : -40,
  bottom: -10,
  aspectRatio: 4 / 2,
}

const BOTTOM_LIST_VIEW: ViewStyle = { width: '100%', height: 50, paddingTop: 10 }
const BOTTOM_SUB_LIST_VIEW: ViewStyle = { flex: 1, borderTopColor: color.line, borderTopWidth: 1 }
const FLEX_ROW_BOTTOM: ViewStyle = { ...ROW, flex: 1 }
const TEXT_LEFT_BOTTOM: TextStyle = {
  flex: 1,
  borderRightColor: color.line, borderRightWidth: 1,
  justifyContent: 'center', alignItems: 'center'
}
const TEXT_RIGHT_BOTTOM: TextStyle = { flex: 1, justifyContent: 'center', alignItems: 'center' }
const PRIMARY_COLOR: TextStyle = { color: color.primary }

const QUOTATION_NUM: ViewStyle = {
  backgroundColor: 'red', height: 20, width: 20, borderRadius: 10, position: 'absolute', top: 0, right: 40,
  justifyContent: 'center', alignItems: 'center'
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
    quotationNumber,
    onEdit,
    ...rest
  } = props

  return (
    <TouchableOpacity testID={"list-vehicle"} {...rest} onPress={onPress || null} style={{ height: 200 }}>
      <View style={{ ...CONTAINER, ...containerStyle }}>
        <View style={{ flex: 1 }}>
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
          <ImageBackground source={images[MapTruckImageName(image)]} resizeMode={Platform.OS == "ios" ? "contain" : 'center'} style={{ ...IMAGE, ...imageStyle }} />

        </View>

        <View style={BOTTOM_LIST_VIEW}>
          <View style={BOTTOM_SUB_LIST_VIEW}>
            <View style={FLEX_ROW_BOTTOM}>
              <TouchableOpacity style={TEXT_LEFT_BOTTOM} onPress={onEdit || null}>
                <Text style={PRIMARY_COLOR} tx={"myVehicleScreen.editCar"} />
              </TouchableOpacity>
              <TouchableOpacity style={TEXT_RIGHT_BOTTOM} onPress={onPress || null}>
                {!!quotationNumber && <View style={QUOTATION_NUM}>
                  <Text style={COLOR_WHITE}>{quotationNumber}</Text>
                </View>}
                <Text style={PRIMARY_COLOR} tx={"myVehicleScreen.pendingWork"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  )
}
