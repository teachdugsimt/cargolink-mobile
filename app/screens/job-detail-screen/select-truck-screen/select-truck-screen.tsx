import React, { useEffect, useState } from 'react'
import { observer } from "mobx-react-lite"
import { Dimensions, FlatList, Image, RefreshControl, TextStyle, View, ViewStyle } from 'react-native'
import { color, images, spacing } from "../../../theme";
import { useNavigation } from "@react-navigation/native"
import { GetTruckType } from "../../../utils/get-truck-type";
import { MapTruckImageName } from "../../../utils/map-truck-image-name";
import { Button, EmptyListMessage, ModalAlert, SearchItemTruck, Text } from "../../../components";
import { translate } from '../../../i18n';
import TruckTypeStore from '../../../store/truck-type-store/truck-type-store'
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import BookingStore from "../../../store/booking-store/booking-store";
import CarriersJobStore from '../../../store/carriers-job-store/carriers-job-store'
import i18n from 'i18n-js'
import { GetRegion } from "../../../utils/get-region";
import MyVehicleStore from "../../../store/my-vehicle-store/my-vehicle-store";
import StatusVehicleStore from "../../../store/my-vehicle-store/status-vehicle-store";

const FULL: ViewStyle = { flex: 1 }
const HEADER: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: spacing[5],
  paddingBottom: spacing[1],
}
const BOTTOM_ROOT: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing[1],
}
const LIST: ViewStyle = {
  flex: 1,
  paddingTop: spacing[2],
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
const BTN_BOTTOM: ViewStyle = {
  flex: 1,
  borderRadius: Dimensions.get('window').width / 2,
  marginHorizontal: spacing[3],
  marginVertical: spacing[2],
  backgroundColor: color.primary,
  borderWidth: 1,
  borderColor: color.primary,
}
const BTN_BOTTOM_TXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
}

const CheckMark = (data) => (<LottieView
  source={require('../../../AnimationJson/check-mark.json')}
  style={{ height: 100, width: 100, }}
  autoPlay={data.autoPlay}
  loop={false}
  speed={0.7}
  onAnimationFinish={data.onAnimationFinish()}
/>)

const RenderImageAlert = () => (<Image source={images['truckYellowIcon']} width={75} height={75} />)

const RenderButtonAlert = (props) => {

  const btnCancleStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.mainGrey, backgroundColor: color.transparent }
  const btnConfirmStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.primary, backgroundColor: color.primary }
  return (
    <View style={{ ...BOTTOM_ROOT, paddingVertical: spacing[2] }}>
      <Button
        testID="btn-cancel"
        style={btnCancleStyle}
        textStyle={{ ...CALL_TEXT, color: color.line }}
        text={translate("common.cancel")}
        onPress={() => props.onCloseModal()}
      />
      <Button
        testID="btn-ok"
        style={btnConfirmStyle}
        textStyle={{ ...CALL_TEXT, color: color.textWhite }}
        text={translate("common.confirm")}
        onPress={() => props.onConfirmJob()}
      />
    </View>
  )
}

const Item = (data) => {
  const {
    id,
    truckType,
    stallHeight,
    tipper,
    isLiked,
    owner,
    workingZones,
    onVisibleModal,
  } = data

  const onToggleHeart = (data) => { }

  const renderContent = () => (<View style={{ paddingLeft: spacing[2] }}>
    <View style={{ paddingVertical: spacing[1] }}>
      <Text text={`${translate('truckDetailScreen.heighttOfTheCarStall')} : ${stallHeight ? translate(`common.${stallHeight.toLowerCase()}`) : '-'}`} />
    </View>
    <View style={{ paddingVertical: spacing[1] }}>
      <Text text={`${tipper ? translate('truckDetailScreen.haveDump') : translate('truckDetailScreen.haveNotDump')}`} />
    </View>
  </View>)

  const renderBottom = () => <View />
  console.log('workingZones', workingZones)
  const workingZoneStr = workingZones?.length ? workingZones.map(zone => {
    let reg = GetRegion(zone.region, i18n.locale)
    return reg?.label || ''
  }).join(', ') : translate('common.notSpecified')

  const truckImage = MapTruckImageName(+truckType)

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
          showFavoriteIcon: false,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress: () => onVisibleModal(id),
          onToggleHeart,
          bottomComponent: renderBottom
        }}
      />
    </View>
  )
}

