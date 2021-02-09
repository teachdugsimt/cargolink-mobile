import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Icon, ModalAlert, Text } from '../../components'
import { translate } from '../../i18n'
import { spacing, images as imageComponent, color, images } from '../../theme'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabBarNavigation } from './tab-bar-navigation'
import { useNavigation, useRoute } from '@react-navigation/native'
import LottieView from 'lottie-react-native';

interface ShipperProfileProps {
  isBooker?: boolean
}

const deviceWidht = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const SPACE_BOTTOM: ViewStyle = {
  marginBottom: spacing[1]
}
const CONTAINER: ViewStyle = {
  flex: 1,
}
const PROFILE: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: spacing[5]
}
const PROFILE_IMAGE: ImageStyle = {
  width: 70,
  height: 70,
  borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
}
const SMALL_ICON: ImageStyle = {
  width: 13,
  height: 13,
}
const ROW: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: color.backgroundWhite,
}
const TEXT: TextStyle = {
  paddingVertical: spacing[1],
}
const TRUCK_IMAGE: ImageStyle = {
  width: 55,
  height: 55,
  borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
  backgroundColor: color.disable,
}
const OUTER_CIRCLE: ViewStyle = {
  borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
  width: 58,
  height: 58,
  backgroundColor: color.primary,
  justifyContent: "center",
  alignItems: "center",
}
const RATING_CONTAINER: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing[1]
}
const START_CONTAINER: ViewStyle = {
  flex: 2,
  flexDirection: 'row'
}
const RATING_BAR_CONTAINER: ViewStyle = {
  flex: 4,
  backgroundColor: color.disable,
  height: 8,
  borderRadius: 3
}
const COUNT_CONTAINER: ViewStyle = {
  flex: 1,
  alignItems: 'center'
}
const TOPIC: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingBottom: spacing[2]
}
const SECTION: ViewStyle = {
  padding: spacing[4],
  backgroundColor: color.backgroundWhite,
  ...SPACE_BOTTOM
}
const BOTTOM_ROOT: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing[3],
  borderTopWidth: 0.5,
  borderTopColor: color.line,
}
const BTN_STYLE: ViewStyle = {
  flex: 1,
  borderRadius: Dimensions.get('window').width / 2,
  marginHorizontal: spacing[3]
}
const CALL_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
  paddingVertical: spacing[1]
}

const PROFILE_DATA = {
  name: 'Cargolink',
  isVerified: true,
  vehicles: [
    {
      id: 1,
      vehicleType: 'รถบรรทุกของเหลว 6 ล้อ',
      imageType: 'truck13',
      vehicleCount: 4,
    },
    {
      id: 2,
      vehicleType: 'รถกระบะ 4 ล้อคอกสูง',
      imageType: 'truck2',
      vehicleCount: 9,
    },
    {
      id: 3,
      vehicleType: 'รถกระบะห้องเย็น 4 ล้อตู้ทึบ',
      imageType: 'truck3',
      vehicleCount: 18,
    },
    {
      id: 4,
      vehicleType: 'รถพ่วงคอก 40 ฟุต',
      imageType: 'truck33',
      vehicleCount: 2,
    },
  ]
}

const STAR = [
  {
    show: 5,
    count: 34
  },
  {
    show: 4,
    count: 7
  },
  {
    show: 3,
    count: 2
  },
  {
    show: 2,
    count: 1
  },
  {
    show: 1,
    count: 0
  },
]

const DATA_JOB = [
  {
    id: 1,
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
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 2,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: false,
    isLike: false,
    rating: '1.9',
    ratingCount: '3',
    isCrown: false,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 3,
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
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 4,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.5',
    ratingCount: '69',
    isCrown: false,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 5,
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
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
]

const CheckMark = (data) => (<LottieView
  source={require('../../AnimationJson/check-mark.json')}
  style={{ height: 100, width: 100, }}
  autoPlay={data.autoPlay}
  loop={false}
  speed={0.7}
  onAnimationFinish={data.onAnimationFinish()}
/>)

const Verified = ({ isVerified }) => {
  const label = isVerified ? translate('shipperProfileScreen.verified') : translate('shipperProfileScreen.notVerified')
  const iconName = isVerified ? "checkActive" : "checkInactive"
  return (
    <View style={ROW}>
      <Text text={label} style={TEXT} />
      <Icon icon={iconName} style={SMALL_ICON} containerStyle={{ paddingLeft: spacing[1] }} />
    </View>
  )
}

const Truck = ({ id, vehicleType, vehicleCount, imageType }) => (
  <View style={{ ...ROW, paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: color.disable }}>
    <View style={{ flex: 2 }}>
      <View style={OUTER_CIRCLE}>
        <Image source={imageComponent[imageType ? imageType : "truck17"]} style={TRUCK_IMAGE} />
      </View>
    </View>
    <View style={{ flex: 5 }}>
      <Text text={vehicleType} />
    </View>
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <Text text={vehicleCount} />
    </View>
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <Text text={'คัน'} />
    </View>
  </View>
)

const Star = ({ show, count }) => (
  <View style={RATING_CONTAINER}>
    <View style={START_CONTAINER}>
      {Array(5).fill(show).map((_, index) => <MaterialCommunityIcons key={index} name={'star'} size={16} color={index < show ? color.primary : color.disable} style={{ paddingHorizontal: 2 }} />)}
    </View>
    <View style={RATING_BAR_CONTAINER}>
      <View style={{ flex: 1, width: '50%', backgroundColor: color.primary, borderRadius: 3 }} />
    </View>
    <View style={COUNT_CONTAINER}>
      <Text text={`(${count})`} style={{ color: count ? color.textBlack : color.disable }} />
    </View>
  </View>
)

const RenderButtonAlert = ({ onCloseModal, onConfirmJob }) => {

  const btnCancleStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.line, backgroundColor: color.transparent }
  const btnConfirmStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.primary, backgroundColor: color.primary }
  return (
    <View style={{ ...BOTTOM_ROOT, paddingVertical: spacing[2] }}>
      <Button
        testID="btn-cancel"
        style={btnCancleStyle}
        textStyle={{ ...CALL_TEXT, color: color.line }}
        text={translate("common.cancel")}
        onPress={() => onCloseModal()}
      />
      <Button
        testID="btn-ok"
        style={btnConfirmStyle}
        textStyle={{ ...CALL_TEXT, color: color.textWhite }}
        text={translate("common.confirm")}
        onPress={() => onConfirmJob()}
      />
    </View>
  )
}

