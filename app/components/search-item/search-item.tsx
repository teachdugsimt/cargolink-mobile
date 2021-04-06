import React, { useEffect, useState } from 'react'
import { ImageBackground, ImageStyle, TextStyle, View, ViewStyle, Dimensions, TouchableOpacity } from 'react-native';
import { SearchItemProps } from './search-item.props';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { color, spacing } from '../../theme';
import { Icon } from '../icon/icon';
import { PostingBy } from '../posting-by/posting-by';
import { Text } from '../text/text';
import { translate } from '../../i18n';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity as TouchableOpacityGesture } from 'react-native-gesture-handler';

const truckBackImage = require("./truck-back.png")

const FONT_SIZE_SMALL = 15

const { width, height } = Dimensions.get('window')

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
  position: 'relative',
  flexDirection: "row",
  paddingBottom: spacing[2],
  borderBottomWidth: 1,
  borderBottomColor: color.mainGrey,
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
const LOCATION_TEXT: TextStyle = {
  fontSize: FONT_SIZE_SMALL,
  width: Dimensions.get('window').width - 100,
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
  // justifyContent: 'space-between',
  ...PADDING_LEFT,
  ...PADDING_RIGHT,
  marginLeft: spacing[2],
  marginRight: spacing[1],
  paddingTop: spacing[2],
  paddingBottom: spacing[2],
}
const VIEW_DETAIL_ROOT: ViewStyle = {
  // flex: 1,
  width: 100,
  flexDirection: 'row',
  alignItems: 'center',
}
const ACCOUNT_ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: "flex-end",
}
const TEXT_VIEW: TextStyle = {
  color: color.line,
  fontSize: 14,
  paddingHorizontal: 0,
  paddingVertical: 0
}
const PRICE: ViewStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: color.blue,
  borderTopLeftRadius: width / 2,
  borderBottomLeftRadius: width / 2,
  paddingVertical: spacing[1] + 2,
  paddingHorizontal: spacing[4],
  marginBottom: spacing[2],
}
const PRICE_TEXT: TextStyle = {
  color: color.textWhite
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
    showFavoriteIcon = true,
    iconOnBottom,
    isRecommened,
    rexommenedOnTop,
    postBy,
    isVerified,
    rating,
    ratingCount,
    isCrown,
    image,
    containerStyle,
    requiredTouchableOpacityGesture = false,
    price = 0,
    priceType = translate('common.round'),
    bottomComponent,
    onPress,
    onToggleHeart
  } = props

  const [isLike, setIsLike] = useState<boolean>(like)

  useEffect(() => {
    setIsLike(like)
  }, [like])

  const onSelectedHeart = () => {
    setIsLike(!isLike)
    onToggleHeart({ id, isLike: !isLike })
  }

  const renderButtom = bottomComponent ? bottomComponent((comp) => comp) : null

  const MainTouchableOpacity = requiredTouchableOpacityGesture ? TouchableOpacityGesture : TouchableOpacity

  return (
    <View style={{ ...CONTAINER, ...containerStyle }}>
      <MainTouchableOpacity style={TOP_ROOT} activeOpacity={1} onPress={onPress}>
        <ImageBackground source={truckBackImage} style={BACKGROUND} ></ImageBackground>
        <View style={CONTENT}>
          <View style={LOCATION}>
            <MaterialIcons name={'pin-drop'} color={color.primary} size={22} />
            <Text
              text={`${translate('common.from')}`}
              style={[LOCATION_TEXT, { width: 50 }]}
            />
            <Text style={{ paddingRight: spacing[1] }} text={':'} />
            <Text text={fromText} style={[LOCATION_TEXT, { paddingRight: spacing[7] }]} numberOfLines={1} />
            <Icon />
          </View>
          <View style={LOCATION}>
            <MaterialIcons name={'pin-drop'} color={color.success} size={22} />
            <Text
              text={`${translate('common.to')}`}
              style={[LOCATION_TEXT, { width: 50 }]}
              numberOfLines={1}
            />
            <Text style={{ paddingRight: spacing[1] }} text={':'} />
            <Text text={toText} style={[LOCATION_TEXT, { paddingRight: spacing[7] }]} numberOfLines={1} />
          </View>
          <View style={CAR_DETAIL_ROOT}>
            <View style={CAR_DETAIL}>
              <Text
                style={TEXT}
                text={`${translate('jobDetailScreen.product')} : `}
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
                text={`${translate('common.amount')} : `}
              />
              <Text style={TEXT} text={count.toString()} />
            </View>
          </View>
        </View>
        <View style={CONTENT_RIGHT}>
          {showFavoriteIcon && <MainTouchableOpacity onPress={onSelectedHeart}>
            <MaterialCommunityIcons name={isLike ? 'heart' : 'heart-outline'} size={24} color={isLike ? color.red : color.line} />
          </MainTouchableOpacity>}
          {isRecommened &&
            <View style={RECOMMENED_ROOT}>
              <Text
                style={RECOMMENED}
                text={translate('jobDetailScreen.jobRecommend')}
              />
            </View>}
        </View>

        <View style={PRICE}>
          <Text text={`${price ? price.toString() : '-'} ${'\u0E3F'} / ${priceType}`} style={PRICE_TEXT} preset={'topic'} />
        </View>

      </MainTouchableOpacity>
      {renderButtom || (<MainTouchableOpacity style={BUTTOM_ROOT} activeOpacity={1} onPress={onPress}>
        <View style={VIEW_DETAIL_ROOT}>
          <Text text={translate('jobDetailScreen.seeDetail')} style={TEXT_VIEW} />
          <AntDesign name="right" size={spacing[4] + spacing[1]} color={color.line} />
        </View>
        <View style={ACCOUNT_ROOT}>
          <PostingBy {
            ...{
              postBy,
              isVerified,
              isCrown,
              rating,
              ratingCount,
              image,
            }
          } />
        </View>
      </MainTouchableOpacity>)
      }
    </View>
  )
}
