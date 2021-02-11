import React, { ReactNode, useEffect, useState } from "react"
import { View, TextStyle, ImageProps, RefreshControl, FlatList } from "react-native"
import { EmptyListMessage, SearchItem, Text } from "../../../components"
import { color, spacing } from "../../../theme"
import FavoriteJobStore from "../../../store/carriers-job-store/favorite-job-store"
import { GetTruckType } from "../../../utils/get-truck-type"
import { translate } from "../../../i18n"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../../models"
import { observer } from "mobx-react-lite"
import CarriersJobStore from "../../../store/carriers-job-store/carriers-job-store"

interface JobProps {
  id?: string
  productName?: string
  truckType?: string
  requiredTruckAmount?: string | number
  from?: any
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
  onToggleHeart?: (props) => void
}

const Item = (data: JobProps) => {
  const {
    id,
    productName,
    truckType,
    requiredTruckAmount,
    from,
    to,
    owner,
    isLiked,
    onToggleHeart = null,
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
    CarriersJobStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })
    CarriersJobStore.findOne(id)
    navigation.navigate('favoriteJobDetail')
  }

  const typeOfTruck = GetTruckType(+truckType)?.name || translate('common.notSpecified')
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

  const onPressHeart = onToggleHeart ? () => onToggleHeart && onToggleHeart(data) : null

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItem
        {
        ...{
          id,
          fromText: from?.name || translate('common.notSpecified'),
          toText: to?.map(location => location.name).join(', ') || translate('common.notSpecified'),
          count: requiredTruckAmount || 0,
          productName: productName,
          truckType: typeOfTruck,
          // packaging: productName,
          postBy: owner?.companyName || '', // [Mocking]
          isVerified: false,
          isLike: isLiked,
          rating: '0', // [Mocking]
          ratingCount: '0', // [Mocking]
          isCrown: false, // [Mocking]
          image: imageSource,
          isRecommened: false,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress,
          onToggleHeart: () => onPressHeart()
        }
        }
      />
    </View>
  )
}

export const JobList = observer(function JobList() {

  const { versatileStore } = useStores()
  const [lang, setlang] = useState(null)

  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
    }
  }, [versatileStore.language])

  useEffect(() => {
    if (!FavoriteJobStore.loading) {
      FavoriteJobStore.setList(FavoriteJobStore.list)
    }
  }, [FavoriteJobStore.loading])

  useEffect(() => {
    // re-render when on press heart
  }, [FavoriteJobStore.list.length])

  const renderItem = ({ item }) => (
    <Item {...item} onToggleHeart={onToggleHeart} />
  )

  const onToggleHeart = (res) => {
    const newData = [...JSON.parse(JSON.stringify(FavoriteJobStore.list))].filter(({ id }) => id !== res.id)
    FavoriteJobStore.setList(newData)
    FavoriteJobStore.add(res.id)
  }

  const onScrollList = () => {
    console.log('scroll end')
  }

  const onRefresh = () => {
    FavoriteJobStore.find();
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={FavoriteJobStore.list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => onScrollList()}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={<EmptyListMessage />}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={FavoriteJobStore.loading}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  )
})
