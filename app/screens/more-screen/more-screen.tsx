import React, { useState, useEffect } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Linking, Alert, Image, Platform } from "react-native"
import { observer } from "mobx-react-lite"
import { Text, RoundedButton, HeaderCenter, Button } from "../../components"
import { color, images, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import i18n from 'i18n-js'
import { useStores } from "../../models/root-store/root-store-context";
import AuthStore from "../../store/auth-store/auth-store"
import ProfileStore from "../../store/profile-store/profile-store"
import ShipperJobStore from "../../store/shipper-job-store/shipper-job-store"
import FavoriteJobStore from "../../store/carriers-job-store/favorite-job-store"

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
const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.black
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
    { label: 'moreScreen.Thai', value: 'th', active: versatileStore.language == "th" ? true : false },
    { label: 'moreScreen.English', value: 'en', active: versatileStore.language == "th" ? false : true },
  ])
  const [renderNew, setrenderNew] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerCenter: () => (
        <HeaderCenter tx={"moreScreen.moreMenu"} />
      ),
    });
  }, [renderNew])

  useEffect(() => {
    setrenderNew(!renderNew)
  }, [tokenStore.token])

  const onCall = (phone: string) => {
    let phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
    __DEV__ && console.tron.log('phoneNumber', phoneNumber)
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          __DEV__ && console.tron.log('Phone number is not available');
          Alert.alert('Phone number is not available')
          return false;
        }
      })
      .then(() => {
        return Linking.openURL(phoneNumber);
      })
      .catch(err => __DEV__ && console.tron.log('err', err));
  };

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
      } else if (item.key == "call-center") {
        onCall(versatileStore.phoneNumber)
      } else if (item.key == "line-official-account") {
        // onCall("021065312")
      }
    }
  }

  const _pressChangeLanguage = (item: any, index: any) => {
    versatileStore.setLanguage(item.value)
    i18n.locale = item.value

    versatileStore.findGroup()
    versatileStore.find()
    versatileStore.findProductType()

    let tmp = list
    tmp[index].active = true
    tmp.forEach((e, i) => {
      if (i != index)
        tmp[i].active = false
    })
    setlist(tmp)

    setrenderNew(!renderNew)
  }

  // const _renderFlag = (region, i) => {
  //   return <TouchableOpacity key={`flag-view-${i}`}
  //     style={{
  //       paddingRight: i == list.length - 1 ? 0 : 5
  //     }} onPress={() => _pressChangeLanguage(region)}>
  //     <Image source={images[region.value]}
  //       width={40} height={30}
  //       resizeMode="stretch" style={{
  //         width: 45, height: 30, borderRadius: 3
  //       }} />
  //   </TouchableOpacity>
  // }
  const _renderRegionButton = (region, i) => {
    return <Button key={`flag-view-${i}`}
      style={{
        marginRight: i == list.length - 1 ? 0 : 5,
        backgroundColor: region.active ? color.primary : color.line
      }} onPress={() => _pressChangeLanguage(region, i)}
      text={region.value.toUpperCase()} textStyle={{ fontFamily: 'Kanit-Bold', fontSize: 14 }}>
    </Button>
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
                  {menu.key && menu.key == "language" && (list.map((e, i) => _renderRegionButton(e, i)))}
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
            ProfileStore.clearAllData()
            ShipperJobStore.clearDataByName('list')
            FavoriteJobStore.setList([])
            navigation.navigate("signin")
          }}
            text={tokenStore?.token?.accessToken && !ProfileStore.loading && ProfileStore.data ? "homeScreen.logout" : "signinScreen.signin"}
            containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT}
          />
        </View>
      </View>
    </View>
  )


})
