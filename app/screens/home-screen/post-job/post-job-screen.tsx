import React from "react"
import { View, ViewStyle, TextStyle, FlatList, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Header, Text } from "../../../components"
import { spacing, color } from "../../../theme"
import { AddJobElement } from '../../../components'
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

const TOP_VIEW: ViewStyle = {
    flex: Platform.OS == "ios" ? 1 : 1,
    backgroundColor: color.mainTheme,
    justifyContent: 'center',
}
const BOTTOM_VIEW: ViewStyle = {
    flex: 5,
}

export const PostJobScreen = observer(function PostJobScreen() {
    // const navigation = useNavigation()

    const data = [
        { no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: true },
        { no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
        { no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
        { no: 4, id: 4, name: 'postJobScreen.success', active: false },
    ]
    return (
        <View testID="PostJobScreen" style={FULL}>
            <View style={TOP_VIEW}>
                <AddJobElement data={data}/>
            </View>
            <View style={BOTTOM_VIEW}>

            </View>
        </View>
    )
})


