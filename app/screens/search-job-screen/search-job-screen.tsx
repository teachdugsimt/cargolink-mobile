import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';
import { AdvanceSearchTab, ModalLoading, SearchBar, Text } from '../../components';
import { color, spacing } from '../../theme';
import { SearchItem } from '../../components/search-item/search-item';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import ShipperJobStore from "../../store/shipper-job-store/shipper-job-store";
import { GetTruckType } from '../../utils/get-truck-type'
import i18n from 'i18n-js'
import AdvanceSearchStore from "../../store/shipper-job-store/advance-search-store";
import TruckTypeStore from "../../store/my-vehicle-store/truck-type-store"
import { provinceListEn, provinceListTh } from '../../screens/home-screen/manage-vehicle/datasource'
import Feather from 'react-native-vector-icons/Feather'
import FavoriteJobStore from "../../store/shipper-job-store/favorite-job-store"

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
    ShipperJobStore.findOne(id)
    navigation.navigate('jobDetail')
  }

  const onToggleHeart = (data) => {
    console.log('onToggleHeart data', data)
    FavoriteJobStore.add(data.id)
    // const nList = ShipperJobStore.list.map(attr => {
    //   return {
    //     ...attr,
    //     isLiked: data.id === attr.id ? !attr.isLiked : attr.isLiked
    //   }
    // }) // [PENDING]
    // ShipperJobStore.list = JSON.parse(JSON.stringify(nList))
  }

  const typeOfTruck = GetTruckType(+truckType, i18n.locale).name

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
          isVerified: true,
          isLike: isLiked,
          // rating,
          // ratingCount,
          // isCrown,
          logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
          isRecommened: true,
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
}

let PAGE = 0;

export const SearchJobScreen = observer(function SearchJobScreen() {
  const navigation = useNavigation()

  const [{ subButtons, data, listLength, filterLength }, setState] = useState(initialState)

  useFocusEffect(
    useCallback(() => {
      const { productType, truckAmountMax, truckAmountMin, truckType, weight } = JSON.parse(JSON.stringify(AdvanceSearchStore.filter))
      const length = [
        ...[...productType || []],
        ...[...truckType || []],
        weight,
        truckAmountMax || truckAmountMin
      ].filter(Boolean).length

      setState(prevState => ({
        ...prevState,
        filterLength: length
      }))
    }, [])
  );

  useEffect(() => {
    ShipperJobStore.find()
    return () => {
      PAGE = 0
      ShipperJobStore.setDefaultOfList()
      setState(initialState)
    }
  }, [])

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      listLength: ShipperJobStore.list.length,
    }))
    if (!ShipperJobStore.loading && !data.length && ShipperJobStore.list && ShipperJobStore.list.length) {
      setState(prevState => ({
        ...prevState,
        data: ShipperJobStore.list,
      }))
    }
  }, [ShipperJobStore.loading, ShipperJobStore.list])

  const renderItem = ({ item }) => (
    <Item {...item} />
  )

  const onScrollList = () => {
    if (ShipperJobStore.list.length >= 10) {
      PAGE = ShipperJobStore.list.length === listLength ? listLength : PAGE + ShipperJobStore.list.length
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      ShipperJobStore.find(advSearch)
    }
  }

  const onPress = (id: number) => {
    console.log('id', id)
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
    ShipperJobStore.find(filter)
    ShipperJobStore.setDefaultOfList()
  }

  const onAdvanceSeach = () => {
    // AdvanceSearchStore.getProductTypes()
    TruckTypeStore.getTruckTypeDropdown(i18n.locale)
    navigation.navigate('advanceSearch')
  }

  return (
    <View style={{ flex: 1 }}>
      {ShipperJobStore.loading && <ModalLoading size={'large'} color={color.primary} visible={ShipperJobStore.loading} />}
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
          data && !!data.length ? <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={() => onScrollList()}
            onEndReachedThreshold={0.5}
          // onMomentumScrollBegin={() => console.log('onResponderEnd')}
          // onMomentumScrollEnd={() => console.log('onMomentumScrollEnd')}
          /> : <View style={CONTEXT_NOT_FOUND}>
              <Feather name={'inbox'} size={50} color={color.line} />
              <Text text={translate('common.notFound')} style={NOT_FOUND_TEXT} preset={'topicExtra'} />
            </View>
        }
      </View>
    </View>
  )
});
