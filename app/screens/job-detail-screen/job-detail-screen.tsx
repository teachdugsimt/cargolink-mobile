import React, { useEffect, useLayoutEffect, useRef, useState, createRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, ScrollView, TextStyle, View, ViewStyle, TouchableOpacity, LayoutChangeEvent, Linking, Platform, Alert, Image, AppState, ImageStyle, ImageProps } from 'react-native'
import { BookerItem, Button, ModalAlert, ModalLoading, PostingBy, SearchItemTruck, Text } from '../../components'
import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from '@react-navigation/native'
import { color, spacing, images } from '../../theme'
import { translate } from '../../i18n'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import CarriersJobStore from '../../store/carriers-job-store/carriers-job-store'
import { Modalize } from 'react-native-modalize';
import MapView, {
  Polyline,
  Marker,
  Callout,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import TruckTypeStore from '../../store/truck-type-store/truck-type-store'
import FavoriteJobStore from '../../store/carriers-job-store/favorite-job-store'
import { useStores } from "../../models/root-store/root-store-context";
import { ConverTimeFormat } from "../../utils/convert-time-format";
import LottieView from 'lottie-react-native';
import CarriersHistoryCallStore from '../../store/carriers-history-call-store/carriers-history-call-store'
import CallDetectorManager from 'react-native-call-detection'
import UserJobStore from "../../store/user-job-store/user-job-store"
import ProfileStore from "../../store/profile-store/profile-store"
import { SearchByAddressTh, GetProvinceByEnArress } from "../../utils/search-province";
import i18n from 'i18n-js'
import BookingStore from '../../store/booking-store/booking-store'
import MyVehicleStore from '../../store/my-vehicle-store/my-vehicle-store'
import { GetRegion } from '../../utils/get-region'
import { MapTruckImageName } from '../../utils/map-truck-image-name'
import { GetTruckType } from '../../utils/get-truck-type'
import TruckDetailStore from '../../store/free-store/truck-detail-store'

interface JobDetailProps {
  booker?: Array<any>
  showOwnerAccount?: boolean
  fromManageCar?: boolean
  quotationsID?: string
  actionStatus?: string
  statusScreen?: number
  jobStatus?: number
}

const deviceWidht = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const PADDING_TOP = { paddingTop: spacing[1] }
const PADDING_BOTTOM = { paddingBottom: spacing[1] }
const PADDING_LEFT = { paddingLeft: spacing[1] }
const MARGIN_BOTTOM = { marginBottom: spacing[1] }
const BACKGROUND_COLOR = { backgroundColor: color.backgroundWhite }
const BOTTOM_LINE = {
  borderBottomColor: color.mainGrey,
  borderBottomWidth: 1,
}

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundPrimary,
}
const TOP_ROOT: ViewStyle = {
  ...BACKGROUND_COLOR,
  ...MARGIN_BOTTOM,
  padding: spacing[4],
  marginHorizontal: spacing[3],
  borderRadius: spacing[1],
  paddingVertical: spacing[2],
}
const MAP_CONTAINER: ViewStyle = {
  flex: 1,
  position: 'relative',
}
const LOCATION_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  position: 'relative',
}
const LOCATION_BOX: ViewStyle = {
  flex: 1,
  paddingRight: spacing[0]
}
const PRODUCT_ROOT: ViewStyle = {
  position: 'relative',
  flexDirection: 'column',
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[5],
  ...BACKGROUND_COLOR,
  ...MARGIN_BOTTOM,
  ...BOTTOM_LINE
}
const ICON_BOX: ViewStyle = {
  paddingTop: spacing[2]
}
const DETAIL_BOX: ViewStyle = {
  paddingHorizontal: spacing[3]
}
const ROW: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}
const PRODUCT_ROW: ViewStyle = {
  flexDirection: "row",
}
const ONWER_ROOT: ViewStyle = {
  ...BACKGROUND_COLOR,
  paddingTop: spacing[3],
  paddingBottom: spacing[3],
  paddingLeft: spacing[4] + spacing[2],
  paddingRight: spacing[4] + spacing[2],
  // marginBottom: spacing[6],
}
const TO_LOCATION: ViewStyle = {
  flexDirection: 'row',
  ...PADDING_TOP,
  ...PADDING_BOTTOM,
}
const LOCATION: ViewStyle = {
  flexDirection: "row",
  // alignItems: "center",
}
const LOCATION_TEXT: TextStyle = {
  paddingVertical: spacing[1],
  ...PADDING_LEFT
}
const TEXT_SMALL: TextStyle = {
  fontSize: 11
}
const BOTTOM_ROOT: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing[3],
  // borderTopWidth: 0.5,
  // borderTopColor: color.line,
}
const BTN_STYLE: ViewStyle = {
  flex: 1,
  borderRadius: deviceWidht / 2,
  marginHorizontal: spacing[3]
}
const CALL_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
}
const TEXT: TextStyle = {
  paddingVertical: spacing[2]
}
const SCROLL_VIEW: ViewStyle = {
  marginTop: spacing[5],
}
const CONTEXT_SMALL_CONTAINER: ViewStyle = {
  ...TOP_ROOT,
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: spacing[6],
}
const CONTENT_SMALL: ViewStyle = {
  height: 105,
  overflow: 'hidden',
  marginHorizontal: spacing[3],
  paddingBottom: spacing[2],
  paddingTop: spacing[1],
}
const FLOAT_CONTAINER: ViewStyle = {
  width: Math.floor(deviceWidht * (3 / 4)),
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  top: -18,
  left: '50%',
  transform: [{
    translateX: -Math.floor(deviceWidht / 3),
  }],
  height: 0,
  borderBottomWidth: 100,
  borderBottomColor: color.backgroundWhite,
  borderLeftWidth: 50,
  borderLeftColor: "transparent",
  borderRightWidth: 50,
  borderRightColor: "transparent",
  borderStyle: "solid",
}
const FLOAT_LINE: ViewStyle = {
  width: '35%',
  height: spacing[1] + 2,
  top: spacing[2],
  backgroundColor: color.disable,
  position: 'absolute',
  borderRadius: Math.floor(deviceHeight / 2)
}
const LINE: ViewStyle = {
  position: 'absolute',
  zIndex: -1,
  left: 15.5,
  borderLeftWidth: 1,
  borderLeftColor: color.disable,
}
const TOPIC: TextStyle = {
  color: color.primary,
  paddingBottom: spacing[2],
}
const LOGO_ROOT: ViewStyle = {
  width: 40,
  height: 40,
  // paddingLeft: spacing[4],
}
const LOGO: ImageStyle = {
  width: 40,
  height: 40,
  borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
}
const TRANSPORT_BY: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: spacing[2],
  marginLeft: spacing[4],
  marginRight: spacing[3],
}
const PHONE: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: spacing[2],
  padding: spacing[1],
  borderRadius: deviceWidht / 2,
  backgroundColor: color.line,
}
const BTN_VIEW_TRUCK: ViewStyle = {
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[1],
  backgroundColor: color.primary,
  borderRadius: 4,
}
const PRICE: ViewStyle = {
  position: 'absolute',
  right: 0,
  top: 0,
  backgroundColor: color.blue,
  borderTopLeftRadius: deviceWidht / 2,
  borderBottomLeftRadius: deviceWidht / 2,
  paddingVertical: spacing[1] + 2,
  paddingHorizontal: spacing[4],
  marginTop: spacing[3],
}
const PRICE_TEXT: TextStyle = {
  color: color.textWhite
}

