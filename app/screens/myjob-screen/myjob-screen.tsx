import React, { useCallback, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, FlatList, RefreshControl, Dimensions, Image, ImageStyle, Platform } from "react-native"
import { observer } from "mobx-react-lite"
import { EmptyListMessage, SearchItem, Text, ModalAlert, Button } from "../../components"
import { color, spacing, images as imageComponent } from "../../theme"
import ShipperJobStore from '../../store/shipper-job-store/shipper-job-store'
import CarriersJobStore from '../../store/carriers-job-store/carriers-job-store'
import PostJobStore from '../../store/post-job-store/post-job-store'
import AdvanceSearchStore from '../../store/shipper-job-store/advance-search-store'
import TruckTypeStore from '../../store/truck-type-store/truck-type-store'
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { GetTruckType } from "../../utils/get-truck-type"
import { translate } from "../../i18n"
import { MapTruckImageName } from "../../utils/map-truck-image-name"
import DateAndTime from 'date-and-time';
import StatusStore from '../../store/post-job-store/job-status-store'
import { useStores } from "../../models/root-store/root-store-context";
import ProfileStore from "../../store/profile-store/profile-store"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import BookingStore from "../../store/booking-store/booking-store";
import { TabView, TabBar } from 'react-native-tab-view';
import { API_URL } from '../../config/'

const COLOR_WHITE: TextStyle = { color: color.textWhite }
const FULL: ViewStyle = { flex: 1 }

const QUOTATION_NUM: ViewStyle = {
  backgroundColor: 'red', height: 20, width: 20, borderRadius: 10, position: 'absolute', top: 0, right: 40,
  justifyContent: 'center', alignItems: 'center'
}
const CONTENT: ViewStyle = {
  flex: 1,
  paddingTop: spacing[2],
}
const BOTTOM_ROOT: ViewStyle = {
  flexDirection: 'row',
  paddingVertical: spacing[1]
}
const BTN_COLUMN: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: spacing[2]
}
const WAITING: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: spacing[2],
}
const WAITING_TEXT: TextStyle = {
  color: color.line,
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[1],
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
const LOGO_ROOT: ViewStyle = {
  width: 40,
  height: 40,
  paddingLeft: spacing[4],
}
const LOGO: ImageStyle = {
  width: 40,
  height: 40,
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
}
const OPN_ROW: ViewStyle = {
  paddingTop: spacing[4],
  paddingBottom: spacing[1],
  paddingHorizontal: spacing[4],
  marginVertical: spacing[1] - 2,
  backgroundColor: color.backgroundWhite,
}
const OPN_BUTTON: ViewStyle = {
  // flex: 1,
  minWidth: '45%',
  borderRadius: Dimensions.get('window').height / 2,
  marginHorizontal: spacing[1],
  marginVertical: spacing[1],
  paddingVertical: spacing[1] + 2,
  borderWidth: 1,
  borderColor: color.dim,
}
const OPN_BUTTON_TEXT: TextStyle = {
  color: color.textBlack,
  fontSize: 12,
}
const OPN_ROW_CONTENT: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  paddingTop: spacing[4],
  paddingBottom: spacing[2],
}
const OPN_BOTTOM_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[1],
  paddingBottom: spacing[3],
  marginTop: spacing[1] - 2,
}
const OPN_CALL_BUTTON: ViewStyle = {
  width: '100%',
  borderRadius: Dimensions.get('window').width / 2,
  backgroundColor: color.success,
}

const dateFormat = (date: string) => {
  if (!date) return ''
  const newDate = DateAndTime.parse(date, 'DD-MM-YYYY HH:mm')
  const dateFormat = DateAndTime.format(newDate, 'YYYY-MM-DDTHH:mm:ss')
  return dateFormat
}

const RenderButtonAlert = ({ onConfirmJob, onCloseModal }) => {
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
        onPress={onConfirmJob}
      />
    </View>
  )
}

