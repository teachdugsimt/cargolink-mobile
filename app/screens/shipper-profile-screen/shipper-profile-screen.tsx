import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, FlatList, Image, ImageProps, ImageStyle, RefreshControl, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Button, EmptyListMessage, Icon, ModalAlert, ModalLoading, RatingStart, SearchItemTruck, Text } from '../../components'
import { translate } from '../../i18n'
import { spacing, images as imageComponent, color, images } from '../../theme'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabBarNavigation } from './tab-bar-navigation'
import { useNavigation, useRoute } from '@react-navigation/native'
import LottieView from 'lottie-react-native';
import ProfileStore from '../../store/profile-store/profile-store'
import UserTruckStore from '../../store//user-truck-store/user-truck-store'
import ShipperTruckStore from '../../store/shipper-truck-store/shipper-truck-store'
import BookingStore from '../../store/booking-store/booking-store'
import { GetTruckType } from "../../utils/get-truck-type"
import { MapTruckImageName } from '../../utils/map-truck-image-name'
import FavoriteTruckStore from '../../store/shipper-truck-store/favorite-truck-store'
import { useStores } from '../../models'
import { GetRegion } from '../../utils/get-region'
import i18n from 'i18n-js'

interface ShipperTruckProps {
  isBooker?: boolean
  bookingId?: any
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
  backgroundColor: color.disable,
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
  flexDirection: 'row',
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
const SHOW_MORE: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: spacing[4],
}
const SHOW_MORE_TEXT: TextStyle = {
  color: color.primary,
  textDecorationLine: 'underline',
}

