import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
  ScrollView,
  TextStyle,
  View,
  ViewStyle, Platform, Linking, Alert, FlatList
} from "react-native"
import { Button, HeaderCenter, ModalLoading, Text, PostingBy, ModalAlert, Icon, } from "../../components"
import { translate } from "../../i18n"
import { color, images as imageComponent, spacing } from "../../theme"
import { useNavigation, useRoute } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { GetTruckType } from "../../utils/get-truck-type"
import { MapTruckImageName } from "../../utils/map-truck-image-name"
import ImageView from 'react-native-image-view';
import i18n from 'i18n-js'
import { GetRegion } from "../../utils/get-region"
import CallDetectorManager from 'react-native-call-detection'
import { useStores } from "../../models/root-store/root-store-context";
import UserTruckStore from '../../store/user-truck-store/user-truck-store'
import ProfileStore from '../../store/profile-store/profile-store'
import FavoriteTruckStore from "../../store/shipper-truck-store/favorite-truck-store"
import UserJobStore from "../../store/user-job-store/user-job-store"
import BookingStore from "../../store/booking-store/booking-store"
import TruckDetailStore from "../../store/free-store/truck-detail-store"
import LottieView from 'lottie-react-native';
import ShippersHistoryCallStore from '../../store/shippers-history-call-store/shippers-history-call-store'

interface ImageInfo {
  width: number
  height: number
  title: string
  source?: ImageSourcePropType
  object?: any
}

interface TruckDetailProps {
  truckID?: string
  truckData?: any
  headerName?: string
  profile?: any
  isBooker?: boolean
  statusScreen?: number
  bookerId?: string
}

const deviceWidht = Dimensions.get("window").width
const deviceHeight = Dimensions.get('window').height

