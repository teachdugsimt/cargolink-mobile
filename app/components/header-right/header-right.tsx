import React from 'react'
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { typography, color } from '../../theme'
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ROOT_STYLE: TextStyle = {
  fontFamily: 'Kanit-Medium',
  fontSize: typography.title
}
const DOT: ViewStyle = {
  position: 'absolute',
  right: 0,
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: color.red,
}
const FLOAT_DOT: ViewStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
}

export const HeaderRight = (props: any) => {
  const { tx, txStyle, onRightPress, iconName, iconSize, iconColor, showRedDot } = props
  if (tx)
    return (
      <TouchableOpacity onPress={onRightPress}>
        <Text tx={tx} style={{ ...ROOT_STYLE, ...txStyle }} />
      </TouchableOpacity>
    )
  else
    return (
      <TouchableOpacity onPress={onRightPress}>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
        {showRedDot && <View style={FLOAT_DOT}>
          <View style={DOT} />
        </View>}
      </TouchableOpacity>
    )
}

