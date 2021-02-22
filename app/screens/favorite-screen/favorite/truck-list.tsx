import React, { useCallback, useEffect, useState } from "react"
import { View, ImageProps, FlatList, RefreshControl } from "react-native"
import { EmptyListMessage, SearchItemTruck, Text } from "../../../components"
import { spacing, images as imageComponent } from "../../../theme"
import FavoriteTruckStore from "../../../store/shipper-truck-store/favorite-truck-store"
import { GetTruckType } from "../../../utils/get-truck-type"
import { translate } from "../../../i18n"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import ShipperTruckStore from "../../../store/shipper-truck-store/shipper-truck-store"
import { GetRegion } from "../../../utils/get-region"
import i18n from "i18n-js"
import { MapTruckImageName } from "../../../utils/map-truck-image-name"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../models"

interface JobProps {
  id?: string
  productName?: string
  truckType?: string
  requiredTruckAmount?: string | number
  workingZones?: any
  tipper?: boolean
  stallHeight?: string
  to?: any
  owner?: {
    id?: number
    userId?: string
    companyName?: string
    fullName?: string
    mobileNo?: string
    email?: string
    avatar: {
      object?: string
      token?: string
    }
  }
  isLiked?: boolean
  list?: string
  onToggleHeart?: (props) => void
}

export const Item = (data: JobProps) => {
  const {
    id,
    truckType,
    workingZones,
    isLiked,
    tipper,
    stallHeight,
    onToggleHeart,
    owner,
  } = data

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
    navigation.navigate('favoriteTruckDetail')
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
    return reg.label
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
        {
        ...{
          id,
          fromText: workingZoneStr,
          // count: 2,
          customContent: renderContent,
          truckType: `${translate('common.vehicleTypeField')} : ${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`,
          // viewDetail,
          postBy: owner?.companyName || '', // [Mocking]
          isVerified: false,
          isLike: isLiked,
          backgroundImage: imageComponent[truckImage && truckImage !== 'greyMock' ? truckImage : ''],
          rating: '0', // [Mocking]
          ratingCount: '0', // [Mocking]
          isCrown: false,
          image: imageSource,
          // isRecommened,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress,
          onToggleHeart
        }
        }
      />
    </View>
  )
}


export const TruckList = observer(function TruckList() {
  const navigation = useNavigation()

  const { versatileStore } = useStores()
  const [lang, setlang] = useState(null)

  useFocusEffect(
    useCallback(() => {
      FavoriteTruckStore.find();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      // console.log('re-render when on press heart')
    }, [FavoriteTruckStore.list.length])
  );


  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
    }
  }, [versatileStore.language])

  useEffect(() => {
    if (!FavoriteTruckStore.loading) {
      FavoriteTruckStore.setList(FavoriteTruckStore.list)
    }
  }, [FavoriteTruckStore.loading])

  const renderItem = ({ item }) => (
    <Item {...item} onToggleHeart={onToggleHeart} />
  )

  const onToggleHeart = (res) => {
    const newData = [...JSON.parse(JSON.stringify(FavoriteTruckStore.list))].filter(({ id }) => id !== res.id)
    FavoriteTruckStore.setList(newData)
    FavoriteTruckStore.add(res.id)
  }

  const onScrollList = () => {
    console.log('scroll end')
  }

  const onRefresh = () => {
    FavoriteTruckStore.find();
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={FavoriteTruckStore.list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => onScrollList()}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={<EmptyListMessage />}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={FavoriteTruckStore.loading}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  )
})