const RenderOpinionButton = ({ onSubmit }) => {
  const [doneFrom, setDoneFrom] = useState<"CARGOLINK" | "OTHER" | "CANCELJOB">(null)

  const BUTTON_SLECTE = [
    {
      id: 0,
      value: 'CARGOLINK',
      label: translate('feedbackScreen.rightFromApp'),
    }, {
      id: 1,
      value: 'OTHER',
      label: translate('feedbackScreen.notFromApp'),
    }, {
      id: 2,
      value: 'CANCELJOB',
      label: translate('feedbackScreen.cancel')
    }
  ]

  return (
    <View style={OPN_ROW}>
      <Text text={translate('feedbackScreen.canYouAgreeJob')} style={{ textAlign: 'center' }} preset={'topic'} />
      <View style={OPN_ROW_CONTENT}>
        {BUTTON_SLECTE.length && BUTTON_SLECTE.map((button: any, index: number) => (
          <Button
            key={index}
            activeOpacity={1}
            testID={`btn-select-${index + 1}`}
            text={button.label}
            style={{
              ...OPN_BUTTON,
              backgroundColor: button.value === doneFrom ? color.primary : color.transparent,
              borderColor: button.value === doneFrom ? color.primary : color.disable,
            }}
            textStyle={OPN_BUTTON_TEXT}
            onPress={() => setDoneFrom(button.value)} />)
        )}
      </View>

      <View style={OPN_BOTTOM_CONTAINER}>
        <Button
          disabled={!doneFrom}
          testID="call-with-owner"
          style={[OPN_CALL_BUTTON, { backgroundColor: !doneFrom ? color.line : color.success }]}
          textStyle={CALL_TEXT}
          text={translate('common.confirm')}
          onPress={() => onSubmit(doneFrom)}
        />
      </View>
    </View>
  )
}

