import React from "react"
import { TouchableOpacity, View, ViewStyle, Image, ImageStyle, TextStyle } from "react-native"
import { color, images, spacing, typography } from "../../theme"
import { Text } from '../text/text'
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
    overflow: 'hidden',
    borderStyle: 'dashed'
}
const VIEW_ICON: ViewStyle = {
    position: 'absolute',
    top: 5,
    right: 5
}
const IMAGE_AND_TEXT: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
}
const IMAGE_PLACHOLDER: ImageStyle = {
    width: 100,
    height: 100
}
const CONTENT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    color: color.grey,
    fontSize: typography.content,
    paddingTop: 5
}
export function UploadVehicle(props: any) {
    const { uploadStyle, source, imageStyle, tx } = props
    return (
        <View style={{ ...ROOT_STYLE, ...uploadStyle }}>
            <TouchableOpacity style={UPLOAD_BUTTON}>
                <View style={UPLOAD_VIEW}>
                    <View style={VIEW_ICON}>
                        <Ionicons name={"camera-outline"} size={22} color={color.grey} />
                    </View>

                    <View style={IMAGE_AND_TEXT}>
                        <Image source={source} style={{ ...IMAGE_PLACHOLDER, ...imageStyle }} resizeMode={'stretch'}></Image>
                        <Text tx={tx} style={CONTENT_TEXT} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
