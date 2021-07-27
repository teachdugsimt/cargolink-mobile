import React, { useState } from "react"
import { TouchableOpacity, View, ViewStyle, Image, ImageStyle, TextStyle, Dimensions } from "react-native"
import { color, images, spacing, typography } from "../../theme"
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
/**
 * A component which has a label and an input together.
 */
const { width } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }
const ROOT_STYLE: ViewStyle = {
    ...FULL,

}
const UPLOAD_BUTTON: ViewStyle = {
    ...FULL
}
const UPLOAD_VIEW: ViewStyle = {
    ...FULL,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color.mainGrey,
    borderRadius: 10,
    overflow: 'hidden',
    borderStyle: 'dashed',
    maxHeight: 120,
    maxWidth: (width / 2) - 10
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
    height: 100,
}
const CONTENT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    color: color.line,
    fontSize: typography.content,
}
const DELETE_BUTTON: ViewStyle = {
    zIndex: 2,
    position: 'absolute',
    top: -5, right: 0
}
export function UploadVehicle(props: any) {
    const { uploadStyle, source, imageStyle, tx, onPress, viewImageStyle, txStyle, deleteImage, haveImage } = props
    console.log("source :: ", source)
    return (
        <View style={{ ...ROOT_STYLE, ...uploadStyle }}>
            <TouchableOpacity style={UPLOAD_BUTTON} onPress={onPress} testID={"select-image"}>
                <View style={UPLOAD_VIEW}>
                    <View style={VIEW_ICON}>
                        <Ionicons name={"camera-outline"} size={22} color={color.line} />
                    </View>

                    <View style={{ ...IMAGE_AND_TEXT, ...viewImageStyle }}>
                        {haveImage && <TouchableOpacity onPress={deleteImage} style={DELETE_BUTTON}><Ionicons name={"close"} size={22} color={color.error} /></TouchableOpacity>}
                        <Image source={source} style={{ ...IMAGE_PLACHOLDER, ...imageStyle }} resizeMode={'stretch'}></Image>
                        <Text tx={tx} style={{ ...CONTENT_TEXT, ...txStyle }} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
