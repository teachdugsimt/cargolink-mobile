import React from "react"
import { TouchableOpacity, View, ViewStyle, Image, ImageStyle } from "react-native"
import { color, spacing, typography } from "../../theme"
import Ionicons from 'react-native-vector-icons/Ionicons'
/**
 * A component which has a label and an input together.
 */

const FULL: ViewStyle = { flex: 1 }
const ROOT_STYLE: ViewStyle = {
    ...FULL
}
const UPLOAD_BUTTON: ViewStyle = {
    ...FULL
}
const UPLOAD_VIEW: ViewStyle = {
    ...FULL,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color.grey,
    borderRadius: 10,
    overflow: 'hidden'
}
const VIEW_ICON: ViewStyle = {
    position: 'absolute',
    top: 5,
    right: 5
}
const IMAGE_AND_TEXT: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
}
const IMAGE_PLACHOLDER: ImageStyle = {
    width: 100,
    height: 100
}
export function TextInputTheme(props: any) {
    const { forwardedRef, inputStyle, actualPlaceholder, ...rest } = props
    return (
        <View style={ROOT_STYLE}>
            <TouchableOpacity style={UPLOAD_BUTTON}>
                <View style={UPLOAD_VIEW}>
                    <View style={VIEW_ICON}>
                        <Ionicons name={"camera"} size={22} color={color.grey} />
                    </View>

                    <View style={IMAGE_AND_TEXT}>
                        {/* <Image source={} style={IMAGE_PLACHOLDER}></Image> */}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
