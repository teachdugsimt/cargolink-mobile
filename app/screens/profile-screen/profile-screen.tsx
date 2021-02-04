import React, { useEffect, useState } from "react"
import {
  View, ViewStyle, TextStyle, TouchableOpacity,
  SectionList, Dimensions, Image, ImageStyle, FlatList, Platform, LayoutAnimation,
} from "react-native"
import { observer } from "mobx-react-lite"
import { Text, Icon, HeaderCenter, HeaderRight } from "../../components"
import { color, images, typography } from "../../theme"
import ProfileStore from '../../store/profile-store/profile-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MapTruckImageName } from '../../utils/map-truck-image-name'
import { useStores } from "../../models/root-store/root-store-context";
import { useNavigation } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const COLOR_PRIMARY: TextStyle = { color: color.primary }
const TOP_VIEW: ViewStyle = {
  flex: Platform.OS == "ios" ? 0.8 : 1.1, backgroundColor: color.mainTheme,
  borderBottomRightRadius: 15, borderBottomLeftRadius: 15
}
const BOTTOM_VIEW: ViewStyle = { flex: 4 }
const PROFILE_IMG: ImageStyle = {
  width: 75, height: 75, borderRadius: 37.5
}
const ICON_STYLE: ImageStyle = {
  width: 15, height: 15, borderRadius: 7.5, alignSelf: 'flex-end', marginLeft: 5, marginTop: 2.5
}
const JUSTIFY_BETWEEN: ViewStyle = { justifyContent: 'space-between' }
const JUSTIFY_CENTER: ViewStyle = { justifyContent: 'center' }
const FLEX_ROW: ViewStyle = { flexDirection: 'row' }
const ROW_LAYOUT: ViewStyle = {
  ...FLEX_ROW,
  width: '100%'
}
const VIEW_PROFILE: ViewStyle = {
  ...FLEX_ROW, justifyContent: 'center', alignItems: 'center',
  padding: 10
}
const VIEW_NAME_NAD_PHONE: ViewStyle = {
  flexDirection: 'column',
  alignItems: 'center',
  padding: 15
}


const PADDING_VERTICAL_SMALL: ViewStyle = { paddingVertical: 20 }
const PADDING_HORIZON_EXTRA: ViewStyle = { paddingHorizontal: 20 }
const PADDING_RIGHT_SMALL: ViewStyle = { paddingRight: 10 }
const PADDING_TOP_SMALL: ViewStyle = { paddingTop: 10 }
const PADDING_LEFT_SMALL: ViewStyle = { paddingLeft: 10 }

const VIEW_MENU_TITLE: ViewStyle = {
  ...FLEX_ROW,
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 50,
}
const PADDING_PURE: ViewStyle = {
  padding: 10
}
const PURE_ROW_LAYOUT: ViewStyle = {
  ...FLEX_ROW,
  ...PADDING_PURE
}

const VIEW_MENU_TOUCH: ViewStyle = { justifyContent: 'center', alignItems: 'center', flex: 1 }
const VIEW_MENU_TOUCH_ACTIVE: ViewStyle = { ...VIEW_MENU_TOUCH, borderBottomWidth: 2 }
const TEXT_MENU_STYLE: TextStyle = { padding: 10 }
const PADDING_RIGHT: ViewStyle = {
  paddingRight: 10
}
const ROOT_FLAT_LIST: ViewStyle = {
  flex: 1,
  minHeight: 100,
}
const IMAGE_LIST: ImageStyle = {
  backgroundColor: color.line, padding: 10,
  resizeMode: "cover",
  aspectRatio: 2 / 2,
  borderRadius: 30,
  borderColor: color.primary, borderWidth: 2,
}
const BORDER_BOTTOM: ViewStyle = { borderBottomColor: color.line }
const NORMAL_WRAPPER_LIST: ViewStyle = {
  ...ROOT_FLAT_LIST,
  marginHorizontal: 10,
  borderBottomWidth: 1, ...BORDER_BOTTOM,
}

const ROW_TOPIC_REPORT: ViewStyle = {
  flex: 0.8, ...FLEX_ROW, justifyContent: 'space-between', alignItems: 'center'
}

const FLEX_14: ViewStyle = { flex: 1.4 }
const PRIMARY: TextStyle = {
  color: color.primary
}
const LINE_COLOR: TextStyle = {
  color: color.line
}