const BOTTOM_ROOT: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing[3],
  borderTopWidth: 0.5,
  borderTopColor: color.line,
}
const CONTAINER: ViewStyle = {
  flex: 1,
}
const COLUMN: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite,
  marginBottom: spacing[1],
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[4],
  position: 'relative',
}
const CALL_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
}
const ROW: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}
const TOPIC: TextStyle = {
  marginBottom: spacing[3],
}
const IMAGES: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
}
const IMAGE: ImageStyle = {
  height: "100%",
  width: deviceWidht / 2 - spacing[5],
  resizeMode: "cover",
  aspectRatio: 4 / 2,
  margin: spacing[1],
  borderRadius: 4,
  backgroundColor: color.line,
}
const TOUCHABLE: ViewStyle = {
  flex: 1,
  flexDirection: 'row'
}
const ICON_BOX: ViewStyle = {
  paddingTop: spacing[2]
}
const DETAIL_BOX: ViewStyle = {
  paddingHorizontal: spacing[3]
}
const TEXT: TextStyle = {
  paddingVertical: spacing[2]
}
const BACKGROUND_CONTAINER: ViewStyle = {
  width: 230,
  height: 200,
  position: 'absolute',
  overflow: 'hidden',
  right: 0,
  bottom: 0,
}
const BACKGROUND: ImageStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  right: -100,
  opacity: 0.3
}
const BTN_STYLE: ViewStyle = {
  flex: 1,
  borderRadius: Dimensions.get('window').width / 2,
  marginHorizontal: spacing[3]
}
const SPACE_BOTTOM: ViewStyle = {
  marginBottom: spacing[1]
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
const SECTION: ViewStyle = {
  padding: spacing[4],
  backgroundColor: color.backgroundWhite,
  ...SPACE_BOTTOM
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

const initialState = {
  openViewer: false,
  indexOfImage: 0,
  liked: false,
}

let callDetector = undefined

const CheckMark = (data) => (<LottieView
  source={require('../../AnimationJson/check-mark.json')}
  style={{ height: 100, width: 100, }}
  autoPlay={data.autoPlay}
  loop={false}
  speed={0.7}
  onAnimationFinish={data.onAnimationFinish()}
/>)

const RenderButtonAlert = ({ onCloseModal, onConfirmJob }) => {

  const btnCancleStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.mainGrey, backgroundColor: color.transparent }
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

const Truck = ({ truckType, total }) => {
  const truckTypeName = GetTruckType(+truckType)?.name || translate('common.notSpecified')
  const truckImage = MapTruckImageName(+truckType)

  return (<View style={{ ...ROW, paddingHorizontal: spacing[2], paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: color.mainGrey }}>
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

const Verified = ({ isVerified }) => {
  const label = isVerified ? translate('shipperProfileScreen.verified') : translate('shipperProfileScreen.notVerified')
  const iconName = isVerified ? "checkActive" : "checkInactive"
  return (
    <View style={[ROW, { alignItems: 'center' }]}>
      <Text text={label} style={TEXT} />
      <Icon icon={iconName} style={SMALL_ICON} containerStyle={{ paddingLeft: spacing[1] }} />
    </View>
  )
}

const RenderImageAlert = () => (<Image source={imageComponent['workYellowIcon']} width={75} height={75} />)

export const TruckDetailWithProfile = observer(function TruckDetailWithProfile() {
  const navigation = useNavigation()

  const { tokenStore, versatileStore } = useStores()
  const route = useRoute()
  const { truckID, truckData, headerName = "truckDetailScreen.truckDetail",
    profile, bookerId }: TruckDetailProps = route?.params || {}

  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [isBokking, setIsBooking] = useState<boolean>(false)
  const [showMore, setShowMore] = useState<boolean>(false)
  const scrollRef = useRef<FlatList>(null);

  const [{ openViewer, indexOfImage, liked }, setState] = useState(initialState)

  useEffect(() => {
    if (truckID && !truckData) {
      TruckDetailStore.findOne(truckID)
    }
  }, [truckID, truckData])

  useEffect(() => {
    const imageSource = profile?.avatar?.object && profile?.avatar?.token ? {
      source: {
        uri: profile?.avatar?.object || '',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${profile?.avatar?.token || ''}`,
          adminAuth: profile?.avatar?.token
        },
      },
      resizeMode: 'cover'
    } : null
    TruckDetailStore.setProfile({ ...profile, imageProps: JSON.stringify(imageSource) })
  }, [profile])

  const {
    id,
    truckType,
    stallHeight,
    tipper,
    isLiked,
    truckPhotos,
    phoneNumber,
    workingZones,
  } = truckData || TruckDetailStore.data


  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: color.mainTheme },
      headerCenter: () => <HeaderCenter tx={headerName} />,
      headerRight: () => (<TouchableOpacity onPress={() => onSelectedHeart(id)}>
        <MaterialCommunityIcons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? color.red : color.line} />
      </TouchableOpacity>),
    })
    return () => { }
  }, [liked, id, navigation]);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      liked: isLiked,
    }))
  }, [isLiked])

  const onViewer = (index: number) => {
    setState(prevState => ({
      ...prevState,
      openViewer: true,
      indexOfImage: index,
    }))
  }

  const onCancel = () => {
    setState(prevState => ({
      ...prevState,
      openViewer: false
    }))
  }

  const startListenerTapped = (truckId: string) => {
    __DEV__ && console.log('startListenerTapped')
    callDetector = new CallDetectorManager((event, phoneNumber) => {
      __DEV__ && console.log('phoneNumber', phoneNumber)
      if (event === 'Disconnected') {
        __DEV__ && console.log('Disconnected')
        stopListenerTapped()
        ShippersHistoryCallStore.add({ truckId })
      } else if (event === 'Connected') { //  for iOS
        __DEV__ && console.log('Connected')
      } else if (event === 'Incoming') {
        __DEV__ && console.log('Incoming')
      } else if (event === 'Dialing') { //  for iOS
        __DEV__ && console.log('Dialing')
      } else if (event === 'Offhook') { // for Android
        __DEV__ && console.log('Offhook')
        // ShippersHistoryCallStore.add({ truckId })
      } else if (event === 'Missed') { // for Android
        __DEV__ && console.log('Missed')
      }
    },
      false,
      () => { },
      {
        title: 'Phone State Permission',
        message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
      }
    )
  }

  const stopListenerTapped = () => {
    callDetector && callDetector.dispose();
  }

  const onCall = (truckId: string, phone: string) => {
    const phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available')
          return false;
        } else {
          return startListenerTapped(truckId)
        }
      })
      .then(() => {
        return Linking.openURL(phoneNumber);
      })
  };

  const onSelectedHeart = (id: string) => {
    if (tokenStore?.token?.accessToken) {
      FavoriteTruckStore.keepLiked(id, !liked)
      FavoriteTruckStore.add(id)
      setState(prevState => ({
        ...prevState,
        liked: !prevState.liked,
      }))
    } else {
      navigation.navigate('signin')
    }
  }

  const confirmBookAJob = () => {
    setVisibleModal(true)
  }

  const cancelBookAJob = () => {
    BookingStore.approveBooking('shipper', 'reject', bookerId)
    navigation.navigate('myjob')
  }

  const onApproveJobBooking = () => {
    BookingStore.approveBooking('shipper', 'accept', bookerId)
  }

  const onConfirmJobSuccess = () => {
    onApproveJobBooking()
    setIsBooking(true)
  }

  const onCloseModal = () => {
    setVisibleModal(false)
  }

  const onAnimationFinish = () => {
    setIsBooking(false)
    onCloseModal()
    navigation.navigate('myjob')
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

  useEffect(() => {
    if (!versatileStore.list?.length) {
      versatileStore.find()
    }
    return () => {
      if (route.name === 'truckDetail') {
        TruckDetailStore.setDefaultOfData()
        TruckDetailStore.setDefaultOfProfile()
        TruckDetailStore.updateFavoriteInList(FavoriteTruckStore.id, FavoriteTruckStore.liked)
      }
    }
  }, [])

  let outImage: Array<any> = truckPhotos
  const transformImage = outImage &&
    Object.keys(outImage).length ?
    Object.entries(outImage).map(img => {
      let imageInfo: ImageInfo = {
        width: 1024,
        height: 720,
        title: `img-${img[0]}`
      }
      if (img[1] && img[1].object) {
        imageInfo.source = {
          uri: img[1].object,
          method: 'GET',
          headers: {
            Authorization: img[1].token,
            adminAuth: img[1].token
          }
        }
      } else {
        imageInfo.source = imageComponent['noImageAvailable']
      }
      return imageInfo
    }) : []
  const truckImage = MapTruckImageName(+truckType)

  const workingZoneStr = workingZones?.length ? workingZones.map(zone => {
    let reg = GetRegion(zone.region, i18n.locale)
    return reg?.label || ''
  }).join(', ') : translate('common.notSpecified')

  const profileReport = ProfileStore.data_report_profile

  const truckCountAll = profileReport?.trucks?.reduce((curr, next) => (curr + next.total), 0) || 0

  const showLessTruck = JSON.parse(JSON.stringify(profileReport))?.trucks?.splice(0, 4) || []

  const imageProps = {
    source: {
      uri: truckData?.owner?.avatar?.object,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${truckData?.owner?.avatar?.token || ''}`,
        adminAuth: truckData?.owner?.avatar?.token
      },
    },
    resizeMode: 'cover'
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

  return (
    <View style={CONTAINER}>
      {TruckDetailStore.loading && <ModalLoading size={'large'} color={color.primary} visible={TruckDetailStore.loading} />}
      <ScrollView onScroll={({ nativeEvent }) => { }} style={{}} scrollEventThrottle={400}>
        <View style={COLUMN}>
          <View style={ROW}>
            <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleImage")} preset={'topic'} />
          </View>
          <View style={ROW}>
            <View style={IMAGES}>
              {!!transformImage &&
                transformImage.map((image, index) => {
                  return (
                    <TouchableOpacity style={TOUCHABLE} key={index} onPress={() => {
                      if (image && image.source && image.source != 51)
                        onViewer(index)
                    }
                    }>
                      <Image style={IMAGE} source={image?.source ? image.source : imageComponent['noImageAvailable']} key={index} />
                    </TouchableOpacity>
                  )
                })}
              <ImageView
                images={transformImage}
                imageIndex={indexOfImage}
                isVisible={openViewer}
                onClose={onCancel}
                useNativeDriver={true}
              />
            </View>
          </View>
        </View>

        <View style={COLUMN}>
          <View style={ROW}>
            <Text style={[TOPIC, { color: color.primary }]} text={translate("truckDetailScreen.truckDetail")} preset={'topic'} />
          </View>

          <View style={ROW}>
            <View style={ICON_BOX}>
              <MaterialCommunityIcons name={'truck-outline'} size={24} color={color.primary} />
            </View>
            <View style={DETAIL_BOX}>
              <Text style={TEXT}>
                {translate('searchTruckScreen.workingZone') + ' : '}
                <Text style={{ fontFamily: 'Kanit-Bold' }} text={workingZoneStr} numberOfLines={1} />
              </Text>
              <Text style={TEXT}>
                {translate('common.vehicleTypeField') + ' : '}
                <Text style={{ fontFamily: 'Kanit-Bold' }} text={GetTruckType(+truckType)?.name || translate('common.notSpecified')} numberOfLines={1} />
              </Text>
              <Text style={TEXT}>
                {translate('vehicleDetailScreen.carHaveDum') + ' : '}
                <Text style={{ fontFamily: 'Kanit-Bold' }} text={tipper ? translate('common.have') : translate('common.notHave')} />
              </Text>
              <Text style={TEXT} >
                {translate('truckDetailScreen.heighttOfTheCarStall') + ' : '}
                <Text style={{ fontFamily: 'Kanit-Bold' }} text={stallHeight ? translate(`common.${stallHeight.toLowerCase()}`) : '-'} />
              </Text>
            </View>
          </View>

          <View style={BACKGROUND_CONTAINER}>
            <ImageBackground source={imageComponent[truckImage && truckImage !== 'greyMock' ? truckImage : '']} style={BACKGROUND} resizeMode={'contain'} />
          </View>

        </View>

        <View style={[COLUMN, { paddingHorizontal: 0 }]}>
          <View style={[ROW, { paddingHorizontal: spacing[4] }]}>
            <Text style={[TOPIC, { color: color.primary }]} tx={'profileScreen.profile'} preset={'topic'} />
          </View>

          <View style={[ROW, { paddingHorizontal: spacing[5], paddingVertical: spacing[3], ...SPACE_BOTTOM, alignItems: 'center' }]}>
            <View style={{ flex: 1 }} >
              <Image {...imageProps} style={PROFILE_IMAGE} resizeMode={'cover'} />
            </View>
            <View style={{ flex: 3 }}>
              <Text text={profile?.companyName} style={TEXT} preset={'topicExtra'} />
              <Verified isVerified={false} />
            </View>
            <View style={{}}>
              <TouchableOpacity style={{ backgroundColor: color.success, borderRadius: deviceHeight / 2 }} onPress={() => onCall(id, phoneNumber)} >
                <MaterialCommunityIcons name={'phone'} size={30} color={color.textBlack} style={{ margin: spacing[2] }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={SECTION}>
            <View style={[TOPIC, { flexDirection: 'row', justifyContent: 'space-between' }]}>
              <Text text={translate('profileScreen.allVehicle')} />
              <Text text={`${truckCountAll.toString()}  ${translate('jobDetailScreen.unit')}`} style={{ paddingRight: spacing[1] + 2 }} />
            </View>
            <View>
              {!showMore ? showLessTruck.map((vehicle, index) => {
                return <Truck key={index} {...vehicle} />
              }) : profileReport?.trucks?.map((vehicle, index) => {
                return <Truck key={index} {...vehicle} />
              })}
            </View>
            {profileReport?.trucks?.length > 4 && <TouchableOpacity style={SHOW_MORE} onPress={onToggle}>
              <Text text={showMore ? translate('shipperProfileScreen.showLess') : translate('shipperProfileScreen.showMore')} style={SHOW_MORE_TEXT} />
            </TouchableOpacity>}
          </View>
        </View>

      </ScrollView>

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

    </View>
  )
})

