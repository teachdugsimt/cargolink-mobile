import React, { useEffect, useState } from "react"
import {
  View, ViewStyle, TextStyle, TouchableOpacity,
  SectionList, Dimensions, Image, ImageStyle, FlatList, Platform, LayoutAnimation,
} from "react-native"
import { observer } from "mobx-react-lite"
import { Text, Icon } from "../../components"
import { color, images, typography } from "../../theme"
import ProfileStore from '../../store/profile-store/profile-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MapTruckImageName } from '../../utils/map-truck-image-name'

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }

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

const NORMAL_WRAPPER_LIST: ViewStyle = {
  ...ROOT_FLAT_LIST,
  marginHorizontal: 10,
  borderBottomWidth: 1, borderBottomColor: color.line,
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

export const ProfileScreen = observer(function ProfileScreen() {
  // console.tron.log('hello rendering world')
  const [menu1, setmenu1] = useState(true)
  const [menu2, setmenu2] = useState(false)
  const [swipe, setswipe] = useState(false)

  useEffect(() => {
    ProfileStore.getProfileRequest()
    ProfileStore.getTruckSummary()
  }, [])

  useEffect(() => {
    let tmp_profile = JSON.parse(JSON.stringify(ProfileStore.data))
    if (tmp_profile && Object.keys(tmp_profile).length) {
      console.log("Profile screen => Profile data :: => ", tmp_profile)
      console.log("Profile screen => Profile data :: => ", tmp_profile)
    }
  }, [ProfileStore.data])

  const list_analatic_work = [
    { id: 1, name: 'profileScreen.allPostjob', value: 123 },
    { id: 1, name: 'profileScreen.workDonePassApp', value: 78 },
    { id: 1, name: 'profileScreen.useWorkPassApp', value: 54 },
  ]

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
      return <View style={{ height: 80, flex: 1, marginBottom: 1 }}>
        <View style={{
          flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginHorizontal: 20,
          borderBottomColor: color.line, borderBottomWidth: 1
        }}>
          <View style={{ width: 60, height: 60 }}>
            {Platform.OS == "ios" ? <Image source={images[MapTruckImageName(item.id)]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
              <Image source={images[MapTruckImageName(item.id)]} style={IMAGE_LIST} height={60} width={60} />}
          </View>

          <View style={{ flex: 1, width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text style={{ width: '70%' }}>{item.name}</Text>
              <Text>{item.number}</Text>
              <Text tx={"profileScreen.unit"} />

            </View>
          </View>


        </View>
      </View>
    } else {
      let checker_view = provinceTmp ? provinceTmp.split('-')[0] : null
      __DEV__ && console.tron.log("Checker View :: ", checker_view)
      return <View style={{ minHeight: 40 }} >
        <TouchableOpacity style={{
          minHeight: 40,
          flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20,
          borderBottomColor: color.line, borderBottomWidth: checker_view == item.id ? 0 : 1
        }} onPress={() => onChangeLayout(`${item.id}-${item.name}`)}>
          <View><Text style={{ color: color.primary }} tx={item.name} /></View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <View style={{ flexDirection: 'row', paddingRight: 20 }}>
              <Text>{item.province_number + "   "}</Text>
              <Text tx={"common.provinceField"} />
            </View>
            <View>
              <Ionicons name="chevron-down" size={20} />
            </View>
          </View>
        </TouchableOpacity>

        {checker_view && checker_view == item.id &&
          <View style={{
            marginHorizontal: 20, borderBottomColor: color.line,
            borderBottomWidth: checker_view == item.id ? 1 : 0
          }}>
            {item.province_list.map((e, i) => {
              return <Text style={{ padding: 5, paddingBottom: 7.5 }}>{(i + 1) + ". " + e.toString()}</Text>
            })}
          </View>}
      </View>
    }
  }




  const full_name = ProfileStore.data?.fullName ? JSON.parse(JSON.stringify(ProfileStore.data.fullName)) : null
  const phone_number = ProfileStore.data?.phoneNumber ? JSON.parse(JSON.stringify(ProfileStore.data.phoneNumber)) : null

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
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg' }} style={PROFILE_IMG} />
          <View style={VIEW_NAME_NAD_PHONE}>

            {!!full_name && <View style={ROW_LAYOUT}>
              <Ionicons name={"person-outline"} size={typography.mediumIcon} />
              <Text preset={"default"} style={PADDING_LEFT_SMALL}>
                {full_name}
              </Text>
              <Icon icon={'checkActive'} style={ICON_STYLE} />
            </View>}

            {!!phone_number && <View style={ROW_LAYOUT}>
              <Ionicons name={"call-outline"} size={typography.mediumIcon} />
              <Text preset="default" style={PADDING_LEFT_SMALL}>{phone_number}</Text>
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
          />


        </View>}


      </View>


    </View>
  )
})
