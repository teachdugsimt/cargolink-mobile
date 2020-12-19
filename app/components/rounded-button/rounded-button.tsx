


import React from "react"
import { TextStyle, ViewStyle, Dimensions } from "react-native"
import { color, spacing, typography } from "../../theme"
import { Button } from '../button/button'
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
/**
 * A component which has a label and an input together.
 */
const { width, height } = Dimensions.get('window')

const CONTENT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.title
}

const ADD_VEHICLE_BUTTON: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 20,
    alignSelf: 'center',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.textWhite
}

export function RoundedButton(props: any) {
    const { containerStyle, textStyle, text, leftIconName, rightIconName, rightIconcolor, leftIconColor, onPress } = props
    return (
        <Button onPress={onPress} style={{ ...ADD_VEHICLE_BUTTON, ...containerStyle }}>
            {leftIconName && <Ionicons name={leftIconName} size={spacing[5]} color={leftIconColor} />}
            <Text tx={text} style={{ ...CONTENT_TEXT, ...textStyle }} />
            {rightIconName && <Ionicons name={rightIconName} size={spacing[5]} color={rightIconcolor} />}
        </Button>
    )
}
