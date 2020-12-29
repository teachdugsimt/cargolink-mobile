import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../../components"
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }



export const SettingScreen = observer(function SettingScreen() {
    __DEV__ && console.tron.log('hello rendering world')
    return (
        <View testID="SettingScreen" style={FULL}>

            <Text style={{ color: 'red' }}>Settings View</Text>
            <Text style={{ color: 'red' }}>Settings View</Text>
            <Text style={{ color: 'red' }}>Settings View</Text>
            <Text style={{ color: 'red' }}>Settings View</Text>
            <Text style={{ color: 'red' }}>Settings View</Text>

        </View>
    )
})
