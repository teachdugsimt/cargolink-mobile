import React, { useEffect, useState } from "react"
import { View, ViewStyle, TouchableOpacity, Image, ImageStyle, Dimensions, Platform, Linking, Alert, Animated } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { images, color, spacing } from '../../theme'
import { useStores } from "../../models/root-store/root-store-context";
// import { GridView } from '../../components/home-element/home-element'
import { GridNew } from '../../components'
import { ModalLoading, Text } from '../../components/'
import TruckTypeStore from "../../store/truck-type-store/truck-type-store"
import ProductTypeStore from "../../store/product-type-store/product-type-store"
import StatusStore from '../../store/post-job-store/job-status-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontIcon from 'react-native-vector-icons/FontAwesome5'
import ProfileStore from "../../store/profile-store/profile-store"
import jwtDecode, { JwtPayload } from "jwt-decode";
import i18n from 'i18n-js'

const { width } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }
const ROW: ViewStyle = { flexDirection: 'row' }
const ALL_CENTER: ViewStyle = { justifyContent: 'center', alignItems: Platform.OS == "android" ? 'flex-start' : 'center' }

const backgrounTopHeight = Platform.OS == 'android' ? 200 : 240

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
  // paddingTop: spacing[5]
  marginTop: Platform.OS == 'android' ? -56 : -68
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
const VIEW_ICON: ViewStyle = {
  borderRadius: 20,
  justifyContent: 'center', alignItems: 'center',
  backgroundColor: color.disable,
  marginLeft: 15, marginRight: 10
}
const VIEW_ICON2: ViewStyle = {
  borderRadius: 20,
  justifyContent: 'center', alignItems: 'center',
  backgroundColor: color.disable,
  marginLeft: 10, marginRight: 15
}

const CONTACT_VIEW: ViewStyle = {
  flex: Platform.OS == "android" ? 0.9 : 0.6,
  alignItems: 'center'
}
export const HomeScreen = observer((props) => {
  const { tokenStore, versatileStore } = useStores()
  const navigation = useNavigation()

  useEffect(() => {
    console.log("Persist Language :: ", versatileStore.language)
    if (versatileStore.language) i18n.locale = versatileStore.language
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
      data: [
        // {
        //   id: 1, name: "homeScreen.manageCar", onPressButton: () => {
        //     if (!token || !ProfileStore.data) navigation.navigate("signin")
        //     else {
        //       MyVehicleStore.findRequest({ page: 1 })
        //       navigation.navigate("myVehicle")
        //     }
        //   },
        //   img: images.manageTruck
        // },
        {
          id: 4, name: "homeScreen.findCar", onPressButton: () => {
            navigation.navigate("searchTruck")
          }, img: images.findTruck
        },
        {
          id: 2, name: "homeScreen.findJob", onPressButton: () => {
            navigation.navigate("searchJob")
          }, img: images.findJob
        }]
    },
    {
      title: "homeScreen.shippers",
      data: [
        {
          id: 3, name: "homeScreen.postJob", onPressButton: () => {
            if (!token || !ProfileStore.data) navigation.navigate("signin")
            else {
              StatusStore.setStatusScreen('add')
              navigation.navigate("postjob")
            }
          },
          img: images.postjob
        },

      ]
    }
  ]

  // __DEV__ && console.tron.log("List (render) home screen :: ", versatileStore.list)
  // __DEV__ && console.tron.log("List Group (render) home screen :: ", versatileStore.listGroup)
  __DEV__ && console.tron.log("Token Store :: ", tokenStore.token)

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
            <GridNew data={dataTest} />
          </View>
        </View>


        <ModalLoading
          containerStyle={{ zIndex: 2 }}
          size={'large'} color={color.primary} visible={versatileStore.list_loading ||
            versatileStore.list_group_loading || versatileStore.product_type_loading || ProfileStore.loading} />

        <View style={CONTACT_VIEW}>
          <Text tx={'moreScreen.contactUs'} style={{ marginBottom: 20, alignSelf: 'flex-start', marginLeft: 20 }}></Text>
          <View style={[ROW, ALL_CENTER]}>
            <Animated.View style={{ transform: [{ translateX: leftValue }] }} >
              <TouchableOpacity style={VIEW_ICON} onPress={() => Linking.openURL(versatileStore.fblink)}>
                {/* <FontIcon name={"facebook"} size={40} color={color.facebook} /> */}
                <Image source={images.facebookLogo} style={{ height: 65, width: 181 }} resizeMode="stretch" />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ translateX: rightValue }] }} >
              <TouchableOpacity style={VIEW_ICON2} onPress={() => onCall(versatileStore.phoneNumber)}>
                {/* <Ionicons name={"call"} size={22} color={color.primary} /> */}
                <View style={{ position: 'absolute', top: 13, left: 5, zIndex: 5 }}>
                  <Text style={{ color: color.textWhite }} preset="small">Call Center</Text>
                  <View style={ROW}>
                    <Ionicons name="call" size={14} color={color.textWhite} />
                    <Text style={{ color: color.textWhite, paddingLeft: 2.5 }} preset="small">02-106-5312</Text>
                  </View>
                </View>
                <Image source={images.callCenter} style={{ height: 65, width: 181 }} resizeMode="stretch" />
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
