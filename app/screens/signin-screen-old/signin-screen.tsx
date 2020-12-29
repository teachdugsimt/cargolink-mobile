import React from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, Wallpaper } from "../../components"
import { color, spacing, typography } from "../../theme"
// const bowserLogo = require("./bowser.png")
// import BookStore from "../../models/book-store"
const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
    backgroundColor: color.transparent,
    paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
    color: color.palette.white,
    fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
    paddingTop: spacing[3],
    paddingBottom: spacing[5] - 1,
    paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
    ...BOLD,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
}


const CONTINUE: ViewStyle = {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: "#5D2555",
}
const CONTINUE_TEXT: TextStyle = {
    ...TEXT,
    ...BOLD,
    fontSize: 13,
    letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
}


export const SigninScreen = observer(function SigninScreen() {
    const navigation = useNavigation()
    // const { books } = BookStore
    const goBack = () => navigation.goBack()
    __DEV__ && console.tron.log('hello rendering world')


    return (
        <View testID="SigninScreen" style={FULL}>
            <Header
                headerTx="demoScreen.howTo"
                leftIcon="back"
                onLeftPress={goBack}
                style={HEADER}
                titleStyle={HEADER_TITLE}
            />
            <Text style={{ color: 'red' }}>Test View</Text>
            <Text style={{ color: 'red' }}>Test View</Text>
            <Text style={{ color: 'red' }}>Test View</Text>
            <Text style={{ color: 'red' }}>Test View</Text>
            <Text style={{ color: 'red' }}>Test View</Text>
            <View style={FOOTER_CONTENT}>
                <Button
                    testID="next-screen-button"
                    style={CONTINUE}
                    textStyle={CONTINUE_TEXT}
                    tx="goHome"
                    onPress={() => {
                        // BookStore.addBook({
                        //     title: "book1",
                        //     author: "tester",
                        //     read: false
                        // })
                        // console.log("BOOKS :: ", books[0])
                        // console.log("BOOKS :: ", books[0])
                        // console.log("BOOKS :: ", books[0])
                        // console.log("BOOKS :: ", books[0])
                        // console.log("BOOKS :: ", books[0])
                        // console.log("BOOKS :: ", books[0])
                        navigation.navigate("home")
                    }}
                />
            </View>
        </View>
    )
})