const RenderImageAlert = () => (<Image source={images['workYellowIcon']} width={75} height={75} />)

export const ShipperProfileScreen = observer(function ShipperProfileScreen() {
  const navigation = useNavigation()

  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [isBokking, setIsBooking] = useState<boolean>(false)

  const route = useRoute()

  const { isBooker }: ShipperProfileProps = route?.params || {}

  const confirmBookAJob = () => {
    setVisibleModal(true)
  }

  const cancelBookAJob = () => {
    console.log('cancel')
  }

  const onCloseModal = () => {
    setVisibleModal(false)
  }

  const onAnimationFinish = () => {
    setIsBooking(false)
    onCloseModal()
    navigation.navigate('myjob')
  }

  const onConfirmJobSuccess = () => {
    setIsBooking(true)
  }

  const profileImage = 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg'

  const modalProps = {
    containerStyle: {
      paddingTop: spacing[5],
      paddingBottom: spacing[2]
    },
    imageComponent: !isBokking ? RenderImageAlert : () => CheckMark({ autoPlay: isBokking, onAnimationFinish: () => onAnimationFinish }),
    header: !isBokking ? translate('jobDetailScreen.confirmJob') : translate('jobDetailScreen.bookedSuccess'),
    headerStyle: {
      paddingTop: spacing[3],
      color: color.primary
    },
    content: translate('jobDetailScreen.callbackForOwner'),
    contentStyle: {
      paddingTop: spacing[1],
      paddingBottom: spacing[5],
      paddingHorizontal: spacing[7],
      color: color.line
    },
    buttonContainerStyle: !isBokking ? { width: '90%' } : {},
    buttonComponent: !isBokking ? () => <RenderButtonAlert onCloseModal={onCloseModal} onConfirmJob={onConfirmJobSuccess} /> : null,
    visible: visibleModal,
  }

  const vehicleCount = PROFILE_DATA.vehicles.reduce((prev, curr) => { return prev + curr.vehicleCount }, 0)

  return (
    <View style={CONTAINER}>
      <View style={[ROW, { padding: spacing[5], ...SPACE_BOTTOM }]}>
        <View style={{ flex: 1 }} >
          <Image source={{ uri: profileImage }} style={PROFILE_IMAGE} resizeMode={'contain'} />
        </View>
        <View style={{ flex: 3 }}>
          <Text text={PROFILE_DATA.name} style={TEXT} />
          <Verified isVerified={PROFILE_DATA.isVerified} />
        </View>
      </View>
      <ScrollView
        onScroll={({ nativeEvent }) => {
        }}
        style={{}}
        scrollEventThrottle={400}
      >
        <View style={SECTION}>
          <View style={TOPIC}>
            <Text text={translate('profileScreen.allVehicle')} />
            <Text text={`${vehicleCount.toString()}  คัน`} />
          </View>
          {PROFILE_DATA.vehicles.map((vehicle, index) => {
            return <Truck key={index} {...vehicle} />
          })}
        </View>

        <View style={SECTION}>
          <View style={TOPIC}>
            <Text text={'คะแนนความพึงพอใจ'} />
          </View>
          <View>
            {STAR.map(val => <Star key={val.show} {...val} />)}
          </View>
        </View>

        <View style={{}}>
          <TabBarNavigation data={DATA_JOB} />
        </View>
      </ScrollView>

      {isBooker && (<>
        <View style={BOTTOM_ROOT}>
          <Button
            testID="cancel"
            style={[BTN_STYLE, { backgroundColor: color.line }]}
            tx={'common.cancel'}
            textStyle={CALL_TEXT}
            onPress={cancelBookAJob}
          />
          <Button
            testID="confirm"
            style={[BTN_STYLE, { backgroundColor: color.primary }]}
            tx={'common.confirm'}
            textStyle={CALL_TEXT}
            onPress={confirmBookAJob}
          />
        </View>
        <ModalAlert {...modalProps} />
      </>)}
    </View>
  )
})
