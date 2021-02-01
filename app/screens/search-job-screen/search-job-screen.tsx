import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { FlatList, RefreshControl, TextStyle, View, ViewStyle } from 'react-native';
import { AdvanceSearchTab, EmptyListMessage, ModalLoading, SearchBar, Text } from '../../components';
import { color, spacing, images as imageComponent } from '../../theme';
import { SearchItem } from '../../components/search-item/search-item';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import CarriersJobStore from "../../store/carriers-job-store/carriers-job-store";
import { GetTruckType } from '../../utils/get-truck-type'
import i18n from 'i18n-js'
import AdvanceSearchStore from "../../store/carriers-job-store/advance-search-store";
// import TruckTypeStore from "../../store/my-vehicle-store/truck-type-store"
import TruckTypeStore from "../../store/truck-type-store/truck-type-store"
import { provinceListEn, provinceListTh } from '../../screens/home-screen/manage-vehicle/datasource'
import Feather from 'react-native-vector-icons/Feather'
import FavoriteJobStore from "../../store/carriers-job-store/favorite-job-store"
import { MapTruckImageName } from '../../utils/map-truck-image-name';

interface SubButtonSearch {
  id?: number
  label?: string
  isChecked?: boolean
}

const SEARCH_BAR: ViewStyle = {
  marginBottom: spacing[1],
  paddingVertical: spacing[3],
}
const RESULT_CONTAINER: ViewStyle = {
  flex: 1,
}
const BUTTON_CONTAINER: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: spacing[2],
  justifyContent: 'center',
}
const CONTEXT_NOT_FOUND: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  top: -spacing[5],
}
const NOT_FOUND_TEXT: TextStyle = {
  color: color.line,
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
  } = data

  const navigation = useNavigation()

  const onPress = () => {
    CarriersJobStore.findOne(id)
    navigation.navigate('jobDetail')
  }

  const onToggleHeart = (data) => {
    FavoriteJobStore.add(data.id)
    CarriersJobStore.updateFavoriteInList(data.id, data.isLike)
  }

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
          // packaging: productName,
          // detail,
          viewDetail: true,
          postBy: owner?.companyName || '',
          isVerified: false,
          isLike: isLiked,
          backgroundImage: imageComponent[MapTruckImageName(+truckType) || 'truck'],
          rating: '0',
          // ratingCount,
          // isCrown,
          logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
          // isRecommened: true,s
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

const SUB_BUTTON: Array<SubButtonSearch> = [
  {
    id: 1,
    label: 'สินค้าเกษตร',
    isChecked: false,
  },
  {
    id: 2,
    label: 'อุสาหกรรม',
    isChecked: false,
  },
]

const initialState = {
  subButtons: SUB_BUTTON,
  listLength: 0,
  data: [],
  filterLength: 0,
  arrayFilter: [],
  loading: true,
}

let PAGE = 0;