const Dot = (data) => (<LottieView
  source={require('../../AnimationJson/dot.json')}
  style={{ height: 32, width: 32, backgroundColor: color.backgroundWhite }}
  colorFilters={[{ keypath: 'palette 01', color: data.color }, { keypath: 'palette 02', color: data.color }]}
  autoPlay
  loop
/>)

const SwipeUpArrows = (data) => (<LottieView
  source={require('../../AnimationJson/swipe-up-arrows.json')}
  style={{ height: 100, width: 100, }}
  colorFilters={[{ keypath: 'Path 1', color: data.color }, { keypath: 'Path 2', color: data.color }]}
  autoPlay
  loop={false}
  speed={0.8}
/>)

const CheckMark = (data) => (<LottieView
  source={require('../../AnimationJson/check-mark.json')}
  style={{ height: 100, width: 100, }}
  autoPlay={data.autoPlay}
  loop={false}
  speed={0.7}
  onAnimationFinish={data.onAnimationFinish()}
/>)

const dateFormat = (date: string) => date.replace(/-/g, '/')

const PickUpPoint = ({ to, from, distances, onPress, containerStyle = {}, statusScreen, onCall }) => {
  const [height, setHeight] = useState(0)

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setHeight(height)
  }

  // const onMove = onPress ? (lat: string, lng: string) => onPress(lat, lng) : null

  const fromProvinceName = SearchByAddressTh(from?.name)
  const province = CarriersJobStore.provinces ? JSON.parse(CarriersJobStore.provinces) : {}
  const fromProvinceHeader = fromProvinceName || GetProvinceByEnArress(province[`${from?.lat},${from?.lng}`]) || from?.name

  return (
    <View style={{ ...LOCATION_CONTAINER, ...containerStyle }} onLayout={(e) => onLayout(e)}>

      <View style={{ ...LINE, height }} />

      <View style={LOCATION_BOX}>
        <TouchableOpacity activeOpacity={1} style={{ ...LOCATION, paddingBottom: spacing[3] }} onPress={() => onPress ? onPress(from.lat, from.lng) : null}>
          <Dot color={color.primary} />
          <Text
            text={`${translate('common.from')}  :`}
            style={{ ...LOCATION_TEXT, width: i18n.locale === 'th' ? 50 : 48, justifyContent: 'flex-end' }}
          />
          <View style={{ flexShrink: 1 }}>
            <View style={{ width: '80%' }}>
              <Text text={fromProvinceHeader} style={LOCATION_TEXT} numberOfLines={1} />
            </View>
            <View>
              <View style={{ flex: 1 }}>
                <Text text={from && from.name} style={[LOCATION_TEXT, { color: color.line }]} />
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text text={`${translate('common.date')} :`} style={[LOCATION_TEXT, { color: color.line }]} />
                <Text text={from?.dateTime ? dateFormat(from.dateTime) : '-'} style={[LOCATION_TEXT, { color: color.line }]} />
              </View>
              {(statusScreen === 1 || statusScreen === 2) && <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text text={`${translate('jobDetailScreen.contact')} :`} style={[LOCATION_TEXT, { color: color.line }]} />
                <Text text={from?.contactName || '-'} style={[LOCATION_TEXT, { color: color.line }]} />
                <TouchableOpacity style={PHONE} onPress={() => onCall(from?.contactMobileNo)}>
                  <MaterialCommunityIcons name={'phone'} size={18} />
                </TouchableOpacity>
              </View>}
            </View>
          </View>
        </TouchableOpacity>
        {to?.length && to.map((attr, index) => {
          const latLng = `${attr.lat},${attr.lng}`
          const fromProvinceName = SearchByAddressTh(attr.name)
          const province = CarriersJobStore.provinces ? JSON.parse(CarriersJobStore.provinces) : {}
          const fromProvinceHeader = fromProvinceName || GetProvinceByEnArress(province[latLng]) || attr?.name
          const distance = JSON.parse(JSON.stringify(distances)).filter(dist => dist.to === latLng)[0]
          const distanceKM = distance ? (distance.distance / 1000).toFixed(2) : '0'
          const time = distance ? ConverTimeFormat(distance.duration * 1000, 'HHmm') : '0'
          return (
            <View key={index} style={TO_LOCATION}>
              <TouchableOpacity activeOpacity={1} style={{ ...LOCATION, flex: 3 }} onPress={() => onPress ? onPress(attr.lat, attr.lng) : null}>
                <Dot color={color.success} />
                <Text
                  text={`${translate('common.to')}  :`}
                  style={{ ...LOCATION_TEXT, width: i18n.locale === 'th' ? 50 : 48 }}
                />
                <View style={{ flexShrink: 1 }}>
                  <View>
                    <Text text={fromProvinceHeader} style={LOCATION_TEXT} numberOfLines={1} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text text={attr.name} style={[LOCATION_TEXT, { color: color.line }]} />
                  </View>
                  <View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <Text text={`${translate('common.date')} :`} style={[LOCATION_TEXT, { color: color.line }]} />
                      <Text text={attr?.dateTime ? dateFormat(attr.dateTime) : ''} style={[LOCATION_TEXT, { color: color.line }]} />
                    </View>
                    {(statusScreen === 1 || statusScreen === 2) && <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Text text={`${translate('jobDetailScreen.contact')} :`} style={[LOCATION_TEXT, { color: color.line }]} />
                      <Text text={attr?.contactName || '-'} style={[LOCATION_TEXT, { color: color.line }]} />
                      <TouchableOpacity style={PHONE} onPress={() => onCall(attr?.contactMobileNo)}>
                        <MaterialCommunityIcons name={'phone'} size={18} />
                      </TouchableOpacity>
                    </View>}
                  </View>
                </View>
              </TouchableOpacity>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ paddingVertical: spacing[1] }} >{distanceKM}<Text text={' KM'} style={TEXT_SMALL} /></Text>
                <Text text={time} style={{ ...TEXT_SMALL, paddingBottom: spacing[1], color: color.line }} />
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const PickUpPointSmall = ({ to, from, distances, containerStyle = {} }) => {
  const [height, setHeight] = useState(0)

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setHeight(height)
  }

  const fromProvinceName = SearchByAddressTh(from?.name || '')
  const province = CarriersJobStore.provinces ? JSON.parse(CarriersJobStore.provinces) : {}
  const fromProvinceHeader = fromProvinceName || GetProvinceByEnArress(province[`${from?.lat || ''},${from?.lng || ''}`]) || from?.name || ''

  const valueTo = to && to[0] ? to[0] : {}
  const latLng = `${valueTo ? valueTo?.lat : ''},${valueTo ? valueTo?.lng : ''}`
  const toProvinceName = SearchByAddressTh(valueTo?.name || '')
  const provinceTo = CarriersJobStore.provinces ? JSON.parse(CarriersJobStore.provinces) : {}
  const toProvinceHeader = toProvinceName || GetProvinceByEnArress(provinceTo[latLng]) || valueTo?.name || ''
  const distanceTo = JSON.parse(JSON.stringify(distances)).filter(dist => dist.to === latLng)[0]
  const distanceKM = distanceTo ? (distanceTo.distance / 1000).toFixed(2) : '0'
  const time = distanceTo ? ConverTimeFormat(distanceTo.duration * 1000, 'HHmm') : '0'

  return (
    <View style={{ ...LOCATION_CONTAINER, ...containerStyle }} onLayout={(e) => onLayout(e)}>

      <View style={{ ...LINE, height }} />

      <View style={LOCATION_BOX}>
        <View style={{ ...LOCATION, paddingBottom: spacing[3] }}>
          <Dot color={color.primary} />
          <Text
            text={`${translate('common.from')}  :`}
            style={{ ...LOCATION_TEXT, width: i18n.locale === 'th' ? 50 : 48, justifyContent: 'flex-end' }}
          />
          <View style={{ flexShrink: 1, flexDirection: 'row' }}>
            <Text text={fromProvinceHeader} style={[LOCATION_TEXT, { width: '80%' }]} numberOfLines={1} />
          </View>
        </View>

        <View style={TO_LOCATION}>
          <View style={{ ...LOCATION, flex: 3 }}>
            <Dot color={color.success} />
            <Text
              text={`${translate('common.to')}  :`}
              style={{ ...LOCATION_TEXT, width: i18n.locale === 'th' ? 50 : 48 }}
            />
            <View style={{ flexShrink: 1, flexDirection: 'row' }}>
              <Text text={toProvinceHeader} style={LOCATION_TEXT} numberOfLines={1} />
            </View>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ paddingVertical: spacing[1] }} >{distanceKM}<Text text={' KM'} style={TEXT_SMALL} /></Text>
            <Text text={time} style={{ ...TEXT_SMALL, paddingBottom: spacing[1], color: color.line }} />
          </View>
        </View>

      </View>
    </View>
  )
}

