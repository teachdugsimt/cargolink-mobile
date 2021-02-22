import React from 'react'
import { ImageStyle, View, ViewStyle, Image, ImageProps, Dimensions } from 'react-native';
import { ContactListProps } from './contact-list.props';
import { color, spacing } from '../../theme';
import { Text } from "../text/text";

const FULL: ViewStyle = {
  flex: 1
}
const TOP: ViewStyle = {
  paddingVertical: spacing[2],
  flexDirection: 'row',
}
const BOTTOM: ViewStyle = {
  flexDirection: 'row',
}
const IMAGE_ROOT: ViewStyle = {
  // flex: 1,
}
const CENTER: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  paddingHorizontal: spacing[3],
  // backgroundColor: 'red',
  // height: 55
}
const IMAGE: ImageStyle = {
  width: 60,
  height: 60,
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
}
const RIGHT: ViewStyle = {
  marginLeft: 'auto',
  justifyContent: 'center',
}

export function ContactList(props: ContactListProps) {
  const {
    header,
    callTime,
    content,
    contentRight,
    footer,
    imageSource,
    containerStyle,
    imageStyle,
  } = props

  const mainStyle: ViewStyle = { ...FULL, ...containerStyle };
  const imgStyle: ImageStyle = { ...IMAGE, ...imageStyle }

  const imageProps: ImageProps = typeof imageSource === 'string' ? {
    style: imgStyle,
    resizeMode: 'contain',
    source: {
      uri: imageSource
    }
  } : {
      style: imgStyle,
      resizeMode: 'contain',
      ...imageSource
    }

  const renderContent = content ? content((comp) => comp) : null
  const renderContentRight = contentRight ? contentRight((comp) => comp) : null
  const renderFooter = footer ? footer((comp) => comp) : null

  return (
    <View style={mainStyle}>
      <View style={TOP}>
        <View style={IMAGE_ROOT}>
          {imageSource ? <Image {...imageProps} /> : <View style={{ ...imgStyle, backgroundColor: color.disable }} />}
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>

            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={CENTER}>
                <View>
                  {!!header && <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ width: '90%' }} text={header} preset={'topicExtra'} />}
                </View>
                <View>
                  {renderContent}
                </View>
              </View>

              <View style={RIGHT}>
                {renderContentRight}
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{
              textAlign: 'right', color: color.line, bottom: -spacing[1]
            }}
              preset={'fieldLabel'}>{callTime}</Text>
          </View>
        </View>
      </View>

      <View style={BOTTOM}>
        {renderFooter}
      </View>
    </View>
  )
}
