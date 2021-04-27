import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { observer } from 'mobx-react-lite'
import { Text } from '../../../components'
import { color, spacing } from '../../../theme'
import { useNavigation, useRoute } from '@react-navigation/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AddressStore from '../../../store/my-vehicle-store/address-store'

const FULL: ViewStyle = { flex: 1 }
const ITEM_TEXT: TextStyle = {
  color: color.textBlack,
}

const TOPIC: ViewStyle = {
  paddingBottom: spacing[1],
}

const TOPIC_TEXT: TextStyle = {
  color: color.line,
}


const BOX_FOR_PROVINCE: ViewStyle = {

}

const LIST_PROVINCE: ViewStyle = {
  paddingVertical: spacing[3],
  borderBottomWidth: 1,
  borderBottomColor: color.disable,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}

export const SelectProvinceScreen = observer(function () {
  const navigation = useNavigation()
  const route = useRoute()
  const [itemSelected, setItemSelected] = useState<any>({})
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

  const list_region = JSON.parse(JSON.stringify(AddressStore.workZone))

  const selectItemOnce = (province: any, mainIndex: number) => {
    let tmp_list = list_region
    tmp_list[mainIndex].subMenu.forEach((e, i) => {
      if (e.value == province.value) e.active = !e.active
    })
    AddressStore.setWorkZone(tmp_list)
  }


  console.log("List region here :: ", list_region)
  return (
    <View style={FULL}>
      <ScrollView>
        <>
          {list_region?.map((zone: any, index: number) => {
            return (
              <View key={`zone-${index}`} style={BOX_FOR_PROVINCE}>
                <View style={[TOPIC, { paddingTop: spacing[4], paddingHorizontal: spacing[1] }]}>
                  <Text text={zone.label} style={[TOPIC_TEXT]} />
                </View>
                <View style={{ paddingHorizontal: spacing[4] }}>
                  {zone?.subMenu?.map((province: any, i: number) => {
                    return (
                      <TouchableOpacity key={`province-${i}`} style={[LIST_PROVINCE]} activeOpacity={0.8} onPress={() => selectItemOnce(province, index)}>
                        <Text text={province.label} style={ITEM_TEXT} />
                        {province.active && <MaterialCommunityIcons name={'check'} color={color.success} size={16} style={{ marginLeft: 'auto' }} />}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            )
          })}
        </>
      </ScrollView>
    </View>
  )
})
