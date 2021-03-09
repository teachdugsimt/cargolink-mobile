import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { spacing, color } from "../../theme"
import { translate } from "../../i18n/"
import Icon2 from 'react-native-vector-icons/Ionicons'
// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[4],
  alignItems: "center",
  paddingTop: spacing[4],
  paddingBottom: spacing[4],
  justifyContent: "flex-start",
  backgroundColor: color.primary
}
const SHADOW: ViewStyle = {
  borderBottomRightRadius: 5,
  borderBottomLeftRadius: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 5,
}
const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }
/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */

const RIGHT_ICON_REAL: ViewStyle = {
  padding: 5,
  paddingRight: 10
}

export function Header(props: HeaderProps) {
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    rightIconText,
    leftIcon,
    leftIconText,
    leftIconTextStyle,
    rightIconTextStyle,
    headerText,
    headerTx,
    style,
    titleStyle,
    rightIconReal,
    rightIconName,
    rightIconSize,
    rightIconColor,
    leftIconReal,
    leftIconName,
    leftIconSize,
    leftIconColor,
    iconStyle,
    closeShadow,
  } = props

  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={closeShadow == true ? { ...ROOT, ...style } : { ...ROOT, ...style, ...SHADOW }}>

      {
        leftIcon ? (
          <Button preset="link" onPress={onLeftPress} >
            <Icon icon={leftIcon} style={iconStyle} />
          </Button>
        ) : (
            leftIconText ? <TouchableOpacity onPress={onLeftPress}><Text style={leftIconTextStyle}>{leftIconText}</Text></TouchableOpacity> :
              leftIconReal ? <TouchableOpacity
                style={RIGHT_ICON_REAL}
                onPress={onLeftPress}>
                <Icon2 name={leftIconName} size={leftIconSize} color={leftIconColor} />
              </TouchableOpacity>
                : <View style={LEFT} />
          )}


      <View style={TITLE_MIDDLE}>
        <Text style={{ ...TITLE, ...titleStyle }} text={header} preset="topic" />
      </View>


      {
        rightIcon ? (
          <Button preset="link" onPress={onRightPress}>
            <Icon icon={rightIcon} style={iconStyle} />
          </Button>
        ) : (
            rightIconText ? <TouchableOpacity onPress={onRightPress}><Text style={rightIconTextStyle}>{rightIconText}</Text></TouchableOpacity> :
              rightIconReal ? <TouchableOpacity
                style={RIGHT_ICON_REAL}
                onPress={onRightPress}>
                <Icon2 name={rightIconName} size={rightIconSize} color={rightIconColor} />
              </TouchableOpacity> : <View style={RIGHT} />
          )
      }
    </View >
  )
}
