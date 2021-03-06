import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import UserJobStore from '../../store/user-job-store/user-job-store'
import { EmptyListMessage, SearchItem } from "../../components";
import { useStores } from '../../models/root-store/root-store-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import CarriersJobStore from '../../store/carriers-job-store/carriers-job-store'
import FavoriteJobStore from '../../store/carriers-job-store/favorite-job-store'
import { images, spacing } from '../../theme';
import { GetTruckType } from "../../utils/get-truck-type";
import { translate } from '../../i18n';
import { MapTruckImageName } from '../../utils/map-truck-image-name';
import { observer } from 'mobx-react-lite';

const JobItem = (data) => {
  const {
    id,
    productName,
    truckType,
    requiredTruckAmount,
    from,
    to,
    owner,
    isLiked,
    routeName
  } = data

  const { tokenStore } = useStores()

  const navigation = useNavigation()

  const onPress = () => {
    // CarriersJobStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })

    console.log('routeName', routeName)

    CarriersJobStore.setDefaultOfData()
    CarriersJobStore.findOne(id)

    if (routeName === 'inprogress-carrier') {
      navigation.navigate('jobDetailOwner')
    } else if (routeName === 'inprogress-booker') {
      navigation.navigate('myJobDetailOwner')
    } else if (routeName === 'inprogress-favorite') {
      navigation.navigate('favoriteJobDetailOwner')
    }
  }

  const onToggleHeart = (data) => {
    if (tokenStore?.token?.accessToken) {
      FavoriteJobStore.add(data.id)
      CarriersJobStore.updateFavoriteInList(data.id, data.isLike)
    } else {
      navigation.navigate('signin')
    }
  }
  // myJobDetail

  const typeOfTruck = GetTruckType(+truckType)?.name || `${translate('jobDetailScreen.truckType')} : ${translate('common.notSpecified')}`

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItem
        {
        ...{
          id,
          fromText: from?.name || '',
          toText: to?.map(location => location.name).join(', ') || '',
          count: requiredTruckAmount || '',
          productName: productName,
          truckType: typeOfTruck,
          viewDetail: true,
          postBy: owner?.companyName || '',
          isVerified: false,
          isLike: isLiked,
          backgroundImage: images[MapTruckImageName(+truckType) || 'truck'],
          rating: '0',
          bottomComponent: () => <></>,
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

let PAGE = 0

export const TabItem = observer(function TabItem() {

  const route = useRoute()

  useFocusEffect(
    useCallback(() => {
      const status = JSON.parse(JSON.stringify(route.params)).status
      UserJobStore.find({
        userId: UserJobStore.userId,
        page: PAGE,
        type: status
      })

      return () => {
        PAGE = 0
        UserJobStore.clearList()
      }
    }, [])
  );

  const onScrollList = () => {
    console.log('onScrollList')
  }

  const onRefresh = () => {
    console.log('onRefresh')
  }

  return (<FlatList
    data={JSON.parse(JSON.stringify(UserJobStore.list))}
    renderItem={({ item }) => {
      return <JobItem {...item} routeName={route.name} />
    }}
    keyExtractor={item => item.id.toString()}
    onEndReachedThreshold={0.1}
    contentContainerStyle={{ flexGrow: 1 }}
    ListEmptyComponent={<EmptyListMessage containerStyle={{ top: 0 }} />}
    onEndReached={onScrollList}
    // onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
    refreshControl={
      <RefreshControl
        refreshing={CarriersJobStore.loading}
        onRefresh={onRefresh}
      />
    }
  />)
})