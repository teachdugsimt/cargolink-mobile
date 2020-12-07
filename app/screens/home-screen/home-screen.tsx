import React, { useEffect } from "react"
import { View, ViewStyle, TextStyle, Image, ImageStyle, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { images, color } from '../../theme'
import { Header, Text, Button } from "../../components"
import { spacing } from "../../theme"
import { useStores } from "../../models/root-store/root-store-context";
import BookStore from '../../store/test-store/book-store'
// const bowserLogo = require("./bowser.png")
const { width, height } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }

const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
    paddingTop: spacing[3],
    paddingBottom: spacing[5] - 1,
    paddingHorizontal: 0,
    color: 'black',
    backgroundColor: color.mainTheme
}
const HEADER_TITLE: TextStyle = {
    ...BOLD,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
    color: 'black'
}



const TOP_VIEW: ViewStyle = {
    ...FULL,
    backgroundColor: color.mainTheme,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
}
const BOTTOM_VIEW: ViewStyle = {
    flex: 2,
    backgroundColor: 'white'
}

const IMAGE_LOGO: ImageStyle = {
    width: '100%',
}
const IMG_VIEW: ViewStyle = {
    ...FULL,
    width: width - 40,
    alignSelf: 'center',
}

export const HomeScreen = observer((props) => {
    const { books } = BookStore
    const { signinStore } = useStores()

    const navigation = useNavigation()
    const logout = () => navigation.navigate("signin")

    useEffect(() => {
        signinStore.addCartItem({
            name: "test 1",
            price: 60
        });
        BookStore.addBook({
            title: "Title 1",
            author: "Author john",
            read: false
        })
        console.log("Props useeffect :: ", props)
        console.log("Store signin store :: ", signinStore)
    }, [])

    useEffect(() => {
        if (signinStore.totalItems) console.log("Total Item : ", signinStore.totalItems)
        if (signinStore.totalPrice) console.log("Total price : ", signinStore.totalPrice)
    }, [signinStore])

    useEffect(() => {
        console.log("Pure books :: ", books)
        console.log('BookStore: ', BookStore)
        console.log('readBooks:', BookStore.readBooks)
        console.log('booksByErnestCline: ', BookStore.booksByAuthor('Author john'))
    }, [])

    console.tron.log('hello rendering world')
    return (
        <>
            <Header
                headerTx="homeScreen.logout"
                leftIcon="back"
                onLeftPress={logout}
                style={HEADER}
                titleStyle={HEADER_TITLE}
            />
            <View testID="HomeScreen" style={FULL}>


                <View style={TOP_VIEW}>
                    <View style={IMG_VIEW}>
                        <Image style={IMAGE_LOGO} height={(height / 10)}
                            resizeMode='stretch' source={images.logo} />
                    </View>
                </View>
                <View style={BOTTOM_VIEW}>

                </View>







                {/* <Text style={{ color: 'red' }}>Home View</Text>
            <Text style={{ color: 'red' }}>Home View</Text>
            <Text style={{ color: 'red' }}>Home View</Text>
            <Text style={{ color: 'red' }}>Home View</Text>
            <Text style={{ color: 'red' }}>Home View</Text> */}
                {/* <Button
                testID="next-screen-button"
                tx="detailsView"
                onPress={() => {
                    navigation.navigate("detail")
                }}
            /> */}
            </View>
        </>
    )
})
