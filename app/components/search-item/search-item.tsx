import React from 'react'
import { Dimensions, Image, ImageBackground, ImageStyle, TextStyle, View, ViewStyle } from 'react-native';
import { SearchItemProps } from './search-item.props';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { color, spacing } from '../../theme';
import { Icon } from '../icon/icon';
import { Button } from '../button/button';
import { PostingBy } from '../posting-by/posting-by';
import { Text } from '../text/text';
import { translate } from '../../i18n';
const truckBackImage = require("./truck-back.png")

const FONT_SIZE = 20
const FONT_SIZE_SMALL = 15
const FONT_SIZE_LARGE = 25

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
  flex: 1,
  flexDirection: "row",
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
const RECOMMENED_ROOT: ViewStyle = {
  backgroundColor: "#1b4262",
  borderRadius: 5,
}
const RECOMMENED: TextStyle = {
  paddingLeft: spacing[2],
  paddingRight: spacing[2],
  paddingTop: spacing[1],
  paddingBottom: spacing[1],
  color: color.textWhite,
  fontSize: 12,
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
    productName,
    truckType,
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
            <Text
              text={`${translate('common.from')}`} // จาก
              style={[LOCATION_TEXT, { width: 40 }]}
            />
            <Text style={{ paddingRight: spacing[2] }} text={':'} />
            <Text
              text={fromText}
              style={LOCATION_TEXT}
            />
            <Icon />
          </View>
          <View style={LOCATION}>
            <Icon icon="pinDropGreen" style={PIN_ICON} />
            <Text
              text={`${translate('common.to')}`} // ถึง
              style={[LOCATION_TEXT, { width: 40 }]}
            />
            <Text style={{ paddingRight: spacing[2] }} text={':'} />
            <Text
              text={toText}
              style={LOCATION_TEXT}
              numberOfLines={1}
            />
          </View>
          <View style={CAR_DETAIL_ROOT}>
            <View style={CAR_DETAIL}>
              <Text
                style={TEXT}
                text={`${translate('jobDetailScreen.product')} : `} // จำนวนรถบรรทุก
              />
              <Text style={TEXT} text={productName} />
            </View>
          </View>
          <View style={CAR_DETAIL_ROOT}>
            <View style={CAR_DETAIL}>
              <Text style={TEXT} text={truckType} />
            </View>
            <View style={CAR_DETAIL}>
              <Text
                style={TEXT}
                text={`${translate('common.count')} : `} // บรรจุภัณฑ์
              />
              <Text style={TEXT} text={count.toString()} />
            </View>
          </View>
        </View>
        <View style={CONTENT_RIGHT}>
          <Icon icon={isLike ? 'heartActive' : 'heartInactive'} style={HEART_ICON} />
          {isRecommened &&
            <View style={RECOMMENED_ROOT}>
              <Text
                style={RECOMMENED}
                text={translate('jobDetailScreen.jobRecommend')} // งานแนะนำ
              />
            </View>}
        </View>
      </View>
      <View style={BUTTOM_ROOT}>
        <View style={VIEW_DETAIL_ROOT}>
          <Button
            testID="view-detail"
            style={BUTTON_VIEW}
            textStyle={TEXT_VIEW}
            text={translate('jobDetailScreen.seeDetail')} // ดูรายละเอียด
            onPress={onPress}
          />
          <AntDesign name="right" size={FONT_SIZE_LARGE} color={color.disable} />
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