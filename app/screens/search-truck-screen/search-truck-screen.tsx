import React, { useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Dimensions, FlatList, ImageStyle, TextStyle, View, ViewStyle } from 'react-native';
import { AdvanceSearchTab, SearchBar } from '../../components';
import { color, spacing } from '../../theme';
import { SearchItem } from '../../components/search-item/search-item';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import RNPickerSelect from 'react-native-picker-select';
import i18n from 'i18n-js'
import { provinceListEn, provinceListTh } from '../../screens/home-screen/manage-vehicle/datasource'
import { Icon } from '../../components/icon/icon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface SubButtonSearch {
  id?: number
  label?: string
  isChecked?: boolean
}

const SEARCH_BAR: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[6],
  paddingBottom: spacing[4],
  marginBottom: spacing[2],
}
const SEARCH_BAR_ROW: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: spacing[2],
  borderBottomWidth: 1,
  borderBottomColor: color.line,
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
const PIN_ICON: ImageStyle = {
  width: 25,
  height: 25,
  marginRight: spacing[5],
}

const DATA = [
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
    fromText,
    toText,
    count,
    packaging,
    detail,
    viewDetail,
    postBy,
    isVerified,
    isLike,
    rating,
    ratingCount,
    isCrown,
    isRecommened,
    logo
  } = data

  const navigation = useNavigation()

  const onPress = () => {
    navigation.navigate('jobDetail', {
      name: 'Hello world'
    })
  }
  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItem
        {
        ...{
          fromText,
          toText,
          count,
          packaging,
          detail,
          viewDetail,
          postBy,
          isVerified,
          isLike,
          rating,
          ratingCount,
          isCrown,
          logo,
          isRecommened,
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
  data: DATA,
  value: ''
}


export const SearchTruckScreen = observer(function SearchTruckScreen() {
  const navigation = useNavigation()

  const [{ subButtons, data, value }, setState] = useState(initialState)

  const renderItem = ({ item }) => (
    <Item {...item} />
  )

  const onScrollList = () => {
    console.log('scroll down')
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

  const onAdvanceSeach = () => {
    // TruckTypeStore.getTruckTypeDropdown(i18n.locale)
    navigation.navigate('advanceSearch')
  }

  const onChangeValue = (val) => {
    console.log(val)
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={SEARCH_BAR}>
        <View style={SEARCH_BAR_ROW}>
          <Icon icon="pinDropYellow" style={PIN_ICON} />
          <RNPickerSelect
            // testID={"picker_vehicle_type"}
            value={value}
            onValueChange={onChangeValue}
            items={i18n.locale == "en" ? provinceListEn : provinceListTh}
            placeholder={{
              label: translate("searchTruckScreen.selectZoneWorking"),
              color: color.black
            }}
            useNativeAndroidPickerStyle={false}
            style={{
              inputAndroidContainer: {
                width: Dimensions.get('window').width
              },
              inputAndroid: {
                color: color.textBlack,
              },
              inputIOSContainer: {
                marginTop: 1,
                paddingVertical: spacing[2],
                width: Dimensions.get('window').width
              },
              inputIOS: {
                color: color.textBlack,
                marginLeft: spacing[1],
              },
            }}
          />
          <MaterialCommunityIcons name={'chevron-down'} size={30} color={color.line} style={{ marginLeft: 'auto' }} />
        </View>
      </View>
      <View style={BUTTON_CONTAINER}>
        <AdvanceSearchTab
          mainText={translate('searchJobScreen.fullSearch')}
          subButtons={subButtons?.length ? subButtons : []}
          onPress={(id) => onPress(id)}
          onAdvanceSeach={onAdvanceSeach}
          count={2}
        />
      </View>
      <View style={RESULT_CONTAINER}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => onScrollList()}
          onEndReachedThreshold={0.5}
        />
      </View>
    </View>
  )
});
