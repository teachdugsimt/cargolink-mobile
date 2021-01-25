import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Dimensions, FlatList, ImageStyle, TextStyle, View, ViewStyle, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { AdvanceSearchTab, Text, SearchItemTruck, Icon, ModalLoading } from '../../components';
import { color, spacing, images as imageComponent } from '../../theme';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { translate } from '../../i18n';
import { provinceListEn, provinceListTh, regionListEn, regionListTh } from '../../screens/home-screen/manage-vehicle/datasource'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import { Modal, ModalContent } from 'react-native-modals';
import TruckTypeStore from '../../store/truck-type-store/truck-type-store'
// import SearchTruckTypeStore from '../../store/truck-type-store/search-truck-type-store'
import ShipperTruckStore from '../../store/shipper-truck-store/shipper-truck-store'
import AdvanceSearchTruckStore from '../../store/shipper-truck-store/advance-search-store'
import i18n from 'i18n-js'
import { GetRegion } from "../../utils/get-region";
import AdvanceSearchStore from '../../store/shipper-truck-store/advance-search-store';
import FavoriteTruckStore from '../../store/shipper-truck-store/favorite-truck-store';
import { MapTruckImageName } from '../../utils/map-truck-image-name';
import { GetTruckType } from '../../utils/get-truck-type';

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
const SELECTED: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: color.line,
  borderRadius: Dimensions.get('window').width / 2,
  paddingVertical: spacing[1],
  paddingHorizontal: spacing[2],
  marginHorizontal: spacing[1],
  marginVertical: spacing[3],
}
const SELECTED_TEXT: TextStyle = {
  color: color.line,
  paddingRight: spacing[2],
}
const CIRCLE_VISIBLE_BUTTON: ViewStyle = {
  width: 60,
  height: 60,
  backgroundColor: color.primary,
  borderRadius: width / 2,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  right: 0,
  // marginLeft: 'auto',
  // marginRight: 'auto',
  // left: '50%',
  // transform: [{
  //   translateX: ,
  // }],
  bottom: spacing[5],
}
const CIRCLE_VISIBLE_BUTTON_TEXT: TextStyle = {
  color: color.textWhite,
}

