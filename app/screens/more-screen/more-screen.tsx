import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../../components"
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }


export const MoreScreen = observer(function MoreScreen() {
    console.tron.log('hello rendering world')
    return (
        <View testID="MoreScreen" style={FULL}>

            <Text style={{ color: 'red' }}>More View</Text>
            <Text style={{ color: 'red' }}>More View</Text>
            <Text style={{ color: 'red' }}>More View</Text>
            <Text style={{ color: 'red' }}>More View</Text>
            <Text style={{ color: 'red' }}>More View</Text>

        </View>
    )
})
