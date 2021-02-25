import React, { useState } from 'react'
import { Dimensions, FlatList, ImageProps, RefreshControl, View } from 'react-native'
import { translate } from '../../i18n'
import { color, spacing, images as imageComponent } from '../../theme'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SearchItem } from '../../components/search-item/search-item';
import { EmptyListMessage, Text } from '../../components';
import { useStores } from '../../models';
import { useNavigation } from '@react-navigation/native';
import CarriersJobStore from '../../store/carriers-job-store/carriers-job-store';
import FavoriteJobStore from '../../store/carriers-job-store/favorite-job-store';
import { GetTruckType } from '../../utils/get-truck-type';
import { MapTruckImageName } from '../../utils/map-truck-image-name';
import { SafeAreaView } from 'react-native-safe-area-context';

const Item = (data) => {
  const {
    id,
    productName,
    truckType,
    weight,
    requiredTruckAmount,
    from,
    to,
    owner,
    isLiked,
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
    CarriersJobStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })
    CarriersJobStore.findOne(id)
    navigation.navigate('jobDetail')
  }

  const onToggleHeart = (data) => {
    if (tokenStore?.token?.accessToken) {
      FavoriteJobStore.add(data.id)
      CarriersJobStore.updateFavoriteInList(data.id, data.isLike)
    } else {
      navigation.navigate('signin')
    }
  }

  const typeOfTruck = GetTruckType(+truckType)?.name || `${translate('jobDetailScreen.truckType')} : ${translate('common.notSpecified')}`
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
          backgroundImage: imageComponent[MapTruckImageName(+truckType) || 'truck'],
          rating: '0',
          // ratingCount,
          // isCrown,
          // isRecommened: true,s
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

const renderItem = ({ item }) => (<Item {...item} />)

const WorkInProgressRoute = (data, onScrollList, onRefresh) => (
  <SafeAreaView style={{ flex: 1 }}>
    <FlatList
      data={data || []}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onEndReached={onScrollList}
      onEndReachedThreshold={0.1}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={<EmptyListMessage />}
      // onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      refreshControl={
        <RefreshControl
          refreshing={CarriersJobStore.loading}
          onRefresh={onRefresh}
        />
      }
    />
  </SafeAreaView>
)

const PastWorkRoute = (data, onScrollList, onRefresh) => (
  <FlatList
    data={data || []}
    renderItem={renderItem}
    keyExtractor={item => item.id}
    onEndReached={onScrollList}
    onEndReachedThreshold={0.1}
    contentContainerStyle={{ flexGrow: 1 }}
    ListEmptyComponent={<EmptyListMessage />}
    // onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
    refreshControl={
      <RefreshControl
        refreshing={CarriersJobStore.loading}
        onRefresh={onRefresh}
      />
    }
  />
);

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: color.dim }}
    style={{ backgroundColor: color.backgroundWhite }}
    renderLabel={({ route, focused, color: colorText }) => (
      <Text style={{ color: color.textBlack }} text={route.title} />
    )}
  />
);

export function TabBarNavigation(props) {

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'workInProgress', title: translate('shipperProfileScreen.workInProgress') },
    { key: 'pastWork', title: translate('shipperProfileScreen.pastWork') },
  ]);

  const onScrollList = () => {
    console.log('onScrollList')
  }

  const onRefresh = () => {
    console.log('onRefresh')
  }

  const renderScene = SceneMap({
    workInProgress: () => WorkInProgressRoute(props.data, onScrollList, onRefresh),
    pastWork: () => PastWorkRoute(props.data, onScrollList, onRefresh),
  });

  return (
    <View style={{}}>
      <TabView
        key={props.key}
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        // style={{ backgroundColor: 'pink' }}
        sceneContainerStyle={{ marginVertical: spacing[3] }}
      />
    </View>
  )
}
