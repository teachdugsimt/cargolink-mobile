import React from "react"
import { View, Image, ImageStyle, Dimensions, ViewStyle } from "react-native"
import { images } from "../../theme"
import { Text } from '../text/text'
const { width } = Dimensions.get('window')



/**
 * A component which has a label and an input together.
 */
const MARGIN_HORIZONTAL_10: ViewStyle = { marginHorizontal: 20 }
const PADDING_TOP_10: ViewStyle = { paddingTop: 10 }
const IMAGE_NEWS: ImageStyle = {
  width: '100%',
  height: width / 3,
  borderRadius: 10,
}
export function SponserHome(props: any) {

  return (
    <View style={MARGIN_HORIZONTAL_10}>
      <View>
        <Text tx="homeScreen.newPromotion" preset="topic" />
      </View>
      <View style={[PADDING_TOP_10, { overflow: "hidden", borderRadius: 10 }]}>
        <Image source={images.sponser} style={IMAGE_NEWS} resizeMode="stretch" />
      </View>
    </View>
  )
}
