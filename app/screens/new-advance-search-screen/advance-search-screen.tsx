import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from '../../components/text/text';
import Icon from "react-native-vector-icons/Ionicons"
import { color, spacing } from '../../theme';
import AdvanceSearchStore from '../../store/shipper-truck-store/advance-search-store';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/core';
import { translate } from '../../i18n';

const ROW: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: spacing[3],
  paddingHorizontal: spacing[3],
  borderBottomWidth: 1,
  borderBottomColor: color.disable,
}
const ROW_BOX: ViewStyle = {
  flexDirection: 'row',
  position: 'relative',
}
const COUNT: ViewStyle = {
  backgroundColor: color.red,
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
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

const setFilterTypeId = (type: string) => {
  try {
    const selected = JSON.parse(AdvanceSearchStore.selected)
    const dataWithType = selected[type]
    console.log('dataWithType :>> ', dataWithType);
    if (!dataWithType) return []
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

export const NewAdvanceSearchScreen = observer(function AdvanceSearchScreen() {

  const [selectedCount, setSelectedCount] = useState<any>({})

  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    console.log('JSON.parse(JSON.stringify(AdvanceSearchStore.menu)) :>> ', JSON.parse(JSON.stringify(AdvanceSearchStore.menu)));
  }, [])

  useFocusEffect(
    useCallback(() => {
      let objType: any = {}
      let objCountType: any = {}
      let countType: number = 0
      AdvanceSearchStore.menu.forEach(({ type }) => {
        const arrTypeId = setFilterTypeId(type)
        objType = {
          ...objType,
          [type]: arrTypeId
        }
        objCountType = {
          ...objCountType,
          [type]: arrTypeId.length
        }
        countType += arrTypeId.length
      })

      AdvanceSearchStore.setFilterTypeId(objType)
      AdvanceSearchStore.setFilterCount(countType)
      setSelectedCount(prevState => ({
        ...prevState,
        ...objCountType
      }))
    }, [])
  );

  const onPress = (id: number) => {
    const data = JSON.parse(JSON.stringify(AdvanceSearchStore.menu))
    const dataSelected = data.filter(({ id: idx }) => idx === id)
    const type = dataSelected[0].type
    navigation.navigate('advanceSearchItem', {
      data: dataSelected[0].subMenu,
      topic: getTopicByType(type),
      type: type
    })
  }

  return (
    <View style={{ flex: 1 }}>

      <ScrollView style={{ padding: spacing[3] }}>

        {AdvanceSearchStore.menu?.map((menu, index) => {
          // const count = AdvanceSearchStore.filterTypeId[menu.type]?.length
          const count = selectedCount[menu.type]
          return (
            <TouchableOpacity key={`${menu.type}-${index}`} style={ROW} onPress={() => onPress(menu.id)}>
              <View style={ROW_BOX}>
                <Text text={menu.topic} />
                {count > 0 && <View style={COUNT}>
                  <Text style={COUNT_TEXT}>{count}</Text>
                </View>}
              </View>
              <Icon name={'chevron-forward'} size={24} color={color.line} />
            </TouchableOpacity>
          )
        })}

      </ScrollView>

    </View>
  )
})
