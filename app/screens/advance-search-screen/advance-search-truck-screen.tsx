import React, { useEffect, useLayoutEffect } from 'react'
import { observer } from 'mobx-react-lite';
import { Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from '../../components/text/text';
import Icon from "react-native-vector-icons/Ionicons"
import { color, spacing } from '../../theme';
import AdvanceSearchStore from '../../store/shipper-truck-store/advance-search-store';
import { useNavigation } from '@react-navigation/core';
import { translate } from '../../i18n';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { HeaderLeft, RoundedButton } from '../../components';
import ShipperTruckStore from '../../store/shipper-truck-store/shipper-truck-store'

const { width, height } = Dimensions.get('window')

const ROOT: ViewStyle = {
  flex: 1,
  position: 'relative',
}
const BOX: ViewStyle = {
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[3],
  borderBottomWidth: 1,
  borderBottomColor: color.disable,
}
const ROW: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
}
const ROW_BOX: ViewStyle = {
  flexDirection: 'row',
  position: 'relative',
}
const COUNT: ViewStyle = {
  backgroundColor: color.red,
  borderRadius: Math.round(width + height) / 2,
  position: 'absolute',
  right: -20,
  top: 0,
  width: 15,
  height: 15,
  justifyContent: 'center',
  alignItems: 'center',
}
const COUNT_TEXT: TextStyle = {
  fontSize: 10,
  textAlign: 'center',
  color: color.textWhite,
}
const SUB_MENU_SELECTED: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
}
const ITEM: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: height / 2,
  borderWidth: 1,
  borderColor: color.line,
  paddingVertical: spacing[1],
  paddingHorizontal: spacing[3],
  marginVertical: spacing[1],
  marginHorizontal: spacing[1],
}
const ITEM_TEXT: TextStyle = {
  color: color.line,
}
const ICON: ViewStyle = {
  paddingLeft: spacing[2],
}
const BUTTON_ROOT: ViewStyle = {
  // flex: 1,
  // backgroundColor: 'lightgreen',
  borderTopWidth: 0.5,
  borderTopColor: color.line,

  justifyContent: "center",
  alignItems: 'center'
}
const BUTTON_CONFIRM: ViewStyle = {
  backgroundColor: color.primary,
  width: '90%',
  borderRadius: width,
  marginVertical: spacing[3],
  paddingVertical: spacing[1],
}
const BUTTON_CONFIRM_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
  paddingVertical: spacing[1]
}

const getTopicByType = (type: string) => {
  if (type === 'workZones') {
    return translate('advanceSearchScreen.zoneForDesiredJob')
  } else if (type === 'truckTypes') {
    return translate('advanceSearchScreen.chooseTruckType')
  } else if (type === 'weight') {
    return translate('advanceSearchScreen.chooseWeightMoreThanOne')
  } else {
    return ''
  }
}

const getIdFromArraySelected = (arr: Array<any>) => arr.map((attr: any) => attr.value)

const getRegionId = (arr: Array<any>) => [...new Set(arr.map((attr: any) => attr.parentValue))];

const translationHeader = (type: string) => {
  let headerName = ''
  switch (type) {
    case 'truckTypes':
      headerName = 'advanceSearchScreen.truckType'
      break;
    case 'workZones':
      headerName = 'advanceSearchScreen.zoneForDesiredJob'
      break;
    case 'weight':
      headerName = 'advanceSearchScreen.weight'
      break;
    default:
      break;
  }
  return headerName
}

