


import React from "react"
import { TextStyle, ViewStyle, Dimensions, View } from "react-native"
import { color, spacing, typography } from "../../theme"
import { Button } from '../button/button'
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
/**
 * A component which has a label and an input together.
 */
const { width } = Dimensions.get('window')
interface RadioProps {
  containerStyle?: any
  buttonStyle?: any
  textStyle?: any
  data?: any
  onPress?: any
}
const FULL: ViewStyle = {
  flex: 1
}

const ROOT_STYLE: ViewStyle = {
  flexDirection: 'row', justifyContent: 'flex-end'
}

const CONTENT_TEXT: TextStyle = {
  fontFamily: 'Kanit-Medium',
  width: width / 6,
  textAlign: 'center'
}

const RADIO_BUTTON: ViewStyle = {
  height: 40,
}

export function RadioButton(props: RadioProps) {
  const { containerStyle, buttonStyle, textStyle, data, onPress } = props

  if (!data || data.length == 0) return (<View />)

  return (
    <View style={{ ...ROOT_STYLE, ...containerStyle }}>
      {data.map((item, index) => {
        let inactiveObject = {
          borderWidth: 0.5,
          borderRadius: 2.5,
          borderColor: color.line,
        }
        let inactiveText = { color: color.line }
        let activeText = { color: color.snow }
        return <Button key={'radio-button-' + index} onPress={() => onPress(item, index)}
          style={[{
            ...RADIO_BUTTON, ...buttonStyle,
            backgroundColor: item.active ? color.primary : color.textWhite,
            borderTopLeftRadius: index ? 0 : 5,
            borderTopRightRadius: 5 * index,
            borderBottomLeftRadius: index ? 0 : 5,
            borderBottomRightRadius: 5 * index,
            // borderLeftWidth: item.active ? 0 : 0.5
          },
          !item.active && inactiveObject]}
        >
          <Text tx={item.label}
            style={[CONTENT_TEXT, item.active ? activeText : inactiveText, item.active, textStyle]} />
        </Button>
      })}
    </View>
  )
}
