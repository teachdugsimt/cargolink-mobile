import React from "react"
import { View, ViewStyle, TextStyle, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Header, Text } from "../../components"
import { spacing } from "../../theme"
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }

const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
    paddingTop: spacing[3],
    paddingBottom: spacing[5] - 1,
    paddingHorizontal: 0,
    color: 'black'
}
const HEADER_TITLE: TextStyle = {
    ...BOLD,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
}

export const DetailScreen = observer(function DetailScreen() {
    const navigation = useNavigation()
    const goBack = () => navigation.goBack()

    return (
        <View testID="DetailScreen" style={FULL}>
            <Header
                headerTx="Logout"
                leftIcon="back"
                onLeftPress={goBack}
                style={HEADER}
                titleStyle={HEADER_TITLE}
            />
            <Text style={{ color: 'red' }}>Details SSS+ View</Text>
            <Text style={{ color: 'red' }}>Details SSS+ View</Text>
            <Text style={{ color: 'red' }}>Details SSS+ View</Text>
            <Text style={{ color: 'red' }}>Details SSS+ View</Text>
            <Text style={{ color: 'red' }}>Details SSS+ View</Text>

        </View>
    )
})
