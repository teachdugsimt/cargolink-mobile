


import React from "react"
import { TextStyle, ViewStyle, View, Image, ImageStyle, Platform } from "react-native"
import { color, images } from "../../theme"
import { RoundedButton } from '../rounded-button/rounded-button'
import { Text } from '../text/text'
import { BookListProps } from './book-list.props'
/**
 * A component which has a label and an input together.
 */
const FULL: ViewStyle = { flex: 1 }
const ROUND_BUTTON_CONTAINER: ViewStyle = {
  width: '70%',
  alignSelf: 'flex-end',
  height: 35,
  alignItems: 'center',
  backgroundColor: color.line, borderColor: color.transparent,
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.textWhite,
  paddingRight: 5,
  marginLeft: 5,
  marginTop: -2.5
}
const MAIN_VIEW: ViewStyle = { ...FULL, borderBottomColor: color.line, borderBottomWidth: 1 }
const SUB_VIEW: ViewStyle = { ...FULL, flexDirection: 'row', alignItems: 'center' }
const IMG_VIEW: ViewStyle = { width: 60, height: 60 }
const IMG_PURE_VIEW: ImageStyle = { height: 60, width: 60, borderRadius: 30 }
const MAIN_CENTER_VIEW: ViewStyle = { ...FULL, paddingLeft: 20 }
const ROW: ViewStyle = { flexDirection: 'row' }
const COLOR_LINE: TextStyle = { color: color.line }
const MARGIN_TOP_1: ViewStyle = { marginTop: -1 }
const HEIGHT_80: ViewStyle = { height: 80 }

export function BookList(props: BookListProps) {
  const { item, index, onPress } = props
  return <View style={HEIGHT_80} key={'booking-' + index.toString()}>
    <View style={MAIN_VIEW}>
      <View style={SUB_VIEW}>

        <View style={IMG_VIEW}>
          {Platform.OS == "ios" ? <Image source={item.img ? { uri: item.img } : images.greyMock}
            resizeMode={"stretch"} style={IMG_PURE_VIEW} /> : <Image source={item.img ? { uri: item.img } : images.greyMock}
              style={IMG_PURE_VIEW} />}
        </View>

        <View style={MAIN_CENTER_VIEW}>
          <View style={ROW}>
            <Text>{item.prefix + " "}</Text>
            <Text>{item.name}</Text>
          </View>
          <View style={ROW}>
            <Text style={COLOR_LINE} tx={"myVehicleScreen.queueTime"} />
            <Text style={COLOR_LINE}>{" " + item.bookTime}</Text>
          </View>
        </View>

        <View style={FULL}>
          <RoundedButton onPress={onPress}
            rightIconName="chevron-forward" rightIconcolor={color.textWhite} rightIconSize={20}
            rightIconStyle={MARGIN_TOP_1}
            text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
        </View>

      </View>
    </View>
  </View>
}