export const SearchJobScreen = observer(function SearchJobScreen() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [{ subButtons, data, listLength, filterLength, loading, arrayFilter }, setState] = useState(initialState)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)

  useFocusEffect(
    useCallback(() => {
      const { productType, truckAmountMax, truckAmountMin, truckType, weight } = JSON.parse(JSON.stringify(AdvanceSearchStore.filter))
      const arrayFilter = [
        ...[...productType || []],
        ...[...truckType || []],
        weight,
        truckAmountMax || truckAmountMin
      ].filter(Boolean)

      const length = arrayFilter.length

      setState(prevState => ({
        ...prevState,
        filterLength: length,
        arrayFilter: arrayFilter
      }))
    }, [])
  );

  useEffect(() => {
    CarriersJobStore.setDefaultOfList()
    if (!arrayFilter.length) {
      CarriersJobStore.find()
    } else {
      CarriersJobStore.find(AdvanceSearchStore.filter)
    }
  }, [JSON.stringify(arrayFilter)])

  // useEffect(() => {
  //   if (FavoriteJobStore.id) {
  //     FavoriteJobStore.keepLiked('', false)
  //   }
  // }, [isFocused])

  useEffect(() => {
    // CarriersJobStore.find()
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find()
    }

    return () => {
      PAGE = 0
      AdvanceSearchStore.clearMenu()
      AdvanceSearchStore.setFilter({})
      CarriersJobStore.setDefaultOfList()
      setState(initialState)
    }
  }, [])

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      listLength: CarriersJobStore.list.length,
    }))
    // if (!CarriersJobStore.loading && CarriersJobStore.list && CarriersJobStore.list.length) {
    //   setState(prevState => ({
    //     ...prevState,
    //     data: CarriersJobStore.list,
    //   }))
    // }
  }, [CarriersJobStore.loading])

  const renderItem = ({ item }) => (
    <Item {...item} />
  )

  const onScrollList = () => {
    if (!onEndReachedCalledDuringMomentum
      && CarriersJobStore.list.length >= 10
      && !CarriersJobStore.loading
      && CarriersJobStore.previousListLength !== listLength) {
      PAGE = CarriersJobStore.list.length === listLength ? listLength : PAGE + CarriersJobStore.list.length
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      CarriersJobStore.find(advSearch)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onPress = (id: number) => {
    const newButtonSearch = subButtons.map(button => {
      if (button.id !== id) return button
      return { ...button, isChecked: !button.isChecked }
    })

    setState(prevState => ({
      ...prevState,
      subButtons: newButtonSearch,
    }))
  }

  const onSelectDropdown = (fLocale, sLocale) => {
    fLocale = fLocale ? (
      i18n.locale === 'th' ?
        provinceListTh.filter(n => n.value === fLocale)[0].label :
        provinceListEn.filter(n => n.value === fLocale)[0].label
    ) : undefined
    sLocale = sLocale ? (
      i18n.locale === 'th' ?
        provinceListTh.filter(n => n.value === sLocale)[0].label :
        provinceListEn.filter(n => n.value === sLocale)[0].label
    ) : undefined

    AdvanceSearchStore.setFilter({
      ...AdvanceSearchStore.filter,
      descending: true,
      from: fLocale,
      to: sLocale,
      page: 0,
      // rowsPerPage: 6,
    })
  }

  const onSearch = () => {
    const filter = AdvanceSearchStore.filter
    CarriersJobStore.find(filter)
    // CarriersJobStore.setDefaultOfList()
  }

  const onAdvanceSeach = () => {
    // AdvanceSearchStore.getProductTypes()
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find(i18n.locale)
    }
    navigation.navigate('advanceSearch')
  }

  const onRefresh = () => {
    // CarriersJobStore.setDefaultOfList()
    CarriersJobStore.find(AdvanceSearchStore.filter)
    PAGE = 0
  }

  return (
    <View style={{ flex: 1 }}>
      {/* <ModalLoading size={'large'} color={color.primary} visible={loading} /> */}
      <View>
        <SearchBar
          {...{
            fromText: translate('common.from'),
            toText: translate('common.to'),
            navigationTo: 'advanceSearch',
            buttonText: translate('searchJobScreen.search'),
            style: SEARCH_BAR,
            onToggle: (firstLocale, secondLocale) => onSelectDropdown(firstLocale, secondLocale),
            onSearch: onSearch
          }}
        />
      </View>

      <View style={BUTTON_CONTAINER}>
        <AdvanceSearchTab
          mainText={translate('searchJobScreen.fullSearch')}
          subButtons={subButtons.length ? subButtons : []}
          onPress={(id) => onPress(id)}
          onAdvanceSeach={onAdvanceSeach}
          count={filterLength}
        />
      </View>

      <View style={RESULT_CONTAINER}>
        {
          <FlatList
            data={CarriersJobStore.list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={() => onScrollList()}
            onEndReachedThreshold={0.1}
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
    </View>
  )
});
