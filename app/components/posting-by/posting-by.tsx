import React from 'react'
import { Dimensions, ImageStyle, TextStyle, View, ViewStyle, Text, Image, TouchableOpacity } from 'react-native'
import { PostingByProps } from './posting-by.props'
import { color, spacing } from '../../theme';
import { Icon } from '../icon/icon';

const PADDING_LEFT = { paddingLeft: spacing[1] }
const PADDING_RIGHT = { paddingRight: spacing[1] }

const FILL: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
}
const ACCOUNT_VIEW: ViewStyle = {
  flexDirection: 'column'
}
const ACCOUNT_DETAIL: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
}
const LOGO_ROOT: ViewStyle = {
  flexDirection: 'row',
  ...PADDING_LEFT
}
const LOGO: ImageStyle = {
  width: 40,
  height: 40,
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
}
const TEXT_RATING: TextStyle = {
  ...PADDING_RIGHT,
  color: color.primary,
  fontSize: 12
}
const SMALL_ICON: ImageStyle = {
  width: 18,
  height: 18,
}
const STAR: ImageStyle = {
  width: 13,
  height: 13,
}

export function PostingBy(props: PostingByProps) {
  const {
    postBy,
    isVerified,
    isCrown,
    rating,
    ratingCount,
    logo,
    onToggle
  } = props

  const onPress = onToggle ? () => onToggle && onToggle() : null

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <View style={FILL}>
        <View style={ACCOUNT_VIEW}>
          <View style={ACCOUNT_DETAIL}>
            <Text style={{ ...PADDING_RIGHT }}>{postBy}</Text>
            <Icon icon={isVerified ? "checkActive" : "checkInactive"} style={SMALL_ICON} containerStyle={{ ...PADDING_RIGHT }} />
            {isCrown && <Icon icon="crown" style={SMALL_ICON} containerStyle={{ ...PADDING_RIGHT }} />}
          </View>
          <View style={ACCOUNT_DETAIL}>
            <Icon icon="star" style={STAR} containerStyle={{ ...PADDING_RIGHT }} />
            <Text style={TEXT_RATING}>{rating || '0.0'}</Text>
            <Text style={TEXT_RATING}>({ratingCount || '0'})</Text>
          </View>
        </View>
        <View style={LOGO_ROOT}>
          <Image source={{ uri: logo }} style={LOGO} resizeMode={'contain'} />
        </View>
      </View>
    </TouchableOpacity>
  )
}