const STAR = [
  {
    show: 5,
    count: 0
  },
  {
    show: 4,
    count: 0
  },
  {
    show: 3,
    count: 0
  },
  {
    show: 2,
    count: 0
  },
  {
    show: 1,
    count: 0
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

const Truck = ({ truckType, total }) => {
  const truckTypeName = GetTruckType(+truckType)?.name || translate('common.notSpecified')
  const truckImage = MapTruckImageName(+truckType)

  return (<View style={{ ...ROW, paddingHorizontal: spacing[2], paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: color.disable }}>
    <View style={{ flex: 2 }}>
      <View style={OUTER_CIRCLE}>
        <Image source={imageComponent[truckImage && truckImage !== 'greyMock' ? truckImage : '']} style={TRUCK_IMAGE} />
      </View>
    </View>
    <View style={{ flex: 5 }}>
      <Text text={truckTypeName} />
    </View>
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <Text text={total} />
    </View>
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <Text tx={'jobDetailScreen.unit'} />
    </View>
  </View>)
}

const Rating = ({ show, count }) => (
  <View style={RATING_CONTAINER}>
    <View style={START_CONTAINER}>
      <RatingStart size={16} space={1} colorInActive={color.disable} colorActive={color.primary} indexActive={show} isHorizontal disabled />
    </View>
    <View style={RATING_BAR_CONTAINER}>
      <View style={{ flex: 1, width: '0%', backgroundColor: color.primary, borderRadius: 3 }} />
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

const JobItem = (data) => {
  const {
    id,
    truckType,
    stallHeight,
    tipper,
    isLiked,
    owner,
    workingZones,
  } = data

  const { tokenStore } = useStores()

  const navigation = useNavigation()

  const onPress = () => {
    const imageSource = owner?.avatar?.object && owner?.avatar?.token ? {
      source: {
        uri: owner?.avatar?.object || '',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${owner?.avatar?.token || ''}`,
          adminAuth: owner?.avatar?.token
        },
      },
      resizeMode: 'cover'
    } : null
    ShipperTruckStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })
    ShipperTruckStore.findOne(id)
    navigation.navigate('truckDetailOwner')
  }

  const onToggleHeart = (data) => { // id, isLike
    if (tokenStore?.token?.accessToken) {
      FavoriteTruckStore.add(data.id)
      ShipperTruckStore.updateFavoriteInList(data.id, data.isLike)
    } else {
      navigation.navigate('signin')
    }
  }

  const renderContent = () => (<View style={{ paddingLeft: spacing[2] }}>
    <View style={{ paddingVertical: spacing[1] }}>
      <Text text={`${translate('truckDetailScreen.heighttOfTheCarStall')} : ${stallHeight ? translate(`common.${stallHeight.toLowerCase()}`) : '-'}`} />
    </View>
    <View style={{ paddingVertical: spacing[1] }}>
      <Text text={`${tipper ? translate('truckDetailScreen.haveDump') : translate('truckDetailScreen.haveNotDump')}`} />
    </View>
  </View>)

  const workingZoneStr = workingZones?.length ? workingZones.map(zone => {
    let reg = GetRegion(zone.region, i18n.locale)
    return reg?.label || ''
  }).join(', ') : translate('common.notSpecified')

  const truckImage = MapTruckImageName(+truckType)

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItemTruck
        {
        ...{
          id,
          fromText: workingZoneStr,
          customContent: renderContent,
          truckType: `${translate('common.vehicleTypeField')} : ${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`,
          postBy: owner?.companyName || '',
          isVerified: false,
          isLike: isLiked,
          backgroundImage: imageComponent[truckImage && truckImage !== 'greyMock' ? truckImage : ''],
          isCrown: false,
          bottomComponent: () => <></>,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress,
          onToggleHeart
        }
        }
      />
    </View>
  )
}

const Item = () => {

  const [isActive, setIsActive] = useState<number>(0)

  return (
    <View>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={[SECTION, {
            alignItems: 'center',
            borderBottomWidth: 3,
            borderBottomColor: isActive === 0 ? color.dim : color.transparent,
            flex: 1,
          }]}
          onPress={() => setIsActive(0)}>
          <Text tx={'shipperProfileScreen.workInProgress'} preset={'topic'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[SECTION, {
            alignItems: 'center',
            borderBottomWidth: 3,
            borderBottomColor: isActive === 1 ? color.dim : color.transparent,
            flex: 1,
          }]}
          onPress={() => setIsActive(1)}>
          <Text tx={'shipperProfileScreen.pastWork'} preset={'topic'} />
        </TouchableOpacity>
      </View>

      {isActive === 0 && <FlatList
        data={UserTruckStore.list || []}
        renderItem={({ item }) => {
          return <JobItem {...item} />
        }}
        keyExtractor={item => item.id.toString()}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={<EmptyListMessage containerStyle={{ top: 0 }} />}
        onEndReached={() => console.log('onScrollList isActive = 0')}
      />}

      {isActive === 1 && <FlatList
        data={UserTruckStore.list || []}
        renderItem={({ item }) => {
          return <JobItem {...item} />
        }}
        keyExtractor={item => item.id.toString()}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={<EmptyListMessage containerStyle={{ top: 0 }} />}
        onEndReached={() => console.log('onScrollList isActive = 1')}
      />}

    </View>
  )
}

let PAGE = 0

export const ShipperProfileScreen = observer(function ShipperProfileScreen() {
  const navigation = useNavigation()

  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [isBokking, setIsBooking] = useState<boolean>(false)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)
  const [showMore, setShowMore] = useState<boolean>(false)
  const scrollRef = useRef<FlatList>(null);

  const route = useRoute()

  const { isBooker, bookingId }: ShipperTruckProps = route?.params || {}

  useEffect(() => {
    return () => {
      ProfileStore.clearAllData()
      UserTruckStore.clearList()
    }
  }, [])

  const confirmBookAJob = () => {
    setVisibleModal(true)
  }

  const cancelBookAJob = () => {
    BookingStore.approveBooking('shipper', 'reject', bookingId)
    navigation.goBack()
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
    onApproveJobBooking()
    setIsBooking(true)
  }

  const onScrollList = () => {
    if (!onEndReachedCalledDuringMomentum
      && UserTruckStore.list.length >= 10
      && !UserTruckStore.loading
    ) {
      PAGE += 1
      const filter = { userId: ShipperTruckStore.profile?.userId, page: PAGE }
      UserTruckStore.find(filter)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onToggle = () => {
    if (showMore) {
      scrollRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      })
    }
    setShowMore(!showMore)
  }

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

  const renderItem = ({ item }) => (<Item {...item} owner={ShipperTruckStore.profile} />)

  const imageProps = ShipperTruckStore.profile?.imageProps ? JSON.parse(ShipperTruckStore.profile.imageProps) : ''

  const profile = ProfileStore.data_report_profile
  const truckCountAll = profile?.trucks.reduce((curr, next) => (curr + next.total), 0) || 0

  const showLessTruck = JSON.parse(JSON.stringify(profile))?.trucks.splice(0, 4) || []

  const HeaderComponent = () => (<>
    <View style={SECTION}>
      <View style={TOPIC}>
        <Text text={translate('profileScreen.allVehicle')} />
        <Text text={`${truckCountAll.toString()}  ${translate('jobDetailScreen.unit')}`} style={{ paddingRight: spacing[1] + 2 }} />
      </View>
      <View>
        {!showMore ? showLessTruck.map((vehicle, index) => {
          return <Truck key={index} {...vehicle} />
        }) : profile?.trucks?.map((vehicle, index) => {
          return <Truck key={index} {...vehicle} />
        })}
      </View>
      {profile?.trucks?.length > 4 && <TouchableOpacity style={SHOW_MORE} onPress={onToggle}>
        <Text text={showMore ? translate('shipperProfileScreen.showLess') : translate('shipperProfileScreen.showMore')} style={SHOW_MORE_TEXT} />
      </TouchableOpacity>}
    </View>

    <View style={SECTION}>
      <View style={TOPIC}>
        <Text tx={'shipperProfileScreen.feedbackScore'} />
      </View>
      <View style={{ paddingLeft: spacing[2] }}>
        {STAR.map(val => <Rating key={val.show} {...val} />)}
      </View>
    </View>
  </>)

  const onApproveJobBooking = () => {
    console.log("on confirm booking approval :: ", isBooker, bookingId)
    BookingStore.approveBooking('shipper', 'accept', bookingId)
    // navigation.navigate('jobDetail')
  }


  return (
    <View style={CONTAINER}>

      {/* <ModalLoading size={'large'} color={color.primary} visible={ProfileStore.loading_report_profile} /> */}

      <View style={[ROW, { padding: spacing[5], ...SPACE_BOTTOM }]}>
        <View style={{ flex: 1 }} >
          <Image {...imageProps} style={PROFILE_IMAGE} resizeMode={'cover'} />
        </View>
        <View style={{ flex: 3 }}>
          <Text text={ShipperTruckStore.profile?.companyName || ''} style={TEXT} preset={'topicExtra'} />
          <Verified isVerified={false} />
        </View>
      </View>

      {/* <ScrollView
        onScroll={({ nativeEvent }) => {
        }}
        style={{}}
        scrollEventThrottle={400}
      >
        <View style={SECTION}>
          <View style={TOPIC}>
            <Text text={translate('profileScreen.allVehicle')} />
            <Text text={`${truckCountAll.toString()}  ${translate('jobDetailScreen.unit')}`} />
          </View>
          {profile?.trucks?.map((vehicle, index) => {
            return <Truck key={index} {...vehicle} />
          })}
        </View>

        <View style={SECTION}>
          <View style={TOPIC}>
            <Text tx={'shipperProfileScreen.feedbackScore'} />
          </View>
          <View>
            {STAR.map(val => <Star key={val.show} {...val} />)}
          </View>
        </View>

        <View style={{}}>
          <TabBarNavigation data={UserTruckStore.list} />
        </View>
      </ScrollView> */}

      {/* <FlatList
        ref={scrollRef}
        data={UserTruckStore.list || []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={onScrollList}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={<EmptyListMessage containerStyle={{ top: 0 }} />}
        ListHeaderComponent={HeaderComponent}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        refreshControl={
          <RefreshControl
            // refreshing={ShipperTruckStore.loading}
            refreshing={ProfileStore.loading_report_profile}
            onRefresh={() => console.log('onRefresh')}
          />
        }
      /> */}

      <FlatList
        ref={scrollRef}
        data={[{ id: Date.now().toString() }]}
        renderItem={renderItem}
        onEndReachedThreshold={0.1}
        keyExtractor={item => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={<EmptyListMessage containerStyle={{ top: 0 }} />}
        ListHeaderComponent={HeaderComponent}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={ProfileStore.loading_report_profile}
      //     onRefresh={() => console.log('onRefresh')}
      //   />
      // }
      />

      {isBooker && (<>
        <View style={BOTTOM_ROOT}>
          <Button
            testID="cancel"
            style={[BTN_STYLE, { backgroundColor: color.line }]}
            tx={'common.reject'}
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
