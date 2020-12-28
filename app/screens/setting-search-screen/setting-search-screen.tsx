import React, { useState, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Checkbox, Text } from '../../components'
import { color, spacing } from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

const deviceWidht = Dimensions.get('window').width / 2
const marginPercent = 1
interface MENU {
  id?: number
  topic?: string
  showSubColumn?: number
  isChecked?: boolean
  subMenu?: {
    id?: number
    label?: string
    isChecked?: boolean
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
}
const ITEM: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingTop: spacing[2],
}
const SUB_MENU: ViewStyle = {
  flexDirection: 'row',
  // justifyContent: 'center',
  flexWrap: 'wrap',
  paddingVertical: spacing[3]
}
const ITEM_SUB_MENU: ViewStyle = {
  backgroundColor: color.transparent,
  borderWidth: 1,
  borderRadius: deviceWidht,
  marginVertical: spacing[1],
  marginHorizontal: `${marginPercent}%`,
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
  borderRadius: deviceWidht,
}
const BUTTON_CONFIRM_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
  paddingTop: 5,
  paddingBottom: 5
}

const MENUS: Array<MENU> = [
  {
    id: 1,
    topic: 'ประเภทรถ',
    showSubColumn: 3,
    isChecked: false,
    subMenu: [
      {
        id: 11,
        label: 'รถ 4 ล้อ',
        isChecked: false,
      },
      {
        id: 12,
        label: 'รถ 6 ล้อ',
        isChecked: false,
      },
      {
        id: 13,
        label: 'รถ 10 ล้อ',
        isChecked: false,
      },
    ]
  },
  {
    id: 2,
    topic: 'จำนวนรถ',
    showSubColumn: 3,
    isChecked: false,
    subMenu: [
      {
        id: 21,
        label: '1-2 คัน',
        isChecked: false,
      },
      {
        id: 22,
        label: '3-4 คัน',
        isChecked: false,
      },
      {
        id: 23,
        label: 'มากกว่า 4 คัน',
        isChecked: false,
      },
    ]
  },
  {
    id: 3,
    topic: 'ประเภทสินค้า',
    showSubColumn: 2,
    isChecked: false,
    subMenu: [
      {
        id: 31,
        label: 'สินค้าเกษตร',
        isChecked: false,
      },
      {
        id: 32,
        label: 'สินค้าเกษตร',
        isChecked: false,
      },
      {
        id: 33,
        label: 'สินค้าเกษตร',
        isChecked: false,
      },
      {
        id: 34,
        label: 'สินค้าเกษตร',
        isChecked: false,
      },
      {
        id: 35,
        label: 'สินค้าเกษตร',
        isChecked: false,
      },
      {
        id: 36,
        label: 'สินค้าเกษตร',
        isChecked: false,
      },
    ]
  },
  {
    id: 4,
    topic: 'น้ำหนัก',
    showSubColumn: 2,
    isChecked: false,
    subMenu: [
      {
        id: 41,
        label: '1-5 ตัน',
        isChecked: false,
      },
      {
        id: 42,
        label: '5-10 ตัน',
        isChecked: false,
      },
    ]
  },
]

const initialState = {
  settings: MENUS
}

export const SettingSearchScreen = observer(function SettingSearchScreen() {
  const navigation = useNavigation()

  const [{ settings }, setState] = useState(initialState)

  const onClick = (id: number, isChecked: boolean) => {
    const newMenu = settings.map(menu => {
      if (menu.id !== id) return menu
      const subMenu = menu.subMenu && menu.subMenu.length ? menu.subMenu.map(item => {
        return { ...item, isChecked: !isChecked }
      }) : []
      return { ...menu, isChecked: !isChecked, subMenu }
    })

    setState(prevState => ({
      ...prevState,
      settings: newMenu
    }))
  }

  const onSelect = (subId: number, mainId: number, isChecked: boolean) => {
    const newMenu = settings.map(menu => {
      if (menu.id !== mainId) return menu
      const subMenu = menu.subMenu && menu.subMenu.length ? menu.subMenu.map(item => {
        if (item.id !== subId) return item
        return { ...item, isChecked: !isChecked }
      }) : []
      const unCheckedAll = subMenu.filter(menu => menu.isChecked === true)
      return { ...menu, isChecked: !!unCheckedAll.length, subMenu }
    })

    setState(prevState => ({
      ...prevState,
      settings: newMenu
    }))
  }

  const SubMenu = ({ id, label, isChecked, mainIndex, percentWidth }): ReactElement => {

    return (<Button
      key={id}
      text={label}
      style={{
        ...ITEM_SUB_MENU,
        borderColor: isChecked === true ? color.primary : color.line,
        flexBasis: `${percentWidth}%`,
      }}
      textStyle={{
        color: color.textBlack,
        fontSize: 12
      }}
      onPress={() => onSelect(id, mainIndex, isChecked)}
    />)
  }

  return (
    <View style={CONTAINER}>
      <View style={SEARCH_ITEM_ROOT}>
        <ScrollView style={{ padding: spacing[3] }}>

          {
            settings.length && settings.map((menu, index) => {
              return (
                <View style={ITEM} key={index} >
                  <View style={ROW}>
                    <Checkbox value={menu.isChecked} onToggle={() => onClick(menu.id, menu.isChecked)} />
                    <Text text={menu.topic} style={CONTENT} onPress={() => onClick(menu.id, menu.isChecked)} />
                  </View>
                  <View style={SUB_MENU}>
                    {
                      menu.subMenu && menu.subMenu.map((subMenu, i) => {
                        const percentWidth = (100 - (menu.showSubColumn * (marginPercent * 2))) / menu.showSubColumn
                        const { id, label, isChecked } = subMenu
                        return (<SubMenu key={id} id={id} label={label} isChecked={isChecked} mainIndex={menu.id} percentWidth={percentWidth} />)
                      })
                    }
                  </View>
                </View>
              )
            })
          }

        </ScrollView>
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