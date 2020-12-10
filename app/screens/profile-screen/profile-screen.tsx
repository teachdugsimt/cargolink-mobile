import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }


export const ProfileScreen = observer(function ProfileScreen() {
    console.tron.log('hello rendering world')
    const navigation = useNavigation()
    return (
        <View testID="ProfileScreen" style={FULL}>

            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <Text style={{ color: 'red' }}>Profile Screen View</Text>
            <TouchableOpacity onPress={() => navigation.navigate('signin')}>
                <Text>Signout</Text>
            </TouchableOpacity>

        </View>
    )
})