const RenderButtonAlert = ({ onConfirm, onCloseModal }) => {
  const btnCancleStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.mainGrey, backgroundColor: color.transparent }
  const btnConfirmStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.primary, backgroundColor: color.primary }
  return (
    <View style={{ ...BOTTOM_ROOT, paddingVertical: spacing[2] }}>
      <Button
        testID="btn-cancel"
        style={btnCancleStyle}
        textStyle={{ ...CALL_TEXT, color: color.line }}
        text={translate("common.cancel")}
        onPress={onCloseModal}
      />
      <Button
        testID="btn-ok"
        style={btnConfirmStyle}
        textStyle={{ ...CALL_TEXT, color: color.textWhite }}
        text={translate("common.confirm")}
        onPress={onConfirm}
      />
    </View>
  )
}

const TruckItem = (data) => {
  const {
    id,
    truckType,
    stallHeight,
    tipper,
    isLiked,
    owner,
    workingZones,
    requiredFooter = true,
    quotationId,
  } = data

  const [visible, setVisible] = useState<boolean>(false)
  const [isConfirm, setIsConfirm] = useState<boolean>(true)

  const navigation = useNavigation()

  const onPress = () => {
    navigation.navigate('truckDetailOnly', {
      truckData: data
    })
  }

  const openModal = (status: boolean) => {
    setIsConfirm(status)
    setVisible(true)
  }

  const onConfirm = (id: string) => {
    if (isConfirm) {
      BookingStore.approveBooking('carrier', 'accept', id)
    } else {
      BookingStore.approveBooking('carrier', 'reject', id)
    }
    setVisible(false)
    navigation.goBack()
  }

  const onCloseModal = () => {
    setVisible(false)
  }

  const renderContent = () => (<View style={{ paddingLeft: spacing[2] }}>
    <View style={{ paddingVertical: spacing[1] }}>
      <Text text={`${translate('truckDetailScreen.heighttOfTheCarStall')} : ${stallHeight ? translate(`common.${stallHeight.toLowerCase()}`) : '-'}`} />
    </View>
    <View style={{ paddingVertical: spacing[1] }}>
      <Text text={`${tipper ? translate('truckDetailScreen.haveDump') : translate('truckDetailScreen.haveNotDump')}`} />
    </View>
  </View>)

  const renderFooter = () => {
    return requiredFooter ? (<View style={{ flexDirection: 'row' }}>
      <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: spacing[3] }} onPress={() => openModal(true)}>
        <Text text={translate('common.confirm')} style={{ color: color.primary }} />
      </TouchableOpacity>
      <TouchableOpacity style={{ flex: 1, alignItems: 'center', paddingVertical: spacing[3], borderLeftColor: color.disable, borderLeftWidth: 1 }} onPress={() => openModal(false)}>
        <Text text={translate('common.reject')} style={{ color: color.line }} />
      </TouchableOpacity>
    </View>) : <></>
  }

  const workingZoneStr = workingZones?.length ? workingZones.map(zone => {
    let reg = GetRegion(zone.region, i18n.locale)
    return reg?.label || ''
  }).join(', ') : translate('common.notSpecified')

  const truckImage = MapTruckImageName(+truckType)
  const imageSource: ImageProps = owner?.avatar?.object && owner?.avatar?.token ? {
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

  const modalProps = {
    containerStyle: {
      paddingTop: spacing[5],
      paddingBottom: spacing[2]
    },
    // imageComponent: onAnimationFinish: () => onAnimationFinish }),
    header: isConfirm ? translate('myJobScreen.confirmJob') : translate('myJobScreen.cancelJob'),
    headerStyle: {
      paddingTop: spacing[3],
      color: color.primary
    },
    content: isConfirm ? translate('myJobScreen.confirmJob') : translate('myJobScreen.cancelJob'),
    contentStyle: {
      paddingTop: spacing[1],
      paddingBottom: spacing[5],
      paddingHorizontal: spacing[7],
      color: color.line
    },
    buttonContainerStyle: { width: '90%' },
    buttonComponent: () => <RenderButtonAlert onConfirm={() => onConfirm(quotationId)} onCloseModal={onCloseModal} />,
    visible: visible,
  }

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItemTruck
        {...{
          id,
          fromText: workingZoneStr,
          customContent: renderContent,
          truckType: `${translate('common.vehicleTypeField')} : ${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`,
          postBy: owner?.companyName || '',
          isVerified: false,
          isLike: isLiked,
          backgroundImage: images[truckImage && truckImage !== 'greyMock' ? truckImage : ''],
          isCrown: false,
          image: imageSource,
          showFavoriteIcon: false,
          bottomComponent: renderFooter,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress,
        }}
      />

      <ModalAlert {...modalProps} />

    </View>
  )
}