const MIN_HEIGHT_LIST: ViewStyle = { minHeight: 40 }
const PROVINCE_BUTTON: ViewStyle = {
  ...MIN_HEIGHT_LIST,
  ...FULL, ...FLEX_ROW, ...JUSTIFY_BETWEEN,
  alignItems: 'center', marginHorizontal: 20,
  ...BORDER_BOTTOM,
}
const WRAP_PROVINCE: ViewStyle = { ...FLEX_ROW, paddingRight: 20 }
const VIEW_LIST_PROVINCE: ViewStyle = { ...FLEX_ROW, justifyContent: 'space-evenly' }
const SUB_LIST_VIEW: ViewStyle = { marginHorizontal: 20, ...BORDER_BOTTOM, }
const TEXT_LIST_PROVINCE: ViewStyle = { padding: 5, paddingBottom: 7.5 }

const SUB_VIEW_VEHICLE: ViewStyle = {
  ...FULL, ...FLEX_ROW, alignItems: 'center', paddingVertical: 10, marginHorizontal: 20,
  ...BORDER_BOTTOM, borderBottomWidth: 1
}
const MAIN_VIEW_LIST: ViewStyle = { height: 80, ...FULL, marginBottom: 1 }
const VEHICLE_TEXT_VIEW: ViewStyle = { ...FULL, width: '100%' }
const SUB_VEHICLE_TEXT: ViewStyle = { ...FLEX_ROW, justifyContent: 'space-around' }
const IMAGE_LAYOUT: ViewStyle = { width: 60, height: 60 }
const WIDTH_70: ViewStyle = { width: '70%' }
const EMPTY_VIEW: ViewStyle = { ...FULL, alignItems: 'center', justifyContent: 'center', marginTop: (height / 4) - 20 }

