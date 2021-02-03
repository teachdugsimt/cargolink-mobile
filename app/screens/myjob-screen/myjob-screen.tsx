import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, FlatList, RefreshControl } from "react-native"
import { observer } from "mobx-react-lite"
import { EmptyListMessage, SearchItem, Text, HeaderCenter } from "../../components"
import { color, spacing, images as imageComponent } from "../../theme"
import ShipperJobStore from '../../store/shipper-job-store/shipper-job-store'
import CarriersJobStore from '../../store/carriers-job-store/carriers-job-store'
import FavoriteJobStore from '../../store/carriers-job-store/favorite-job-store'
import AdvanceSearchStore from '../../store/shipper-job-store/advance-search-store'
import { useNavigation } from "@react-navigation/native"
import { GetTruckType } from "../../utils/get-truck-type"
import { translate } from "../../i18n"
import { MapTruckImageName } from "../../utils/map-truck-image-name"
import { useStores } from "../../models/root-store/root-store-context";

const FULL: ViewStyle = { flex: 1 }
const HEADER: ViewStyle = {
  flexDirection: 'row',
  backgroundColor: color.primary,
}
const HEADER_ACTIVE: ViewStyle = {
  borderBottomWidth: 2,
  borderBottomColor: color.textBlack,
}
const TOUCHABLE_VIEW: ViewStyle = {
  flex: 1,
  alignItems: 'center',
}
const TEXT: TextStyle = {
  color: color.textBlack,
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

let PAGE = 0

const Item = (data) => {
  const {
    id,
    productTypeId,
    productName,
    truckType,
    requiredTruckAmount,
    from,
    to,
    owner,
    isLiked,
    list,
    setUnFollow
  } = data

  const navigation = useNavigation()

  const onPress = () => {
    CarriersJobStore.findOne(id)
    navigation.navigate('myJobDetail')
  }

  const onToggleHeart = (data) => {
    const newData = [...JSON.parse(JSON.stringify(list))].filter(({ id }) => id !== data.id)
    setUnFollow(newData)
    FavoriteJobStore.add(data.id)
  }

  const RenderBottom = () => (
    <View style={BOTTOM_ROOT}>
      <TouchableOpacity activeOpacity={1} style={BTN_COLUMN} onPress={onPress}>
        <Text tx={'myJobScreen.editJob'} style={{ color: color.line }} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={onPress}>
        <Text tx={'myJobScreen.bookerWaiting'} style={{ color: color.primary }} />
      </TouchableOpacity>
    </View>
  )

  const typeOfTruck = GetTruckType(+truckType)?.name || translate('common.notSpecified')

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
          onPress,
          onToggleHeart,
          bottomComponent: () => <RenderBottom />
        }
        }
      />
    </View>
  )
}

export const MyJobScreen = observer(function MyJobScreen() {
  const navigation = useNavigation()
  const [isFirstHeaderSelected, setIsFirstHeaderSelected] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isActivitySwitch, setIsActivitySwitch] = useState<boolean>(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState<boolean>(true)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)
  const [listLength, setListLength] = useState<number>(0)

  useEffect(() => {
    ShipperJobStore.find()
    return () => {
      ShipperJobStore.setDefaultOfList()
    }
  }, [])

  const renderItem = ({ item }) => <Item {...item} />

  const onScrollList = () => {
    console.log('onScrollList')
    if (!onEndReachedCalledDuringMomentum
      // && ShipperJobStore.list.length >= 10
      && !ShipperJobStore.loading
      // && ShipperJobStore.previousListLength !== listLength
    ) {
      PAGE = ShipperJobStore.list.length === listLength ? listLength : PAGE + ShipperJobStore.list.length
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      ShipperJobStore.find(advSearch)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onRefresh = () => {
    setLoading(true)
    // if (!isActivitySwitch) { // job
    //     FavoriteJobStore.find();
    // } else {
    //     FavoriteTruckStore.find()
    // }
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

      <View style={HEADER}>
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
      </View>

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
