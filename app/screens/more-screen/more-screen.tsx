import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Button, Header, Text } from "../../components"
import { color, spacing } from "../../theme"
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
const CONTAINER: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingLeft: spacing[4] + spacing[1],
    paddingRight: spacing[4] + spacing[1]
}
const COLUMN: ViewStyle = {
    flex: 1,
    justifyContent: 'flex-end'
}
const TOPIC: TextStyle = {
    ...BOLD,
}
const MENU: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: color.error,
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

export const MoreScreen = observer(function MoreScreen() {
    const navigation = useNavigation()
    const goBack = () => navigation.goBack()

    return (
        <View testID="MoreScreen" style={FULL}>

            <Header
                headerTx="searchCarScreen.searchCar"
                style={HEADER}
                titleStyle={HEADER_TITLE}
                headerText={"เมนูเพิ่มเติม"}
                leftIconReal={true}
                leftIconName={"chevron-back"}
                leftIconSize={24}
                onLeftPress={goBack}
            />

            <View style={CONTAINER}>
                <View style={COLUMN}>
                    <Text
                        text={'ความปลอดภัย'}
                        style={TOPIC}
                    />
                    <View style={MENU}>
                        <Text
                            text={'ตั้งค่ารหัสผ่านของคุณ'}
                        />
                        <Icon name={'chevron-forward'} size={24} color={color.disable} />
                    </View>
                </View>

                <View style={COLUMN}>
                    <Text
                        text={'ติดต่อเรา'}
                        style={TOPIC}
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

                <View style={COLUMN}>
                    <Button
                        testID="continue-with-signin"
                        style={BUTTON}
                        textStyle={BUTTON_TEXT}
                        text={'ออกจากระบบ'}
                        onPress={() => navigation.navigate("signin")}
                    />
                </View>
            </View>

        </View>
    )
})
