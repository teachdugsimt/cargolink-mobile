import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { spacing } from "../../theme"
import { translate } from "../../i18n/"
import Icon2 from 'react-native-vector-icons/Ionicons'
// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[4],
  alignItems: "center",
  paddingTop: spacing[5],
  paddingBottom: spacing[5],
  justifyContent: "flex-start",
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
    leftIcon,
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
  } = props

  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={{ ...ROOT, ...style }}>

      {leftIcon ? (
        <Button preset="link" onPress={onLeftPress}>
          <Icon icon={leftIcon} />
        </Button>
      ) : (
          leftIconReal ? <TouchableOpacity
            style={RIGHT_ICON_REAL}
            onPress={onLeftPress}><Icon2 name={leftIconName} size={leftIconSize} color={leftIconColor} />
          </TouchableOpacity> 
          : <View style={LEFT} />
        )}


      <View style={TITLE_MIDDLE}>
        <Text style={{ ...TITLE, ...titleStyle }} text={header} />
      </View>


      {rightIcon ? (
        <Button preset="link" onPress={onRightPress}>
          <Icon icon={rightIcon} />
        </Button>
      ) : (
          rightIconReal ? <TouchableOpacity
            style={RIGHT_ICON_REAL}
            onPress={onRightPress}><Icon2 name={rightIconName} size={rightIconSize} color={rightIconColor} />
          </TouchableOpacity> : <View style={RIGHT} />
        )}
    </View>
  )
}