export const AdvanceSearchTruckScreen = observer(function AdvanceSearchScreen() {

  // const [selectedCount, setSelectedCount] = useState<any>({})

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text tx={"searchJobScreen.clear"} onPress={onClear} />,
      headerLeft: () => (<HeaderLeft onLeftPress={onGoBack} />),
    })
  }, [navigation]);

  useEffect(() => {
    console.log('JSON.parse(JSON.stringify(AdvanceSearchStore.menu)) :>> ', JSON.parse(JSON.stringify(AdvanceSearchStore.menu)));
    if (!AdvanceSearchStore.menu.length) {
      AdvanceSearchStore.mapMenu()
    }

    return () => {
      const values = AdvanceSearchStore.filterSelected ? Object.values(AdvanceSearchStore.filterSelected) : []
      if (values?.length) {
        const valuesWithoutNull = values.filter(Boolean)
        const count = JSON.parse(JSON.stringify(valuesWithoutNull)).reduce((prev: number, curr: Array<any>) => {
          return prev + Object.values(curr).length
        }, 0)
        AdvanceSearchStore.setFilterCount(count)
      }
    }
  }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('JSON.parse(JSON.stringify(AdvanceSearchStore.filterSelected)) :>> ', JSON.parse(JSON.stringify(AdvanceSearchStore.filterSelected)));
  //   }, [])
  // );

  const onGoBack = () => {
    AdvanceSearchStore.clearFilterSelected()
    AdvanceSearchStore.clearSelected()
    AdvanceSearchStore.clearFilterCount()
    navigation.goBack()
  }

  const onPress = (id: number) => {
    const data = JSON.parse(JSON.stringify(AdvanceSearchStore.menu))
    const dataSelected = data.filter(({ id: idx }) => idx === id)
    const type = dataSelected[0].type
    navigation.navigate('advanceSearchTruckItem', {
      data: dataSelected[0].subMenu,
      topic: getTopicByType(type),
      type: type,
      header: translationHeader(type),
    })
  }

  const onConfirm = () => {
    const parseItems = JSON.parse(JSON.stringify(AdvanceSearchStore.filterSelected))

    let filter: any = {
      descending: true,
      page: 0,
      rowsPerPage: 10,
    }

    if (parseItems) {
      const truckTypeValues = parseItems['truckTypes'] ? Object.values(parseItems['truckTypes']) : []
      const arrTruckTypeId = getIdFromArraySelected(truckTypeValues)

      const workingZones = parseItems['workZones'] ? Object.values(parseItems['workZones']) : []
      const arrWorkingZoneId = getRegionId(workingZones)

      filter = {
        ...filter,
        truckTypes: arrTruckTypeId,
        workingZones: arrWorkingZoneId,
      }
    }

    AdvanceSearchStore.setFilter(filter)
    ShipperTruckStore.find(filter)
    navigation.goBack()
  }

  const onClear = () => {
    AdvanceSearchStore.clearFilterSelected()
    AdvanceSearchStore.clearSelected()
    AdvanceSearchStore.clearFilterCount()
  }

  const deleteTypeSelected = (id: number, type: string) => {
    const index = AdvanceSearchStore.filterSelected[type].findIndex(({ id: idx }) => idx === id)
    const parseItems = JSON.parse(JSON.stringify(AdvanceSearchStore.filterSelected))
    delete parseItems[type][index]
    const newItemSelected = parseItems[type].filter(Boolean)
    AdvanceSearchStore.setFilterSelected({
      [type]: newItemSelected
    })
    const parseSelectedItems = JSON.parse(AdvanceSearchStore.selected)
    delete parseSelectedItems[type][id]
    AdvanceSearchStore.setSelected(parseSelectedItems)
  }

  return (
    <View style={ROOT}>

      <ScrollView style={{ padding: spacing[3] }}>

        {AdvanceSearchStore.menu?.map((menu, index) => {
          const type = menu.type
          const count = AdvanceSearchStore.filterSelected
            && AdvanceSearchStore.filterSelected[type]
            ? AdvanceSearchStore.filterSelected[type]?.length
            : 0
          return (
            <View key={`${menu.type}-${index}`} style={BOX}>
              <TouchableOpacity style={ROW} onPress={() => onPress(menu.id)}>
                <View style={ROW_BOX}>
                  <Text text={menu.topic} />
                  {count > 0 && <View style={COUNT}>
                    <Text style={COUNT_TEXT}>{count}</Text>
                  </View>}
                </View>
                <Icon name={'chevron-forward'} size={24} color={color.line} />
              </TouchableOpacity>
              <View style={SUB_MENU_SELECTED}>
                {AdvanceSearchStore.filterSelected && AdvanceSearchStore.filterSelected[type]?.map((data: any, i: number) => {
                  return (
                    <TouchableOpacity key={`selected-item-${i}`} style={ITEM} onPress={() => deleteTypeSelected(data.id, type)}>
                      <Text text={data.name} style={ITEM_TEXT} />
                      <MaterialCommunityIcons name={'close-circle'} size={18} color={color.line} style={ICON} />
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )
        })}

      </ScrollView>

      <View style={BUTTON_ROOT}>
        <RoundedButton
          // testID={"setting-search-confirm"}
          onPress={onConfirm}
          containerStyle={BUTTON_CONFIRM}
          textStyle={BUTTON_CONFIRM_TEXT}
          text={'common.confirm'}
        />
      </View>

    </View>
  )
})
