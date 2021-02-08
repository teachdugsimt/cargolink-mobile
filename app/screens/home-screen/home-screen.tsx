import React, { useEffect, useState } from "react"
import { View, ViewStyle, TouchableOpacity, Image, ImageStyle, Dimensions, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { images, color } from '../../theme'
import { useStores } from "../../models/root-store/root-store-context";
import { GridView } from '../../components/home-element/home-element'
import MyVehicleStore from "../../store/my-vehicle-store/my-vehicle-store"
import TruckTypeStore from "../../store/truck-type-store/truck-type-store"
import ProductTypeStore from "../../store/product-type-store/product-type-store"
import StatusStore from '../../store/post-job-store/job-status-store'

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
  const { tokenStore, versatileStore } = useStores()

  const navigation = useNavigation()
  const [visible, setvisible] = useState(false)
  useEffect(() => {
    versatileStore.findGroup()
    versatileStore.find()
    versatileStore.findProductType()

    console.log("TOKEN STORE :: => ", JSON.parse(JSON.stringify(tokenStore.token)))
  }, [])

  const [swipe, setswipe] = useState(false)
  const [lang, setlang] = useState(null)
  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
      setswipe(!swipe)
    }
  }, [versatileStore.language])
  useEffect(() => {
    if (versatileStore.list.length && !TruckTypeStore.list.length) {
      TruckTypeStore.setList(JSON.parse(JSON.stringify(versatileStore.list)))
    }
  }, [versatileStore.list.length])

  useEffect(() => {
    if (versatileStore.listGroup.length && !TruckTypeStore.listGroup.length) {
      TruckTypeStore.setGroupList(JSON.parse(JSON.stringify(versatileStore.listGroup)))
    }
  }, [versatileStore.listGroup.length])

  useEffect(() => {
    if (versatileStore.listProductType.length && !ProductTypeStore.list.length) {
      ProductTypeStore.setList(JSON.parse(JSON.stringify(versatileStore.listProductType)))
    }
  }, [versatileStore.listProductType.length])

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
      data: [{
        id: 3, name: "homeScreen.postJob", onPressButton: () => {
          StatusStore.setStatusScreen('add')
          navigation.navigate("postjob")
        }, img: images.sheet1
      },
      { id: 4, name: "homeScreen.findCar", onPressButton: () => navigation.navigate("searchTruck"), img: images.word1 }]
    }
  ]

  __DEV__ && console.tron.log("List (render) home screen :: ", versatileStore.list)
  __DEV__ && console.tron.log("List Group (render) home screen :: ", versatileStore.listGroup)


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
            {swipe ? <GridView data={dataTest} /> : <GridView data={dataTest} />}
          </View>
        </View>

        {/* <ModalNormal
          visible={visible}
          onTouchOutside={() => setvisible(false)}
          onSwipeOut={() => setvisible(true)}
          title={"profileScreen.profile"}
          subTitle={"profileScreen.fullSuggestText"}
          onPressLeft={() => setvisible(false)}
          onPressRight={() => console.log("confirm right")}
        /> */}

        {/* <TouchableOpacity onPress={() => navigation.navigate("comment")}>
          <Text>Click Me!!</Text>
        </TouchableOpacity> */}


      </View>
    </>
  )
})