let initCount = 0
let count = 0

export const SelectTruckScreen = observer(function MyJobScreen() {
  const navigation = useNavigation()

  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [isBokking, setIsBooking] = useState<boolean>(false)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)
  const [truckId, setTruckId] = useState<string>(null)
  // const [listLength, setListLength] = useState<number>(0)

  useEffect(() => {
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find()
    }
    // CarriersJobStore.find()
    MyVehicleStore.findRequest({ page: count })
    return () => {
      // CarriersJobStore.setDefaultOfList()
      count = initCount
      MyVehicleStore.clearListData()
    }
  }, [])

  const renderItem = ({ item }) => <Item {...item} onVisibleModal={onVisibleModal} />

  const onScrollList = () => {
    const myVehicleList = JSON.parse(JSON.stringify(MyVehicleStore.list))
    if (!onEndReachedCalledDuringMomentum && MyVehicleStore.loading == false && myVehicleList.length % 10 == 0) {
      count++
      MyVehicleStore.findRequest({ page: count })
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onRefresh = () => {
    count = initCount
    MyVehicleStore.findRequest({ page: count })
  }

  const onCloseModal = () => {
    // navigation.navigate('Home', {
    //   // onNavigateBack: (commentText) => refresh(commentText)
    //   screen: 'jobDetail'
    // })
    navigation.navigate('jobDetail')
    setVisibleModal(false)
  }

  const onVisibleModal = (id: string) => {
    setTruckId(id)
    setVisibleModal(true)
  }

  const onConfirmJob = () => {
    BookingStore.addCarrierJobBookingOne({
      jobId: CarriersJobStore.data.id,
      truckId: truckId
    })
    setIsBooking(true)
    // onCloseModal()
  }

  const onAnimationFinish = () => {
    setIsBooking(false)
    onCloseModal()
  }

  const addNewTruck = () => {
    StatusVehicleStore.setStatusScreen('add')
    navigation.navigate('uploadVehicleHome', { from: 'home' })
  }

  const modalProps = {
    containerStyle: {
      paddingTop: spacing[6],
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
    buttonComponent: () => !isBokking ? <RenderButtonAlert onCloseModal={onCloseModal} onConfirmJob={onConfirmJob} /> : null,
    visible: visibleModal,
  }

  console.log('JSON.parse(JSON.stringify(MyVehicleStore.list))', JSON.parse(JSON.stringify(MyVehicleStore.list)))

  return (
    <View style={FULL}>
      <View style={HEADER}>
        <Text text={`* ${translate('selectTruckScreen.selectBooking')}`} />
      </View>
      <View style={LIST}>
        <FlatList
          data={MyVehicleStore.list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={() => onScrollList()}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={<EmptyListMessage />}
          onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          refreshControl={
            <RefreshControl
              refreshing={MyVehicleStore.loading}
              onRefresh={onRefresh}
            />
          }
        />
      </View>

      <View style={BOTTOM_ROOT}>
        <Button
          testID="call-with-owner"
          style={BTN_BOTTOM}
          children={
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <Ionicons name={'add-circle-outline'} size={24} color={color.textWhite} style={{ paddingRight: spacing[2] }} />
              <Text style={BTN_BOTTOM_TXT} tx={'selectTruckScreen.addNewTruck'} />
            </View>
          }
          onPress={() => addNewTruck()}
        />
      </View>

      <ModalAlert {...modalProps} />

    </View>
  )
})
