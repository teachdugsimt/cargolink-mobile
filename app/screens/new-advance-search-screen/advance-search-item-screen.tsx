import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Text } from '../../components/text/text'
import { color, spacing } from '../../theme'
import { observer } from 'mobx-react-lite';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core';
import { HeaderCenter } from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AdvanceSearchStore from '../../store/shipper-truck-store/advance-search-store'

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

const setFilterTypeId = (type: string) => {
  try {
    const selected = JSON.parse(AdvanceSearchStore.selected)
    const dataWithType = selected[type]
    let arrTypes = []
    if (type === 'truckTypes') {
      const values = Object.values(dataWithType)
      values.forEach(v => {
        const res = Object.keys(v).filter(k => v[k])
        arrTypes.push(...res)
      })
    } else if (type === 'weight') {
      console.log('weight')
      const res = Object.keys(dataWithType).filter(k => dataWithType[k])
      arrTypes.push(...res)
    } else {
      const res = Object.keys(dataWithType).filter(k => dataWithType[k])
      arrTypes.push(...res)
    }
    return arrTypes
  } catch (e) {
    return []
  }
}

export const AdvanceSearchItemScreen = observer(function AdvanceSearchItemScreen() {

  const navigation = useNavigation()
  const route = useRoute()
  const { data, topic, type } = JSON.parse(JSON.stringify(route.params))

  const [items, setItems] = useState<Array<ItemsProps>>([])
  const [truckTypeSelected, setTruckTypeSelected] = useState<any>({})
  const [itemSelected, setItemSelected] = useState<any>({})

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft: () => <HeaderLeft onLeftPress={() => onConfirm()} />,
      headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
    })
  }, [navigation]);

  useEffect(() => {
    setItemSelected(AdvanceSearchStore.selected ? JSON.parse(AdvanceSearchStore.selected) : {})
  }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       let arrayTypes = []
  //       data.forEach(({ type }) => arrayTypes.push(setFilterTypeId(type)))
  //       console.log('arrayTypes :>> ', arrayTypes);
  //     }
  //   }, [])
  // );

  const selectTruckType = (id: number) => {
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
          [item.id]: false
        }
      })
      delete parseItems[index]
      const newItems = parseItems.filter(Boolean)
      setItems(newItems)
      setItemSelected(prevState => ({
        ...prevState,
        [type]: {
          ...prevState[type],
          // ...clearCheck,
          [id]: {
            // ...prevState[type][id] || undefined,
            ...clearCheck,
          }
        }
      }))
    }
    setTruckTypeSelected(prevState => ({
      ...prevState,
      [id]: !!!truckTypeSelected[id]
    }))
  }

  const selectTruckTypeItem = (id: number, parentTruckId: number) => {
    setItemSelected(prevState => {
      const prevTruckId = prevState[type] ? prevState[type][parentTruckId] : {}
      const state = {
        ...prevState,
        [type]: {
          ...prevState[type],
          [parentTruckId]: {
            ...prevTruckId,
            [id]: itemSelected[type] && itemSelected[type][parentTruckId] ? !!!itemSelected[type][parentTruckId][id] : true
          }
        }
      }
      AdvanceSearchStore.setSelected(state)
      return state
    })
  }

  const selectItem = (id: number) => {
    setItemSelected(prevState => {
      const state = {
        ...prevState,
        [type]: {
          ...prevState[type],
          [id]: itemSelected[type] ? !!!itemSelected[type][id] : true
        }
      }
      AdvanceSearchStore.setSelected(state)
      return state
    })
  }

  console.log('itemSelected :>> ', itemSelected);
  console.log('AdvanceSearchStore.selected :>> ', AdvanceSearchStore.selected);

  return (
    <View style={ROOT}>

      <ScrollView style={{ padding: spacing[3] }}>

        <View style={TOPIC}>
          <Text text={topic} style={TOPIC_TEXT} />
        </View>

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
                        <TouchableOpacity key={`province-${i}`} style={[LIST_PROVINCE]} activeOpacity={0.8} onPress={() => selectItem(province.value)}>
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
                // const bgColor = truckTypeSelected && truckTypeSelected[menu.id] ? color.primary : color.transparent
                const bgColor = itemSelected[type] && itemSelected[type][menu.id] ? color.primary : color.transparent
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
                        <TouchableOpacity key={`${index}-${i}`} style={[ITEM, { backgroundColor: bgColor }]} onPress={() => selectTruckTypeItem(subMenu.id, item.id)}>
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
                  <TouchableOpacity key={index} style={[ITEM, { backgroundColor: bgColor }]} onPress={() => selectItem(menu.id)}>
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