const RenderOwnerTruck = ({ truck }) => {
  const navigation = useNavigation()
  const route = useRoute()
  const {
    statusScreen
  }: JobDetailProps = route?.params || {}

  const openProfile = (id: string) => {
    const imageSource = truck?.owner?.avatar?.object && truck?.owner?.avatar?.token ? {
      source: {
        uri: truck?.owner?.avatar?.object || '',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${truck?.owner?.avatar?.token || ''}`,
          adminAuth: truck?.owner?.avatar?.token
        },
      },
      resizeMode: 'cover'
    } : null

    CarriersJobStore.setProfile({ ...truck.owner, imageProps: JSON.stringify(imageSource) })

    ProfileStore.getProfileReporter(id)
    UserJobStore.setUserId(id)
    // UserJobStore.find({
    //   userId: id,
    //   page: 0,
    //   type: 1,
    // })

    navigation.navigate('bookerProfile', { statusScreen })
  }

  const openTruckDetail = (data: any) => {
    navigation.navigate('truckDetailOnly', {
      truckData: data
    })
  }

  return (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing[2] }}>
    <TouchableOpacity
      activeOpacity={1}
      style={[LOGO_ROOT, { flexDirection: 'row', alignItems: 'center', }]}
      onPress={() => openProfile(truck?.owner?.userId)}
    >
      <View>
        <Image
          style={LOGO}
          source={{
            uri: truck?.owner?.avatar?.object || null,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${truck?.owner?.avatar?.token || null}`,
              adminAuth: truck?.owner?.avatar?.token || null
            },
          }}
          resizeMode={'cover'} />
      </View>
      <Text text={truck?.owner?.companyName || ''} style={{ paddingLeft: spacing[2] }} />
    </TouchableOpacity>
    <View>
      <TouchableOpacity activeOpacity={1} style={BTN_VIEW_TRUCK} onPress={() => openTruckDetail(truck)}>
        <Text tx={'jobDetailScreen.truckDetail'} />
      </TouchableOpacity>
    </View>
  </View>)
}

let callDetector = undefined

