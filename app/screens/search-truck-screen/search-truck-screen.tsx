import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Dimensions, FlatList, ImageStyle, TextStyle, View, ViewStyle, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, ImageProps } from 'react-native';
import { AdvanceSearchTab, Text, SearchItemTruck, EmptyListMessage } from '../../components';
import { color, spacing, images as imageComponent } from '../../theme';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { translate } from '../../i18n';
import { provinceListEn, provinceListTh, regionListEn, regionListTh } from '../../screens/home-screen/manage-vehicle/datasource'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Modal, ModalContent } from 'react-native-modals';
import TruckTypeStore from '../../store/truck-type-store/truck-type-store'
import ShipperTruckStore from '../../store/shipper-truck-store/shipper-truck-store'
import i18n from 'i18n-js'
import { GetRegion } from "../../utils/get-region";
import AdvanceSearchStore from '../../store/shipper-truck-store/advance-search-store';
import FavoriteTruckStore from '../../store/shipper-truck-store/favorite-truck-store';
import { MapTruckImageName } from '../../utils/map-truck-image-name';
import { GetTruckType } from '../../utils/get-truck-type';
import { useStores } from "../../models/root-store/root-store-context";

const width = Dimensions.get('window').width

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
  shadowColor: color.line,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  elevation: 5,
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
// const CIRCLE_VISIBLE_BUTTON_TEXT: TextStyle = {
//   color: color.textWhite,
// }

const Item = (data) => {
  const {
    id,
    truckType,
    // loadingWeight,
    stallHeight,
    // createdAt,
    // updatedAt,
    // approveStatus,
    // registrationNumber,
    tipper,
    isLiked,
    owner,
    workingZones,
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
    ShipperTruckStore.setProfile({ ...owner, imageProps: JSON.stringify(imageSource) })
    ShipperTruckStore.findOne(id)
    navigation.navigate('truckDetail')
  }

  const onToggleHeart = (data) => { // id, isLike
    if (tokenStore?.token?.accessToken) {
      FavoriteTruckStore.add(data.id)
      ShipperTruckStore.updateFavoriteInList(data.id, data.isLike)
    } else {
      navigation.navigate('signin')
    }
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
    return reg?.label || ''
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
        {...{
          id,
          fromText: workingZoneStr,
          // count: 2,
          customContent: renderContent,
          truckType: `${translate('common.vehicleTypeField')} : ${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`,
          // viewDetail,
          postBy: owner?.companyName || '',
          isVerified: false,
          isLike: isLiked,
          backgroundImage: imageComponent[truckImage && truckImage !== 'greyMock' ? truckImage : ''],
          // rating,
          // ratingCount,
          isCrown: false,
          image: imageSource,
          // isRecommened,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress,
          onToggleHeart
        }}
      />
    </View>
  )
}

