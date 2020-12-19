


import React from "react"
import { TextStyle, ViewStyle, Dimensions, View } from "react-native"
import { color, spacing, typography } from "../../theme"
import { Button } from '../button/button'
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
/**
 * A component which has a label and an input together.
 */
const FULL: ViewStyle = {
    flex: 1
}

const ROOT_STYLE: ViewStyle = {
    flexDirection: 'row', justifyContent: 'flex-end'
}

const CONTENT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.title,
    color: color.black,
    paddingHorizontal: 10,
}

const RADIO_BUTTON: ViewStyle = {

}

export function RadioButton(props: any) {
    const { containerStyle, buttonStyle, data, onPress } = props

    if (!data || data.length == 0) return (<View />)

    return (
        <View style={{ ...ROOT_STYLE, ...containerStyle }}>
            {data.map((item, index) => {
                return <Button key={'radio-button-' + index} onPress={() => onPress(item, index)}
                    style={{ ...RADIO_BUTTON, ...buttonStyle, backgroundColor: item.active ? color.primary : color.line }}
                >
                    <Text tx={item.label} style={CONTENT_TEXT} />
                </Button>
            })
            }
        </View>
    )
}
