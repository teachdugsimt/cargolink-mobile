import React from "react"
import { TextInput, ViewStyle } from "react-native"
import { color, spacing } from "../../theme"
// import { Text } from '../text/text'
/**
 * A component which has a label and an input together.
 */

const ROOT_STYLE: ViewStyle = {
    borderRadius: spacing[1],
    height: 40,
    borderWidth: 1,
    borderColor: color.mainGrey,
    paddingLeft: 10
}

export function TextInputTheme(props: any) {
    const { forwardedRef, inputStyle, actualPlaceholder, editable, ...rest } = props
    return (
        <TextInput
            editable={editable === false ? false : true}
            testId={"vehicle-upload-input"}
            placeholder={actualPlaceholder}
            placeholderTextColor={color.palette.lighterGrey}
            underlineColorAndroid={color.transparent}
            {...rest}
            style={{ ...ROOT_STYLE, ...inputStyle }}
            ref={forwardedRef}
        />
    )
}
