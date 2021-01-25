import React, { useEffect, useState } from 'react'
import { ImageBackground, ImageStyle, TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
import { SearchItemProps } from './search-item.props';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { color, spacing } from '../../theme';
import { Icon } from '../icon/icon';
import { PostingBy } from '../posting-by/posting-by';
import { Text } from '../text/text';
import { translate } from '../../i18n';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const truckBackImage = require("./truck-back.png")

const FONT_SIZE_SMALL = 15

const PADDING_TOP = { paddingTop: spacing[1] }
const PADDING_BOTTOM = { paddingBottom: spacing[1] }
const PADDING_LEFT = { paddingLeft: spacing[2] }
const PADDING_RIGHT = { paddingRight: spacing[2] }
const CONTAINER: ViewStyle = {
  width: '100%',
  ...PADDING_TOP,
  position: "relative",
  backgroundColor: color.backgroundWhite,
  borderWidth: 1,
  borderColor: color.line,
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
  borderBottomColor: color.line,
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
const LOCATION_TEXT: TextStyle = {
  fontSize: FONT_SIZE_SMALL,
  ...PADDING_LEFT
}
const TEXT: TextStyle = {
  ...PADDING_TOP,
  ...PADDING_BOTTOM
}
const CAR_DETAIL_ROOT: TextStyle = {
  // flex: 1,
  flexDirection: "row",
  ...PADDING_LEFT,
}
const CAR_DETAIL: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}
const CONTENT_RIGHT: ViewStyle = {
  // flex: 1,
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
  flexDirection: 'row',
  ...PADDING_LEFT,
  ...PADDING_RIGHT,
  marginLeft: spacing[2],
  marginRight: spacing[1],
  paddingTop: spacing[2],
  paddingBottom: spacing[2],
}
const VIEW_DETAIL_ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
}
const ACCOUNT_ROOT: ViewStyle = {
  flexDirection: 'row',
  justifyContent: "flex-end"
}
const TEXT_VIEW: TextStyle = {
  color: color.line,
  fontSize: 14,
  paddingHorizontal: 0,
  paddingVertical: 0
}

export function SearchItem(props: SearchItemProps) {
  const {
    id,
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
    isLike: like = false,
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
    onPress,
    onToggleHeart
  } = props

  const [isLike, setIsLike] = useState(like)

  useEffect(() => {
    setIsLike(like)
  }, [like])

  const onSelectedHeart = () => {
    setIsLike(!isLike)
    onToggleHeart({ id, isLike: !isLike })
  }

  return (
    <TouchableOpacity style={{ ...CONTAINER, ...containerStyle }} activeOpacity={1} onPress={onPress}>
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
            <Text text={fromText} style={[LOCATION_TEXT, { paddingRight: spacing[7] }]} numberOfLines={1} />
            <Icon />
          </View>
          <View style={LOCATION}>
            <Icon icon="pinDropGreen" style={PIN_ICON} />
            <Text
              text={`${translate('common.to')}`} // ถึง
              style={[LOCATION_TEXT, { width: 40 }]}
              numberOfLines={1}
            />
            <Text style={{ paddingRight: spacing[2] }} text={':'} />
            <Text text={toText} style={[LOCATION_TEXT, { paddingRight: spacing[7] }]} numberOfLines={1} />
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
          <TouchableOpacity onPress={onSelectedHeart}>
            <MaterialCommunityIcons name={isLike ? 'heart' : 'heart-outline'} size={24} color={isLike ? color.red : color.line} />
          </TouchableOpacity>
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
          <Text text={translate('jobDetailScreen.seeDetail')} style={TEXT_VIEW} />
          <AntDesign name="right" size={spacing[5]} color={color.line} />
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
    </TouchableOpacity>
  )
}