import React from 'react'
import { Dimensions, ImageBackground, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { VehicleItemProps } from './vehicle-item.prop';
import { color, images, spacing } from '../../theme'
import { Text } from '..'
import { translate } from '../../i18n';

const TEXT_BOLD: TextStyle = { fontWeight: 'bold' }
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
  flexDirection: 'row',
  flex: 1,
}
const TOPIC: TextStyle = {
  ...TEXT_BOLD,
  fontSize: 16,
}
const STATUS: TextStyle = {
  color: color.primary,
  paddingTop: spacing[1],
  paddingBottom: spacing[1],
  paddingLeft: spacing[3],
  paddingRight: spacing[3],
  fontSize: 12,
  backgroundColor: color.disable,
  ...BORDER_RADIUS,
}
const SUB_TOPIC: TextStyle = {
  ...TEXT_BOLD,
  fontSize: 13,
  paddingTop: spacing[2]
}
const INFORMATION_DATE: TextStyle = {
  color: color.disable,
  fontSize: 13,
}
const IMAGE: ImageStyle = {
  position: 'absolute',
  height: 85,
  right: spacing[2],
  bottom: spacing[1],
  resizeMode: 'contain',
  aspectRatio: 4 / 2
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
    isChecked,
    onPress
  } = props

  const statusColor = isChecked ? color.success : color.primary
  const deviceHeight = Dimensions.get('window').height

  return (
    <TouchableOpacity onPress={onPress || null} style={{ height: deviceHeight / 4.5, flex: 1 }}>
      <View style={{ ...CONTAINER, ...containerStyle }}>
        <View style={{ ...ROW, justifyContent: 'space-between' }}>
          <Text style={{ ...TOPIC, ...topicStyle }} text={topic} />
          <Text style={{ ...STATUS, color: statusColor, ...statusStyle }} text={status} />
        </View>
        <View style={ROW}>
          <Text style={{ ...SUB_TOPIC, ...subTopicStyle }} text={`${translate('myVehicleScreen.type')} ${subTopic}`} />
        </View>
        <View style={{ ...ROW, flex: 3, alignItems: 'flex-end' }}>
          <Text style={INFORMATION_DATE} text={`${translate('myVehicleScreen.informationAt')} ${updatedDate}`} />
        </View>
        <ImageBackground source={images[`${image}`]} style={{ ...IMAGE, ...imageStyle }} />
      </View>
    </TouchableOpacity>
  )
}