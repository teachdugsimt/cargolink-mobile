import React, { useCallback, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, FlatList, RefreshControl, Dimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { EmptyListMessage, SearchItem, Text, HeaderCenter } from "../../components"
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

const COLOR_WHITE: TextStyle = { color: color.textWhite }
const FULL: ViewStyle = { flex: 1 }
const HEADER_ACTIVE: ViewStyle = {
  borderBottomWidth: 2,
  borderBottomColor: color.textBlack,
}
const TOUCHABLE_VIEW: ViewStyle = {
  flex: 1,
  alignItems: 'center',
}
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

const bookerList = [{
  image: 'https://img.cinemablend.com/filter:scale/quill/f/6/0/5/4/7/f60547eb6c012791e9a6e360989779224b947d31.jpg?mw=600',
  name: 'Mr. John Wick',
  date: 'จองเมื่อ 29/01/2564 11:11 น.'
}, {
  image: 'https://img.cinemablend.com/filter:scale/quill/f/6/0/5/4/7/f60547eb6c012791e9a6e360989779224b947d31.jpg?mw=600',
  name: 'Mr. John Wick',
  date: 'จองเมื่อ 30/01/2564 12:12 น.'
}, {
  image: 'https://img.cinemablend.com/filter:scale/quill/f/6/0/5/4/7/f60547eb6c012791e9a6e360989779224b947d31.jpg?mw=600',
  name: 'Mr. John Wick',
  date: 'จองเมื่อ 31/01/2564 13:13 น.'
}]

const dateFormat = (date: string) => {
  if (!date) return ''
  const newDate = DateAndTime.parse(date, 'DD-MM-YYYY HH:mm')
  const dateFormat = DateAndTime.format(newDate, 'YYYY-MM-DDTHH:mm:ss')
  return dateFormat
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
    quotationNumber
  } = JSON.parse(JSON.stringify(data))

  const navigation = useNavigation()
  const { tokenStore } = useStores()

  const onVisible = () => {
    CarriersJobStore.findOne(id)
    navigation.navigate('myJobDetail', {
      showOwnerAccount: false,
      booker: bookerList
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

    // console.log('jobInfoFirstTab', jobInfoFirstTab)
    // console.log('jobInfoSecondTab', jobInfoSecondTab)

    PostJobStore.setPostJob(1, jobInfoFirstTab)
    PostJobStore.setPostJob(2, jobInfoSecondTab)
    PostJobStore.setJobId(id)

    StatusStore.setStatusScreen('edit')
    let token = tokenStore?.token?.accessToken || null
    if (!token) navigation.navigate('signin')
    else navigation.navigate('MyJob', { screen: 'postjob' })
  }

  const RenderBottom = () => (
    <View style={BOTTOM_ROOT}>
      <TouchableOpacity activeOpacity={1} style={BTN_COLUMN} onPress={quotationNumber == 0 ? onEdit : null}>
        <Text tx={'myJobScreen.editJob'} style={{ color: quotationNumber == 0 ? color.primary : color.line }} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={onVisible}>
        {!!quotationNumber && <View style={QUOTATION_NUM}>
          <Text style={COLOR_WHITE}>{quotationNumber}</Text>
        </View>}
        <Text tx={'myJobScreen.bookerWaiting'} style={{ color: color.primary }} />
      </TouchableOpacity>
    </View>
  )

  const typeOfTruck = GetTruckType(+truckType)?.name || `${translate('jobDetailScreen.truckType')} : ${translate('common.notSpecified')}`

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItem
        {
        ...{
          id,
          fromText: from.name,
          toText: to.map(location => location.name).join(', '),
          count: requiredTruckAmount,
          productName: productName,
          truckType: typeOfTruck,
          // packaging: productName,
          // detail,
          viewDetail: true,
          postBy: owner.companyName,
          isVerified: false,
          // isLike: isLiked,
          showFavoriteIcon: false,
          backgroundImage: imageComponent[MapTruckImageName(+truckType) || 'truck'],
          // rating,
          // ratingCount,
          // isCrown,
          logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
          isRecommened: false,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress: () => onVisible(),
          // onToggleHeart,
          bottomComponent: () => <RenderBottom />
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
  console.log("status : ", status)
  const [isFirstHeaderSelected, setIsFirstHeaderSelected] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isActivitySwitch, setIsActivitySwitch] = useState<boolean>(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)
  const [listLength, setListLength] = useState<number>(0)

  useFocusEffect(
    useCallback(() => {
      ShipperJobStore.find();
      return () => {
        ShipperJobStore.setDefaultOfList()
      }
    }, [])
  );

  useEffect(() => {
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find()
    }
  }, [])

  const renderItem = ({ item }) => <Item {...item} />

  const onScrollList = () => {
    console.log('onScrollList')
    if (!onEndReachedCalledDuringMomentum
      && ShipperJobStore.list.length >= 10
      && !ShipperJobStore.loading
      // && ShipperJobStore.previousListLength !== listLength
    ) {
      PAGE++
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      ShipperJobStore.find(advSearch)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onRefresh = () => {
    ShipperJobStore.find()
  }

  const { versatileStore } = useStores()
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

  const touchableHeaderStyle: ViewStyle = {
    ...TOUCHABLE_VIEW,
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  }
  // const favoriteHeaderStyle: ViewStyle = { ...touchableHeaderStyle, ...(isFirstHeaderSelected && HEADER_ACTIVE) }
  // const lastestContactHeaderStyle: ViewStyle = { ...touchableHeaderStyle, ...(!isFirstHeaderSelected && HEADER_ACTIVE) }

  const firstTabStyle: ViewStyle = { ...touchableHeaderStyle, ...(activeTab === 0 && HEADER_ACTIVE) }
  const secondTabStyle: ViewStyle = { ...touchableHeaderStyle, ...(activeTab === 1 && HEADER_ACTIVE) }
  const thirdTabStyle: ViewStyle = { ...touchableHeaderStyle, ...(activeTab === 2 && HEADER_ACTIVE) }

  return (
    <View testID="MyJobScreen" style={FULL}>

      {/* <View style={HEADER}>
        <TouchableOpacity activeOpacity={1} style={firstTabStyle}
          onPress={() => setActiveTab(0)} >
          <Text tx={'myJobScreen.workOpen'} style={{ ...TEXT, color: activeTab === 0 ? color.textBlack : color.textWhite }} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={secondTabStyle}
          onPress={() => setActiveTab(1)} >
          <Text tx={'myJobScreen.workInProgress'} style={{ ...TEXT, color: activeTab === 1 ? color.textBlack : color.textWhite }} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={thirdTabStyle}
          onPress={() => setActiveTab(2)} >
          <Text tx={'myJobScreen.workDone'} style={{ ...TEXT, color: activeTab === 2 ? color.textBlack : color.textWhite }} />
        </TouchableOpacity>
      </View> */}

      <View style={CONTENT}>
        <FlatList
          data={ShipperJobStore.list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={() => onScrollList()}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={<EmptyListMessage />}
          onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          refreshControl={
            <RefreshControl
              refreshing={ShipperJobStore.loading}
              onRefresh={onRefresh}
            />
          }
        />
      </View>

    </View>
  )
})
