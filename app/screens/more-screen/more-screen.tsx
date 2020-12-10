import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Button, Header, Text } from "../../components"
import { color } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"

const FULL: ViewStyle = { flex: 1 }
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
const MENU: ViewStyle = {
    flexDirection: 'row'
}

export const MoreScreen = observer(function MoreScreen() {
    const navigation = useNavigation()
    const goBack = () => navigation.goBack()

    return (
        <View testID="MoreScreen" style={FULL}>

            <Header
                headerTx="searchCarScreen.searchCar"
                style={HEADER}
                titleStyle={HEADER_TITLE}
                headerText={"หางาน"}
                leftIconReal={true}
                leftIconName={"chevron-back"}
                leftIconSize={24}
                onLeftPress={goBack}
            />

            <View>
                <Text
                    text={'ความปลอดภัย'}
                />
                <View style={MENU}>
                    <Text
                        text={'ตั้งค่ารหัสผ่านของคุณ'}
                    />
                    <Icon name={'chevron-forward'} size={24} color={color.disable} />
                </View>
            </View>

            <View>
                <Text
                    text={'ติดต่อเรา'}
                />
                <View style={MENU}>
                    <Text
                        text={'Line Official Account'}
                    />
                    <Icon name={'chevron-forward'} size={24} color={color.disable} />
                </View>
                <View style={MENU}>
                    <Text
                        text={'Call Center'}
                    />
                    <Icon name={'chevron-forward'} size={24} color={color.disable} />
                </View>
            </View>

            <View>
                <Button
                    testID="continue-with-signin"
                    style={{
                        backgroundColor: color.disable
                    }}
                    textStyle={{ color: color.textWhite }}
                    text={'ออกจากระบบ'}
                    onPress={() => navigation.navigate("signin")}
                />
            </View>

        </View>
    )
})
