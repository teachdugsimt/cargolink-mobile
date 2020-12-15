import React from 'react'
import { ImageBackground, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { VehicleItemProps } from './vehicle-item.prop';
import { color, images, spacing } from '../../theme'
import { Text } from '..'
import { translate } from '../../i18n';

const TEXT_BOLD: TextStyle = { fontWeight: 'bold' }
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite,
}
const ROW: ViewStyle = {
  flexDirection: 'row',
}
const TOPIC: TextStyle = {
  ...TEXT_BOLD,
  fontSize: 16,
}
const STATUS: TextStyle = {
  color: color.primary,
  padding: spacing[2],
  fontSize: 12
}
const SUB_TOPIC: TextStyle = {
  ...TEXT_BOLD
}
const INFORMATION_DATE: TextStyle = {
  color: color.disable,
}
const IMAGE: ImageStyle = {
  width: 130,
  height: 100,
  position: 'absolute',
  right: 0,
  bottom: spacing[3],
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
    onPress
  } = props

  return (
    <TouchableOpacity onPress={onPress || null}>
      <View style={{ ...CONTAINER, ...containerStyle }}>
        <View style={{ ...ROW, justifyContent: 'space-between' }}>
          <Text style={{ ...TOPIC, ...topicStyle }} text={topic} />
          <Text style={{ ...STATUS, ...statusStyle }} text={status} />
        </View>
        <View style={ROW}>
          <Text style={{ ...SUB_TOPIC, ...subTopicStyle }} text={`${translate('myCarScreen.type')} ${subTopic}`} />
        </View>
        <View style={ROW}>
          <Text style={INFORMATION_DATE} text={`${translate('myCarScreen.informationAt')} ${updatedDate}`} />
        </View>
        <ImageBackground source={images[`${image}`]} style={{ ...IMAGE, ...imageStyle }} />
      </View>
    </TouchableOpacity>
  )
}