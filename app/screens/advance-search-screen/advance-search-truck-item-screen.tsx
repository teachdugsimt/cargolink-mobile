import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Text } from '../../components/text/text'
import { color, spacing } from '../../theme'
import { observer } from 'mobx-react-lite';
import { useNavigation, useRoute } from '@react-navigation/core';
import { HeaderCenter } from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AdvanceSearchTruckStore from '../../store/shipper-truck-store/advance-search-store'

interface ItemsProps {
  id?: number
  isChecked?: boolean
  name?: string
  subMenu?: Array<{
    id?: number
    isChecked?: boolean
    name?: string
  }>
}

const ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite,
}

const BOX: ViewStyle = {
  paddingVertical: spacing[3],
  borderBottomWidth: 1,
  borderBottomColor: color.disable,
}

const BOX_FOR_PROVINCE: ViewStyle = {

}

const ROW: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
}

const ITEM: ViewStyle = {
  borderRadius: Dimensions.get('window').height / 2,
  borderWidth: 1,
  borderColor: color.line,
  paddingVertical: spacing[1],
  paddingHorizontal: spacing[4],
  marginVertical: spacing[1],
  marginHorizontal: spacing[1],
}

const LIST_PROVINCE: ViewStyle = {
  paddingVertical: spacing[3],
  borderBottomWidth: 1,
  borderBottomColor: color.disable,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const ITEM_TEXT: TextStyle = {
  color: color.textBlack,
}

const TOPIC: ViewStyle = {
  paddingBottom: spacing[1],
}

const TOPIC_TEXT: TextStyle = {
  color: color.line,
}

export const AdvanceSearchTruckItemScreen = observer(function AdvanceSearchTruckItemScreen() {

  const navigation = useNavigation()
  const route = useRoute()
  const { data, topic, type, header, screenName = 'truckScreen' } = JSON.parse(JSON.stringify(route.params))

  const [items, setItems] = useState<Array<ItemsProps>>([])
  const [itemSelected, setItemSelected] = useState<any>({})

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft: () => <HeaderLeft onLeftPress={() => onConfirm()} />,
      headerCenter: () => <HeaderCenter tx={header} />,
    })
  }, [navigation]);

  useEffect(() => {
    setItemSelected(AdvanceSearchTruckStore.selected ? JSON.parse(AdvanceSearchTruckStore.selected) : {})
    const parseSelected = AdvanceSearchTruckStore.selected ? JSON.parse(AdvanceSearchTruckStore.selected)['truckTypes'] : null
    console.log('parseSelected :>> ', parseSelected);
    if (
      AdvanceSearchTruckStore.selected
      && parseSelected
      && Object.keys(parseSelected).length
    ) {
      const arrSelected = Object.keys(parseSelected).filter(key => Object.values(parseSelected[key]).length)
      if (arrSelected.length) {
        const filtered = data.filter(({ id }) => arrSelected.includes(id.toString()));
        let truckTypeWithoutFalse = {}
        filtered.forEach(({ id }) => {
          truckTypeWithoutFalse = { ...truckTypeWithoutFalse, [id]: true }
        })
        setItems(filtered)
        AdvanceSearchTruckStore.replaceParentTruckTypeSelected(JSON.stringify(truckTypeWithoutFalse))
      } else {
        AdvanceSearchTruckStore.clearParentTruckTypeSelected()
      }
    }

    return () => {
      if (type === 'truckTypes') {
        // console.log('JSON.parse(JSON.stringify(AdvanceSearchTruckStore.filterSelected)) :>> ', JSON.parse(JSON.stringify(AdvanceSearchTruckStore.filterSelected)));
        // console.log('JSON.parse(JSON.stringify(AdvanceSearchTruckStore.parentTruckTypeSelected)) :>> ', JSON.parse(JSON.stringify(AdvanceSearchTruckStore.parentTruckTypeSelected)));
        if (!AdvanceSearchTruckStore.filterSelected || !AdvanceSearchTruckStore.filterSelected[type] || !AdvanceSearchTruckStore.filterSelected[type].length) {
          AdvanceSearchTruckStore.clearParentTruckTypeSelected()
        }
      }
    }
  }, [])

  // useFocusEffect(
  //   useCallback(() => {

  //   }, [])
  // );

  const selectTruckType = (id: number) => {
    const truckTypeSelected = AdvanceSearchTruckStore.parentTruckTypeSelected ? JSON.parse(AdvanceSearchTruckStore.parentTruckTypeSelected) : {}
    if (!truckTypeSelected[id]) {
      const selectData = data.filter(({ id: idx }) => idx === id)
      const newItems = [...items, ...selectData]
      setItems(newItems)
    } else {
      const parseItems = JSON.parse(JSON.stringify(items))
      const index = parseItems.findIndex(({ id: idx }) => idx === id)
      let clearCheck = {}
      parseItems[index]?.subMenu?.forEach((item: any) => {
        clearCheck = {
          ...clearCheck,
          [item.id]: undefined
        }
      })
      delete parseItems[index]
      const newItems = parseItems.filter(Boolean)
      setItems(newItems)
      setItemSelected(prevState => {
        const state: any = {
          ...prevState,
          [type]: {
            ...prevState[type],
            [id]: clearCheck
          }
        }
        AdvanceSearchTruckStore.setSelected(JSON.parse(JSON.stringify(state)))
        return state
      })
      const clearSelected = AdvanceSearchTruckStore.filterSelected
        && AdvanceSearchTruckStore.filterSelected[type]
        && AdvanceSearchTruckStore.filterSelected[type].length
        && AdvanceSearchTruckStore.filterSelected[type]
          .filter(({ parentValue }) => parentValue !== id)
      AdvanceSearchTruckStore.setFilterSelected({
        [type]: clearSelected || null
      })
    }
    AdvanceSearchTruckStore.setParentTruckTypeSelected(id, !!!truckTypeSelected[id])
  }

  const selectTruckTypeItem = (id: number, parentTruckId: number, data: any) => {
    setItemSelected(prevState => {
      const prevTruckId = prevState[type] ? prevState[type][parentTruckId] : {}
      const truckId = itemSelected[type]
        && itemSelected[type][parentTruckId]
        ? (!!!itemSelected[type][parentTruckId][id] || undefined)
        : true
      const state = {
        ...prevState,
        [type]: {
          ...prevState[type],
          [parentTruckId]: {
            ...prevTruckId,
            [id]: truckId
          }
        }
      }
      AdvanceSearchTruckStore.setSelected(JSON.parse(JSON.stringify(state)))
      return state
    })

    const filterSelected = AdvanceSearchTruckStore.filterSelected ? (JSON.parse(JSON.stringify(AdvanceSearchTruckStore.filterSelected))[type] || []) : []
    const index = filterSelected.findIndex(({ id: idx }) => idx === id)

    if (index >= 0) {
      const dataFilterSelected = JSON.parse(JSON.stringify(filterSelected))
      delete dataFilterSelected[index]
      AdvanceSearchTruckStore.setFilterSelected({
        [type]: dataFilterSelected.filter(Boolean)
      })
    } else {
      const newData = [...filterSelected, data]
      AdvanceSearchTruckStore.setFilterSelected({
        [type]: newData
      })
    }
  }

  const selectItem = (id: number, data: any) => {
    setItemSelected(prevState => {
      const ids = itemSelected[type]
        && itemSelected[type][id]
        ? (!!!itemSelected[type][id] || undefined)
        : true
      const state = {
        ...prevState,
        [type]: {
          ...prevState[type],
          [id]: ids
        }
      }
      AdvanceSearchTruckStore.setSelected(JSON.parse(JSON.stringify(state)))
      return state
    })
    // console.log('selectItem data :>> ', data);
    let index = -1
    const filterSelected = AdvanceSearchTruckStore.filterSelected ? (JSON.parse(JSON.stringify(AdvanceSearchTruckStore.filterSelected))[type] || []) : []
    if (type === 'workZones') {
      index = filterSelected.findIndex(({ value }) => value === id)
    } else {
      index = filterSelected.findIndex(({ id: idx }) => idx === id)
    }

    if (index >= 0) {
      const dataFilterSelected = JSON.parse(JSON.stringify(filterSelected))
      delete dataFilterSelected[index]
      AdvanceSearchTruckStore.setFilterSelected({
        [type]: dataFilterSelected.filter(Boolean)
      })
    } else {
      const newData = [...filterSelected, data]
      AdvanceSearchTruckStore.setFilterSelected({
        [type]: newData
      })
    }
  }

  return (
    <View style={ROOT}>

      <ScrollView style={{ padding: spacing[3] }}>

        {type !== 'workZones' && (
          <View style={TOPIC}>
            <Text text={topic} style={TOPIC_TEXT} />
          </View>
        )}

        {type === 'workZones' && (
          <>
            {data?.map((zone: any, index: number) => {
              return (
                <View key={`zone-${index}`} style={BOX_FOR_PROVINCE}>
                  <View style={[TOPIC, { paddingTop: spacing[4], paddingHorizontal: spacing[1] }]}>
                    <Text text={zone.name} style={[TOPIC_TEXT]} />
                  </View>
                  <View style={{ paddingHorizontal: spacing[4] }}>
                    {zone?.subMenu?.map((province: any, i: number) => {
                      return (
                        <TouchableOpacity key={`province-${i}`} style={[LIST_PROVINCE]} activeOpacity={0.8} onPress={() => selectItem(province.value, province)}>
                          <Text text={province.name} style={ITEM_TEXT} />
                          {itemSelected[type] && itemSelected[type][province.value] && <MaterialCommunityIcons name={'check'} color={color.success} size={16} style={{ marginLeft: 'auto' }} />}
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              )
            })}
          </>
        )}

        {type === 'truckTypes' && (
          <>
            <View style={ROW}>
              {data?.map((menu: any, index: number) => {
                const truckTypeSelected = AdvanceSearchTruckStore.parentTruckTypeSelected ? JSON.parse(AdvanceSearchTruckStore.parentTruckTypeSelected) : {}
                const bgColor = truckTypeSelected && truckTypeSelected[menu.id] ? color.primary : color.transparent

                return (
                  <TouchableOpacity key={index} style={[ITEM, { backgroundColor: bgColor }]} onPress={() => selectTruckType(menu.id)}>
                    <Text text={menu.name} style={ITEM_TEXT} />
                  </TouchableOpacity>
                )
              })}
            </View>

            {items?.map((item: any, index: number) => {
              return (
                <View key={index} style={BOX}>
                  <View style={TOPIC}>
                    <Text text={item.name} style={TOPIC_TEXT} />
                  </View>
                  <View style={ROW}>
                    {item?.subMenu?.map((subMenu: any, i: number) => {
                      const bgColor = itemSelected[type] && itemSelected[type][item.id] && itemSelected[type][item.id][subMenu.id] ? color.primary : color.transparent
                      return (
                        <TouchableOpacity key={`${index}-${i}`} style={[ITEM, { backgroundColor: bgColor }]} onPress={() => selectTruckTypeItem(subMenu.id, item.id, subMenu)}>
                          <Text text={subMenu.name} />
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </View>
              )
            })}
          </>
        )}

        {type === 'weight' && (
          <>
            <View style={ROW}>
              {data?.map((menu: any, index: number) => {
                const bgColor = itemSelected[type] && itemSelected[type][menu.id] ? color.primary : color.transparent
                return (
                  <TouchableOpacity key={index} style={[ITEM, { backgroundColor: bgColor }]} onPress={() => selectItem(menu.id, menu)}>
                    <Text text={menu.name} style={ITEM_TEXT} />
                  </TouchableOpacity>
                )
              })}
            </View>
          </>
        )}

      </ScrollView>

    </View>
  )
})
