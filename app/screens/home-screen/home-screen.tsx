import React, { useEffect, useState, useCallback } from "react"
import { View, ViewStyle, TouchableOpacity, Image, ImageStyle, Dimensions, Platform, Linking, Alert, Animated } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { images, color } from '../../theme'
import { useStores } from "../../models/root-store/root-store-context";
// import { GridView } from '../../components/home-element/home-element'
import { GridNew, Screen } from '../../components'
import { ModalLoading, Text, SponserHome } from '../../components/'
import TruckTypeStore from "../../store/truck-type-store/truck-type-store"
import ProductTypeStore from "../../store/product-type-store/product-type-store"
import StatusStore from '../../store/post-job-store/job-status-store'
import ProfileStore from "../../store/profile-store/profile-store"
import jwtDecode, { JwtPayload } from "jwt-decode";
import i18n from 'i18n-js'
// import 'moment/locale/th';
import AuthStore from "../../store/auth-store/auth-store"

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
  backgroundColor: color.mainBackgrorund
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
  alignItems: 'center',
  paddingVertical: 20,
}
export const HomeScreen = observer((props) => {
  const { tokenStore, versatileStore } = useStores()
  const navigation = useNavigation()

  // useFocusEffect(
  //   useCallback(() => {
  //     // when back from other screen 
  //     __DEV__ && console.tron.logImportant("COME useCallback useCallback useCallback useCallback")
  //     if (AuthStore.profile?.userProfile?.userId || tokenStore?.profile?.userId)
  //       ProfileStore.getProfileRequest(AuthStore.profile?.userProfile?.userId || tokenStore.profile.userId)
  //     return () => {
  //       // before go Other screen 
  //     }
  //   }, [])
  // );

  useEffect(() => {
    __DEV__ && console.tron.logImportant("COME USE EFFECT HOME")
    console.log("Persist Language :: ", versatileStore.language)
    if (versatileStore.language) i18n.locale = versatileStore.language
    versatileStore.findGroup()
    versatileStore.find()
    versatileStore.findProductType()
    if (AuthStore.profile?.userProfile?.userId || tokenStore?.profile?.userId)
      ProfileStore.getProfileRequest(AuthStore.profile?.userProfile?.userId || tokenStore?.profile?.userId, AuthStore?.profile?.token?.accessToken || tokenStore?.token?.accessToken)
    console.log("TOKEN STORE :: => ", JSON.parse(JSON.stringify(tokenStore.profile)))

    AuthStore.clearError()
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
        {
          id: 4, name: "homeScreen.findCar", onPressButton: () => {
            if (!token || !ProfileStore.data) navigation.navigate("signin")
            else navigation.navigate("searchTruck")
          }, img: images.findTruck
        },
        {
          id: 2, name: "homeScreen.findJob", onPressButton: () => {
            if (!token || !ProfileStore.data) navigation.navigate("signin")
            else navigation.navigate("searchJob")
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

  const _onPressPremium = () => {
    if (!token || !ProfileStore.data) navigation.navigate("signin")
    else {
      ProfileStore.getProfileRequest(AuthStore.profile?.userProfile?.userId || tokenStore.profile.userId)
      navigation.navigate("premiumDetail")
    }
  }

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
    <Screen preset="scroll" unsafe backgroundColor={color.mainBackgrorund}
      statusBar={'dark-content'} bounch={false}
      showsVerticalScrollIndicator={false}
    >
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
          <Image style={IMAGE_LOGO} width={width / 1.8} height={width / 3.22}
            resizeMode='stretch'
            source={images.logoNew} />
        </Animated.View>
        <View style={BOTTOM_VIEW}>
          <View style={VIEW_GRID_BOX}>
            <GridNew data={dataTest} />
          </View>
        </View>

        {/* <View style={{
          height: 90, backgroundColor: 'white',
          marginHorizontal: 20, marginVertical: 10,
          borderRadius: 15, padding: 20
        }}>
          <Text style={{ fontSize: 18 }}>????????????????????????????????????????????????????????????????????????</Text>
        </View> */}

        <SponserHome onPress={_onPressPremium} />

        <ModalLoading
          containerStyle={{ zIndex: 2 }}
          size={'large'} color={color.primary} visible={versatileStore.list_loading ||
            versatileStore.list_group_loading || versatileStore.product_type_loading || ProfileStore.loading} />

        <View style={CONTACT_VIEW}>
          <Text tx={'moreScreen.contactUs'} style={{ paddingBottom: 10, alignSelf: 'flex-start', marginLeft: 20 }}></Text>
          <View style={[ROW, ALL_CENTER]}>
            <Animated.View style={{ transform: [{ translateX: leftValue }] }}>
              <TouchableOpacity style={VIEW_ICON} onPress={() => onCall(versatileStore.phoneNumber)}>
                <View style={{ position: 'absolute', justifyContent: 'center', left: 5, zIndex: 5 }}>
                  <Text style={{ color: color.textWhite, paddingLeft: 2.5, fontSize: 16 }} preset="small">02-106-5312</Text>
                </View>
                <Image source={images.callCenter} style={{ height: 37.5, width: (width / 2) - 30 }} resizeMode="stretch" />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ translateX: rightValue }] }} >
              <TouchableOpacity style={VIEW_ICON2} onPress={() => Linking.openURL(versatileStore.fblink)}>
                <View style={{ position: 'absolute', justifyContent: 'center', left: 5, zIndex: 5 }}>
                  <Text style={{ color: color.textWhite, paddingLeft: 2.5, fontSize: 18 }} preset='small'>Facebook</Text>
                </View>
                <Image source={images.facebookLogo} style={{ height: 37.5, width: (width / 2) - 30 }} resizeMode="stretch" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* <TouchableOpacity onPress={() => navigation.navigate("comment")}>
          <Text>Click Me!!</Text>
        </TouchableOpacity> */}

      </View>
    </Screen>
  )
})
