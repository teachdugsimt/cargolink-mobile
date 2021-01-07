import React, { useState } from 'react'
import { observer } from 'mobx-react-lite';
import { FlatList, SafeAreaView, TextStyle, View, ViewStyle } from 'react-native';
import { Header, SearchBar } from '../../components';
import { color, spacing } from '../../theme';
import { SearchItem } from '../../components/search-item/search-item';
import { useNavigation } from '@react-navigation/native';

const TEXT: TextStyle = { color: color.textBlack, }
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = { backgroundColor: color.primary }
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const SEARCH_BAR: ViewStyle = {
  paddingTop: spacing[4],
  paddingBottom: spacing[4],
  paddingLeft: 10 + spacing[2],
  paddingRight: 10,
  marginBottom: 10,
}
const RESULT_CONTAINER: ViewStyle = {
  flex: 1,
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

export const SearchCarScreen = observer(function SearchCarScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  const [data, setData] = useState(DATA)

  const renderItem = ({ item }) => (
    <Item {...item} />
  )

  const onScrollList = () => {
    console.log('scroll down')
  }

  return (
    <View style={{ flex: 1 }}>
      <Header
        headerTx="searchCarScreen.searchCar"
        style={HEADER}
        titleStyle={HEADER_TITLE}
        headerText={"หารถ"}
        leftIconReal={true}
        leftIconName={"chevron-back"}
        leftIconSize={24}
        onLeftPress={goBack}
      />
      <View>
        <SearchBar
          {...{
            fromText: 'ภาคกลาง',
            toText: 'ภาคกลาง',
            navigationTo: 'advanceSearch',
            style: SEARCH_BAR
          }}
        />
      </View>
      <SafeAreaView style={RESULT_CONTAINER}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => onScrollList()}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </View>
  )
});
