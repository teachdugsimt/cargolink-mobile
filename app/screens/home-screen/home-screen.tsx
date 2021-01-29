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
import date from 'date-and-time';
// import TruckTypeStore from '../../store/truck-type-store/truck-type-store'

const { width, height } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }

const TOP_VIEW: ViewStyle = {
  // flex: 1,
  height: 230,
  backgroundColor: color.mainTheme,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  justifyContent: 'flex-start',
  alignItems: 'center',
  // marginBottom: 20,
}
const BOTTOM_VIEW: ViewStyle = {
  flex: 2,
  // backgroundColor: 'green'
}

const IMAGE_LOGO: ImageStyle = {
  // backgroundColor: 'red',
  width: '100%',
  // marginTop: -spacing[6],
}
const IMG_VIEW: ViewStyle = {
  ...FULL,
  width: width - 40,
  alignSelf: 'center',
  justifyContent: 'flex-start'
}

const VIEW_GRID_BOX: ViewStyle = {
  // backgroundColor: 'red',
  flex: 1,
  marginTop: Platform.OS == "ios" ? ((height / 2) - (height / 1.69)) : ((height / 2) - (height / 1.6))
}

const ROOT_HOME: ViewStyle = {
  ...FULL,
  // backgroundColor: color.dim
}

export const HomeScreen = observer((props) => {
  const { books } = BookStore
  const { signinStore, tokenStore, versatileStore } = useStores()

  const navigation = useNavigation()

  useEffect(() => {

    versatileStore.findGroup()
    versatileStore.find()
    versatileStore.findProductType()

    const now = new Date();
    const yesterday = date.addDays(now, -1);
    __DEV__ && console.tron.log("Test -1 Date :: => ", yesterday)



    signinStore.addCartItem({
      name: "test 1",
      price: 60
    });
    BookStore.addBook({
      title: "Title 1",
      author: "Author john",
      read: false
    })
    console.log("TOKEN STORE :: => ", JSON.parse(JSON.stringify(tokenStore.token)))
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

  __DEV__ && console.tron.log('hello rendering world')
  interface List {
    title: string;
    data: any
  }
  const dataTest: List[] = [
    {
      title: "homeScreen.carriers",
      data: [{
        id: 1, name: "homeScreen.manageCar", onPressButton: () => {
          MyVehicleStore.findRequest({})
          navigation.navigate("myVehicle")
        }, img: images.truck1
      },
      { id: 2, name: "homeScreen.findJob", onPressButton: () => navigation.navigate("searchJob"), img: images.pinbox }]
    },
    {
      title: "homeScreen.shippers",
      data: [{ id: 3, name: "homeScreen.postJob", onPressButton: () => navigation.navigate("postjob"), img: images.sheet1 },
      { id: 4, name: "homeScreen.findCar", onPressButton: () => navigation.navigate("searchTruck"), img: images.word1 }]
    }
  ]
  return (
    <>
      <View testID="HomeScreen" style={ROOT_HOME}>
        <View style={TOP_VIEW}>
          {/* <View style={IMG_VIEW}> */}
          <Image style={IMAGE_LOGO} width={width / 1.5} height={width / 3.24}
            resizeMode='stretch'
            source={images.logoNew} />
        </View>
        <View style={BOTTOM_VIEW}>
          <View style={VIEW_GRID_BOX}>
            <GridView data={dataTest} />
          </View>
        </View>
      </View>
    </>
  )
})
