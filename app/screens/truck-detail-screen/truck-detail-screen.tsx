import React, { useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
  Linking,
  Modal,
  Platform,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Button, ModalLoading, PostingBy, Text } from "../../components"
import { translate } from "../../i18n"
import { color, images as imageComponent, spacing } from "../../theme"
import { useNavigation, useRoute } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import ShipperTruckStore from '../../store/shipper-truck-store/shipper-truck-store'
import TruckTypeStore from '../../store/truck-type-store/truck-type-store'
import { useStores } from "../../models/root-store/root-store-context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FavoriteTruckStore from "../../store/shipper-truck-store/favorite-truck-store"
import { GetTruckType } from "../../utils/get-truck-type"
import { MapTruckImageName } from "../../utils/map-truck-image-name"
import ImageView from 'react-native-image-view';
import ShippersHistoryCallStore from '../../store/shippers-history-call-store/shippers-history-call-store'
import UserTruckStore from '../../store/user-truck-store/user-truck-store'
import ProfileStore from '../../store/profile-store/profile-store'
import i18n from 'i18n-js'
import { GetRegion } from "../../utils/get-region"
import CallDetectorManager from 'react-native-call-detection'

interface ImageInfo {
  width: number
  height: number
  title: string
  source?: ImageSourcePropType
}

const deviceWidht = Dimensions.get("window").width

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
const BOTTOM_ROOT: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing[3],
  borderTopWidth: 0.5,
  borderTopColor: color.line,
}
const CALL_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
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

const initialState = {
  openViewer: false,
  indexOfImage: 0,
  liked: false,
}

let callDetector = undefined