const Item = (data) => {
  const {
    id,
    productTypeId,
    productName,
    truckType,
    requiredTruckAmount,
    weight,
    from,
    to,
    owner,
    status: bookingStatus,
    quotationNumber,
    actionStatus,
    statusScreen,
    onConfirm,
    price,
    priceType,
    tipper,
    onSubmitOpinion,
  } = data

  const myUserId = ProfileStore.data?.userId || ''
  const ownerUserId = owner?.userId || null

  const [visible, setVisible] = useState<boolean>(false)
  const [isFinishedJob, setIsFinishedJob] = useState<boolean>(false)

  const navigation = useNavigation()
  const { tokenStore } = useStores()

  const onVisible = () => {
    const imageSource = owner?.avatar?.object ? {
      source: {
        uri: `${API_URL}/api/v1/media/file-stream?attachCode=` + owner?.avatar?.object || '',
        method: 'GET',
        headers: {
          Accept: 'image/*'
          // Authorization: `Bearer ${owner?.avatar?.token || ''}`,
          // adminAuth: owner?.avatar?.token || '',
        },
      },
      resizeMode: 'cover'
    } : null

    CarriersJobStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })
    CarriersJobStore.findOne(id)
    navigation.navigate('myJobDetail', {
      showOwnerAccount: false,
      actionStatus: actionStatus,
      statusScreen: statusScreen,
      jobStatus: bookingStatus
    })
  }

  const onEdit = () => {
    const shipping_type = {
      "PER_TRIP": 1,
      "PER_TON": 2
    }
    console.log("Vehicle Types  : ", truckType)
    const jobInfoFirstTab: any = {
      "vehicle-type": +truckType,
      "car-num": requiredTruckAmount.toString(),
      "item-type": productTypeId,
      "item-name": productName,
      "item-weight": weight.toString(),
      "shipping-rate": price + "",
      "shipping-type": shipping_type[priceType],
    }
    if (tipper == true || tipper == false) jobInfoFirstTab['dump-field'] = tipper == true ? 1 : 2

    const shippings = to?.map(shipping => {
      return {
        "shipping-address": shipping?.name || '',
        "shipping-date": dateFormat(shipping?.dateTime || ''),
        "shipping-time": dateFormat(shipping?.dateTime || ''),
        "shipping-name": shipping?.contactName || '',
        "shipping-tel-no": shipping?.contactMobileNo || '',
        "shipping-region": {
          "latitude": +shipping?.lat || 0,
          "longitude": +shipping?.lng || 0,
          "latitudeDelta": 0.0058863476810167015,
          "longitudeDelta": 0.005000643432154561,
        }
      }
    }) || []

    const jobInfoSecondTab = {
      "receive-region": {
        "latitude": +from?.lat || 0,
        "longitude": +from?.lng || 0,
        "latitudeDelta": 0.005878748388420618,
        "longitudeDelta": 0.004999972879886627,
      },
      "receive-location": from?.name || '',
      "receive-date": dateFormat(from?.dateTime || ''),
      "receive-time": dateFormat(from?.dateTime || ''),
      "receive-name": from?.contactName || '',
      "receive-tel-no": from?.contactMobileNo || '',
      "shipping-information": shippings
    }

    PostJobStore.setPostJob(1, jobInfoFirstTab)
    PostJobStore.setPostJob(2, jobInfoSecondTab)
    PostJobStore.setJobId(id)

    StatusStore.setStatusScreen('edit')
    let token = tokenStore?.token?.accessToken || null
    if (!token) navigation.navigate('signin')
    else navigation.navigate('MyJob', { screen: 'postjob' })
  }

  const onFinishJob = (id: string) => {
    setVisible(true)
  }

  const onConfirmJob = (id: string) => {
    onConfirm(id)
    // setVisible(false)
    setIsFinishedJob(true)
  }

  const onCloseModal = () => {
    setVisible(false)
  }

  const onSubmit = (value: any) => {
    onSubmitOpinion({ id, value })
    setVisible(false)
  }

  const renderOwnerProfile = (reverse?: boolean) => (
    <View style={{ flexDirection: reverse ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: spacing[1] }}>
      <View style={LOGO_ROOT}>
        <Image
          style={LOGO}
          source={{
            uri: (owner?.avatar?.object ? `${API_URL}/api/v1/media/file-stream?attachCode=` + owner?.avatar?.object : '') || '',
            method: 'GET',
            headers: {
              Accept: 'image/*'
              // Authorization: `Bearer ${owner?.avatar?.token || ''}`,
              // adminAuth: owner?.avatar?.token || ''
            },
          }}
          resizeMode={'cover'} />
      </View>
      <Text text={owner?.fullName || (owner?.companyName || '')} style={reverse ? { paddingRight: spacing[2] } : { paddingLeft: spacing[5] }} />
    </View>
  )

  const renderFooter = (status: string) => {
    let footer = null
    switch (status) {
      case 'IM_OWN_CAR_AND_HAVE_JOB_ASK_FOR_BOOKING':
        footer = (<TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { flexDirection: 'row' }]}>
          <MaterialCommunityIcons name={'clock-fast'} color={color.line} size={28} />
          <Text tx={'myJobScreen.ownerProductAwaitYourResponse'} style={{ color: color.line, paddingLeft: spacing[2] }} />
        </TouchableOpacity>)
        break;
      case 'IM_OWN_JOB_AND_HAVE_CAR_ASK_FOR_BOOKING':
        footer = (<>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN]} onPress={() => onFinishJob(id)}>
            <Text tx={'myJobScreen.finishJob'} style={{ color: color.success, paddingLeft: spacing[2] }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={quotationNumber == 0 ? onEdit : null}>
            <Text tx={'myJobScreen.editJob'} style={{ color: quotationNumber == 0 ? color.primary : color.line }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={onVisible}>
            {!!quotationNumber && <View style={QUOTATION_NUM}>
              <Text style={COLOR_WHITE}>{quotationNumber}</Text>
            </View>}
            <Text tx={'myJobScreen.bookerWaiting'} style={{ color: color.primary }} />
          </TouchableOpacity>
        </>)
        break;
      case 'IM_OWN_CAR_AND_ASK_FOR_BOOKING_HIM_JOB':
        footer = (<TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { flexDirection: 'row' }]} >
          <MaterialCommunityIcons name={'clock-fast'} color={color.line} size={28} />
          <Text tx={'myJobScreen.waitingForFeedback'} style={{ color: color.line, paddingLeft: spacing[2] }} />
        </TouchableOpacity>)
        break;
      case 'IM_OWN_JOB':
        footer = (<>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN]} onPress={() => onFinishJob(id)}>
            {/* <MaterialCommunityIcons name={'checkbox-marked-circle-outline'} color={color.success} size={20} /> */}
            <Text tx={'myJobScreen.finishJob'} style={{ color: color.success, paddingLeft: spacing[2] }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={quotationNumber == 0 ? onEdit : null}>
            <Text tx={'myJobScreen.editJob'} style={{ color: color.primary }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={onVisible}>
            <Text tx={'myJobScreen.bookerWaiting'} style={{ color: color.primary }} />
          </TouchableOpacity>
        </>)
        break;
      case 'IM_OWN_JOB_AND_ASK_FOR_BOOKING_HIM_CAR':
        footer = (<>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN]} onPress={() => onFinishJob(id)}>
            <Text tx={'myJobScreen.finishJob'} style={{ color: color.success, paddingLeft: spacing[2] }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={onEdit}>
            <Text tx={'myJobScreen.editJob'} style={{ color: color.primary }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]}>
            {/* <MaterialCommunityIcons name={'clock-fast'} color={color.line} size={28} /> */}
            <Text tx={'myJobScreen.waitForAcceptingFromCarrer'} style={{ color: color.line, textAlign: 'center' }} />
          </TouchableOpacity>
        </>)
        break;
      default:
        break;
    }

    return footer
  }

  const RenderFooter = () => (
    <View style={BOTTOM_ROOT}>
      {/* {statusScreen === 0 && (
        bookingStatus === 3 ? (<>
          <TouchableOpacity activeOpacity={1} style={BTN_COLUMN} onPress={quotationNumber == 0 ? onEdit : null}>
            <Text tx={'myJobScreen.editJob'} style={{ color: quotationNumber == 0 ? color.primary : color.line }} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={onVisible}>
            {!!quotationNumber && <View style={QUOTATION_NUM}>
              <Text style={COLOR_WHITE}>{quotationNumber}</Text>
            </View>}
            <Text tx={'myJobScreen.bookerWaiting'} style={{ color: color.primary }} />
          </TouchableOpacity>
        </>) : bookingStatus === 1 && !!quotationNumber ? (<View style={WAITING}>
          <MaterialCommunityIcons name={'clock-fast'} color={color.line} size={28} />
          <Text tx={'myJobScreen.waitForAcceptingFromCarrer'} style={WAITING_TEXT} />
        </View>) : (<>
          {myUserId === ownerUserId ? (<>
            <TouchableOpacity activeOpacity={1} style={BTN_COLUMN} onPress={quotationNumber == 0 ? onEdit : null}>
              <Text tx={'myJobScreen.editJob'} style={{ color: quotationNumber == 0 ? color.primary : color.line }} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={onVisible}>
              <Text tx={'myJobScreen.bookerWaiting'} style={{ color: color.primary }} />
            </TouchableOpacity>
          </>) : (renderOwnerProfile())}
        </>)
      )} */}

      {statusScreen === 0 && (
        renderFooter(actionStatus)
      )}

      {statusScreen === 1 && (<>
        {myUserId === ownerUserId ? (<>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { flexDirection: 'row' }]} onPress={() => onFinishJob(id)}>
            <MaterialCommunityIcons name={'checkbox-marked-circle-outline'} color={color.primary} size={20} />
            <Text tx={'myJobScreen.finishJob'} style={{ color: color.primary, paddingHorizontal: spacing[2] }} />
          </TouchableOpacity>
        </>) : (renderOwnerProfile())}
      </>)}

      {statusScreen === 2 && (<>
        {myUserId === ownerUserId ? (<>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN]} onPress={onVisible}>
            <Text tx={'jobDetailScreen.seeDetail'} style={{ color: color.primary }} />
          </TouchableOpacity>
        </>) : (<View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderRightWidth: 1, borderRightColor: color.disable }]} onPress={onVisible}>
            <Text tx={'jobDetailScreen.seeDetail'} style={{ color: color.primary }} />
          </TouchableOpacity>
          <View style={{ paddingRight: spacing[4], flex: 1 }}>
            <View style={{ alignItems: 'flex-end' }}>
              {renderOwnerProfile(true)}
            </View>
          </View>
        </View>)}
      </>)}

    </View>
  )

  const modalProps = {
    containerStyle: {
      paddingTop: spacing[5],
      paddingBottom: spacing[2]
    },
    // imageComponent: onAnimationFinish: () => onAnimationFinish }),
    header: translate('myJobScreen.confirmFinishJob'),
    headerStyle: {
      paddingTop: spacing[3],
      color: color.primary
    },
    content: translate('myJobScreen.confirmFinishJob'),
    contentStyle: {
      paddingTop: spacing[1],
      paddingBottom: spacing[5],
      paddingHorizontal: spacing[7],
      color: color.line
    },
    buttonContainerStyle: { width: '90%' },
    buttonComponent: () => <RenderButtonAlert onConfirmJob={() => onConfirmJob(id)} onCloseModal={onCloseModal} />,
    visible: visible,
  }

  const modalOpinionProps = {
    containerStyle: {
      paddingTop: spacing[2],
      // paddingBottom: spacing[2]
    },
    buttonContainerStyle: { width: '100%' },
    buttonComponent: () => <RenderOpinionButton onSubmit={onSubmit} />,
    visible: visible,
  }

  const typeOfTruck = GetTruckType(+truckType)?.name || `${translate('jobDetailScreen.truckType')} : ${translate('common.notSpecified')}`

  return (
    <View style={{ paddingHorizontal: spacing[2] }}>
      <SearchItem
        {
        ...{
          id,
          fromText: from.name,
          toText: to.map(location => location.name).join(', '),
          count: requiredTruckAmount,
          productName: productName,
          truckType: typeOfTruck,
          viewDetail: true,
          postBy: owner.companyName,
          isVerified: false,
          showFavoriteIcon: false,
          backgroundImage: imageComponent[MapTruckImageName(+truckType) || 'truck'],
          isRecommened: false,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          price: price,
          priceType: priceType === 'PER_TRIP' ? translate('common.round') : translate('common.ton'),
          requiredTouchableOpacityGesture: true,
          onPress: () => onVisible(),
          bottomComponent: () => <RenderFooter />
        }
        }
      />

      {!isFinishedJob ? <ModalAlert {...modalProps} /> : <ModalAlert {...modalOpinionProps} />}

    </View>
  )
}

