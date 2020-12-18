import React, { useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { observer } from "mobx-react-lite"
import { Button, RadioButton, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { translate } from "../../i18n"
import i18n from 'i18n-js'
import { useStores } from "../../models/root-store/root-store-context";
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
    justifyContent: 'center',
    // alignItems: 'center',
    paddingLeft: spacing[4] + spacing[1],
    paddingRight: spacing[4] + spacing[1]
}
const COLUMN: ViewStyle = {
    flex: 1,
    justifyContent: 'center'
}
const TOPIC: TextStyle = {
    ...BOLD,
    paddingBottom: spacing[2],
}
const MENU: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderColor: color.disable,
}
const BUTTON: ViewStyle = {
    backgroundColor: color.disable,
    marginBottom: spacing[3]
}
const BUTTON_TEXT: TextStyle = {
    color: color.textWhite,
    fontSize: 18
}

const MENUS: Array<MenuProps> = [
    {
        key: 'security',
        topic: 'moreScreen.security', // 'ความปลอดภัย'
        subMenu: [{
            key: 'set-password',
            label: 'moreScreen.setYourPassword', // 'ตั้งค่ารหัสผ่านของคุณ'
            icon: 'chevron-forward'
        }]
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
    },
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
    }
]


export const MoreScreen = observer(function MoreScreen() {
    const navigation = useNavigation()
    const { versatileStore } = useStores()
    const [list, setlist] = useState([
        { label: 'moreScreen.Thai', value: 'th', active: i18n.locale == "th" ? true : false },
        { label: 'moreScreen.English', value: 'en', active: i18n.locale == "en" ? true : false },
    ])
    const [renderNew, setrenderNew] = useState(false)

    const _pressMenu = (item) => {
        console.log("::Press change language:: ", item)
        if (item.key === "thai") {
            versatileStore.setLanguage('th')
            console.log("After change :: ", versatileStore.getLanguage)
        }
        else if (item.key == "english") {
            versatileStore.setLanguage('en')
            console.log("After change :: ", versatileStore.getLanguage)
        }
    }

    const _pressChangeLanguage = (item: any, index: any) => {
        versatileStore.setLanguage(item.value)
        i18n.locale = item.value

        let tmp = list
        tmp[index].active = true
        tmp.forEach((e, i) => {
            if (i != index)
                tmp[i].active = false
        })
        console.log(tmp)
        setlist(tmp)
        setrenderNew(!renderNew)
    }

    return (
        <View testID="MoreScreen" style={FULL}>

            <View style={CONTAINER}>

                {MENUS.map(menu => {
                    return (
                        <View key={menu.key} style={COLUMN}>
                            <Text
                                tx={menu.topic}
                                style={TOPIC}
                            />
                            {menu.key && menu.key != "language" && menu.subMenu && menu.subMenu.map(item => {
                                return (
                                    <TouchableOpacity key={item.key} style={MENU} onPress={() => _pressMenu(item)}>
                                        <Text tx={item.label} />
                                        <Icon name={item.icon} size={24} color={color.disable} />
                                    </TouchableOpacity>
                                )
                            })}
                            {menu.key && menu.key == "language" && renderNew && <RadioButton
                                data={list}
                                onPress={(item: any, index: any) => _pressChangeLanguage(item, index)}
                            />}
                            {menu.key && menu.key == "language" && !renderNew && <RadioButton
                                data={list}
                                onPress={(item: any, index: any) => _pressChangeLanguage(item, index)}
                            />}

                        </View>
                    )
                })}

                <View style={{ ...COLUMN, justifyContent: 'flex-end' }}>
                    <Button
                        testID="continue-with-signin"
                        style={BUTTON}
                        textStyle={BUTTON_TEXT}
                        text={translate('homeScreen.logout')} // 'ออกจากระบบ'
                        onPress={() => {
                            console.log('Click me')
                            navigation.navigate("signin")
                        }}
                    />
                </View>
            </View>
        </View>
    )
})
