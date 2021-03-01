import React, { useCallback, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, FlatList, RefreshControl, Dimensions, Image, ImageStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { EmptyListMessage, SearchItem, Text, HeaderCenter, ModalAlert, Button } from "../../components"
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

const dateFormat = (date: string) => {
  if (!date) return ''
  const newDate = DateAndTime.parse(date, 'DD-MM-YYYY HH:mm')
  const dateFormat = DateAndTime.format(newDate, 'YYYY-MM-DDTHH:mm:ss')
  return dateFormat
}

const RenderButtonAlert = ({ onConfirmJob, onCloseModal }) => {
  const btnCancleStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.line, backgroundColor: color.transparent }
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
    statusScreen,
  } = JSON.parse(JSON.stringify(data))

  const myUserId = ProfileStore.data?.userId || ''
  const ownerUserId = owner?.userId || ''

  const [visible, setVisible] = useState<boolean>(false)

  const navigation = useNavigation()
  const { tokenStore } = useStores()

  const onVisible = () => {
    CarriersJobStore.findOne(id)
    navigation.navigate('myJobDetail', {
      showOwnerAccount: false,
    })
  }

  const onEdit = () => {
    const jobInfoFirstTab = {
      "vehicle-type": +truckType,
      "car-num": requiredTruckAmount.toString(),
      "item-type": productTypeId,
      "item-name": productName,
      "item-weight": weight.toString(),
    }

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
    console.log('id', id)
    setVisible(false)
  }

  const onCloseModal = () => {
    setVisible(false)
  }

  const modalProps = {
    containerStyle: {
      paddingTop: spacing[5],
      paddingBottom: spacing[2]
    },
    // imageComponent: onAnimationFinish: () => onAnimationFinish }),
    header: translate('myJobScreen.confirmJob'),
    headerStyle: {
      paddingTop: spacing[3],
      color: color.primary
    },
    content: translate('myJobScreen.confirmJob'),
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

  console.log('owner?.avatar?.object ', owner?.avatar?.object)

  const RenderFooter = () => (
    <View style={BOTTOM_ROOT}>
      {statusScreen === 0 && (
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
          </>) : (<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: spacing[1] }}>
            <View style={LOGO_ROOT}>
              <Image
                style={LOGO}
                source={{
                  uri: owner?.avatar?.object || '',
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${owner?.avatar?.token || ''}`,
                    adminAuth: owner?.avatar?.token
                  },
                }}
                resizeMode={'cover'} />
            </View>
            <Text text={owner?.fullName || ''} style={{ paddingLeft: spacing[5] }} />
          </View>)}
        </>)
      )}

      {statusScreen === 3 && (<>
        <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { flexDirection: 'row' }]} onPress={() => onFinishJob(id)}>
          <MaterialCommunityIcons name={'checkbox-marked-circle-outline'} color={color.primary} size={20} />
          <Text tx={'myJobScreen.finishJob'} style={{ color: color.primary, paddingHorizontal: spacing[2] }} />
        </TouchableOpacity>
      </>)}

      {statusScreen === 7 && (<>
        <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN]} onPress={onVisible}>
          <Text tx={'jobDetailScreen.seeDetail'} style={{ color: color.primary }} />
        </TouchableOpacity>
      </>)}

      <ModalAlert {...modalProps} />
    </View>
  )

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
          requiredTouchableOpacityGesture: true,
          onPress: () => onVisible(),
          bottomComponent: () => <RenderFooter />
        }
        }
      />
    </View>
  )
}

let PAGE = 0

export const MyJobScreen = observer(function MyJobScreen() {
  const navigation = useNavigation()

  const route = useRoute()
  const { status }: any = route?.params || {}
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)

  useFocusEffect(
    useCallback(() => {
      // ShipperJobStore.find({ type: status });
      BookingStore.findSummaryJob({ type: status });
      return () => {
        PAGE = 0
        BookingStore.clearList()
        // ShipperJobStore.setDefaultOfList()
      }
    }, [])
  );

  useEffect(() => {
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find()
    }
  }, [])

  const renderItem = ({ item }) => <Item {...item} statusScreen={status} />

  const onScrollList = () => {
    console.log('onScrollList')
    if (!onEndReachedCalledDuringMomentum
      && BookingStore.list.length >= 10
      && !BookingStore.loading
      // && BookingStore.previousListLength !== listLength
    ) {
      PAGE++
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE, type: status }
      BookingStore.findSummaryJob(advSearch)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onRefresh = () => {
    PAGE = 0
    BookingStore.findSummaryJob({ type: status, page: PAGE })
    // ShipperJobStore.find({ type: status })
  }

  const { versatileStore, tokenStore } = useStores()
  const [lang, setlang] = useState(null)
  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
    }
  }, [versatileStore.language])

  useEffect(() => {
    navigation.setOptions({
      headerCenter: () => (
        <HeaderCenter tx={"myJobScreen.myJob"} />
      ),
      headerLeft: () => null
    });
  }, [lang])

  const _renderFlatList = (data) => (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onEndReached={() => onScrollList()}
      onEndReachedThreshold={0.1}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={<EmptyListMessage />}
      onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      refreshControl={
        <RefreshControl
          refreshing={BookingStore.loading}
          onRefresh={onRefresh}
        />
      }
    />)

  return (
    <View testID="MyJobScreen" style={FULL}>

      <View style={CONTENT}>
        {ProfileStore.data && tokenStore?.token?.accessToken ? _renderFlatList(BookingStore.list) : _renderFlatList([])}
      </View>

    </View>
  )
})
