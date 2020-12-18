import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Image, ImageStyle, Dimensions, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { images, color } from '../../theme'
import { Header, Text, Button } from "../../components"
import { spacing } from "../../theme"
import { useStores } from "../../models/root-store/root-store-context";
import BookStore from '../../store/test-store/book-store'
import { GridView } from '../../components/home-element/home-element'
import i18n from 'i18n-js'
import MyVehicleStore from "../../store/my-vehicle-store/my-vehicle-store"


// import { createServer } from "miragejs"
// createServer({
//     routes() {
//         this.get("https://jsonplaceholder.typicode.com/todos/", () => [
//             { id: "1", name: "Luke" },
//             { id: "2", name: "Leia" },
//             { id: "3", name: "Anakin" },
//         ])

//         this.get("https://jsonplaceholder.typicode.com/todos/1", () => [
//             { id: "1", name: "Luke" },
//             { id: "2", name: "Leia" },
//             { id: "3", name: "Anakin" },
//         ])

//         this.post("https://jsonplaceholder.typicode.com/todos/post", (schema, request) => {
//             let attrs = JSON.parse(request.requestBody)
//             // console.log(attrs)
//             // debugger
//             return { responseData: { data: 555 } }
//         })
//     },
// })


// const bowserLogo = require("./bowser.png")
const { width, height } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }

const TOP_VIEW: ViewStyle = {
    ...FULL,
    backgroundColor: color.mainTheme,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
}
const BOTTOM_VIEW: ViewStyle = {
    flex: 2,
}

const IMAGE_LOGO: ImageStyle = {
    width: '100%',
}
const IMG_VIEW: ViewStyle = {
    ...FULL,
    width: width - 40,
    alignSelf: 'center',
}

const VIEW_GRID_BOX: ViewStyle = {
    marginTop: Platform.OS == "ios" ? ((height / 2) - (height / 1.69)) : ((height / 2) - (height / 1.6))
}

const ROOT_HOME: ViewStyle = {
    ...FULL,
    // backgroundColor: color.dim
}

export const HomeScreen = observer((props) => {
    const { books } = BookStore
    const { signinStore, versatileStore } = useStores()

    const navigation = useNavigation()
    const logout = () => navigation.navigate("signin")

    // const [users, setUsers] = useState([])
    const [languageState, setlanguageState] = useState(null)

    // useEffect(() => {
    //     fetch("https://jsonplaceholder.typicode.com/todos/")
    //         .then((response) => response.json())
    //         .then((json) => {
    //             console.log("JSON DATA HOME SCREEN :: ", json)
    //             setUsers(json)
    //         })

    //     fetch('https://jsonplaceholder.typicode.com/todos/post', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             schema: 'yourValue',
    //             request: 'yourOtherValue',
    //         }),
    //     }).then(val => console.log("VAL POSTPOSTPSTOSPTOSPOT :: ", val))
    // }, [])

    // useEffect(() => {
    //     if (users && users.length)
    //         console.log("User HERE :: ", users)
    // }, [users])

    useEffect(() => {
        const language = JSON.parse(JSON.stringify(versatileStore.getLanguage))

        if (language) {
            // i18n.defaultLocale = language
            // i18n.fallbacks = true
            i18n.locale = language
        }
    }, [versatileStore.getLanguage])

    useEffect(() => {
        console.log("Use Effect language :: ", versatileStore.getLanguage)
        if (languageState != versatileStore.getLanguage) {
            // setlanguageState(versatileStore.getLanguage)
            setlanguageState(versatileStore.getLanguage)
        }
    }, [languageState])

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
        console.log("All books 111 : ", JSON.parse(JSON.stringify(BookStore.allBooks)))
    }, [])

    useEffect(() => {
        let tmp: Array<any> = JSON.parse(JSON.stringify(BookStore.allBooks))
        if (tmp.length) {
            console.log("All books 222 : ", tmp)
        }
    }, [BookStore.allBooks.length])

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
    interface List {
        title: string;
        data: any
    }
    const dataTest: List[] = [
        {
            title: "ผู้ให้บริการขนส่ง / Carriers",
            data: [{
                id: 1, name: "homeScreen.manageCar", onPressButton: () => {
                    MyVehicleStore.findRequest({})
                    navigation.navigate("myVehicle")
                }, img: images.truck1
            },
            { id: 2, name: "homeScreen.findJob", onPressButton: () => navigation.navigate("searchJob"), img: images.pinbox }]
        },
        {
            title: "เจ้าของสินค้า / Shippers",
            data: [{ id: 3, name: "homeScreen.postJob", onPressButton: () => navigation.navigate("postjob"), img: images.sheet1 },
            { id: 4, name: "homeScreen.findCar", onPressButton: () => navigation.navigate("searchCar"), img: images.word1 }]
        }
    ]
    return (
        <>
            <View testID="HomeScreen" style={ROOT_HOME}>
                <View style={TOP_VIEW}>
                    <View style={IMG_VIEW}>
                        {Platform.OS == "ios" ? <Image style={IMAGE_LOGO} height={(height / 12)}
                            resizeMode='stretch'
                            source={images.logo} /> : <Image style={IMAGE_LOGO} height={(height / 10)}
                                resizeMode='stretch'
                                source={images.logo} />}
                    </View>
                </View>
                <View style={BOTTOM_VIEW}>
                    <View style={VIEW_GRID_BOX}>
                        {languageState && languageState != versatileStore.getLanguage ? <GridView data={dataTest} /> :
                            <GridView data={dataTest} />}
                    </View>
                </View>
            </View>
        </>
    )
})