const initialState = {
  zones: [],
  filterLength: 0,
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

  const [{ zones, filterLength }, setState] = useState(initialState)
  const [visible, setVisible] = useState<boolean>(false)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)
  const [selectSearch, setSelectSearch] = useState({})

  const { versatileStore } = useStores()

  useFocusEffect(
    useCallback(() => {
      const { truckType } = JSON.parse(JSON.stringify(AdvanceSearchStore.filter))
      const length = [
        ...[...truckType || []],
      ].filter(Boolean).length

      setState(prevState => ({
        ...prevState,
        filterLength: length,
      }))
      // PAGE = 0
    }, [])
  );

  useEffect(() => {
    if (FavoriteTruckStore.id) {
      FavoriteTruckStore.keepLiked('', false)
    }
  }, [isFocused])

  useEffect(() => {
    ShipperTruckStore.find()
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
    if (versatileStore.list.length) {
      AdvanceSearchStore.mapMenu()
    }
  }, [JSON.stringify(versatileStore.list)])

  useEffect(() => {
    if (Object.keys(selectSearch).length) {
      const { truckType } = JSON.parse(JSON.stringify(AdvanceSearchStore.filter))
      const length = [
        ...[...truckType || []],
      ].filter(Boolean).length

      setState(prevState => ({
        ...prevState,
        filterLength: length,
      }))

      ShipperTruckStore.find(AdvanceSearchStore.filter)
    }
  }, [selectSearch])

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      listLength: ShipperTruckStore.list.length,
    }))
  }, [ShipperTruckStore.loading, TruckTypeStore.loading, ShipperTruckStore.list])

  useEffect(() => {
    const zoneIds = zones.filter(({ isSelected }) => isSelected).map(({ value }) => value)
    if (!visible && zoneIds.length) {
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), zoneIds }
      AdvanceSearchStore.setFilter(advSearch)
      ShipperTruckStore.find(advSearch)
      console.log('ShipperTruckStore.find(advSearch)')
      // ShipperTruckStore.setDefaultOfList()
      PAGE = 0
    }
  }, [visible])

  const renderItem = ({ item }) => (
    <Item {...item} />
  )

  const onScrollList = () => {
    if (!onEndReachedCalledDuringMomentum
      && ShipperTruckStore.list.length >= AdvanceSearchStore.filter.rowsPerPage
      && !ShipperTruckStore.loading
      // && ShipperTruckStore.previousListLength !== listLength
    ) {
      PAGE += 1
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      ShipperTruckStore.find(advSearch)
      console.log('onScrollList ShipperTruckStore.find(advSearch)')
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onPress = (id: number) => {
    let idx = []
    const newMenu = JSON.parse(JSON.stringify(AdvanceSearchStore.menu))
    const indexMenu = newMenu.findIndex(({ type }) => type === 'truckType')
    const indexSubmenu = newMenu[indexMenu]?.subMenu.findIndex(({ id: idx }) => idx === id)
    const mainSelect = newMenu[indexMenu].subMenu[indexSubmenu]
    const activeMenu = newMenu[indexMenu].subMenu[indexSubmenu].subMenu.map(data => {
      idx.push(data.value)
      return { ...data, isChecked: !selectSearch[id] }
    })
    newMenu[indexMenu].subMenu.splice(indexSubmenu, 1, { ...mainSelect, isChecked: !mainSelect.isChecked, subMenu: activeMenu })

    AdvanceSearchStore.mapMenu(newMenu)

    let truckTypes = JSON.parse(JSON.stringify(AdvanceSearchStore.filter))?.truckType || []

    if (newMenu[indexMenu].subMenu[indexSubmenu].isChecked) {
      truckTypes = [...truckTypes, ...mainSelect.subMenu.map(menu => menu.value)]
    } else {
      truckTypes = truckTypes.filter(type => !idx.includes(type))
    }

    AdvanceSearchStore.setFilter({ ...AdvanceSearchStore.filter, truckType: truckTypes })

    setSelectSearch({ ...selectSearch, [id]: !mainSelect.isChecked })
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
    // ShipperTruckStore.setDefaultOfList()
    PAGE = 0
  }

  const onRefresh = () => {
    // ShipperTruckStore.setDefaultOfList()
    ShipperTruckStore.find(AdvanceSearchStore.filter)
    PAGE = 0
  }

  const isSelected = zones.find(zone => zone.isSelected === true)

  return (
    <View style={{ flex: 1 }}>
      <View style={SEARCH_BAR}>
        <View style={SEARCH_BAR_ROW}>
          <MaterialIcons name={'pin-drop'} color={color.primary} size={25} style={PIN_ICON} />
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
                    <MaterialCommunityIcons name={'check'} color={color.textWhite} size={30} />
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
            } else {
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
          })}
        </ScrollView>
      </View>
      <View style={BUTTON_CONTAINER}>
        <AdvanceSearchTab
          mainText={translate('searchJobScreen.fullSearch')}
          // subButtons={subButtons?.length ? subButtons : []}
          subButtons={
            AdvanceSearchStore.menu?.filter(({ type }) => type === 'truckType')[0]?.subMenu?.map(subMenu => {
              if (subMenu.id === 1 || subMenu.id === 2) {
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
            data={ShipperTruckStore.list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={() => onScrollList()}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={<EmptyListMessage />}
            onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
            refreshControl={
              <RefreshControl
                refreshing={ShipperTruckStore.loading}
                onRefresh={onRefresh}
              />
            }
          />
        }
      </View>
    </View>
  )
});
