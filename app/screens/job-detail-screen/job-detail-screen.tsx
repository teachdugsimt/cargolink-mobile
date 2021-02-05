import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, ScrollView, TextStyle, View, ViewStyle, TouchableOpacity, LayoutChangeEvent, Linking, Platform, Alert, Image, AppState } from 'react-native'
import { BookerItem, Button, ModalAlert, ModalLoading, PostingBy, Text } from '../../components'
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

interface JobDetailProps {
  booker?: Array<any>
  showOwnerAccount?: boolean
}

const deviceWidht = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const PADDING_TOP = { paddingTop: spacing[1] }
const PADDING_BOTTOM = { paddingBottom: spacing[1] }
const PADDING_LEFT = { paddingLeft: spacing[1] }
const MARGIN_BOTTOM = { marginBottom: spacing[1] }
const BACKGROUND_COLOR = { backgroundColor: color.backgroundWhite }
const BOTTOM_LINE = {
  borderBottomColor: color.disable,
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
  marginBottom: spacing[6],
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
  borderRadius: Dimensions.get('window').width / 2,
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
const CONTENT_SMALL: ViewStyle = {
  ...TOP_ROOT,
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: spacing[6],
  height: 105,
  overflow: 'hidden',
  marginHorizontal: spacing[3],
  paddingVertical: spacing[4],
}
const FLOAT_CONTAINER: ViewStyle = {
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
const FLOAT_LINE: ViewStyle = {
  width: '15%',
  height: spacing[1] + 2,
  top: -spacing[2],
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

const DATA = { // [Mocking]
  id: 9,
  fromText: 'กรุงเทพมหานคร',
  toText: 'นครศรีธรรมราช',
  count: '2',
  packaging: 'อื่นๆ',
  truckType: 'รถ 6 ล้อตู้คอก',
  viewDetail: true,
  postBy: 'Cargolink',
  isVerified: false,
  isLike: true,
  rating: '0',
  ratingCount: '0',
  isCrown: false,
  isRecommened: true,
  weigh: 20,
  productType: 'สินค้าเกษตร',
  productName: 'ข้าวโพด',
  distance: '435.35',
  period: '3 ชั่วโมง 45 นาที',
  logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
}

// const distances = [{
//   "from": "13.7884902,100.6079443",
//   "to": "13.2773405,100.9410782",
//   "distance": 99623,
//   "duration": 4572
// }, {
//   "from": "13.2773405,100.9410782",
//   "to": "12.6004546,101.9276771",
//   "distance": 154882,
//   "duration": 8373
// }]

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

const PickUpPoint = ({ to, from, distances, containerStyle = {} }) => {
  const [height, setHeight] = useState(0)

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setHeight(height)
  }

  return (
    <View style={{ ...LOCATION_CONTAINER, ...containerStyle }} onLayout={(e) => onLayout(e)}>

      <View style={{ ...LINE, height }} />

      <View style={LOCATION_BOX}>
        <View style={{ ...LOCATION, paddingBottom: spacing[3] }}>
          <Dot color={color.primary} />
          <Text
            text={`${translate('common.from')}  :`}
            style={{ ...LOCATION_TEXT, width: 48, justifyContent: 'flex-end' }}
          />
          <Text
            text={from && from.name}
            style={{ ...LOCATION_TEXT, flexShrink: 1 }}
          />
        </View>
        {to?.length && to.map((attr, index) => {
          const latLng = `${attr.lat},${attr.lng}`
          const distance = JSON.parse(JSON.stringify(distances)).filter(dist => dist.to === latLng)[0]
          const distanceKM = distance ? (distance.distance / 1000).toFixed(2) : '0'
          const time = distance ? ConverTimeFormat(distance.duration * 1000, 'HHmm') : '0'
          return (
            <View key={index} style={TO_LOCATION}>
              <View style={{ ...LOCATION, flex: 3 }}>
                <Dot color={color.success} />
                <Text
                  text={`${translate('common.to')}  :`}
                  style={{ ...LOCATION_TEXT, width: 48 }}
                />
                <Text
                  text={attr.name}
                  style={{ ...LOCATION_TEXT, flexShrink: 1 }}
                />
              </View>
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

let callDetector = undefined

export const JobDetailScreen = observer(function JobDetailScreen() {

  const navigation = useNavigation()

  const modalizeRef = useRef<Modalize>(null);
  const [coordinates, setCoordinates] = useState([])
  const [liked, setLiked] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [isBokking, setIsBooking] = useState<boolean>(false)
  const [appState, setAppState] = useState(AppState.currentState)
  // const [callDetector, setCallDetector] = useState(null)
  const [isCalling, setIsCalling] = useState<boolean>(false)

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
  } = JSON.parse(JSON.stringify(CarriersJobStore.data))

  // const data = { "id": "K1NXGEQL", "productTypeId": 21, "productName": "รถยนต์", "truckType": "21", "weight": 200, "requiredTruckAmount": 2, "from": { "name": "กรุงเทพมหานคร", "dateTime": "28-01-2021 16:27", "contactName": "Onelink Space", "contactMobileNo": "0998999988", "lat": "13.7884902", "lng": "100.6079443" }, "to": [{ "name": "ชลบุรี", "dateTime": "29-01-2021 11:54", "contactName": "หมู่บ้านบางแสนวิลล์ ตำบล ห้วยกะปิ อำเภอเมืองชลบุรี ชลบุรี", "contactMobileNo": "0899388403", "lat": "13.2773405", "lng": "100.9410782" }, { "name": "จันทบุรี", "dateTime": "30-01-2021 18:14", "contactName": "ศูนย์ศึกษาธรรมชาติป่าชายเลนอ่าวคุ้งกระเบน", "contactMobileNo": "0990999811", "lat": "12.6004546", "lng": "101.9276771" }], "owner": { "id": 611, "companyName": "Fast Delivery", "fullName": "Fast Delivery", "mobileNo": "0926270468", "email": "mymail.example@mail.com" }, "isLiked": false }
  // const {
  //   id,
  //   from,
  //   to,
  //   productName,
  //   productTypeId,
  //   requiredTruckAmount,
  //   truckType,
  //   isLiked,
  //   weight
  // } = data

  const route = useRoute()

  const {
    showOwnerAccount = true,
    booker = []
  }: JobDetailProps = route?.params || {}

  const { versatileStore } = useStores()

  useEffect(() => {
    if (!TruckTypeStore.list?.length) {
      TruckTypeStore.find()
    }
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      CarriersJobStore.setDefaultOfData()
      CarriersJobStore.updateFavoriteInList(FavoriteJobStore.id, FavoriteJobStore.liked)
      AppState.addEventListener('change', handleAppStateChange)
    }
  }, [])

  useEffect(() => {
    if (!TruckTypeStore.list?.length) {
      TruckTypeStore.find()
    }
    return () => {
      CarriersJobStore.setDefaultOfData()
      __DEV__ && console.tron.log('stopListenerTapped()')
    }
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (<TouchableOpacity onPress={() => onSelectedHeart(id)}>
        <MaterialCommunityIcons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? color.red : color.line} />
      </TouchableOpacity>),
    })
    return () => { }
  }, [liked, id, navigation]);

  useEffect(() => {
    setLiked(isLiked)
  }, [isLiked])

  useEffect(() => {
    if (CarriersJobStore.data && CarriersJobStore.data.id) {
      const coordinates = [CarriersJobStore.data.from, ...CarriersJobStore.data.to]
      setCoordinates(coordinates)
      CarriersJobStore.getDirections(coordinates)
    }
  }, [CarriersJobStore.loading, CarriersJobStore.data])

  const handleAppStateChange = (nextAppState) => {
    console.log('appState', appState)
    if (appState.match(/active|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
    // setAppState(nextAppState)
    console.log('nextAppState', nextAppState)
  }

  const onSelectedHeart = (id: string) => {
    FavoriteJobStore.keepLiked(id, !liked)
    FavoriteJobStore.add(id)
    setLiked(!liked)
  }

  const onPress = () => {
    modalizeRef.current?.close();
    navigation.navigate('shipperProfile')
  }

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const confirmBookAJob = () => {
    setVisibleModal(true)
  }

  const onCloseModal = () => {
    setVisibleModal(false)
  }

  const onConfirmJob = () => {
    setIsBooking(true)
    // onCloseModal()
  }

  // const onCall = (id: string, phoneNumber: string) => {
  //   // callFriendTapped(phoneNumber)
  //   // startListenerTapped()
  //   callPhone(id, phoneNumber)
  //   // route.name === 'jobDetail' ? navigation.navigate('feedback') : navigation.navigate('myFeedback')
  // }

  const onAnimationFinish = () => {
    setIsBooking(false)
    onCloseModal()
  }

  const startListenerTapped = (jobId: string) => {
    __DEV__ && console.tron.log('startListenerTapped')
    callDetector = new CallDetectorManager((event, phoneNumber) => {
      __DEV__ && console.tron.log('phoneNumber', phoneNumber)
      if (event === 'Disconnected') {
        __DEV__ && console.tron.log('Disconnected')
        stopListenerTapped()
        CarriersHistoryCallStore.add({ jobId })
        setIsCalling(false)
        route.name === 'jobDetail' ? navigation.navigate('feedback') : navigation.navigate('myFeedback')
        // setTimeout(() => {
        //   setIsCalling(false)
        //   route.name === 'jobDetail' ? navigation.navigate('feedback') : navigation.navigate('myFeedback')
        // }, 800)
      }
      else if (event === 'Connected') { //  for iOS
        __DEV__ && console.tron.log('Connected')
      }
      else if (event === 'Incoming') {
        __DEV__ && console.tron.log('Incoming')
      }
      else if (event === 'Dialing') { //  for iOS
        __DEV__ && console.tron.log('Dialing')
        setIsCalling(true)
      }
      else if (event === 'Offhook') { // for Android
        __DEV__ && console.tron.log('Offhook')
        setIsCalling(true)
      }
      else if (event === 'Missed') { // for Android
        __DEV__ && console.tron.log('Missed')
      }
    },
      false,
      () => { },
      {
        title: 'Phone State Permission',
        message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
      }
    )

    // setCallDetector(call)
  }

  const stopListenerTapped = () => {
    __DEV__ && console.tron.log('stopListenerTapped')
    callDetector && callDetector.dispose();
  }

  const onCall = (jobId: string, phone: string) => {
    let phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
    __DEV__ && console.tron.log('phoneNumber', phoneNumber)
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          __DEV__ && console.tron.log('Phone number is not available');
          Alert.alert('Phone number is not available')
          return false;
        } else {
          return startListenerTapped(jobId)
        }
      })
      .then(() => {
        return Linking.openURL(phoneNumber);
      })
      .catch(err => __DEV__ && console.tron.log('err', err));
  };

  const RenderButtonAlert = () => {
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

  const truckTypeList = versatileStore.list
  const txtTruckType = productTypeId && truckTypeList.length
    ? (truckTypeList.filter(({ id }) => id === +truckType)?.[0]?.name || translate('common.notSpecified'))
    : translate('common.notSpecified')

  // const txtTruckType = GetTruckType(+truckType)

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

  return (
    <View style={CONTAINER}>
      <ModalLoading size={'large'} color={color.primary} visible={!!(CarriersJobStore.mapLoading || CarriersJobStore.loading || isCalling)} />
      <View style={MAP_CONTAINER}>
        {from && !!from.lat && !!from.lng && !!CarriersJobStore.directions.length &&
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: +from.lat - 0.01,
              longitude: +from.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            }}
            region={{
              latitude: +from.lat - 0.01,
              longitude: +from.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            }}
          >
            {!!coordinates.length && coordinates.map((attr, index) => (
              <Marker
                key={`${index}-${!index ? 'yellow' : 'green'}`}
                coordinate={{ latitude: +attr.lat, longitude: +attr.lng }}
              >
                <MaterialIcons name={'location-pin'} color={!index ? color.primary : color.success} size={48} />
                <Callout style={{ width: deviceWidht - 80 }}>
                  <Text text={attr.name} />
                </Callout>
              </Marker>
            ))}
            {JSON.parse(JSON.stringify(CarriersJobStore.directions)).map((attr, index) => {
              return (<Polyline key={index} coordinates={attr} strokeWidth={4} strokeColor={'red'} />)
            })}
          </MapView>
        }

        <TouchableOpacity activeOpacity={1} onPress={onOpen} onPressOut={onOpen} style={CONTENT_SMALL}>
          <View style={FLOAT_CONTAINER}>
            <View style={FLOAT_LINE} />
          </View>
          <PickUpPoint from={from} to={to} distances={CarriersJobStore.distances} containerStyle={{ overflow: 'hidden' }} />

          <View style={{ position: 'absolute', right: -spacing[5], top: -spacing[4] }}>
            <SwipeUpArrows color={color.disable} />
          </View>

        </TouchableOpacity>

      </View>

      <Modalize
        ref={modalizeRef}
        scrollViewProps={{ showsVerticalScrollIndicator: true }}
        snapPoint={300}
        // HeaderComponent={}
        modalStyle={{
          flex: 1,
          marginTop: spacing[5],
        }}
        withHandle={true}
      // tapGestureEnabled={true}
      >
        <View style={SCROLL_VIEW}>

          <View style={TOP_ROOT}>
            <View>
              <Text tx={'jobDetailScreen.pickUpPoint'} style={{ ...TEXT_SMALL, color: color.line, }} />
            </View>
            <PickUpPoint from={from} to={to} containerStyle={{ paddingBottom: spacing[4] }} distances={CarriersJobStore.distances} />
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
                <Text text={`${translate('common.amount')} : ${requiredTruckAmount} ${translate('jobDetailScreen.unit')}`} style={TEXT} />
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
          </View>

        </View>

        {showOwnerAccount &&
          <View style={ONWER_ROOT}>
            <View style={ROW}>
              <Text style={{ color: color.line }}>{translate('jobDetailScreen.postBy')}</Text>
              <PostingBy {...DATA} onToggle={() => onPress()} />
            </View>
          </View>
        }

        {booker.length > 0 && <View style={ONWER_ROOT}>
          <Text tx={'myJobScreen.listOfBookingJob'} preset={'topic'} style={TOPIC} />
          {booker.map((booker, index) => <BookerItem
            key={index}
            imageUrl={booker.image}
            topic={booker.name}
            detail={booker.date}
            btnTxt={translate('myJobScreen.accept')}
            containerStyle={{ paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: color.disable }}
            topicStyle={{ fontSize: 14, paddingBottom: spacing[1] }}
            detailStyle={{ color: color.line }}
            btnStyle={{ paddingVertical: 2, paddingHorizontal: spacing[2] }}
            btnTextStyle={{ fontSize: 12, paddingLeft: spacing[1] }}
          />)}
        </View>}

      </Modalize>

      <View style={BOTTOM_ROOT}>
        <Button
          testID="call-with-owner"
          style={[BTN_STYLE, { backgroundColor: color.line }]}
          children={
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <MaterialCommunityIcons name={'phone'} size={24} color={color.textWhite} style={{ paddingRight: spacing[2] }} />
              <Text style={CALL_TEXT} tx={'jobDetailScreen.call'} />
            </View>
          }
          onPress={() => onCall(id, owner.mobileNo)}
        // onPress={() => callFriendTapped()}
        />
        <Button
          testID="book-a-job"
          style={[BTN_STYLE, { backgroundColor: color.primary }]}
          children={
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <MaterialCommunityIcons name={'download-circle-outline'} size={24} color={color.textWhite} style={{ paddingRight: spacing[2] }} />
              <Text style={CALL_TEXT} tx={'common.bookAJob'} />
            </View>
          }
          onPress={confirmBookAJob}
        />
      </View>

      {/* <ModalAlert
        containerStyle={{ paddingTop: spacing[5], paddingBottom: spacing[2] }}
        imageComponent={RenderImageAlert}
        header={translate('jobDetailScreen.confirmJob')}
        headerStyle={{ paddingTop: spacing[3], color: color.primary }}
        content={translate('jobDetailScreen.callbackForOwner')}
        contentStyle={{ paddingTop: spacing[1], paddingBottom: spacing[5], paddingHorizontal: spacing[7], color: color.line }}
        buttonContainerStyle={{ width: '90%' }}
        buttonComponent={RenderButtonAlert}
        visible={visibleModal}
      /> */}

      <ModalAlert {...modalProps} />

    </View>
  )
})
