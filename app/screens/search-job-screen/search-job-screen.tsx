import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Dimensions, FlatList, TextStyle, View, ViewStyle } from 'react-native';
import { Button, ModalLoading, SearchBar } from '../../components';
import { color, spacing } from '../../theme';
import { SearchItem } from '../../components/search-item/search-item';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import ShipperJobStore from "../../store/shipper-job-store/shipper-job-store";
import { GetTruckType } from '../../utils/get-truck-type'
import i18n from 'i18n-js'
import AdvanceSearchStore from "../../store/shipper-job-store/advance-search-store";
import TruckTypeStore from "../../store/my-vehicle-store/truck-type-store"
import { provinceListEn, provinceListTh } from '../../screens/home-screen/manage-vehicle/datasource'

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
const SUB_BUTTON_CONTAINER: ViewStyle = {
  marginLeft: spacing[2],
  paddingLeft: spacing[2],
  flexDirection: 'row',
  borderLeftWidth: 1,
  borderLeftColor: color.disable,
}
const FULL_SEARCH_BOTTON: ViewStyle = {
  backgroundColor: color.transparent,
  borderRadius: Dimensions.get('window').width / 2,
  borderWidth: 1,
  borderColor: color.primary,
  marginHorizontal: spacing[1],
  paddingHorizontal: spacing[0],
  paddingVertical: spacing[0],
}
const FULL_SEARCH_TEXT: TextStyle = {
  fontSize: 16,
  color: color.textBlack,
}

const DATA_FIRST = [
  {
    id: 1,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.9',
    ratingCount: '122',
    isCrown: true,
    isRecommened: true,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 2,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: false,
    isLike: false,
    rating: '1.9',
    ratingCount: '3',
    isCrown: false,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 3,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.9',
    ratingCount: '122',
    isCrown: true,
    isRecommened: true,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 4,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.5',
    ratingCount: '69',
    isCrown: false,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 5,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.9',
    ratingCount: '122',
    isCrown: true,
    isRecommened: true,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
]

const DATA_SECOND = [
  {
    id: 6,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'GG Transport Thailand',
    isVerified: true,
    isLike: false,
    rating: '3.3',
    ratingCount: '31',
    isCrown: false,
    isRecommened: false,
    logo: 'https://seeklogo.com/images/T/truck-logo-D561DC5A08-seeklogo.com.png',
  },
  {
    id: 7,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.9',
    ratingCount: '122',
    isCrown: true,
    isRecommened: true,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 8,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.9',
    ratingCount: '122',
    isCrown: true,
    isRecommened: true,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
  {
    id: 9,
    fromText: 'ภาคกลาง',
    toText: 'ภาคกลาง',
    count: '2',
    packaging: 'อื่นๆ',
    detail: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.9',
    ratingCount: '122',
    isCrown: true,
    isRecommened: true,
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
  },
]

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
  } = data

  const navigation = useNavigation()

  const onPress = () => {
    navigation.navigate('jobDetail', {
      name: 'Hello world'
    })
  }

  const typeOfTruck = GetTruckType(+truckType, i18n.locale).name

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItem
        {
        ...{
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
          // isLike,
          // rating,
          // ratingCount,
          // isCrown,
          logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
          isRecommened: true,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress
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
}

let PAGE = 0;

export const SearchJobScreen = observer(function SearchJobScreen() {
  const navigation = useNavigation()

  const [{ subButtons, data, listLength }, setState] = useState(initialState)

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
    PAGE = ShipperJobStore.list.length === listLength ? listLength : PAGE + ShipperJobStore.list.length
    const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
    ShipperJobStore.find(advSearch)
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
      descending: true,
      from: fLocale,
      to: sLocale,
      page: 0,
      // rowsPerPage: 6,
    })
  }

  const onSearch = () => {
    const filter = AdvanceSearchStore.filter
    ShipperJobStore.setDefaultOfList()
    ShipperJobStore.find(filter)
  }

  const onAdvanceSeach = () => {
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
        <Button
          testID="full-search-button"
          style={FULL_SEARCH_BOTTON}
          textStyle={FULL_SEARCH_TEXT}
          text={translate('searchJobScreen.fullSearch')} // ค้นหาโดยละเอียด
          onPress={onAdvanceSeach}
        />
        <View style={SUB_BUTTON_CONTAINER}>
          {subButtons.length && subButtons.map(button => {
            const borderColor = button.isChecked ? color.primary : color.disable
            return <Button
              key={button.id}
              testID={`button-search-${button.id}`}
              style={{ ...FULL_SEARCH_BOTTON, borderColor }}
              textStyle={FULL_SEARCH_TEXT}
              text={button.label}
              onPress={() => onPress(button.id)}
            />
          })}
        </View>
      </View>
      <View style={RESULT_CONTAINER}>
        {
          data && !!data.length && <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={() => onScrollList()}
            onEndReachedThreshold={0.5}
          // onMomentumScrollBegin={() => console.log('onResponderEnd')}
          // onMomentumScrollEnd={() => console.log('onMomentumScrollEnd')}
          />
        }
      </View>
    </View>
  )
});
