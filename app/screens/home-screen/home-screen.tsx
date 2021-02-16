import React, { useEffect, useState } from "react"
import { View, ViewStyle, TouchableOpacity, Image, ImageStyle, Dimensions, Platform, Linking, Alert, Animated } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { images, color, spacing } from '../../theme'
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

const { width, height } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }
const ROW: ViewStyle = { flexDirection: 'row' }
const ALL_CENTER: ViewStyle = { justifyContent: 'center', alignItems: Platform.OS == "android" ? 'flex-start' : 'center' }

const backgrounTopHeight = 160

const TOP_VIEW: ViewStyle = {
  height: backgrounTopHeight,
  backgroundColor: color.mainTheme,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  justifyContent: 'flex-start',
  alignItems: 'center',
}
const BOTTOM_VIEW: ViewStyle = {
  flex: 2,
  // backgroundColor: 'red',
  paddingTop: spacing[5]
}

const IMAGE_LOGO: ImageStyle = {
  width: '100%',
}

const VIEW_GRID_BOX: ViewStyle = {
  flex: 1,
  // marginTop: Platform.OS == "ios" ? ((height / 2) - (height / 1.69)) : ((height / 2) - (height / 1.6))
}

const ROOT_HOME: ViewStyle = {
  ...FULL,
}
const VIEW_ICON: ViewStyle = { borderRadius: 20, height: 40, width: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: color.line, marginHorizontal: 15 }

const CONTACT_VIEW: ViewStyle = { flex: Platform.OS == "android" ? 0.5 : 0.6 }
export const HomeScreen = observer((props) => {
  const { tokenStore, versatileStore } = useStores()
  const [isName, setIsName] = useState<boolean>(false)

  const navigation = useNavigation()
  const [visible, setvisible] = useState(false)
  useEffect(() => {
    versatileStore.findGroup()
    versatileStore.find()
    versatileStore.findProductType()
    ProfileStore.getProfileRequest()

    // let d1 = { "vehicle-type": 8, "car-num": "2", "item-type": 8, "item-name": "เครื่องจักรสำหรับบรรทุกรถ", "item-weight": "4300" }
    // let d2 = { "receive-region": { "latitude": 13.7884902, "longitude": 100.6079443, "latitudeDelta": 0.005878748388420618, "longitudeDelta": 0.004999972879886627 }, "receive-location": "กรุงเทพมหานคร", "receive-date": "2021-02-08T15:33:00:000Z", "receive-time": "2021-02-08T15:33:00:000Z", "receive-name": "Onelink Space", "receive-tel-no": "0998999988", "shipping-information": [{ "shipping-address": "ชลบุรี", "shipping-date": "2021-02-10T11:00:00:000Z", "shipping-time": "2021-02-10T11:00:00:000Z", "shipping-name": "หมู่บ้านบางแสนวิลล์ ตำบล ห้วยกะปิ อำเภอเมืองชลบุรี ชลบุรี", "shipping-tel-no": "0899388403", "shipping-region": { "latitude": 13.2773405, "longitude": 100.9410782, "latitudeDelta": 0.0058863476810167015, "longitudeDelta": 0.005000643432154561 } }, { "shipping-address": "จันทบุรี", "shipping-date": "2021-02-10T17:20:00:000Z", "shipping-time": "2021-02-10T17:20:00:000Z", "shipping-name": "ศูนย์ศึกษาธรรมชาติป่าชายเลนอ่าวคุ้งกระเบน", "shipping-tel-no": "0990999811", "shipping-region": { "latitude": 12.6004546, "longitude": 101.9276771, "latitudeDelta": 0.0058863476810167015, "longitudeDelta": 0.005000643432154561 } }] }
    // PostJobStore.setPostJob(1, d1)
    // PostJobStore.setPostJob(2, d2)

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
    if (versatileStore.list.length) {
      TruckTypeStore.setList(JSON.parse(JSON.stringify(versatileStore.list)))
    }
  }, [JSON.stringify(versatileStore.list)])

  useEffect(() => {
    if (versatileStore.listGroup.length) {
      TruckTypeStore.setGroupList(JSON.parse(JSON.stringify(versatileStore.listGroup)))
    }
  }, [JSON.stringify(versatileStore.listGroup)])

  useEffect(() => {
    if (versatileStore.listProductType.length) {
      ProductTypeStore.setList(JSON.parse(JSON.stringify(versatileStore.listProductType)))
    }
  }, [JSON.stringify(versatileStore.listProductType)])

  useEffect(() => {
    if (ProfileStore.data) {
      navigation.navigate('home')
    }
  }, [ProfileStore.data])

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
          if (!token) navigation.navigate("signin")
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
          if (!token) navigation.navigate("signin")
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

  __DEV__ && console.tron.log("List (render) home screen :: ", versatileStore.list)
  __DEV__ && console.tron.log("List Group (render) home screen :: ", versatileStore.listGroup)

  const [topBackgroundValue] = useState(new Animated.Value(-backgrounTopHeight))
  const [leftValue] = useState(new Animated.Value(-(width / 2)))
  const [rightValue] = useState(new Animated.Value(width / 2))

  useEffect(() => {
    Animated.timing(topBackgroundValue, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(({ finished }) => {
      console.log('finished', finished)
    })
    Animated.timing(leftValue, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start()
    Animated.timing(rightValue, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])


  return (
    <>
      <View testID="HomeScreen" style={ROOT_HOME}>
        {/* <View style={TOP_VIEW}>
          <Image style={IMAGE_LOGO} width={width / 1.5} height={width / 3.24}
            resizeMode='stretch'
            source={images.logoNew} />
        </View> */}
        <Animated.View style={[TOP_VIEW, {
          transform: [{
            translateY: topBackgroundValue
          }]
        }]}>
          <Image style={IMAGE_LOGO} width={width / 1.5} height={width / 3.24}
            resizeMode='stretch'
            source={images.logoNew} />
        </Animated.View>
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
            <Animated.View style={{ transform: [{ translateX: leftValue }] }} >
              <TouchableOpacity style={VIEW_ICON} onPress={() => Linking.openURL(versatileStore.fblink)}>
                <FontIcon name={"facebook"} size={24} />
              </TouchableOpacity>
            </Animated.View>
            {/* <TouchableOpacity style={VIEW_ICON} onPress={() => console.log("LINE PRESS")}>
              <FontIcon name={"line"} size={24} />
            </TouchableOpacity> */}
            <Animated.View style={{ transform: [{ translateX: rightValue }] }} >
              <TouchableOpacity style={VIEW_ICON} onPress={() => onCall(versatileStore.phoneNumber)}>
                <Ionicons name={"call"} size={22} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* <TouchableOpacity onPress={() => navigation.navigate("comment")}>
          <Text>Click Me!!</Text>
        </TouchableOpacity> */}

      </View>
    </>
  )
})