export const TruckDetailScreen = observer(function TruckDetailScreen() {
  const navigation = useNavigation()

  const { tokenStore } = useStores()

  const [{ openViewer, indexOfImage, liked }, setState] = useState(initialState)
  const {
    id,
    truckType,
    stallHeight,
    tipper,
    isLiked,
    truckPhotos,
    phoneNumber,
    workingZones,
    owner
  } = ShipperTruckStore.data

  const route = useRoute()

  useLayoutEffect(() => {
    navigation.setOptions({
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

  const startListenerTapped = (truckId: string) => {
    __DEV__ && console.tron.log('startListenerTapped')
    callDetector = new CallDetectorManager((event, phoneNumber) => {
      __DEV__ && console.tron.log('phoneNumber', phoneNumber)
      if (event === 'Disconnected') {
        __DEV__ && console.tron.log('Disconnected')
        stopListenerTapped()
      } else if (event === 'Connected') { //  for iOS
        __DEV__ && console.tron.log('Connected')
      } else if (event === 'Incoming') {
        __DEV__ && console.tron.log('Incoming')
      } else if (event === 'Dialing') { //  for iOS
        __DEV__ && console.tron.log('Dialing')
      } else if (event === 'Offhook') { // for Android
        __DEV__ && console.tron.log('Offhook')
        ShippersHistoryCallStore.add({ truckId })
      } else if (event === 'Missed') { // for Android
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
  }

  const stopListenerTapped = () => {
    __DEV__ && console.tron.log('stopListenerTapped')
    callDetector && callDetector.dispose();
  }

  const onCall = (truckId: string, phone: string) => {
    if (tokenStore?.token?.accessToken) {
      const phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
      __DEV__ && console.tron.log('phoneNumber', phoneNumber)
      Linking.canOpenURL(phoneNumber)
        .then(supported => {
          if (!supported) {
            __DEV__ && console.tron.log('Phone number is not available');
            Alert.alert('Phone number is not available')
            return false;
          } else {
            return startListenerTapped(truckId)
          }
        })
        .then(() => {
          return Linking.openURL(phoneNumber);
        })
        .catch(err => __DEV__ && console.tron.log('err', err));
    } else {
      navigation.navigate('signin')
    }
  };

  const confirmBookAJob = () => {
    navigation.navigate('myJobList')
  }

  const onVisiblePorfile = () => {
    // UserTruckStore.find({
    //   userId: ShipperTruckStore.profile.userId,
    //   page: 0,
    // })
    // navigation.navigate('shipperProfile')

    const userId = ShipperTruckStore.profile.userId
    ProfileStore.getProfileReporter(userId)
    UserTruckStore.find({
      userId: userId,
      page: 0,
    })
    console.log('JSON.parse(JSON.stringify(ShipperTruckStore.profile))', JSON.parse(JSON.stringify(ShipperTruckStore.profile)))
    navigation.navigate('shipperProfile')
  }

  useEffect(() => {
    if (!TruckTypeStore.list?.length) {
      TruckTypeStore.find()
    }
    return () => {
      if (route.name === 'truckDetail') {
        ShipperTruckStore.setDefaultOfData()
        ShipperTruckStore.setDefaultOfProfile()
        ShipperTruckStore.updateFavoriteInList(FavoriteTruckStore.id, FavoriteTruckStore.liked)
      }
    }
  }, [])

  const transformImage = truckPhotos &&
    Object.keys(truckPhotos).length ?
    Object.entries(truckPhotos).map(img => {
      //  __DEV__ &&  console.tron.log("Image MAPPING RAW :: ", img)
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
  __DEV__ && console.tron.log("Transform Image :: ", transformImage)
  const truckImage = MapTruckImageName(+truckType)

  const ownerProfile = {
    postBy: ShipperTruckStore.profile?.companyName || '',
    isVerified: false,
    rating: '0',
    ratingCount: '0',
    isCrown: false,
    image: JSON.parse(ShipperTruckStore.profile.imageProps),
  }

  const workingZoneStr = workingZones?.length ? workingZones.map(zone => {
    let reg = GetRegion(zone.region, i18n.locale)
    return reg?.label || ''
  }).join(', ') : translate('common.notSpecified')

  return (
    <View style={CONTAINER}>
      {ShipperTruckStore.loading && <ModalLoading size={'large'} color={color.primary} visible={ShipperTruckStore.loading} />}
      <ScrollView onScroll={({ nativeEvent }) => { }} style={{}} scrollEventThrottle={400}>
        <View style={COLUMN}>
          <View style={ROW}>
            <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleImage")} preset={'topic'} />
          </View>
          <View style={ROW}>
            <View style={IMAGES}>
              {!!transformImage &&
                transformImage.map((image, index) => {
                  // __DEV__ && console.tron.log("Image index : ", image)
                  return (
                    <TouchableOpacity style={TOUCHABLE} key={index} onPress={(attr) => {
                      if (ShipperTruckStore.data.id && image && image.source && image.source != 51)
                        onViewer(index)
                    }
                    }>
                      <Image style={IMAGE} source={ShipperTruckStore.data.id && image?.source ? image.source : imageComponent['noImageAvailable']} key={index} />
                    </TouchableOpacity>
                  )
                })}
              {/* <Modal visible={openViewer} transparent={true}> */}
              <ImageView
                images={transformImage}
                imageIndex={indexOfImage}
                isVisible={openViewer}
                onClose={onCancel}
                useNativeDriver={true}
              />
              {/* </Modal> */}
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
              {/* <Text text={`${translate('common.count')} : ${2} ${translate('jobDetailScreen.unit')}`} style={TEXT} /> */}
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

        <View style={COLUMN}>
          <View style={[ROW, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <Text style={{ color: color.line }}>{translate('jobDetailScreen.postBy')}</Text>
            <PostingBy {...ownerProfile} onToggle={() => onVisiblePorfile()} />
          </View>
        </View>

      </ScrollView>

      {/* <View style={BOTTOM_ROOT}>
        <Button
          testID="call-with-owner"
          style={CALL_BUTTON}
          children={
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <MaterialCommunityIcons name={'phone'} size={24} color={color.textWhite} style={{ paddingRight: spacing[2] }} />
              <Text style={CALL_TEXT} text={translate('jobDetailScreen.call')} />
            </View>
          }
          onPress={() => navigation.navigate('feedback')}
        />
      </View> */}

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
          onPress={() => onCall(id, phoneNumber)}
        />
        {/* <Button
          testID="book-a-job"
          style={[BTN_STYLE, { backgroundColor: color.primary }]}
          children={
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <MaterialCommunityIcons name={'download-circle-outline'} size={24} color={color.textWhite} style={{ paddingRight: spacing[2] }} />
              <Text style={CALL_TEXT} tx={'jobDetailScreen.bookATruck'} />
            </View>
          }
          onPress={confirmBookAJob}
        /> */}
      </View>
    </View>
  )
})