let PAGE = 0

export const MyJobScreen = observer(function MyJobScreen(props: any) {
  const navigation = useNavigation()

  const [index, setIndex] = useState<number>(BookingStore.status_myjob != null ? BookingStore.status_myjob : 0);
  const [routes, setroutes] = useState([
    { key: '0', title: translate('myJobScreen.workOpen') },
    { key: '1', title: translate('myJobScreen.workInProgress') },
    { key: '2', title: translate('myJobScreen.workDone') },
  ]);
  // const { status }: any = route?.params || {}
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)

  const clearBookingList = () => {
    PAGE = 0
    BookingStore.clearList()
  }
  useFocusEffect(
    useCallback(() => {
      // ShipperJobStore.find({ type: index });
      BookingStore.findSummaryJob({ type: BookingStore.status_myjob });   // when back from other screen 
      return () => {
        clearBookingList() // before go Other screen 
        // ShipperJobStore.setDefaultOfList()
      }
    }, [])
  );

  useEffect(() => {
    // navigation.setOptions({
    //   headerCenter: () => (<RenderHeader text={"myJobScreen.myJob"} />),
    // });
    onRefresh()
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find()
    }
  }, [])

  const renderItem = ({ item }) => <Item {...item} statusScreen={index} onConfirm={(id: string) => onConfirm(id)} onSubmitOpinion={onSubmitOpinion} />

  const onConfirm = (id: string) => {
    // BookingStore.finishJob(id)
    // onRefresh()
    // navigation.navigate('myFeedback')
  }

  const onSubmitOpinion = ({ id, value }) => {
    ShipperJobStore.rating({
      jobId: id,
      doneFrom: value
    })
    onRefresh()
  }

  const onScrollList = () => {
    if (!onEndReachedCalledDuringMomentum
      && BookingStore.list.length >= 10
      && !BookingStore.loading
      // && BookingStore.previousListLength !== listLength
    ) {
      PAGE++
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE, type: index }
      BookingStore.findSummaryJob(advSearch)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onRefresh = () => {
    PAGE = 0
    BookingStore.findSummaryJob({ type: index, page: PAGE })
    // ShipperJobStore.find({ type: index })
  }

  const { versatileStore, tokenStore } = useStores()
  const [lang, setlang] = useState(null)
  useEffect(() => {
    if (lang != versatileStore.language) {
      setroutes([
        { key: '0', title: translate('myJobScreen.workOpen') },
        { key: '1', title: translate('myJobScreen.workInProgress') },
        { key: '2', title: translate('myJobScreen.workDone') },
      ])
      setlang(versatileStore.language)
    }
  }, [versatileStore.language])

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerCenter: () => (
  //       <HeaderCenter tx={"myJobScreen.myJob"} />
  //     ),
  //     // headerLeft: () => null
  //   });
  // }, [lang])

  console.log("Loading Booking Store :: ", BookingStore.loading)

  const _renderFlatList = (data) => (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onEndReached={() => onScrollList()}
      onEndReachedThreshold={0.1}
      // contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={<EmptyListMessage containerStyle={{ marginTop: 50 }} />}
      onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      refreshControl={
        <RefreshControl
          style={!BookingStore.loading ? { display: 'none' } : {}}
          refreshing={BookingStore.loading}
          onRefresh={onRefresh}
        />
      }
    />)

  const renderTabBar = props => {
    return <TabBar
      {...props}
      renderTabBarItem={({ route, onPress, style }) => {
        return <TouchableOpacity
          key={`route-${route.title}`}
          style={[style, {
            justifyContent: 'center', alignItems: 'center',
            flex: +route.key == 1 ? 1.25 : 1, height: 50
          }]}
          onPress={onPress}
        >
          <Text style={[{ fontFamily: 'Kanit-Medium', color: index == +route.key ? color.textWhite : color.textBlack }]}>
            {route.title}</Text>
        </TouchableOpacity>
      }}
      indicatorStyle={{ backgroundColor: color.dim }}
      style={{ backgroundColor: color.primary }}
    />
  }
  const [dataList, setdataList] = useState([])
  const [renderer, setrenderer] = useState(false)
  useEffect(() => {
    clearBookingList()
    BookingStore.findSummaryJob({ type: index, page: 0 })
  }, [index])

  useEffect(() => {
    if (BookingStore.list != dataList) {
      setdataList(BookingStore.list)
      setrenderer(!renderer)
    }
  }, [JSON.stringify(BookingStore.list)])


  const renderScene = ({ route }) => {
    switch (route.key) {
      case '0':
        return _renderFlatList(BookingStore.list);
      case '1':
        return _renderFlatList(BookingStore.list);
      case '2':
        return _renderFlatList(BookingStore.list);
      default:
        return null;
    }
  };

  const _renderTabView = () => {
    return <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={(nav) => renderScene(nav)}
      onIndexChange={(ind) => {
        BookingStore.setStatus(ind)
        setIndex(ind)
      }}
      initialLayout={{ width: Dimensions.get('window').width }}
    />
  }
  console.log("Index In Render Function :: ", index)

  const _renderMainJobScreen = () => (<View testID="MyJobScreen" style={FULL}>
    {ProfileStore.data && tokenStore?.token?.accessToken ? _renderTabView() : _renderTabView()}
  </View>)

  if (versatileStore.language == 'th') return _renderMainJobScreen()
  else return _renderMainJobScreen()
})
