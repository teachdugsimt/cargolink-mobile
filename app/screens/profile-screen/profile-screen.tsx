import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../../components"
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }


export const ProfileScreen = observer(function ProfileScreen() {
    console.tron.log('hello rendering world')
    return (
        <View testID="ProfileScreen" style={FULL}>

            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <Text style={{ color: 'red' }}>Profile Screen View</Text>

        </View>
    )
})
