import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Dimensions, FlatList, ImageStyle, TextStyle, View, ViewStyle, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, ImageProps } from 'react-native';
import { AdvanceSearchTab, Text, SearchItemTruck, EmptyListMessage, ButtonAdvanceSearch } from '../../components';
import { color, spacing, images as imageComponent } from '../../theme';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { translate } from '../../i18n';
import ShipperTruckStore from '../../store/shipper-truck-store/shipper-truck-store'
import i18n from 'i18n-js'
import { GetRegion } from "../../utils/get-region";
import AdvanceSearchStore from '../../store/shipper-truck-store/advance-search-store';
import FavoriteTruckStore from '../../store/shipper-truck-store/favorite-truck-store';
import { MapTruckImageName } from '../../utils/map-truck-image-name';
import { GetTruckType } from '../../utils/get-truck-type';
import { useStores } from "../../models/root-store/root-store-context";
import analytics from '@react-native-firebase/analytics';

const RESULT_CONTAINER: ViewStyle = {
  flex: 1,
  paddingTop: spacing[2],
}
const ADVANCE_SEARCH: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  paddingBottom: spacing[2]
}

const Item = (data) => {
  const {
    id,
    truckType,
    // loadingWeight,
    stallHeight,
    // createdAt,
    // updatedAt,
    // approveStatus,
    // registrationNumber,
    tipper,
    isLiked,
    owner,
    workingZones,
  } = data

  const { tokenStore } = useStores()

  const navigation = useNavigation()

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
    ShipperTruckStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })
    ShipperTruckStore.findOne(id)
    navigation.navigate('truckDetail')
  }

  const onToggleHeart = (data) => { // id, isLike
    if (tokenStore?.token?.accessToken) {
      FavoriteTruckStore.add(data.id)
      // ShipperTruckStore.updateFavoriteInList(data.id, data.isLike)
    } else {
      navigation.navigate('signin')
    }
  }

  const renderContent = () => (<View style={{ paddingLeft: spacing[2] }}>
    <View style={{ paddingVertical: spacing[1] }}>
      <Text text={`${translate('truckDetailScreen.heighttOfTheCarStall')} : ${stallHeight ? translate(`common.${stallHeight.toLowerCase()}`) : '-'}`} />
    </View>
    <View style={{ paddingVertical: spacing[1] }}>
      <Text text={`${tipper ? translate('truckDetailScreen.haveDump') : translate('truckDetailScreen.haveNotDump')}`} />
    </View>
  </View>)

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

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItemTruck
        {...{
          id,
          fromText: workingZoneStr,
          // count: 2,
          customContent: renderContent,
          truckType: `${translate('common.vehicleTypeField')} : ${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`,
          // viewDetail,
          postBy: owner?.companyName || '',
          isVerified: false,
          isLike: isLiked,
          backgroundImage: imageComponent[truckImage && truckImage !== 'greyMock' ? truckImage : ''],
          // rating,
          // ratingCount,
          isCrown: false,
          image: imageSource,
          // isRecommened,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress,
          onToggleHeart
        }}
      />
    </View>
  )
}

let PAGE = 0

export const SearchTruckScreen = observer(function SearchTruckScreen() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)

  const { versatileStore } = useStores()

  useFocusEffect(
    useCallback(() => {

    }, [])
  );

  useEffect(() => {
    if (FavoriteTruckStore.id) {
      FavoriteTruckStore.keepLiked('', false)
    }
  }, [isFocused])

  useEffect(() => {
    ShipperTruckStore.find()

    return () => {
      PAGE = 0
      // AdvanceSearchStore.clearMenu()
      AdvanceSearchStore.setFilter({})
      ShipperTruckStore.setDefaultOfList()
      AdvanceSearchStore.clearFilterSelected()
      AdvanceSearchStore.clearSelected()
      AdvanceSearchStore.clearFilterCount()
      AdvanceSearchStore.clearParentTruckTypeSelected()
    }
  }, [])

  useEffect(() => {
    if (versatileStore.list.length) {
      AdvanceSearchStore.mapMenu(versatileStore.language)
    }
  }, [JSON.stringify(versatileStore.list)])

  const renderItem = ({ item }) => (
    <Item {...item} />
  )

  const onScrollList = () => {
    if (!onEndReachedCalledDuringMomentum
      && ShipperTruckStore.list.length >= AdvanceSearchStore.filter.rowsPerPage
      && !ShipperTruckStore.loading
      // && ShipperTruckStore.previousListLength !== listLength
    ) {
      PAGE += 1
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      ShipperTruckStore.find(advSearch)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onRefresh = () => {
    // ShipperTruckStore.setDefaultOfList()
    ShipperTruckStore.find(AdvanceSearchStore.filter)
    PAGE = 0
  }

  const onPressAdvanceSearch = () => {
    navigation.navigate('advanceSearchTruck')
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={RESULT_CONTAINER}>
        {
          <FlatList
            data={ShipperTruckStore.list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={() => onScrollList()}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={<EmptyListMessage />}
            onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
            refreshControl={
              <RefreshControl
                refreshing={ShipperTruckStore.loading}
                onRefresh={onRefresh}
              />
            }
          />
        }
      </View>
      <View style={ADVANCE_SEARCH}>
        <ButtonAdvanceSearch
          label={translate('advanceSearchScreen.search')}
          count={AdvanceSearchStore.filterCount}
          onPress={onPressAdvanceSearch}
        />
      </View>
    </View>
  )
});
