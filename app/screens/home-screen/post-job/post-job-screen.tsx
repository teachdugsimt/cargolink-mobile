import React from "react"
import { View, ViewStyle, TextStyle, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Header, Text } from "../../../components"
import { spacing, color } from "../../../theme"
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }

const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
    paddingTop: spacing[3],
    paddingBottom: spacing[5] - 1,
    paddingHorizontal: 0,
    backgroundColor: color.mainTheme
}
const HEADER_TITLE: TextStyle = {
    ...BOLD,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
    color: color.black
}

export const PostJobScreen = observer(function PostJobScreen() {
    const navigation = useNavigation()
    const goBack = () => navigation.goBack()

    return (
        <View testID="PostJobScreen" style={FULL}>
            <Header
                headerTx="postJobScreen.postjob"
                // leftIcon="back"
                leftIconReal={true}
                leftIconName={"chevron-back-outline"}
                leftIconSize={24}
                leftIconColor={color.black}
                onLeftPress={goBack}
                style={HEADER}
                titleStyle={HEADER_TITLE}
            />
            <Text style={{ color: 'red' }}>POST JOB SSS+ View</Text>
            <Text style={{ color: 'red' }}>POST JOB SSS+ View</Text>
            <Text style={{ color: 'red' }}>POST JOB SSS+ View</Text>
            <Text style={{ color: 'red' }}>POST JOB SSS+ View</Text>
            <Text style={{ color: 'red' }}>POST JOB SSS+ View</Text>

        </View>
    )
})
