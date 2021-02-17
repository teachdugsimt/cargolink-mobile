import React, { useCallback, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, FlatList, RefreshControl, ImageProps, Dimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { ModalLoading, SearchItem, SearchItemTruck, Text, EmptyListMessage, HeaderCenter } from "../../components"
import { color, spacing, images as imageComponent, images } from "../../theme"
import FavoriteTruckStore from "../../store/shipper-truck-store/favorite-truck-store"
import ShipperTruckStore from "../../store/shipper-truck-store/shipper-truck-store"
import FavoriteJobStore from "../../store/carriers-job-store/favorite-job-store"
import CarriersJobStore from "../../store/carriers-job-store/carriers-job-store"
import TruckTypeStore from "../../store/truck-type-store/truck-type-store"
import Feather from 'react-native-vector-icons/Feather'
import { GetTruckType } from "../../utils/get-truck-type"
import { translate } from "../../i18n"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { GetRegion } from "../../utils/get-region"
import i18n from "i18n-js"
import { MapTruckImageName } from "../../utils/map-truck-image-name"
import { useStores } from "../../models/root-store/root-store-context";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { JobList } from "./favorite/job-list";
import { TruckList } from "./favorite/truck-list";
import { HistoryCall } from "./history-call";
// interface STATE {
//     isHeaderSwitch: boolean

// }

const FULL: ViewStyle = { flex: 1 }
const HEADER: ViewStyle = {
  flexDirection: 'row',
  backgroundColor: color.primary,
}
const HEADER_ACTIVE: ViewStyle = {
  borderBottomWidth: 2,
  borderBottomColor: color.textBlack,
}
const BORDER_RADIUS_LEFT: ViewStyle = {
  borderTopLeftRadius: spacing[1],
  borderBottomLeftRadius: spacing[1],
}
const BORDER_RADIUS_RIGHT: ViewStyle = {
  borderTopRightRadius: spacing[1],
  borderBottomRightRadius: spacing[1],
}
const TOUCHABLE_VIEW: ViewStyle = {
  flex: 1,
  alignItems: 'center',
}
const TEXT: TextStyle = {
  color: color.textBlack,
}
const ACTIVITY: ViewStyle = {
  flexDirection: 'row',
  marginVertical: spacing[4],
  marginHorizontal: spacing[3],
  borderRadius: spacing[2],
}
const ACTIVITY_TEXT_VIEW: TextStyle = {
  ...TEXT,
  paddingVertical: spacing[2],
}

const FavoriteRoute = () => {

  const [isActivitySwitch, setIsActivitySwitch] = useState<boolean>(false)

  return (<View testID="FavoriteScreen" style={FULL}>

    <View style={ACTIVITY}>
      <TouchableOpacity activeOpacity={1} style={{ ...TOUCHABLE_VIEW, ...BORDER_RADIUS_LEFT, backgroundColor: !isActivitySwitch ? color.primary : color.disable }} onPress={() => setIsActivitySwitch(!isActivitySwitch)}>
        <Text tx={'favoriteScreen.job'} style={ACTIVITY_TEXT_VIEW} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} style={{ ...TOUCHABLE_VIEW, ...BORDER_RADIUS_RIGHT, backgroundColor: isActivitySwitch ? color.primary : color.disable }} onPress={() => setIsActivitySwitch(!isActivitySwitch)}>
        <Text tx={'favoriteScreen.vehicle'} style={ACTIVITY_TEXT_VIEW} />
      </TouchableOpacity>
    </View>

    {!isActivitySwitch ? <JobList /> : <TruckList />}

  </View>)
}

export const FavoriteScreen = observer(function FavoriteScreen() {
  const navigation = useNavigation()

  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: 'favorite', title: translate('favoriteScreen.favoriteList') },
    { key: 'historyCall', title: translate('favoriteScreen.lastestContact') },
  ]);

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
        <HeaderCenter tx={"favoriteScreen.favoriteList"} />
      ),
    });
  }, [lang])

  // useFocusEffect(
  //     useCallback(() => {
  //         if (!TruckTypeStore.list.length) {
  //             TruckTypeStore.find()
  //         }
  //         if (FavoriteTruckStore.keepPreviousActivity) {
  //             !FavoriteTruckStore.list.length && FavoriteTruckStore.find()
  //         } else {
  //             !FavoriteJobStore.list.length && FavoriteJobStore.find()
  //         }
  //         return () => {
  //             setIsFirstHeaderSelected(true)
  //             setIsActivitySwitch(FavoriteTruckStore.keepPreviousActivity ? true : false)
  //             setData([])
  //         }
  //     }, [])
  // );

  useEffect(() => {
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find()
    }
  }, [])

  // const renderScene = SceneMap({
  //   favorite: () => <FavoriteRoute />,
  //   historyCall: () => <HistoryCall />,
  // });

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'favorite':
        return <FavoriteRoute />;
      case 'historyCall':
        return <HistoryCall />;
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: color.dim }}
      style={{ backgroundColor: color.primary }}
      renderLabel={({ route, focused, color: colorText }) => (
        <Text style={{ color: color.textBlack }} text={route.title} />
      )}
    />
  )

  return (
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
    />
  )
})


/**
<View testID="FavoriteScreen" style={FULL}>

      <View style={HEADER}>
        <TouchableOpacity activeOpacity={1} style={favoriteHeaderStyle} onPress={() => setIsFirstHeaderSelected(!isFirstHeaderSelected)} >
          <Text tx={'favoriteScreen.favoriteList'} style={{ ...TEXT, color: isFirstHeaderSelected ? color.textBlack : color.textWhite }} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={lastestContactHeaderStyle} onPress={() => setIsFirstHeaderSelected(!isFirstHeaderSelected)} >
          <Text tx={'favoriteScreen.lastestContact'} style={{ ...TEXT, color: !isFirstHeaderSelected ? color.textBlack : color.textWhite }} />
        </TouchableOpacity>
      </View>

      <View style={ACTIVITY}>
        <TouchableOpacity activeOpacity={1} style={{ ...TOUCHABLE_VIEW, ...BORDER_RADIUS_LEFT, backgroundColor: !isActivitySwitch ? color.primary : color.disable }} onPress={() => setIsActivitySwitch(!isActivitySwitch)}>
          <Text tx={'favoriteScreen.job'} style={ACTIVITY_TEXT_VIEW} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={{ ...TOUCHABLE_VIEW, ...BORDER_RADIUS_RIGHT, backgroundColor: isActivitySwitch ? color.primary : color.disable }} onPress={() => setIsActivitySwitch(!isActivitySwitch)}>
          <Text tx={'favoriteScreen.vehicle'} style={ACTIVITY_TEXT_VIEW} />
        </TouchableOpacity>
      </View>

      <View style={RESULT_CONTAINER}>
        {
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={() => onScrollList()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<EmptyListMessage />}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
              />
            }
          />
        }
      </View>

    </View>
 */
