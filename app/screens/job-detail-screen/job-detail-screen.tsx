import React from 'react'
import { observer } from 'mobx-react-lite'
import { Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Header, Icon, PostingBy, Text } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { color, spacing } from '../../theme'
import { translate } from '../../i18n'

const FONT_SIZE_SMALL = 15
const FONT_SIZE_LARGE = 25

const TEXT: TextStyle = { color: color.textBlack }
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = { backgroundColor: color.primary }
const TEXT_BOLD: TextStyle = { fontWeight: "bold" }
const PADDING_TOP = { paddingTop: spacing[1] }
const PADDING_BOTTOM = { paddingBottom: spacing[1] }
const PADDING_LEFT = { paddingLeft: spacing[1] }
const PADDING_RIGHT = { paddingRight: spacing[1] }
const MARGIN_BOTTOM = { marginBottom: spacing[2] }
const BACKGROUND_COLOR = { backgroundColor: color.backgroundWhite }
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundPrimary,
}
const TOP_ROOT: ViewStyle = {
  padding: spacing[4],
  ...BACKGROUND_COLOR,
  ...MARGIN_BOTTOM,
}
const IMAGE_ROOT: ViewStyle = {
  display: 'flex',
  alignItems: 'center',
}
const IMAGE: ImageStyle = {
  width: 120,
  height: 100,
  resizeMode: 'contain',
}
const PRODUCT_ROOT: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: spacing[4],
  ...BACKGROUND_COLOR,
  ...MARGIN_BOTTOM,
}
const COLUMN: ViewStyle = {
  flex: 1,
}
const ROW: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between'
}
const PRODUCT_ROW: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}
const TEXT_DETAIL: TextStyle = {
  padding: spacing[2]
}
const ONWER_ROOT: ViewStyle = {
  ...BACKGROUND_COLOR,
  paddingTop: spacing[3],
  paddingBottom: spacing[3],
  paddingLeft: spacing[4] + spacing[2],
  paddingRight: spacing[4] + spacing[2],
  display: 'flex',
  marginBottom: spacing[6]
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
  ...TEXT_BOLD,
  ...PADDING_LEFT
}
const TEXT_REVIEW: TextStyle = {
  fontSize: 12
}
const BOTTOM_ROOT: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  alignItems: 'center',
  padding: spacing[5]
}
const CALL_BUTTON: ViewStyle = {
  width: '100%',
  borderRadius: 6,
  backgroundColor: color.success,
}
const CALL_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
  ...TEXT_BOLD,
}

const DATA = {
  id: 9,
  fromText: 'ภาคกลาง',
  toText: 'ภาคกลาง',
  count: '2',
  packaging: 'อื่นๆ',
  detail: 'รถ 6 ล้อตู้คอก',
  viewDetail: true,
  postBy: 'Cargolink',
  isVerified: true,
  isLike: true,
  rating: '4.9',
  ratingCount: '122',
  isCrown: true,
  isRecommened: true,
  weigh: 20,
  logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
}

export const JobDetailScreen = observer(function JobDetailScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  const {
    fromText,
    toText,
    detail,
    packaging,
    count,
    postBy,
    isVerified,
    isCrown,
    rating,
    ratingCount,
    logo,
    weigh
  } = DATA

  const imageUrl = 'https://www.kindpng.com/picc/m/259-2598503_box-truck-png-faw-trucks-box-truck-png.png'

  return (
    <View style={CONTAINER}>

      <Header
        headerTx="searchJobScreen.searchJob"
        style={HEADER}
        titleStyle={HEADER_TITLE}
        headerText={"รายละเอียดงาน"}
        leftIconReal={true}
        leftIconName={"chevron-back"}
        leftIconSize={24}
        // rightIconReal={true}
        // rightIconName={"md-heart-outline"}
        // rightIconSize={24}
        rightIcon={'heartActive'}
        onLeftPress={goBack}
      />

      <ScrollView
        onScroll={({ nativeEvent }) => {
          console.log('nativeEvent :>> ', nativeEvent);
        }}
        style={{}}
        scrollEventThrottle={400}
      >
        <View style={TOP_ROOT}>
          <View style={IMAGE_ROOT}>
            <Image source={{ uri: imageUrl }} style={IMAGE} />
          </View>
          <View style={LOCATION}>
            <Icon icon="pinDropYellow" style={PIN_ICON} />
            <Text
              text={`${translate('common.from')} :`} // จาก
              style={LOCATION_TEXT}
            />
            <Text
              text={fromText}
              style={LOCATION_TEXT}
            />
          </View>
          <View style={LOCATION}>
            <Icon icon="pinDropGreen" style={PIN_ICON} />
            <Text
              text={`${translate('common.to')} :`} // ถึง
              style={LOCATION_TEXT}
            />
            <Text
              text={toText}
              style={LOCATION_TEXT}
            />
          </View>
        </View>
        <View style={PRODUCT_ROOT}>
          <View style={PRODUCT_ROW}>
            <Text
              style={{ ...TEXT_DETAIL, color: color.primary }}
              text={translate('jobDetailScreen.productDetail')} // ข้อมูลสินค้า
            />
          </View>
          <View style={PRODUCT_ROW}>
            <View style={COLUMN}>
              <Text
                style={TEXT_DETAIL}
                text={`${translate('jobDetailScreen.truckCount')} : ${count}`} // จำนวนรถบรรทุก
              />
              <Text
                style={TEXT_DETAIL}
                text={`${translate('jobDetailScreen.weightTon')} : ${weigh}`} // น้ำหนัก (ตัน)
              />
            </View>
            <View style={COLUMN}>
              <Text
                style={TEXT_DETAIL}
                text={`${translate('jobDetailScreen.packaging')} : ${packaging}`}
              />
              <Text style={TEXT_DETAIL} text={detail} />
            </View>
          </View>
        </View>
        <View style={ONWER_ROOT}>
          <View style={ROW}>
            <Text style={{ color: color.disable }}>โพสโดย</Text>
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
      </ScrollView>

      <View style={BOTTOM_ROOT}>
        <Button
          testID="call-with-owner"
          style={CALL_BUTTON}
          textStyle={CALL_TEXT}
          text={translate('jobDetailScreen.call')} // โทรติดต่อ
          onPress={() => navigation.navigate("acceptPolicy")}
        />
      </View>
    </View>
  )
})