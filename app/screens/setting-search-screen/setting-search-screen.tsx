import React, { useState, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Checkbox, Text } from '../../components'
import { color, spacing } from '../../theme'
import { useNavigation } from '@react-navigation/native'

interface MENU {
  topic?: string
  subMenu?: {
    label?: string
  }[]
}

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite
}
const SEARCH_ITEM_ROOT: ViewStyle = {
  flex: 5,
  // backgroundColor: "lightblue",
  borderWidth: 1,
  borderColor: color.disable,
  padding: spacing[3]
}
const ITEM: ViewStyle = {

}
const TOPIC: TextStyle = {
  fontSize: 12,
}
const CONTENT: TextStyle = {
  color: color.dim,
}
const ROW: ViewStyle = {
  alignItems: "center",
  flexDirection: 'row',
  borderBottomColor: color.line,
  borderBottomWidth: 1,
}
const BUTTON_ROOT: ViewStyle = {
  flex: 1,
  // backgroundColor: 'lightgreen',
  justifyContent: "center",
  alignItems: 'center'
}
const BUTTON_CONFIRM: ViewStyle = {
  backgroundColor: color.primary,
  width: '90%',
  borderRadius: Dimensions.get('screen').width / 2,
}
const BUTTON_CONFIRM_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
  paddingTop: 5,
  paddingBottom: 5
}

const MENUS: Array<MENU> = [
  {
    topic: 'ประเภทรถ',
    subMenu: [
      {
        label: 'รถ 4 ล้อ'
      },
      {
        label: 'รถ 6 ล้อ'
      },
      {
        label: 'รถ 10 ล้อ'
      },
    ]
  },
  {
    topic: 'จำนวนรถ',
    subMenu: [
      {
        label: '1-2 คัน'
      },
      {
        label: '3-4 คัน'
      },
      {
        label: 'มากกว่า 4 คัน'
      },
    ]
  },
  {
    topic: 'ประเภทสินค้า',
    subMenu: [
      {
        label: 'สินค้าเกษตร'
      },
      {
        label: 'สินค้าเกษตร'
      },
      {
        label: 'สินค้าเกษตร'
      },
      {
        label: 'สินค้าเกษตร'
      },
      {
        label: 'สินค้าเกษตร'
      },
      {
        label: 'สินค้าเกษตร'
      },
    ]
  },
  {
    topic: 'น้ำหนัก',
    subMenu: [
      {
        label: '1-5 ตัน'
      },
      {
        label: '5-10 ตัน'
      },
    ]
  },
]

export const SettingSearchScreen = observer(function SettingSearchScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  const [searchByCategoryCar, setSearchByCategoryCar] = useState(false)
  const [searchByPrice, setSearchByPrice] = useState(false)

  const SubMenu = ({ label, mainIndex, subIndex }): ReactElement => (
    <Button
      key={`${mainIndex}${subIndex}`}
      text={label}
      style={{
        backgroundColor: color.transparent,
        borderWidth: 1,
        borderColor: color.primary,
        borderRadius: Dimensions.get('screen').width / 2,
      }}
      textStyle={{
        color: color.textBlack,
      }}
    />
  )

  return (
    <View style={CONTAINER}>
      <View style={SEARCH_ITEM_ROOT}>

        {
          MENUS.map((menu, index) => {
            return (
              <View style={ITEM} key={index} >
                <View style={ROW}>
                  <Checkbox value={searchByCategoryCar} onToggle={() => setSearchByCategoryCar(!searchByCategoryCar)} />
                  <Text text={menu.topic} style={CONTENT} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {
                    menu.subMenu && menu.subMenu.map((subMenu, i) => {
                      return (<SubMenu key={`${index}${i}`} label={subMenu.label} mainIndex={index} subIndex={i} />)
                    })
                  }
                </View>
              </View>
            )
          })
        }

        {/* <View style={ITEM}>
          <View style={ROW}>
            <Checkbox value={searchByCategoryCar} onToggle={() => setSearchByCategoryCar(!searchByCategoryCar)} />
            <Text text={'กรุณาเลือกประเภทรถขนส่ง'} style={CONTENT} />
          </View>
        </View>
        <View style={ITEM}>
          <View style={ROW}>
            <Checkbox value={searchByPrice} onToggle={() => setSearchByPrice(!searchByPrice)} />
            <Text text={'ช่วงราคา'} style={CONTENT} />
            <Text text={'ช่วงราคา'} style={CONTENT} />
          </View>
        </View> */}
      </View>
      <View style={BUTTON_ROOT}>
        <Button
          testID="setting-search-confirm"
          style={BUTTON_CONFIRM}
          textStyle={BUTTON_CONFIRM_TEXT}
          text={'ยืนยัน'}
          onPress={() => navigation.navigate("searchJob")}
        />
      </View>
    </View>
  )
})