export const JobDetailScreen = observer(function JobDetailScreen() {

  const navigation = useNavigation()

  const modalizeRef = useRef<Modalize>(null);
  const [coordinates, setCoordinates] = useState([])
  const [liked, setLiked] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [isBokking, setIsBooking] = useState<boolean>(false)
  const [isCalling, setIsCalling] = useState<boolean>(false)
  const [region, setRegion] = useState(null)
  const [scrollY, setScrollY] = useState<number>(0)
  const [visibleModalReject, setvisibleModalReject] = useState<boolean>(false)
  const {
    id,
    from,
    to,
    productName,
    productTypeId,
    requiredTruckAmount,
    truckType,
    isLiked,
    weight,
    owner,
    quotations,
    truck,
    price,
    priceType = translate('common.round'),
  } = JSON.parse(JSON.stringify(CarriersJobStore.data))

  const route = useRoute()
  const mapRef = useRef(null)

  const {
    showOwnerAccount = true,
    booker = [],
    fromManageCar,
    quotationsID = '',
    actionStatus,
    statusScreen,
    jobStatus,
  }: JobDetailProps = route?.params || {}

  const { versatileStore, tokenStore } = useStores()

  // useEffect(() => {
  //   if (!TruckTypeStore.list?.length) {
  //     TruckTypeStore.find()
  //   }
  //   return () => {
  //     CarriersJobStore.setDefaultOfData()
  //     CarriersJobStore.updateFavoriteInList(FavoriteJobStore.id, FavoriteJobStore.liked)
  //   }
  // }, [])

  useEffect(() => {
    if (!TruckTypeStore.list?.length) {
      TruckTypeStore.find()
    }

    if (!showOwnerAccount) {
      modalizeRef.current?.open();
    }

    return () => {
      if (fromManageCar) {
        console.log("Unmount from manage car ::; ")
        if (BookingStore.data_approve_booking) {
          BookingStore.clearDataApproveBooking()
          MyVehicleStore.findOneRequest(quotationsID)
        }
      }
      if (route.name === 'jobDetail') {
        CarriersJobStore.setDefaultOfProfile()
        CarriersJobStore.setDefaultOfData()
        CarriersJobStore.updateFavoriteInList(FavoriteJobStore.id, FavoriteJobStore.liked)
      }
      // CarriersJobStore.setProfile({})
    }
  }, [])

  useLayoutEffect(() => {
    if (route.name === 'jobDetail') {
      navigation.setOptions({
        headerRight: () => (<TouchableOpacity onPress={() => onSelectedHeart(id)}>
          <MaterialCommunityIcons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? color.red : color.line} />
        </TouchableOpacity>),
      })
    }
    return () => { }
  }, [liked, id, navigation]);

  useEffect(() => {
    setLiked(isLiked)
  }, [isLiked])

  const [arrBooker, setarrBooker] = useState([])
  const _mappingBookerList = (bookerDetail) => {
    let tmp_detail = []
    bookerDetail.forEach((e: any, i: number) => {
      tmp_detail.push({
        id: e.id || '',
        // image: e.avatar?.object || '',
        // imageToken: e.avatar?.token || '',
        // name: e.companyName || e.fullName || '',
        image: e?.truck?.owner?.avatar?.object || '',
        imageToken: e?.truck?.owner?.avatar?.token || '',
        name: e?.truck?.owner?.companyName || e?.truck?.owner?.fullName || '',
        date: e.bookingDatetime || '',
        owner: e?.truck?.owner || null,
        truck: e.truck || {}
      })
    })
    setarrBooker(tmp_detail)
  }
  useEffect(() => {
    if (CarriersJobStore.data && CarriersJobStore.data.id) {
      if (CarriersJobStore.data.quotations && CarriersJobStore.data.quotations.length > 0) {
        _mappingBookerList(CarriersJobStore.data.quotations)
      }

      const coordinates = [CarriersJobStore.data.from, ...CarriersJobStore.data.to]
      setCoordinates(coordinates)
      CarriersJobStore.getDirections(coordinates)
      setRegion({
        latitude: +from.lat - 0.01,
        longitude: +from.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      })
    }
  }, [CarriersJobStore.loading, CarriersJobStore.data])

  const onSelectedHeart = (id: string) => {
    if (tokenStore?.token?.accessToken) {
      FavoriteJobStore.keepLiked(id, !liked)
      FavoriteJobStore.add(id)
      setLiked(!liked)
    } else {
      navigation.navigate('signin')
    }
  }

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

    CarriersJobStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })

    const userId = CarriersJobStore.profile.userId
    ProfileStore.getProfileReporter(userId)
    UserJobStore.setUserId(userId)
    // UserJobStore.find({
    //   userId: userId,
    //   page: 0,
    //   type: 1,
    // })
    modalizeRef.current?.close();
    if (route.name === 'jobDetail') {
      navigation.navigate('carrierProfile')
    } else if (route.name === 'favoriteJobDetail') {
      navigation.navigate('favoriteCarrierProfile')
    } else {
      navigation.navigate('bookerProfile', { statusScreen })
    }
  }

  const onOpenModalize = () => {
    modalizeRef.current?.open();
  };

  const confirmBookAJob = () => {
    // setVisibleModal(true)
    if (ProfileStore.data && tokenStore?.token?.accessToken) {
      navigation.navigate('myTruckList')
    } else {
      navigation.navigate('signin')
    }
  }

  const onCloseModal = () => {
    setVisibleModal(false)
  }
  const onCloseModal2 = () => {
    setvisibleModalReject(false)
  }

  const onConfirmJob = () => {
    BookingStore.approveBooking("carrier", 'accept', quotationsID)
    setIsBooking(true)
    // onCloseModal()
  }

  const onAnimationFinish = () => {
    setIsBooking(false)
    onCloseModal()
  }
  const onAnimationFinish2 = () => {
    setIsBooking(false)
    onCloseModal2()
  }

  const startListenerTapped = (jobId: string) => {
    __DEV__ && console.log('startListenerTapped')
    callDetector = new CallDetectorManager((event, phoneNumber) => {
      __DEV__ && console.log('phoneNumber', phoneNumber)
      if (event === 'Disconnected') {
        __DEV__ && console.log('Disconnected')
        stopListenerTapped()
        setIsCalling(false)
        CarriersHistoryCallStore.add({ jobId })
        // route.name === 'jobDetail' ? navigation.navigate('feedback') : navigation.navigate('myFeedback')
        // setTimeout(() => {
        //   setIsCalling(false)
        //   route.name === 'jobDetail' ? navigation.navigate('feedback') : navigation.navigate('myFeedback')
        // }, 800)
      } else if (event === 'Connected') { //  for iOS
        __DEV__ && console.log('Connected')
      } else if (event === 'Incoming') {
        __DEV__ && console.log('Incoming')
      } else if (event === 'Dialing') { //  for iOS
        __DEV__ && console.log('Dialing')
        setIsCalling(true)
      } else if (event === 'Offhook') { // for Android
        __DEV__ && console.log('Offhook')
        // CarriersHistoryCallStore.add({ jobId })
        setIsCalling(true)
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
    console.log('stopListenerTapped')
    callDetector && callDetector.dispose();
  }

  const onCall = (jobId: string, phone: string) => {
    if (phone && ProfileStore.data && tokenStore?.token?.accessToken) {
      const phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
      console.log('phoneNumber', phoneNumber)
      Linking.canOpenURL(phoneNumber)
        .then(supported => {
          if (!supported) {
            console.log('Phone number is not available');
            Alert.alert('Phone number is not available')
            return false;
          } else {
            return startListenerTapped(jobId)
          }
        })
        .then(() => {
          return Linking.openURL(phoneNumber);
        })
        .catch(err => console.log('err', err));
    } else if (!phone) {
      Alert.alert(translate('common.noPhoneNumber'))
    } else {
      navigation.navigate('signin')
    }
  };

  const changeRegion = (lat: string, lng: string) => {
    setRegion(prevState => ({
      ...prevState,
      latitude: (+lat) - 0.01,
      longitude: +lng,
    }))

    mapRef.current.animateToRegion({
      latitude: (+lat) - 0.01,
      longitude: +lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
    })

    modalizeRef.current?.close()
  }

  const visibleProfile = (truckOwner: any) => {
    const userId = truckOwner?.userId
    console.log("user id :: ", id)
    const imageUrl = truckOwner?.avatar?.object
    const imageToken = truckOwner?.avatar?.token
    const imageSource = imageUrl && imageToken ? {
      source: {
        uri: imageUrl,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${imageToken}`,
          adminAuth: imageToken
        },
      },
      resizeMode: 'cover'
    } : null

    CarriersJobStore.setProfile({ ...truckOwner, imageProps: JSON.stringify(imageSource) })

    ProfileStore.getProfileReporter(userId)
    UserJobStore.setUserId(userId)
    // UserJobStore.find({
    //   userId: userId,
    //   page: 0,
    //   type: 1
    // })
    navigation.navigate('bookerProfile', {
      isBooker: true,
      bookingId: id,
      statusScreen
    })
  }

  const openTruckDetail = (bookerId: string, truckData: any, ownerData: any) => {

    const imageSource = ownerData?.avatar?.object && ownerData?.avatar?.token ? {
      source: {
        uri: ownerData?.avatar?.object || '',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ownerData?.avatar?.token || ''}`,
          adminAuth: ownerData?.avatar?.token
        },
      },
      resizeMode: 'cover'
    } : null

    CarriersJobStore.setProfile({ ...ownerData, imageProps: JSON.stringify(imageSource) })
    const userId = CarriersJobStore.profile.userId
    ProfileStore.getProfileReporter(userId)
    UserJobStore.setUserId(userId)

    TruckDetailStore.setProfile(ownerData)
    navigation.navigate('truckDetailWithProfile', {
      bookerId,
      truckData: truckData,
      profile: ownerData,
    })
  }

  const onLayoutDetail = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    setScrollY(height)
  }

  const onRejectJob = () => {
    BookingStore.approveBooking("carrier", 'reject', quotationsID)
    setIsBooking(true)
  }

  const RenderButtonAlert = () => {
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

  const RenderButtonAlertReject = () => {
    const btnCancleStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.mainGrey, backgroundColor: color.transparent }
    const btnRejectStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.red, backgroundColor: color.red }
    return (
      <View style={{ ...BOTTOM_ROOT, paddingVertical: spacing[2] }}>
        <Button
          testID="btn-cancel"
          style={btnCancleStyle}
          textStyle={{ ...CALL_TEXT, color: color.line }}
          text={translate("common.cancel")}
          onPress={() => onCloseModal2()}
        />
        <Button
          testID="btn-ok"
          style={btnRejectStyle}
          textStyle={{ ...CALL_TEXT, color: color.textWhite }}
          text={translate("common.reject")}
          onPress={() => onRejectJob()}
        />
      </View>
    )
  }

  const RenderImageAlert = () => (<Image source={images['workYellowIcon']} width={75} height={75} />)

  const truckTypeList = versatileStore.list
  const txtTruckType = productTypeId && truckTypeList.length
    ? (truckTypeList.filter(({ id }) => id === +truckType)?.[0]?.name || translate('common.notSpecified'))
    : translate('common.notSpecified')

  const productTypeList = versatileStore.listProductType
  const productType = productTypeId && productTypeList.length
    ? (productTypeList.filter(({ id }) => id === +productTypeId)?.[0]?.name || translate('common.notSpecified'))
    : translate('common.notSpecified')

  const summaryDistances = ((CarriersJobStore.summaryDistances?.distance || 0) / 1000).toFixed(2)
  const summaryTime = ConverTimeFormat((CarriersJobStore.summaryDistances?.duration) * 1000, 'HHmm')

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
    buttonComponent: !isBokking ? RenderButtonAlert : null,
    visible: visibleModal,
  }

  const modalPropsReject = {
    containerStyle: {
      paddingTop: spacing[5],
      paddingBottom: spacing[2]
    },
    imageComponent: !isBokking ? RenderImageAlert : () => CheckMark({ autoPlay: isBokking, onAnimationFinish: () => onAnimationFinish2 }),
    header: !isBokking ? translate('jobDetailScreen.rejectConfirm') : translate('jobDetailScreen.rejectSuccess'),
    headerStyle: {
      paddingTop: spacing[3],
      color: color.primary
    },
    content: translate('jobDetailScreen.whenReject'),
    contentStyle: {
      paddingTop: spacing[1],
      paddingBottom: spacing[5],
      paddingHorizontal: spacing[7],
      color: color.line
    },
    buttonContainerStyle: !isBokking ? { width: '90%' } : {},
    buttonComponent: !isBokking ? RenderButtonAlertReject : null,
    visible: visibleModalReject,
  }

  console.log("Visible modal reject :: ", visibleModalReject)
  console.log("Bokking value :: ", isBokking)

  const ownerProfile = {
    id: id,
    postBy: owner?.companyName || '',
    rating: '0',
    ratingCount: '0',
    image: JSON.parse(CarriersJobStore.profile.imageProps) || {
      source: {
        uri: CarriersJobStore.data?.owner?.avatar?.object,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CarriersJobStore.data?.owner?.avatar?.token || ''}`,
          adminAuth: CarriersJobStore.data?.owner?.avatar?.token
        },
      },
      resizeMode: 'cover'
    },
  }

  const isLoaded = !!(CarriersJobStore.loading || CarriersJobStore.mapLoading)
  const ownerUserId = owner?.userId || ''
  const myUserId = ProfileStore.data?.userId || ''
  console.log("Job Detail data :: ", JSON.parse(JSON.stringify(CarriersJobStore.data)))
  console.log('route.name', route.name)
  console.log('actionStatus', actionStatus)
  return (
    <View style={CONTAINER}>
      {isLoaded && <ModalLoading size={'large'} color={color.primary} visible={isLoaded} />}
      <View style={MAP_CONTAINER}>
        {from && !!from.lat && !!from.lng && !!CarriersJobStore.directions.length &&
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            ref={mapRef}
          >
            {!!coordinates.length && coordinates.map((attr, index) => (
              <Marker
                key={`${index}-${!index ? 'yellow' : 'green'}`}
                coordinate={{ latitude: +attr.lat, longitude: +attr.lng }}
              >
                <MaterialIcons name={'location-pin'} color={!index ? color.primary : color.success} size={48} />
                <Callout style={{ width: deviceWidht - 80, padding: spacing[2] }}>
                  <Text text={attr.name} />
                </Callout>
              </Marker>
            ))}
            {JSON.parse(JSON.stringify(CarriersJobStore.directions)).map((attr, index) => {
              return (<Polyline key={index} coordinates={attr} strokeWidth={4} strokeColor={'red'} />)
            })}
          </MapView>
        }

        <View style={CONTEXT_SMALL_CONTAINER}>
          <TouchableOpacity activeOpacity={1} style={FLOAT_CONTAINER} onPress={onOpenModalize} onPressOut={onOpenModalize}>
            <View style={FLOAT_LINE} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={onOpenModalize} onPressOut={onOpenModalize} style={CONTENT_SMALL}>
            <PickUpPointSmall
              from={from}
              to={to}
              distances={CarriersJobStore.distances}
              containerStyle={{
                overflow: 'hidden'
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} style={PRICE} onPress={onOpenModalize} onPressOut={onOpenModalize}>
            <Text
              text={`${price ? price.toString() : '-'} ${'\u0E3F'} / ${priceType === 'PER_TRIP' ? translate('common.round') : translate('common.ton')}`}
              style={PRICE_TEXT} preset={'topicExtra'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ position: 'absolute', right: -spacing[5], top: -spacing[4] }} onPress={onOpenModalize} onPressOut={onOpenModalize}>
            <SwipeUpArrows color={color.disable} />
          </TouchableOpacity>

        </View>

      </View>

      <Modalize
        ref={modalizeRef}
        scrollViewProps={{
          showsVerticalScrollIndicator: true,
          // contentOffset: {
          //   x: 0,
          //   y: scrollY
          // }
        }}
        // snapPoint={!showOwnerAccount ? null : 300}
        // HeaderComponent={}
        modalStyle={{
          flex: 1,
          marginTop: spacing[5],
        }}
        withHandle={true}
      // tapGestureEnabled={true}
      >
        <View style={SCROLL_VIEW} onLayout={(e) => onLayoutDetail(e)}>

          <View style={TOP_ROOT}>
            <View>
              <Text tx={'jobDetailScreen.pickUpPoint'} style={{ ...TEXT_SMALL, color: color.line, }} />
            </View>
            <PickUpPoint
              from={from}
              to={to}
              containerStyle={{ paddingBottom: spacing[4] }}
              distances={CarriersJobStore.distances}
              onPress={(lat, lng) => changeRegion(lat, lng)}
              statusScreen={statusScreen}
              onCall={(contactMobileNo: string) => onCall(id, contactMobileNo)}
            />
            <View style={{ ...BOTTOM_LINE, ...LOCATION_BOX, flexDirection: 'row', paddingBottom: spacing[3] }}>
              <View style={{ ...LOCATION, flex: 3 }}>
                <Dot color={color.sky} />
                <Text text={`${translate('common.summary')}  :`} style={{ ...LOCATION_TEXT, justifyContent: 'flex-end' }} />
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ paddingVertical: spacing[1] }} >{summaryDistances}<Text text={' KM'} style={TEXT_SMALL} /></Text>
                <Text text={summaryTime} style={{ ...TEXT_SMALL, paddingBottom: spacing[1], color: color.line }} />
              </View>
            </View>
          </View>

          <View style={PRODUCT_ROOT}>
            <View>
              <Text tx={'jobDetailScreen.jobDetail'} preset={'topic'} style={TOPIC} />
            </View>
            <View style={PRODUCT_ROW}>
              <View style={ICON_BOX}>
                <MaterialCommunityIcons name={'truck-outline'} size={24} color={color.primary} />
              </View>
              <View style={DETAIL_BOX}>
                <Text text={`${translate('jobDetailScreen.truckType')} : ${txtTruckType}`} style={TEXT} />
                <Text text={`${translate('common.amount')} : ${requiredTruckAmount || '-'} ${translate('jobDetailScreen.unit')}`} style={TEXT} />
              </View>
            </View>
            <View style={PRODUCT_ROW}>
              <View style={ICON_BOX}>
                <SimpleLineIcons name={'social-dropbox'} size={24} color={color.primary} />
              </View>
              <View style={DETAIL_BOX}>
                <Text text={`${translate('jobDetailScreen.productType')} : ${productType}`} style={TEXT} />
                <Text text={`${translate('jobDetailScreen.productName')} : ${productName}`} style={TEXT} />
                <Text text={`${translate('jobDetailScreen.weightTon')} : ${weight}`} style={TEXT} />
              </View>
            </View>

            <View style={PRICE}>
              <Text
                text={`${price ? price.toString() : '-'} ${'\u0E3F'} / ${priceType === 'PER_TRIP' ? translate('common.round') : translate('common.ton')}`}
                style={PRICE_TEXT} preset={'topicExtra'}
              />
            </View>

          </View>

        </View>

        {/* {(showOwnerAccount || fromManageCar) && */}
        <View style={ONWER_ROOT}>
          <View style={ROW}>
            <Text style={{ color: color.line }}>{translate('jobDetailScreen.postBy')}</Text>
            <PostingBy {...ownerProfile} onToggle={() => onPress()} />
          </View>
        </View>
        {/* } */}

        {fromManageCar && !BookingStore.data_approve_booking && (<View style={BOTTOM_ROOT}>
          <Button
            testID="reject"
            style={[BTN_STYLE, { backgroundColor: color.disable }]}
            children={
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Text style={CALL_TEXT} tx={'common.reject'} />
              </View>
            }
            onPress={() => setvisibleModalReject(true)}
          />
          {ownerUserId !== myUserId && <Button
            testID="accept"
            style={[BTN_STYLE, { backgroundColor: color.success }]}
            children={
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Text style={CALL_TEXT} tx={'common.approve'} />
              </View>
            }
            onPress={() => setVisibleModal(true)}
          />}
        </View>)}

        {!showOwnerAccount
          && !fromManageCar
          && arrBooker.length > 0
          && actionStatus === 'IM_OWN_JOB_AND_HAVE_CAR_ASK_FOR_BOOKING'
          && <View style={ONWER_ROOT}>
            <Text tx={'myJobScreen.listOfBookingJob'} preset={'topic'} style={TOPIC} />
            {arrBooker.map((booker, index) => <BookerItem
              key={index}
              imageUrl={booker.image}
              tokenUrl={booker.imageToken}
              topic={booker.name}
              detail={booker.date}
              btnTxt={translate('myJobScreen.accept')}
              containerStyle={{ paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: color.mainGrey }}
              topicStyle={{ fontSize: 14, paddingBottom: spacing[1] }}
              detailStyle={{ color: color.line }}
              btnStyle={{ paddingVertical: 2, paddingHorizontal: spacing[2] }}
              btnTextStyle={{ fontSize: 12, paddingLeft: spacing[1] }}
              onToggle={() => openTruckDetail(booker?.id, booker?.truck, booker?.owner)}
            />)}
          </View>}

        {/* // (ฉันเป็นเจ้าของรถและมีงานมาขอจอง)
            slot.actionStatus = "IM_OWN_CAR_AND_HAVE_JOB_ASK_FOR_BOOKING"

          // (ฉันเป็นเจ้าของงานและมีคนมาขอจอง)
            slot.actionStatus = "IM_OWN_JOB_AND_HAVE_CAR_ASK_FOR_BOOKING"

          //  (ฉันเป็นเจ้าของรถและไปขอจองงานคนอื่น)
            slot.actionStatus = "IM_OWN_CAR_AND_ASK_FOR_BOOKING_HIM_JOB"

          (ฉันเป็นเจ้าของงาน ไม่มีใครมาขอจอง)
            slot.actionStatus = "IM_OWN_JOB"

          // (ฉันเป็นเจ้าของงานและไปขอจองรถ)
            slot.actionStatus = "IM_OWN_JOB_AND_ASK_FOR_BOOKING_HIM_CAR" */}


        {actionStatus === 'IM_OWN_JOB_AND_ASK_FOR_BOOKING_HIM_CAR' && (<View style={PRODUCT_ROOT}>
          <View>
            <Text tx={'myJobScreen.waitingForFeedbackFrom'} preset={'topic'} style={TOPIC} />
          </View>
          <View>
            {quotations?.map((item, index: number) => <RenderOwnerTruck key={index} {...item} />)}
          </View>
        </View>)}

        {/* render carrier profile and truck list */}
        {actionStatus === 'IM_OWN_CAR_AND_ASK_FOR_BOOKING_HIM_JOB' && (<View>
          {quotations?.map(({ truck, id }, index: number) => {
            if (myUserId === truck.owner?.userId) {
              return <TruckItem key={index} {...truck} quotationId={id} requiredFooter={false} />
            }
            return null
          })}
        </View>)}

        {actionStatus === 'IM_OWN_CAR_AND_HAVE_JOB_ASK_FOR_BOOKING' && (<View>
          {quotations?.map(({ truck, id }, index: number) => {
            if (myUserId === truck.owner?.userId) {
              return <TruckItem key={index} {...truck} quotationId={id} />
            }
            return null
          })}
        </View>)}

        {/* {actionStatus === 'IM_OWN_JOB' && (<View></View>)} */}

        {statusScreen === 1 && jobStatus !== 2 && truck && (<View>
          <View style={TRANSPORT_BY}>
            <View>
              <Text tx={'myJobScreen.transportBy'} style={{ color: color.line }} />
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={1} onPress={() => visibleProfile(truck?.owner)} >
              <Text text={truck?.owner?.companyName || ''} style={{ paddingRight: spacing[2] }} />
              <View style={LOGO_ROOT}>
                <Image
                  style={LOGO}
                  source={{
                    uri: truck?.owner?.avatar?.object || null,
                    method: 'GET',
                    headers: {
                      Authorization: `Bearer ${truck?.owner?.avatar?.token || null}`,
                      adminAuth: truck?.owner?.avatar?.token || null
                    },
                  }}
                  resizeMode={'cover'} />
              </View>
            </TouchableOpacity>
          </View>
          <TruckItem {...truck} requiredFooter={false} />
        </View>)}

        {/* render carrier profile and truck list */}
        {statusScreen === 2 && jobStatus !== 2 && truck && (<View>
          <View style={TRANSPORT_BY}>
            <View>
              <Text tx={'myJobScreen.transportBy'} style={{ color: color.line }} />
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} activeOpacity={1} onPress={() => visibleProfile(truck?.owner)} >
              <Text text={truck?.owner?.companyName || ''} style={{ paddingRight: spacing[2] }} />
              <View style={LOGO_ROOT}>
                <Image
                  style={LOGO}
                  source={{
                    uri: truck?.owner?.avatar?.object || null,
                    method: 'GET',
                    headers: {
                      Authorization: `Bearer ${truck?.owner?.avatar?.token || null}`,
                      adminAuth: truck?.owner?.avatar?.token || null
                    },
                  }}
                  resizeMode={'cover'} />
              </View>
            </TouchableOpacity>
          </View>
          <TruckItem {...truck} requiredFooter={false} />
        </View>)}

      </Modalize>

      {showOwnerAccount && (<View style={BOTTOM_ROOT}>
        <Button
          testID="call-with-owner"
          style={[BTN_STYLE, { backgroundColor: color.blue }]}
          children={
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <MaterialCommunityIcons name={'phone'} size={24} color={color.textWhite} style={{ paddingRight: spacing[2] }} />
              <Text style={CALL_TEXT} tx={'jobDetailScreen.call'} />
            </View>
          }
          onPress={() => onCall(id, owner.mobileNo)}
        />
        {ownerUserId !== myUserId && <Button
          testID="book-a-job"
          style={[BTN_STYLE, { backgroundColor: color.primary }]}
          children={
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <MaterialCommunityIcons name={'download-circle-outline'} size={24} color={color.textWhite} style={{ paddingRight: spacing[2] }} />
              <Text style={CALL_TEXT} tx={'common.bookAJob'} />
            </View>
          }
          onPress={confirmBookAJob}
        />}
      </View>)}

      <ModalAlert {...modalProps} />
      <ModalAlert {...modalPropsReject} />

    </View>
  )
})
