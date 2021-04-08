import React from 'react'
import { Dimensions, ImageStyle, TextStyle, View, ViewStyle, Image, TouchableOpacity, ImageProps } from 'react-native'
import { PostingByProps } from './posting-by.props'
import { color, spacing } from '../../theme';
import { Icon } from '../icon/icon';
import { Text } from '../text/text';
import { translate } from '../../i18n';

const PADDING_LEFT = { paddingLeft: spacing[1] }
const PADDING_RIGHT = { paddingRight: spacing[1] }

const FILL: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
}
const ACCOUNT_VIEW: ViewStyle = {
  flex: 1,
  flexDirection: 'column'
}
const ACCOUNT_DETAIL: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center'
}
const LOGO_ROOT: ViewStyle = {
  // flexDirection: 'row',
  width: 40, height: 40,
  ...PADDING_LEFT
}
const LOGO: ImageStyle = {
  width: 40,
  height: 40,
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
  backgroundColor: color.disable,
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
    image,
    onToggle
  } = props

  const onPress = onToggle ? () => onToggle && onToggle() : null
  const imageProps: ImageProps = typeof image === 'string' ? {
    style: LOGO,
    resizeMode: 'contain',
    source: {
      uri: image
    }
  } : {
    style: LOGO,
    resizeMode: 'contain',
    ...image
  }

  const postByName: string = postBy ? postBy : translate('common.anonymous')

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1} style={{ flex: 1 }}>
      <View style={FILL}>
        <View style={ACCOUNT_VIEW}>
          <View style={ACCOUNT_DETAIL}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ ...PADDING_RIGHT, flex: 1, textAlign: 'right' }} text={postByName} />
            <Icon icon={isVerified ? "checkActive" : "checkInactive"} style={SMALL_ICON} containerStyle={{ ...PADDING_RIGHT }} />
            {isCrown && <Icon icon="crown" style={SMALL_ICON} containerStyle={{ ...PADDING_RIGHT }} />}
          </View>
          <View style={ACCOUNT_DETAIL}>
            <Icon icon="star" style={STAR} containerStyle={{ ...PADDING_RIGHT }} />
            <Text style={TEXT_RATING} text={rating || '0.0'} />
            <Text style={TEXT_RATING} text={`(${ratingCount || '0'})`} />
          </View>
        </View>
        <View style={LOGO_ROOT}>
          {image ? <Image {...imageProps} /> : <View style={{ ...LOGO, backgroundColor: color.disable }} />}
        </View>
      </View>
    </TouchableOpacity>
  )
}
