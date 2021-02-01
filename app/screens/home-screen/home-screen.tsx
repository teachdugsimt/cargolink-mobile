import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Image, ImageStyle, Dimensions, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { images, color } from '../../theme'
import { Header, Text, Button } from "../../components"
import { spacing } from "../../theme"
import { useStores } from "../../models/root-store/root-store-context";
import { GridView } from '../../components/home-element/home-element'
import i18n from 'i18n-js'
import MyVehicleStore from "../../store/my-vehicle-store/my-vehicle-store"
import date from 'date-and-time';
// import TruckTypeStore from '../../store/truck-type-store/truck-type-store'

const { width, height } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }

const TOP_VIEW: ViewStyle = {
  flex: 1.2,
  backgroundColor: color.mainTheme,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  justifyContent: 'flex-start',
  alignItems: 'center'
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
  const { tokenStore, versatileStore } = useStores()

  const navigation = useNavigation()

  useEffect(() => {
    versatileStore.findGroup()
    versatileStore.find()
    versatileStore.findProductType()

    console.log("TOKEN STORE :: => ", JSON.parse(JSON.stringify(tokenStore.token)))
  }, [])

  const [lang, setlang] = useState(null)
  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
    }
  }, [versatileStore.language])

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
          MyVehicleStore.findRequest({ page: 1 })
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
            {!!lang && <GridView data={dataTest} />}
          </View>
        </View>
      </View>
    </>
  )
})
