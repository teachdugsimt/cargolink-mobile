import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { FlatList, ImageProps, RefreshControl, View, ViewStyle } from 'react-native';
import { AdvanceSearchTab, EmptyListMessage, SearchBar } from '../../components';
import { spacing, images as imageComponent } from '../../theme';
import { SearchItem } from '../../components/search-item/search-item';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import CarriersJobStore from "../../store/carriers-job-store/carriers-job-store";
import { GetTruckType } from '../../utils/get-truck-type'
import i18n from 'i18n-js'
import AdvanceSearchStore from "../../store/carriers-job-store/advance-search-store";
// import TruckTypeStore from "../../store/my-vehicle-store/truck-type-store"
import TruckTypeStore from "../../store/truck-type-store/truck-type-store"
import { provinceListEn, provinceListTh } from '../../screens/home-screen/manage-vehicle/datasource'
import FavoriteJobStore from "../../store/carriers-job-store/favorite-job-store"
import { MapTruckImageName } from '../../utils/map-truck-image-name';
import { useStores } from "../../models/root-store/root-store-context";

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
      // CarriersJobStore.updateFavoriteInList(data.id, data.isLike)
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

const initialState = {
  listLength: 0,
  filterLength: 0,
  arrayFilter: [],
}

let PAGE = 0;

export const SearchJobScreen = observer(function SearchJobScreen() {
  const navigation = useNavigation()

  const [{ listLength, filterLength, arrayFilter }, setState] = useState(initialState)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)
  const [selectSearch, setSelectSearch] = useState({})

  const { versatileStore } = useStores()

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

  useEffect(() => {

    return () => {
      PAGE = 0
      AdvanceSearchStore.clearMenu()
      AdvanceSearchStore.setFilter({})
      CarriersJobStore.setDefaultOfList()
      setState(initialState)
    }
  }, [])

  useEffect(() => {
    if (versatileStore.list.length) {
      AdvanceSearchStore.mapMenu()
    }
  }, [JSON.stringify(versatileStore.list)])

  useEffect(() => {
    if (Object.keys(selectSearch)) {
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
    }
  }, [selectSearch])

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      listLength: CarriersJobStore.list.length,
    }))
  }, [CarriersJobStore.loading])

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

  const onPress = (id: number) => {
    const newMenu = JSON.parse(JSON.stringify(AdvanceSearchStore.menu))
    const indexMenu = newMenu.findIndex(({ type }) => type === 'productType')
    const indexSubmenu = newMenu[indexMenu]?.subMenu.findIndex(({ id: idx }) => idx === id)
    const mainSelect = newMenu[indexMenu].subMenu[indexSubmenu]
    newMenu[indexMenu].subMenu.splice(indexSubmenu, 1, { ...mainSelect, isChecked: !mainSelect.isChecked })

    AdvanceSearchStore.mapMenu(newMenu)

    let productTypes = JSON.parse(JSON.stringify(AdvanceSearchStore.filter))?.productType || []

    if (newMenu[indexMenu].subMenu[indexSubmenu].isChecked) {
      productTypes = [...productTypes, mainSelect.value]
    } else {
      productTypes = productTypes.filter(type => type !== mainSelect.value)
    }

    AdvanceSearchStore.setFilter({ ...AdvanceSearchStore.filter, productType: productTypes })

    setSelectSearch({ ...selectSearch, [id]: !mainSelect.isChecked })
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
  }

  const onAdvanceSeach = () => {
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find(i18n.locale)
    }
    navigation.navigate('advanceSearch')
  }

  const onRefresh = () => {
    CarriersJobStore.find(AdvanceSearchStore.filter)
    PAGE = 0
  }

  return (
    <View style={{ flex: 1 }}>
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
          subButtons={
            AdvanceSearchStore.menu?.filter(({ type }) => type === 'productType')[0]?.subMenu?.map((subMenu, index) => {
              if (index === 1 || index === 2) {
                return { ...subMenu, label: subMenu.name }
              }
              return null
            })?.filter(Boolean) || []
          }
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
    </View>
  )
});
