


import React from "react"
import { TextStyle, ViewStyle, Dimensions, View } from "react-native"
import { color, spacing } from "../../theme"
import { Button } from '../button/button'
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RoundedButtonProps } from './rounded-button.props'
/**
 * A component which has a label and an input together.
 */
const { width, height } = Dimensions.get('window')

const CONTENT_TEXT: TextStyle = {
  // fontFamily: 'Kanit-Medium',
  // fontSize: typography.title
}

const ADD_VEHICLE_BUTTON: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  width: width - 20,
  alignSelf: 'center',
  height: 50,
  borderRadius: 25,
  // borderWidth: 1,
  // borderColor: color.mainGrey,
  backgroundColor: color.textWhite
}
const MAIN_VIEW: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
}
export function RoundedButton(props: RoundedButtonProps) {
  const { containerStyle, textStyle, text, leftIconName, rightIconName, rightIconcolor, leftIconColor,
    rightIconStyle, leftIconStyle, onPress, rightIconSize,
    leftIconSize, ...rest } = props
  return (
    <Button onPress={onPress} style={{ ...ADD_VEHICLE_BUTTON, ...containerStyle }} {...rest}>
      <View style={MAIN_VIEW}>
        {leftIconName && <Ionicons name={leftIconName} size={leftIconSize || spacing[5]} color={leftIconColor} style={leftIconStyle || {}} />}
        <Text tx={text} style={{ ...CONTENT_TEXT, ...textStyle, paddingLeft: leftIconName ? 7.5 : 0 }} />
        {rightIconName && <Ionicons name={rightIconName} size={rightIconSize || spacing[5]} color={rightIconcolor} style={rightIconStyle || {}} />}
      </View>
    </Button>
  )
}

const WRAPPER_TOP: ViewStyle = {
  padding: 10
}
const ROUND_BUTTON_CONTAINER: ViewStyle = {
  height: 40,
  backgroundColor: color.primary, borderColor: color.transparent
}
export function RoundedButtonStandard(props: RoundedButtonProps) {
  const { onPress, text } = props
  return (<View style={WRAPPER_TOP}>
    <RoundedButton onPress={onPress} text={text} containerStyle={ROUND_BUTTON_CONTAINER} />
  </View>)

}
