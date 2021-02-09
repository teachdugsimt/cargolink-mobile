import React, { useState, useEffect } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, ScrollView, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { Button, RadioButton, Text, RoundedButton, HeaderCenter } from "../../components"
import { color, images, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { translate } from "../../i18n"
import i18n from 'i18n-js'
import { useStores } from "../../models/root-store/root-store-context";
import AuthStore from "../../store/auth-store/auth-store"

interface SubMenuProps {
  key?: string
  label?: string
  icon?: string
}
interface MenuProps {
  key?: string
  topic?: string
  icon?: string
  subMenu?: Array<SubMenuProps>
}

const FULL: ViewStyle = { flex: 1, backgroundColor: color.backgroundWhite }
const TEXT: TextStyle = { color: color.textBlack, }
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = { backgroundColor: color.primary }
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const CONTAINER: ViewStyle = {
  flex: 1,
  // justifyContent: 'center',
  // alignItems: 'center',
  paddingTop: spacing[5],
  paddingLeft: spacing[4] + spacing[1],
  paddingRight: spacing[4] + spacing[1]
}
const GROUP: ViewStyle = {
  // flex: 1,
  // justifyContent: 'center'
  marginBottom: spacing[5]
}
const TOPIC: TextStyle = {
  // ...BOLD,
  fontFamily: 'Kanit-Bold',
  paddingBottom: spacing[2],
}
const MENU: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingTop: spacing[2],
  marginBottom: spacing[2],
  borderBottomWidth: 1,
  borderColor: color.line
}
const BUTTON: ViewStyle = {
  backgroundColor: color.line,
  marginBottom: spacing[3]
}
const BUTTON_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18
}
const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.textWhite
}
const MENUS: Array<MenuProps> = [
  // {
  //   key: 'security',
  //   topic: 'moreScreen.security', // 'ความปลอดภัย'
  //   subMenu: [{
  //     key: 'set-password',
  //     label: 'moreScreen.setYourPassword', // 'ตั้งค่ารหัสผ่านของคุณ'
  //     icon: 'chevron-forward'
  //   }]
  // },
  // {
  //   key: 'problemReport',
  //   topic: 'moreScreen.problemReport', // 'ความปลอดภัย'
  //   subMenu: [{
  //     key: 'report',
  //     label: 'moreScreen.report', // 'ตั้งค่ารหัสผ่านของคุณ'
  //     icon: 'chevron-forward'
  //   }]
  // },
  {
    key: 'language',
    topic: 'moreScreen.language',
    subMenu: [
      {
        key: 'thai',
        label: 'moreScreen.thai',
        icon: 'chevron-forward'
      },
      {
        key: 'english',
        label: 'moreScreen.english',
        icon: 'chevron-forward'
      },
    ]
  },
  {
    key: 'contact-us',
    topic: 'moreScreen.contactUs', // 'ติดต่อเรา'
    subMenu: [
      {
        key: 'line-official-account',
        label: 'moreScreen.lineOfficialAccount', // 'Line Official Account'
        icon: 'chevron-forward'
      },
      {
        key: 'call-center',
        label: 'moreScreen.callCenter', // 'Call Center'
        icon: 'chevron-forward'
      },
    ]
  }
]

const RADIO_VIEW: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end'
}

export const MoreScreen = observer(function MoreScreen() {
  const navigation = useNavigation()
  const { versatileStore, tokenStore } = useStores()
  const [list, setlist] = useState([
    { label: 'moreScreen.Thai', value: 'th', active: i18n.locale == "th" ? true : false },
    { label: 'moreScreen.English', value: 'en', active: i18n.locale == "en" ? true : false },
  ])
  const [renderNew, setrenderNew] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerCenter: () => (
        <HeaderCenter tx={"moreScreen.moreMenu"} />
      ),
    });
  }, [renderNew])

  const _pressMenu = (item) => {
    console.log("::Press change language:: ", item)
    if (item.key === "thai") {
      versatileStore.setLanguage('th')
      console.log("After change :: ", versatileStore.getLanguage)
    }
    else if (item.key == "english") {
      versatileStore.setLanguage('en')
      console.log("After change :: ", versatileStore.getLanguage)
    } else {
      if (item.key == "report") {
        navigation.navigate('report')
      }
    }
  }

  const _pressChangeLanguage = (item: any) => {
    versatileStore.setLanguage(item.value)
    i18n.locale = item.value
    setrenderNew(!renderNew)
  }

  const _renderFlag = (region, i) => {
    return <TouchableOpacity style={{ paddingRight: i == list.length - 1 ? 0 : 5 }} onPress={() => _pressChangeLanguage(region)}>
      <Image source={images[region.value]} width={40} height={30} resizeMode="stretch" style={{ width: 45, height: 30, borderRadius: 3 }} />
    </TouchableOpacity>
  }

  return (
    <View testID="MoreScreen" style={FULL}>

      <View style={CONTAINER}>
        <View style={{ flex: 1 }}>
          {MENUS.map(menu => {
            return (
              <View key={menu.key} style={GROUP}>
                <Text
                  tx={menu.topic}
                  style={TOPIC}
                />
                {menu.key && menu.key != "language" && menu.subMenu && menu.subMenu.map(item => {
                  return (
                    <TouchableOpacity key={item.key} style={MENU} onPress={() => _pressMenu(item)}>
                      <Text tx={item.label} style={{ color: color.line }} />
                      <Icon name={item.icon} size={24} color={color.line} />
                    </TouchableOpacity>
                  )
                })}

                <View style={RADIO_VIEW}>
                  {menu.key && menu.key == "language" && (list.map((e, i) => _renderFlag(e, i)))}
                </View>

              </View>
            )
          })}
        </View>

        <View style={{
          // ...GROUP, justifyContent: 'flex-end',
          paddingVertical: 10
        }}>
          <RoundedButton onPress={() => {
            tokenStore.clearToken()
            AuthStore.clearAuthProfile()
            navigation.navigate("signin")
            console.log("Token after logout :: ", tokenStore.token)
          }}
            text={"homeScreen.logout"}
            containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT}
          />
        </View>
      </View>
    </View>
  )


})
