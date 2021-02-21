import React, { useEffect, useState } from "react"
import { View, ViewStyle, TouchableOpacity, Image, ImageStyle, Dimensions, Platform, Linking, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { images, color } from '../../theme'
import { useStores } from "../../models/root-store/root-store-context";
import { GridView } from '../../components/home-element/home-element'
import { ModalLoading } from '../../components/'
import MyVehicleStore from "../../store/my-vehicle-store/my-vehicle-store"
import TruckTypeStore from "../../store/truck-type-store/truck-type-store"
import ProductTypeStore from "../../store/product-type-store/product-type-store"
import StatusStore from '../../store/post-job-store/job-status-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import ProfileStore from "../../store/profile-store/profile-store"
import jwtDecode, { JwtPayload } from "jwt-decode";

const { width, height } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }
const ROW: ViewStyle = { flexDirection: 'row' }
const ALL_CENTER: ViewStyle = { justifyContent: 'center', alignItems: Platform.OS == "android" ? 'flex-start' : 'center' }

const TOP_VIEW: ViewStyle = {
  height: 230,
  backgroundColor: color.mainTheme,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  justifyContent: 'flex-start',
  alignItems: 'center',
}
const BOTTOM_VIEW: ViewStyle = {
  flex: 2,
}

const IMAGE_LOGO: ImageStyle = {
  width: '100%',
}

const VIEW_GRID_BOX: ViewStyle = {
  flex: 1,
  marginTop: Platform.OS == "ios" ? ((height / 2) - (height / 1.69)) : ((height / 2) - (height / 1.6))
}

const ROOT_HOME: ViewStyle = {
  ...FULL,
}
const VIEW_ICON: ViewStyle = { borderRadius: 20, height: 40, width: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: color.line, marginHorizontal: 15 }

const CONTACT_VIEW: ViewStyle = { flex: Platform.OS == "android" ? 0.5 : 0.6 }
export const HomeScreen = observer((props) => {
  const { tokenStore, versatileStore } = useStores()
  const navigation = useNavigation()
  const [visible, setvisible] = useState(false)
  useEffect(() => {
    versatileStore.findGroup()
    versatileStore.find()
    versatileStore.findProductType()
    ProfileStore.getProfileRequest()

    console.log("TOKEN STORE :: => ", JSON.parse(JSON.stringify(tokenStore.token)))
  }, [])

  const [swipe, setswipe] = useState(false)
  const [lang, setlang] = useState(null)

  const _getDataFromToken = (token) => {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded) return decoded;
    else return {};
  };

  useEffect(() => {
    if (tokenStore?.token?.accessToken) {
      let token_data = _getDataFromToken(tokenStore.token.accessToken)
      let new_date = Math.floor(Date.now() / 1000)
      __DEV__ && console.tron.display({
        name: "Token parse ", value: { new_date, token_data }
      })
      if (token_data.exp && new_date >= token_data.exp) {
        // 1. now time >= expire token time
        // 2. Have token
        // 3. don't have profile data / loading profile = false
        // Token was expire => FETCH NEW TOKEN & replace old token
      }
    }
  }, [tokenStore.token, ProfileStore.data, ProfileStore.loading])

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

  const onCall = (phone: string) => {
    let phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
    __DEV__ && console.tron.log('phoneNumber', phoneNumber)
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          __DEV__ && console.tron.log('Phone number is not available');
          Alert.alert('Phone number is not available')
          return false;
        }
      })
      .then(() => {
        return Linking.openURL(phoneNumber);
      })
      .catch(err => __DEV__ && console.tron.log('err', err));
  };

  __DEV__ && console.tron.log('hello rendering world')
  interface List {
    title: string;
    data: any
  }
  let token = tokenStore?.token?.accessToken || null
  const dataTest: List[] = [
    {
      title: "homeScreen.carriers",
      data: [{
        id: 1, name: "homeScreen.manageCar", onPressButton: () => {
          if (!token || !ProfileStore.data) navigation.navigate("signin")
          else {
            MyVehicleStore.findRequest({ page: 1 })
            navigation.navigate("myVehicle")
          }
        },
        img: images.truck1
      },
      { id: 2, name: "homeScreen.findJob", onPressButton: () => navigation.navigate("searchJob"), img: images.pinbox }]
    },
    {
      title: "homeScreen.shippers",
      data: [{
        id: 3, name: "homeScreen.postJob", onPressButton: () => {
          if (!token || !ProfileStore.data) navigation.navigate("signin")
          else {
            StatusStore.setStatusScreen('add')
            navigation.navigate("postjob")
          }
        },
        img: images.sheet1
      },
      { id: 4, name: "homeScreen.findCar", onPressButton: () => navigation.navigate("searchTruck"), img: images.word1 }]
    }
  ]

  // __DEV__ && console.tron.log("List (render) home screen :: ", versatileStore.list)
  // __DEV__ && console.tron.log("List Group (render) home screen :: ", versatileStore.listGroup)
  __DEV__ && console.tron.log("Token Store :: ", tokenStore.token)


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


        <ModalLoading
          containerStyle={{ zIndex: 2 }}
          size={'large'} color={color.primary} visible={versatileStore.list_loading ||
            versatileStore.list_group_loading || versatileStore.product_type_loading || ProfileStore.loading} />

        <View style={CONTACT_VIEW}>
          <View style={[ROW, ALL_CENTER, FULL]}>
            <TouchableOpacity style={VIEW_ICON} onPress={() => Linking.openURL(versatileStore.fblink)}>
              <FontIcon name={"facebook"} size={24} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={VIEW_ICON} onPress={() => console.log("LINE PRESS")}>
              <FontIcon name={"line"} size={24} />
            </TouchableOpacity> */}
            <TouchableOpacity style={VIEW_ICON} onPress={() => onCall(versatileStore.phoneNumber)}>
              <Ionicons name={"call"} size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {/* <TouchableOpacity onPress={() => navigation.navigate("comment")}>
          <Text>Click Me!!</Text>
        </TouchableOpacity> */}


      </View>
    </>
  )
})