const Item = (data) => {
  const {
    id,
    truckType,
    // loadingWeight,
    // stallHeight,
    // createdAt,
    // updatedAt,
    // approveStatus,
    // registrationNumber,
    // tipper,
    isLiked,
    workingZones,
  } = data

  const navigation = useNavigation()

  const onPress = () => {
    ShipperTruckStore.findOne(id)
    navigation.navigate('truckDetail')
  }

  const onToggleHeart = (data) => { // id, isLike
    FavoriteTruckStore.add(data.id)
    ShipperTruckStore.updateFavoriteInList(data.id, data.isLike)
  }

  const workingZoneStr = workingZones?.length ? workingZones.map(zone => {
    let reg = GetRegion(zone.region, i18n.locale)
    return reg.label
  }).join(', ') : translate('common.notSpecified')

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItemTruck
        {
        ...{
          id,
          fromText: workingZoneStr,
          count: 2,
          truckType: `${translate('common.vehicleTypeField')} : ${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`,
          // viewDetail,
          postBy: 'CargoLink',
          isVerified: true,
          isLike: isLiked,
          backgroundImage: imageComponent[MapTruckImageName(+truckType) || 'truck'],
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
  // listLength: 0,
  zones: [],
  filterLength: 0,
  // loading: true,
}

const sortArray = (list) => list.sort((a, b) => (a.value > b.value) ? 1 : -1)

const mappingDefaultZone = (regions, provinces) => {
  return regions.map(reg => {
    const resultProvinces = provinces.filter(prov => prov.region === reg.value).map(prov => ({ ...prov, isSelected: false }))
    return {
      ...reg,
      isSelected: false,
      isSelectedAll: false,
      provinces: resultProvinces,
    }
  })
}

let PAGE = 0

export const SearchTruckScreen = observer(function SearchTruckScreen() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [{ subButtons, data, zones, filterLength }, setState] = useState(initialState)
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useFocusEffect(
    useCallback(() => {
      console.log('JSON.parse(JSON.stringify(AdvanceSearchTruckStore.filter))', JSON.parse(JSON.stringify(AdvanceSearchTruckStore.filter)))
      const { truckType } = JSON.parse(JSON.stringify(AdvanceSearchTruckStore.filter))
      const length = [
        ...[...truckType || []],
      ].filter(Boolean).length

      setState(prevState => ({
        ...prevState,
        filterLength: length,
      }))
      PAGE = 0
    }, [])
  );

  useEffect(() => {
    if (FavoriteTruckStore.id) {
      const newData = [...data]
      const index = data.findIndex(({ id }) => id === FavoriteTruckStore.id)
      if (index !== -1) {
        newData.splice(index, 1, { ...newData[index], isLiked: FavoriteTruckStore.liked })
        setState(prevState => ({
          ...prevState,
          data: newData,
        }))
      }
      FavoriteTruckStore.keepLiked('', false)
    }
  }, [isFocused])

  useEffect(() => {
    ShipperTruckStore.find()
    TruckTypeStore.find()
    let newZone = null
    if (i18n.locale === 'th') {
      const ascZones = sortArray(regionListTh)
      newZone = mappingDefaultZone(ascZones, provinceListTh)
    } else {
      const ascZones = sortArray(regionListEn)
      newZone = mappingDefaultZone(ascZones, provinceListEn)
    }
    setState(prevState => ({
      ...prevState,
      zones: newZone,
    }))

    return () => {
      PAGE = 0
      AdvanceSearchStore.clearMenu()
      AdvanceSearchStore.setFilter({})
      ShipperTruckStore.setDefaultOfList()
      setState(initialState)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    // setState(prevState => ({
    //   ...prevState,
    //   listLength: ShipperTruckStore.list.length,
    //   // loading: true,
    // }))
    if (!ShipperTruckStore.loading && !data.length && ShipperTruckStore.list && ShipperTruckStore.list.length && !TruckTypeStore.loading) {
      setState(prevState => ({
        ...prevState,
        data: ShipperTruckStore.list,
        // loading: false
      }))
      setLoading(false)
    }
    if (!ShipperTruckStore.loading) {
      // setState(prevState => ({
      //   ...prevState,
      //   // loading: false
      // }))
      setLoading(false)
    }
  }, [ShipperTruckStore.loading, TruckTypeStore.loading, ShipperTruckStore.list])

  useEffect(() => {
    const zoneIds = zones.filter(({ isSelected }) => isSelected).map(({ value }) => value)
    if (!visible && zoneIds.length) {
      console.log('JSON.parse(JSON.stringify(zones))', JSON.parse(JSON.stringify(zones)))
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), zoneIds }
      AdvanceSearchStore.setFilter(advSearch)
      ShipperTruckStore.find(advSearch)
      ShipperTruckStore.setDefaultOfList()
      PAGE = 0
    }
  }, [visible])

  const renderItem = ({ item }) => (
    <Item {...item} />
  )

  const onScrollList = () => {
    if (ShipperTruckStore.list.length >= AdvanceSearchStore.filter.rowsPerPage) {
      // PAGE = ShipperTruckStore.list.length === listLength ? listLength : PAGE + ShipperTruckStore.list.length
      // PAGE += ShipperTruckStore.list.length % listLength === 0 ? 1 : 0
      PAGE += 1
      console.log('PAGE', PAGE)
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      ShipperTruckStore.find(advSearch)
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

  const onAdvanceSeach = () => {
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

  const deleteZone = (primaryId: string, childId: string = null) => {
    const zoneIdx = zones.findIndex((zone) => zone.value === primaryId)
    if (childId) {
      const provinceIdx = zones[zoneIdx].provinces.findIndex(prov => prov.value === childId)
      zones[zoneIdx].provinces[provinceIdx].isSelected = false
      const searchSelected = zones[zoneIdx].provinces.findIndex(prov => prov.isSelected === true)
      if (searchSelected <= 0) {
        zones[zoneIdx].isSelected = false
        zones[zoneIdx].isSelectedAll = false
      }
    } else {
      zones[zoneIdx].isSelected = false
      zones[zoneIdx].isSelectedAll = false
      zones[zoneIdx].provinces = zones[zoneIdx].provinces.map(prov => ({ ...prov, isSelected: false }))
    }

    setState(prevState => ({
      ...prevState,
      zones: zones
    }))

    const zoneIds = zones.filter(({ isSelected }) => isSelected).map(({ value }) => value)
    const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), zoneIds }
    AdvanceSearchStore.setFilter(advSearch)
    ShipperTruckStore.find(advSearch)
    ShipperTruckStore.setDefaultOfList()
    PAGE = 0
  }

  const onRefresh = () => {
    ShipperTruckStore.find(AdvanceSearchStore.filter)
    ShipperTruckStore.setDefaultOfList()
    PAGE = 0
  }

  const isSelected = zones.find(zone => zone.isSelected === true)

  return (
    <View style={{ flex: 1 }}>
      <ModalLoading size={'large'} color={color.primary} visible={loading} />
      <View style={SEARCH_BAR}>
        <View style={SEARCH_BAR_ROW}>
          <Icon icon="pinDropYellow" style={PIN_ICON} />
          <Text
            text={isSelected ? translate('searchTruckScreen.selected') : translate("searchTruckScreen.selectWorkingZone")}
            onPress={() => setVisible(!visible)} style={DROPDOWN_TEXT}
          />
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
                <SafeAreaView style={{ flex: 1, position: 'relative' }}>
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
                  <TouchableOpacity onPress={() => setVisible(!visible)} style={CIRCLE_VISIBLE_BUTTON}>
                    <MaterialCommunityIcons name={'close-thick'} color={color.textWhite} size={30} />
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </ModalContent>
          </Modal>

        </View>
        <ScrollView horizontal={true} style={{ flexDirection: 'row' }}>
          {!!zones?.length && zones.map((zone, index) => {
            if (zone.isSelectedAll) {
              return (
                <TouchableOpacity key={`menu-selected-${index}-${zone.value}`} style={SELECTED} onPress={() => deleteZone(zone.value)} >
                  <Text text={zone.label} style={SELECTED_TEXT} />
                  <MaterialIcons name={'cancel'} color={color.line} size={18} />
                </TouchableOpacity>
              )
            } else if (zone.isSelected) {
              return (
                <View key={`menu-selected-${index}-${zone.value}`} style={{ flexDirection: 'row' }}>
                  {
                    zone.provinces.map((prov, i) => {
                      return prov.isSelected ? (
                        <TouchableOpacity key={`menu-selected-${zone.value}-${i}-${prov.value}`} style={SELECTED} onPress={() => deleteZone(zone.value, prov.value)}>
                          <Text text={prov.label} style={SELECTED_TEXT} />
                          <MaterialIcons name={'cancel'} color={color.line} size={18} />
                        </TouchableOpacity>
                      ) : null
                    })
                  }
                </View>
              )
            }
            return null
          })}
        </ScrollView>
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
        {
          data && !!data.length && !TruckTypeStore.loading ? <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={() => onScrollList()}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={ShipperTruckStore.loading}
                onRefresh={onRefresh}
              />
            }
          /> : (!loading && <View style={CONTEXT_NOT_FOUND}>
            <Feather name={'inbox'} size={50} color={color.line} />
            <Text text={translate('common.notFound')} style={NOT_FOUND_TEXT} preset={'topicExtra'} />
          </View>)
        }
      </View>
    </View>
  )
});
