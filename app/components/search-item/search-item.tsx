import React from 'react'
import { Dimensions, Image, ImageBackground, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native';
import { SearchItemProps } from './search-item.props';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { color, spacing } from '../../theme';
import { Icon } from '../icon/icon';
import { Button } from '../button/button';
import { PostingBy } from '../posting-by/posting-by';
const truckBackImage = require("./truck-back.png")

const FONT_SIZE = 20
const FONT_SIZE_SMALL = 15
const FONT_SIZE_LARGE = 25

const TEXT_BOLD: TextStyle = { fontWeight: "bold" }
const PADDING_TOP = { paddingTop: spacing[1] }
const PADDING_BOTTOM = { paddingBottom: spacing[1] }
const PADDING_LEFT = { paddingLeft: spacing[1] }
const PADDING_RIGHT = { paddingRight: spacing[1] }
const CONTAINER: ViewStyle = {
  width: '100%',
  ...PADDING_TOP,
  position: "relative",
  backgroundColor: color.backgroundWhite,
  borderWidth: 1,
  borderColor: color.disable,
  marginTop: spacing[1],
  marginBottom: spacing[1],
}
const BACKGROUND: ImageStyle = {
  width: 130,
  height: 100,
  position: 'absolute',
  right: 0,
  bottom: spacing[3],
}
const TOP_ROOT: ViewStyle = {
  flex: 3,
  flexDirection: "row",
  paddingBottom: spacing[2],
  borderBottomWidth: 1,
  borderBottomColor: color.disable,
  marginLeft: spacing[1],
  marginRight: spacing[1],
  ...PADDING_LEFT,
  ...PADDING_RIGHT,
}
const CONTENT: ViewStyle = {
  flex: 3,
}
const LOCATION: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  ...PADDING_TOP,
  ...PADDING_BOTTOM
}
const PIN_ICON: ImageStyle = {
  width: 22,
  height: 22,
}
const SMALL_ICON: ImageStyle = {
  width: 18,
  height: 18,
}
const HEART_ICON: ImageStyle = {
  width: FONT_SIZE_LARGE,
  height: FONT_SIZE_LARGE
}
const LOCATION_TEXT: TextStyle = {
  fontSize: FONT_SIZE_SMALL,
  ...TEXT_BOLD,
  ...PADDING_LEFT
}
const TEXT: TextStyle = {
  ...PADDING_TOP,
  ...PADDING_BOTTOM
}
const CAR_DETAIL_ROOT: TextStyle = {
  flex: 1,
  flexDirection: "row",
  ...PADDING_LEFT,
}
const CAR_DETAIL: ViewStyle = {
  flex: 1
}
const PACKAGING: ViewStyle = {
  flex: 1
}
const CONTENT_RIGHT: ViewStyle = {
  flex: 1,
  alignItems: "flex-end",
  justifyContent: "space-between",
  ...PADDING_TOP,
  ...PADDING_BOTTOM,
}
const RECOMMENED: TextStyle = {
  backgroundColor: "#1b4262",
  paddingLeft: spacing[2],
  paddingRight: spacing[2],
  paddingTop: spacing[1] / 2,
  paddingBottom: spacing[1] / 2,
  borderRadius: 5,
  color: color.textWhite,
}
const BUTTOM_ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  ...PADDING_LEFT,
  ...PADDING_RIGHT,
  marginLeft: spacing[3],
  marginRight: spacing[3],
  paddingTop: spacing[2],
  paddingBottom: spacing[2],
}
const VIEW_DETAIL_ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
}
const ACCOUNT_ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: "flex-end"
}
const BUTTON_VIEW: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: 0,
  paddingVertical: 0
}
const TEXT_VIEW: TextStyle = {
  color: color.disable,
  fontSize: 14,
  paddingHorizontal: 0,
  paddingVertical: 0
}

export function SearchItem(props: SearchItemProps) {
  const {
    fromText,
    toText,
    count,
    detail,
    packaging,
    viewDetail,
    viewDetailToRight,
    backgroundImage,
    isLike,
    iconOnBottom,
    isRecommened,
    rexommenedOnTop,
    postBy,
    isVerified,
    rating,
    ratingCount,
    isCrown,
    logo,
    containerStyle,
    onPress
  } = props
  return (
    <View style={{ ...CONTAINER, ...containerStyle }}>
      <View style={TOP_ROOT}>
        <ImageBackground source={truckBackImage} style={BACKGROUND} ></ImageBackground>
        <View style={CONTENT}>
          <View style={LOCATION}>
            <Icon icon="pinDropYellow" style={PIN_ICON} />
            <Text style={LOCATION_TEXT}>จาก : {fromText}</Text>
            <Icon />
          </View>
          <View style={LOCATION}>
            <Icon icon="pinDropGreen" style={PIN_ICON} />
            <Text style={LOCATION_TEXT}>ถึง : {toText}</Text>
          </View>
          <View style={CAR_DETAIL_ROOT}>
            <View style={CAR_DETAIL}>
              <Text style={TEXT}>จำนวนรถบรรทุก : {count}</Text>
              <Text style={TEXT}>{detail}</Text>
            </View>
            <View style={PACKAGING}>
              <Text style={TEXT}>บรรจุภัณฑ์ : {packaging}</Text>
            </View>
          </View>
        </View>
        <View style={CONTENT_RIGHT}>
          <Icon icon={isLike ? 'heartActive' : 'heartInactive'} style={HEART_ICON} />
          {isRecommened && <Text style={RECOMMENED}>งานแนะนำ</Text>}
        </View>
      </View>
      <View style={BUTTOM_ROOT}>
        <View style={VIEW_DETAIL_ROOT}>
          <Button
            testID="view-detail"
            style={BUTTON_VIEW}
            textStyle={TEXT_VIEW}
            text={'ดูรายละเอียด'}
            onPress={onPress}
          />
          <AntDesign name="right" siez={FONT_SIZE_LARGE} color={color.disable} />
        </View>
        <View style={ACCOUNT_ROOT}>
          <PostingBy {
            ...{
              postBy,
              isVerified,
              isCrown,
              rating,
              ratingCount,
              logo,
            }
          } />
        </View>
      </View>
    </View>
  )
}