export const ProfileScreen = observer(function ProfileScreen() {
  // console.tron.log('hello rendering world')
  const { tokenStore } = useStores()
  const navigation = useNavigation()
  const [menu1, setmenu1] = useState(true)
  const [menu2, setmenu2] = useState(false)
  const [renderNewProfile, setrenderNewProfile] = useState(false)
  const [profileState, setprofileState] = useState(null)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onRightPress={() => navigation.navigate("updateProfile")} iconName={"ios-create-outline"} iconSize={24} iconColor={color.black} />
      ),
    });
    ProfileStore.getProfileRequest()
    ProfileStore.getTruckSummary()
  }, [])

  useEffect(() => {
    let tmp_profile = JSON.parse(JSON.stringify(ProfileStore.data))
    if (tmp_profile && tmp_profile != profileState) {
      setprofileState(tmp_profile)
      setrenderNewProfile(!renderNewProfile)
    }
  }, [ProfileStore.data])

  const list_analatic_work = [
    { id: 1, name: 'profileScreen.allPostjob', value: 123 },
    { id: 1, name: 'profileScreen.workDonePassApp', value: 78 },
    { id: 1, name: 'profileScreen.useWorkPassApp', value: 54 },
  ]


  const { versatileStore } = useStores()
  const [lang, setlang] = useState(null)
  const [swipe, setswipe] = useState(false)
  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
      setswipe(!swipe)
    }
  }, [versatileStore.language])

  useEffect(() => {
    navigation.setOptions({
      headerCenter: () => (
        <HeaderCenter tx={"profileScreen.profile"} />
      ),
    });
  }, [lang])

  const _onPressMenu = (menu) => {
    if (menu == "menu1") {
      setmenu1(true)
      setmenu2(false)
    } else {
      setmenu1(false)
      setmenu2(true)
    }
  }

  const _renderVehice = (item, index) => {
    return <View key={"view-list-" + index} style={ROOT_FLAT_LIST}>
      <View style={[NORMAL_WRAPPER_LIST, {}]}>

        <View style={ROW_TOPIC_REPORT}>
          <Text tx={item.title} />
          <Text style={PRIMARY} preset={"header"}>{item.number}</Text>
        </View>
        <View style={FLEX_14}>
          <Text style={LINE_COLOR}>{item.content}</Text>
        </View>

      </View>
    </View>
  }

  const [provinceTmp, setprovinceTmp] = useState(null)

  const onChangeLayout = province => {
    let tmp = provinceTmp ? provinceTmp.split("-")[0] : null
    if (tmp && tmp == province.split('-')[0]) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setprovinceTmp(null)
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setprovinceTmp(province)
    }
  };

  const _renderSectionList = (item, index) => {
    if (!item.province_number) {
      return <View style={MAIN_VIEW_LIST}>
        <View style={SUB_VIEW_VEHICLE}>
          <View style={IMAGE_LAYOUT}>
            {Platform.OS == "ios" ? <Image source={images[MapTruckImageName(item.id)]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
              <Image source={images[MapTruckImageName(item.id)]} style={IMAGE_LIST} height={60} width={60} />}
          </View>

          <View style={VEHICLE_TEXT_VIEW}>
            <View style={SUB_VEHICLE_TEXT}>
              <Text style={WIDTH_70}>{item.name}</Text>
              <Text>{item.number}</Text>
              <Text tx={"profileScreen.unit"} />

            </View>
          </View>


        </View>
      </View>
    } else {
      let checker_view = provinceTmp ? provinceTmp.split('-')[0] : null
      return (<View style={MIN_HEIGHT_LIST} >
        <TouchableOpacity style={[PROVINCE_BUTTON, { borderBottomWidth: checker_view == item.id ? 0 : 1 }]} onPress={() => onChangeLayout(`${item.id}-${item.name}`)}>
          <View><Text style={COLOR_PRIMARY} tx={item.name} /></View>

          <View style={VIEW_LIST_PROVINCE}>
            <View style={WRAP_PROVINCE}>
              <Text>{item.province_number + "   "}</Text>
              <Text tx={"common.provinceField"} />
            </View>
            <View>
              <Ionicons name="chevron-down" size={20} />
            </View>
          </View>
        </TouchableOpacity>

        {checker_view && checker_view == item.id &&
          <View style={[SUB_LIST_VIEW, { borderBottomWidth: checker_view == item.id ? 1 : 0 }]}>
            {item.province_list.map((e, i) => {
              return <Text style={TEXT_LIST_PROVINCE}>{(i + 1) + ". " + e.toString()}</Text>
            })}
          </View>}
      </View>)
    }
  }

  const _renderTextProfile = (text) => {
    return <Text preset="default" style={PADDING_LEFT_SMALL} tx={text ? '' : 'profileScreen.nophone'}>{text || ''}</Text>
  }

  const _renderEmptyList = (s1, s2, s3, link) => {
    return <View style={EMPTY_VIEW}>
      <View>
        <Text tx={s1} />
      </View>
      <View>
        <Text tx={s2} />
      </View>

      <TouchableOpacity style={{ paddingTop: 20 }} onPress={() => navigation.navigate('Home', { screen: link })}>
        <Text tx={s3} preset={'topic'} style={{ color: color.primary }} />
      </TouchableOpacity>
    </View>
  }

  const { fullName, phoneNumber, avatar } = JSON.parse(JSON.stringify(ProfileStore.data)) || {}
  __DEV__ && console.tron.log("Profile data :: ", JSON.parse(JSON.stringify(ProfileStore.data)))

  const report_mock = [
    { id: 1, title: "profileScreen.allPostJob", content: "*เราเปิดโอกาสให้ผู้ใช้ทั้ง Carriers และ Shippers สามารถโพสงานหรือหารถได้หากผู้ใช้สนใจโพสงานสามารถเลือกได้จากหน้าแรก", number: 21 },
    { id: 2, title: "profileScreen.workInProgress", content: "*จำนวนรถที่คุณเพิ่มมาในระบบและได้รับการติดต่องานภายในแอปของเรา", number: 5 },
    { id: 3, title: "profileScreen.workDone", content: "*จำนวนรถที่คุณเพิ่มมาในระบบและได้รับการติดต่องานภายในแอปของเรา", number: 16 },
  ]

  const all_vehicle_mock = [
    {
      title: "profileScreen.allVehicle",
      id: 1,
      data: [
        { id: 18, name: 'รถขนสินค้าแบบกระบะตู้', number: 4 },
        { id: 17, name: 'รถขนสินค้าแบบกระบะห้องเย็น', number: 4 }
      ]
    },
    {
      title: "profileScreen.allWorkZone",
      id: 2,
      data: [
        { id: 1, name: 'common.south', province_number: 2, province_list: ['สงขลา', 'หาดใหญ่'] },
        { id: 2, name: 'common.north', province_number: 1, province_list: ['เชียงใหม่'] },
        { id: 3, name: 'common.center', province_number: 1, province_list: ['กรุงเทพมหานคร'] },
      ]
    },
  ]
  const number_all_vehicle = all_vehicle_mock.length > 0 && all_vehicle_mock[0]?.data.length > 0 ? all_vehicle_mock[0].data.reduce((prev: any, stack: any) => prev.number + stack.number) : 0

  __DEV__ && console.tron.log("NUMBER VEHICLE :: ", number_all_vehicle)
  return (
    <View testID="ProfileScreen" style={FULL}>
      <View style={TOP_VIEW}>
        <View style={VIEW_PROFILE}>
          {<Image source={avatar ? {
            uri: avatar,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokenStore.token.accessToken}`
            },
          } : images.greyMock} style={PROFILE_IMG} />}
          <View style={VIEW_NAME_NAD_PHONE}>

            {<View style={ROW_LAYOUT}>
              <Ionicons name={"person-outline"} size={typography.mediumIcon} />
              {setrenderNewProfile ? _renderTextProfile(fullName) : _renderTextProfile(fullName)}
              {fullName && <Icon icon={'checkActive'} style={ICON_STYLE} />}
            </View>}

            {<View style={ROW_LAYOUT}>
              <Ionicons name={"call-outline"} size={typography.mediumIcon} />
              {setrenderNewProfile ? _renderTextProfile(phoneNumber) : _renderTextProfile(phoneNumber)}
            </View>}

          </View>
        </View>

      </View>






      <View style={BOTTOM_VIEW}>
        <View style={VIEW_MENU_TITLE}>
          <TouchableOpacity style={menu1 == true ? VIEW_MENU_TOUCH_ACTIVE : VIEW_MENU_TOUCH} onPress={() => _onPressMenu('menu1')}>
            <Text style={TEXT_MENU_STYLE} tx={"profileScreen.resultWork"} />
          </TouchableOpacity>
          <TouchableOpacity style={menu2 == true ? VIEW_MENU_TOUCH_ACTIVE : VIEW_MENU_TOUCH} onPress={() => _onPressMenu('menu2')}>
            <Text style={TEXT_MENU_STYLE} tx={"profileScreen.carAndWorkZone"} />
          </TouchableOpacity>
        </View>




        {menu1 && <FlatList
          data={report_mock}
          renderItem={({ item, index }) => _renderVehice(item, index)}
          keyExtractor={(item, index) => 'key-' + index.toString()}
          ListEmptyComponent={() => _renderEmptyList("profileScreen.noEnoughWork", "profileScreen.fromAddWorkScreen",
            "profileScreen.goAddWorkScreen", "postjob")}
        />}


        {menu2 && <View style={[FULL, { paddingTop: Platform.OS == "ios" ? 10 : 0 }]}>


          <SectionList
            sections={all_vehicle_mock}
            keyExtractor={(item: any, index: any) => 'section-list-' + (item.id.toString()) + index}
            renderItem={({ item, index }) => _renderSectionList(item, index)}
            renderSectionHeader={({ section: { title, id } }) => {
              __DEV__ && console.tron.log("section: ", id)
              if (id == 1) {
                return <View>
                  <View style={[PADDING_PURE, PADDING_HORIZON_EXTRA]}>
                    <Text tx={"profileScreen.allCar"} preset="topic" />
                  </View>

                  <View style={[ROW_LAYOUT, JUSTIFY_BETWEEN, PADDING_PURE, PADDING_HORIZON_EXTRA]}>
                    <Text tx={"profileScreen.allVehicle"} />
                    <View style={FLEX_ROW}>
                      <Text style={PADDING_RIGHT}>{number_all_vehicle.toString() + " "}</Text>
                      <Text tx={"profileScreen.unit"} />
                    </View>
                  </View>
                </View>
              } else {
                return <View style={[PADDING_VERTICAL_SMALL, PADDING_HORIZON_EXTRA]}><Text tx={"profileScreen.allWorkZone"} preset="topic" /></View>
              }
            }}
            ListFooterComponent={
              <View style={{ height: 50 }}></View>
            }
            ListEmptyComponent={() => _renderEmptyList("profileScreen.noEnoughCar", "profileScreen.fromManageCar",
              "profileScreen.goManageCar", "myVehicle")}
          />


        </View>}


      </View>


    </View>
  )
})
