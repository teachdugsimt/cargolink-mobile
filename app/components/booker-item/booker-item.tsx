import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dimensions, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native";
import { color, images, spacing } from "../../theme"
import { Text } from "../"
import { BookerItemProps } from './booker-item.props';
import { Button } from '../button/button';

const INITIAL_CONTAINER_STYLE: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
}
const IMAGE: ImageStyle = {
  width: 45,
  height: 45,
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
}
const DETAIL: ViewStyle = {
  flexDirection: 'column',
  paddingLeft: spacing[4],
}
const BTN_ROOT: ViewStyle = {
  marginLeft: 'auto',
}
const BTN: ViewStyle = {
  backgroundColor: color.line,
  borderRadius: Dimensions.get('window').width / 2,
  flexDirection: 'row',
}
const BTN_TEXT: TextStyle = {
  color: color.textWhite,
}

export function BookerItem(props: BookerItemProps) {

  const {
    imageUrl,
    topic,
    detail,
    btnTxt,
    containerStyle,
    tokenUrl,
    imageStyle,
    topicStyle,
    detailStyle,
    btnStyle,
    btnTextStyle,
    materialCommunityIconsName = 'chevron-right',
    iconSize = 18,
    iconColor = color.textWhite,
    onToggle = null
  } = props

  const containerViewStyle = { ...INITIAL_CONTAINER_STYLE, ...containerStyle }
  const imageViewStyle = { ...IMAGE, ...imageStyle }
  const btnViewStyle = { ...BTN, ...btnStyle }
  const btnTextViewStyle = { ...BTN_TEXT, ...btnTextStyle }

  const onPress = onToggle ? () => onToggle() : null

  return (
    <View style={containerViewStyle}>
      <View style={imageStyle}>
        <Image source={imageUrl ? {
          uri: imageUrl,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenUrl}`
          },
        } : images.greyMock} style={imageViewStyle} resizeMode={'cover'} />
      </View>

      <View style={DETAIL}>
        <Text text={topic} preset={'topic'} style={topicStyle} />
        <Text text={detail} preset={'small'} style={detailStyle} />
      </View>

      <View style={BTN_ROOT}>
        <Button
          testID="confirm"
          style={btnViewStyle}
          children={
            <View style={btnViewStyle}>
              <Text style={btnTextViewStyle} text={btnTxt} />
              <MaterialCommunityIcons name={materialCommunityIconsName} size={iconSize} color={iconColor} />
            </View>
          }
          onPress={onPress}
        />
      </View>
    </View>
  )
}
