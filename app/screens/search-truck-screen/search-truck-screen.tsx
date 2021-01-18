import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Dimensions, FlatList, ImageStyle, TextStyle, View, ViewStyle, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { AdvanceSearchTab, Text, SearchItemJob, Icon, ModalLoading } from '../../components';
import { color, spacing } from '../../theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import { provinceListEn, provinceListTh, regionListEn, regionListTh } from '../../screens/home-screen/manage-vehicle/datasource'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import { Modal, ModalContent } from 'react-native-modals';
import { GetTruckType } from '../../utils/get-truck-type'
import ShipperTruckStore from '../../store/shipper-truck-store/shipper-truck-store'
import AdvanceSearchTruckStore from '../../store/shipper-truck-store/advance-search-store'
import i18n from 'i18n-js'

const width = Dimensions.get('window').width
interface SubButtonSearch {
  id?: number
  label?: string
  isChecked?: boolean
}

const ROW_ALIGN_CENTER: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
}
const SEARCH_BAR: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[6],
  paddingBottom: spacing[4],
  marginBottom: spacing[2],
}
const SEARCH_BAR_ROW: ViewStyle = {
  ...ROW_ALIGN_CENTER,
  paddingBottom: spacing[2],
  borderBottomWidth: 1,
  borderBottomColor: color.line,
}
const RESULT_CONTAINER: ViewStyle = {
  flex: 1,
}
const BUTTON_CONTAINER: ViewStyle = {
  ...ROW_ALIGN_CENTER,
  justifyContent: 'center',
  marginVertical: spacing[2],
}
const PIN_ICON: ImageStyle = {
  width: 25,
  height: 25,
  marginRight: spacing[5],
}
const DROPDOWN_TEXT: TextStyle = {
  width: width,
  color: color.line,
}
const BOTTOM_LINE: ViewStyle = {
  ...ROW_ALIGN_CENTER,
  borderBottomWidth: 1,
  borderBottomColor: color.line,
  paddingVertical: spacing[3],
}
const ZONE: TextStyle = {
  color: color.primary,
}
const PROVINCE: TextStyle = {
  color: color.line,
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
    truckType,
    loadingWeight,
    stallHeight,
    createdAt,
    updatedAt,
    approveStatus,
    registrationNumber,
    tipper,
  } = data

  const navigation = useNavigation()

  const onPress = () => {
    ShipperTruckStore.findOne(id)
    navigation.navigate('truckDetail')
  }

  const onToggleHeart = (data) => {
    console.log('onToggleHeart data', data)
  }

  const typeOfTruck = GetTruckType(+truckType, i18n.locale).name

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItemJob
        {
        ...{
          id,
          fromText: 'ภาคกลาง',
          count: 2,
          truckType: typeOfTruck,
          // viewDetail,
          postBy: 'CargoLink',
          isVerified: true,
          // isLike,
          // rating,
          // ratingCount,
          isCrown: true,
          logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
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

const makeid = (length: number) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const SUB_BUTTON: Array<SubButtonSearch> = [
  {
    id: 1,
    label: 'รถ 4 ล้อ',
    isChecked: false,
  },
  {
    id: 2,
    label: 'รถ 6 ล้อ',
    isChecked: false,
  },
]

const initialState = {
  subButtons: SUB_BUTTON,
  data: [],
  listLength: 0,
  value: '',
  zones: [],
  filterLength: 0,
}

let PAGE = 0

export const SearchTruckScreen = observer(function SearchTruckScreen() {
  const navigation = useNavigation()

  const [{ subButtons, data, value, zones, filterLength }, setState] = useState(initialState)
  const [visible, setVisible] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {
      const { productType, truckAmountMax, truckAmountMin, truckType, weight } = JSON.parse(JSON.stringify(AdvanceSearchTruckStore.filter))
      const length = [
        ...[...truckType || []],
        weight,
      ].filter(Boolean).length

      setState(prevState => ({
        ...prevState,
        filterLength: length
      }))
    }, [])
  );

  useEffect(() => {
    ShipperTruckStore.find()
    let newZone = null
    if (i18n.locale === 'th') {
      newZone = regionListTh.map(reg => {
        const provinces = provinceListTh.filter(prov => prov.region === reg.value).map(prov => ({ ...prov, isSelected: false }))
        return {
          ...reg,
          isSelected: false,
          isSelectedAll: false,
          provinces,
        }
      })
    } else {
      newZone = regionListEn.map(reg => {
        const provinces = provinceListEn.filter(prov => prov.region === reg.value).map(prov => ({ ...prov, isSelected: false }))
        return {
          ...reg,
          isSelected: false,
          isSelectedAll: false,
          provinces,
        }
      })
    }
    setState(prevState => ({
      ...prevState,
      zones: newZone,
    }))

    return () => {
      PAGE = 0
      ShipperTruckStore.setDefaultOfList()
      setState(initialState)
    }
  }, [])

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      listLength: ShipperTruckStore.list.length,
    }))
    if (!ShipperTruckStore.loading && !data.length && ShipperTruckStore.list && ShipperTruckStore.list.length) {
      setState(prevState => ({
        ...prevState,
        data: ShipperTruckStore.list,
      }))
    }
  }, [ShipperTruckStore.loading, ShipperTruckStore.list])

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
    navigation.navigate('advanceSearchJob')
  }

  const onPressZone = (id: number) => {
    const newZone = zones.map(zone => {
      if (zone.value !== id) return zone
      return {
        ...zone,
        isSelected: !zone.isSelected,
        isSelectedAll: !zone.isSelected,
        provinces: zone.provinces.map(prov => ({ ...prov, isSelected: !zone.isSelected }))
      }
    })

    setState(prevState => ({
      ...prevState,
      zones: newZone
    }))
  }

  const onPressProvince = (zoneId: number, provinceId: number) => {
    let selectedCount = 0
    const newZone = zones.map(zone => {
      if (zone.value !== zoneId) return zone
      const newProvince = zone.provinces.map(prov => {
        if (prov.isSelected) selectedCount++
        if (prov.value !== provinceId) return prov
        selectedCount += (!prov.isSelected) ? 1 : (-1)
        return {
          ...prov,
          isSelected: !prov.isSelected
        }
      })

      return {
        ...zone,
        provinces: newProvince,
        isSelected: !!selectedCount,
        isSelectedAll: zone.provinces.length === selectedCount
      }
    })

    setState(prevState => ({
      ...prevState,
      zones: newZone
    }))
  }

  return (
    <View style={{ flex: 1 }}>
      {ShipperTruckStore.loading && <ModalLoading size={'large'} color={color.primary} visible={ShipperTruckStore.loading} />}
      <View style={SEARCH_BAR}>
        <View style={SEARCH_BAR_ROW}>
          <Icon icon="pinDropYellow" style={PIN_ICON} />
          <Text text={translate("searchTruckScreen.selectWorkingZone")} onPress={() => setVisible(!visible)} style={DROPDOWN_TEXT} />
          <MaterialCommunityIcons name={'chevron-down'} size={30} color={color.line} style={{ marginLeft: 'auto' }} />
          <Modal
            visible={visible}
            onTouchOutside={() => setVisible(!visible)}
            onSwipeOut={() => setVisible(!visible)}
            swipeDirection={['up', 'down']}
            swipeThreshold={200}
          >
            <ModalContent >
              <View style={{ width: (width / 1.1), height: '100%', justifyContent: 'flex-start' }}>
                <SafeAreaView style={{ flex: 1 }}>
                  <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: color.primary }} preset={"topic"} tx={"searchTruckScreen.selectWorkingZone"} />
                  </View>
                  <ScrollView>
                    {zones?.length && zones.map((attr, index) => {
                      return (
                        <View key={`zone-${index}-${attr.value}`} style={{ paddingHorizontal: spacing[2] }} >
                          <TouchableOpacity activeOpacity={1} style={BOTTOM_LINE} onPress={() => onPressZone(attr.value)}>
                            <Text text={attr.label} preset={'topic'} style={ZONE} />
                            {attr.isSelected && <MaterialCommunityIcons name={'check'} color={color.primary} size={16} style={{ marginLeft: 'auto' }} />}
                          </TouchableOpacity>
                          <View>
                            {
                              attr.provinces.map((prov, i) => {
                                return (
                                  <TouchableOpacity activeOpacity={1} key={`province-${i}-${prov.value}`} style={BOTTOM_LINE} onPress={() => onPressProvince(attr.value, prov.value)}>
                                    <Text text={prov.label} style={PROVINCE} />
                                    {prov.isSelected && <MaterialCommunityIcons name={'check'} color={color.line} size={16} style={{ marginLeft: 'auto' }} />}
                                  </TouchableOpacity>
                                )
                              })}
                          </View>
                        </View>
                      )
                    })}
                  </ScrollView>
                </SafeAreaView>
              </View>
            </ModalContent>
          </Modal>

        </View>
        {/* <View style={{ flexDirection: 'row', overflow: 'hidden' }}>
          {!!zones?.length && zones.map((zone, index) => {
            if (zone.isSelectedAll) {
              return (
                <TouchableOpacity key={`menu-selected-${index}-${zone.value}`}>
                  <Text text={zone.label} />
                </TouchableOpacity>
              )
            } else if (zone.isSelected) {
              // return (
              //   <View key={`menu-selected-${index}-${zone.value}`}>
              {
                zone.provinces.map((prov, i) => {
                  return prov.isSelected ? (
                    <TouchableOpacity key={`menu-selected-${zone.value}-${i}-${prov.value}`}>
                      <Text text={prov.label} />
                    </TouchableOpacity>
                  ) : null
                })
              }
              // </View>
              // )
            }
            return null
          })}
        </View> */}
      </View>
      <View style={BUTTON_CONTAINER}>
        <AdvanceSearchTab
          mainText={translate('searchJobScreen.fullSearch')}
          subButtons={subButtons?.length ? subButtons : []}
          onPress={(id) => onPress(id)}
          onAdvanceSeach={onAdvanceSeach}
          count={filterLength}
        />
      </View>
      <View style={RESULT_CONTAINER}>
        {/* <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => onScrollList()}
          onEndReachedThreshold={0.5}
        /> */}
        {
          data && !!data.length ? <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => { return item.id + makeid(6) }}
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
