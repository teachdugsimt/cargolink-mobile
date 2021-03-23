


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
  height: 40
}
const WIDTH_ROW: ViewStyle = { width: '50%', flexDirection: 'row' }

export function RadioButton(props: RadioProps) {
  const { containerStyle, buttonStyle, data, onPress } = props

  if (!data || data.length == 0) return (<View />)

  return (
    <View style={{ ...ROOT_STYLE, ...containerStyle }}>
      {data.map((item, index) => {
        let inactiveObject = { borderWidth: 1, borderRadius: 1, borderRadius: 2.5, borderColor: color.line }
        let inactiveText = { color: color.line }
        return <Button key={'radio-button-' + index} onPress={() => onPress(item, index)}
          style={[{ ...RADIO_BUTTON, ...buttonStyle, backgroundColor: item.active ? color.primary : color.textWhite },
          !item.active && inactiveObject]}
        >
          <Text tx={item.label} style={[CONTENT_TEXT, !item.active && inactiveText]} />
        </Button>
      })}
    </View>
  )
}
