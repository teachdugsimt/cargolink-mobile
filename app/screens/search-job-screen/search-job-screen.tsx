import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { FlatList, ImageProps, RefreshControl, View, ViewStyle } from 'react-native';
import { ButtonAdvanceSearch, EmptyListMessage } from '../../components';
import { spacing, images as imageComponent } from '../../theme';
import { SearchItem } from '../../components/search-item/search-item';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import CarriersJobStore from "../../store/carriers-job-store/carriers-job-store";
import { GetTruckType } from '../../utils/get-truck-type'
import i18n from 'i18n-js'
import AdvanceSearchStore from "../../store/carriers-job-store/advance-search-store";
import FavoriteJobStore from "../../store/carriers-job-store/favorite-job-store"
import { MapTruckImageName } from '../../utils/map-truck-image-name';
import { useStores } from "../../models/root-store/root-store-context";
import { API_URL } from '../../config'

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
    productTypeId,
    productName,
    truckType,
    weight,
    requiredTruckAmount,
    from,
    to,
    owner,
    isLiked,
    price,
    priceType,
  } = data

  const { tokenStore } = useStores()

  const navigation = useNavigation()

  const onPress = () => {
    const imageSource = owner?.avatar?.object ? {
      source: {
        uri: `${API_URL}/api/v1/media/file-stream?attachCode=` + owner?.avatar?.object || '',
        method: 'GET',
        headers: {
          Accept: 'image/*'
          // Authorization: `Bearer ${owner?.avatar?.token || ''}`,
          // adminAuth: owner?.avatar?.token || ''
        },
      },
      resizeMode: 'cover'
    } : null

    CarriersJobStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })
    CarriersJobStore.findOne(id)
    console.log('---------- job id', id)
    navigation.navigate('jobDetail')
  }

  const onToggleHeart = (data) => {
    if (tokenStore?.token?.accessToken) {
      FavoriteJobStore.add(data.id)
      // CarriersJobStore.updateFavoriteInList(data.id, data.isLike)
    } else {
      navigation.navigate('signin')
    }
  }

  const typeOfTruck = GetTruckType(+truckType)?.name || `${translate('jobDetailScreen.truckType')} : ${translate('common.notSpecified')}`
  const imageSource: ImageProps = owner?.avatar?.object ? {
    source: {
      uri: `${API_URL}/api/v1/media/file-stream?attachCode=` + owner?.avatar?.object || '',
      method: 'GET',
      headers: {
        Accept: 'image/*'
        // Authorization: `Bearer ${owner?.avatar?.token || ''}`,
        // adminAuth: owner?.avatar?.token || ''
      },
    },
    resizeMode: 'cover'
  } : null

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItem
        {
        ...{
          id,
          fromText: from?.name || '',
          toText: to?.map(location => location.name).join(', ') || '',
          count: requiredTruckAmount || '-',
          productName: productName,
          truckType: typeOfTruck,
          viewDetail: true,
          postBy: owner?.companyName || '',
          isVerified: false,
          isLike: isLiked,
          backgroundImage: imageComponent[MapTruckImageName(+truckType) || 'truck'],
          rating: '0',
          // ratingCount,
          // isCrown,
          // isRecommened: true,s
          price: price,
          priceType: priceType === 'PER_TRIP' ? translate('common.round') : translate('common.ton'),
          image: imageSource,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress: () => onPress(),
          onToggleHeart
        }
        }
      />
    </View>
  )
}

let PAGE = 0;

export const SearchJobScreen = observer(function SearchJobScreen() {
  const navigation = useNavigation()

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)

  const { versatileStore } = useStores()

  useEffect(() => {
    CarriersJobStore.find(AdvanceSearchStore.filter)
    return () => {
      PAGE = 0
      // AdvanceSearchStore.clearMenu()
      AdvanceSearchStore.setFilter({})
      CarriersJobStore.setDefaultOfList()
      AdvanceSearchStore.clearFilterSelected()
      AdvanceSearchStore.clearSelected()
      AdvanceSearchStore.clearFilterCount()
      AdvanceSearchStore.clearParentTruckTypeSelected()
    }
  }, [])

  useEffect(() => {
    if (versatileStore.list.length) {
      console.log('versatileStore.list.length :>> ', versatileStore.list.length);
      AdvanceSearchStore.mapMenu(versatileStore.language)
    }
  }, [JSON.stringify(versatileStore.list)])

  const renderItem = ({ item }) => (
    <Item {...item} />
  )

  const onScrollList = () => {
    if (!onEndReachedCalledDuringMomentum
      && CarriersJobStore.list.length >= 10
      && !CarriersJobStore.loading
      // && CarriersJobStore.previousListLength !== listLength
    ) {
      // PAGE = CarriersJobStore.list.length === listLength ? listLength : PAGE + CarriersJobStore.list.length
      PAGE += 1
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      CarriersJobStore.find(advSearch)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onRefresh = () => {
    CarriersJobStore.find(AdvanceSearchStore.filter)
    PAGE = 0
  }

  const onPressAdvanceSearch = () => {
    navigation.navigate('advanceSearchJob')
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={RESULT_CONTAINER}>
        {
          <FlatList
            data={CarriersJobStore.list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={onScrollList}
            onEndReachedThreshold={0.4}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={<EmptyListMessage />}
            onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
            refreshControl={
              <RefreshControl
                refreshing={CarriersJobStore.loading}
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
