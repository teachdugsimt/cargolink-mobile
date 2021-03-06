import React, { useEffect, useState } from "react"
import {
  View, ViewStyle, TextStyle, TouchableOpacity, RefreshControl,
  SectionList, Dimensions, Image, ImageStyle, FlatList, Platform, LayoutAnimation, Alert,
} from "react-native"
import { observer } from "mobx-react-lite"
import { Text, Icon, RoundedButtonStandard } from "../../components"
import { color, images, typography } from "../../theme"
import ProfileStore from '../../store/profile-store/profile-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MapTruckImageName } from '../../utils/map-truck-image-name'
import { useStores } from "../../models/root-store/root-store-context";
import { useNavigation } from "@react-navigation/native"
import { translate } from "../../i18n"
import { provinceListEn, provinceListTh, regionListEn, regionListTh } from '../home-screen/manage-vehicle/datasource'
import i18n from 'i18n-js'
import StatusStore from '../../store/post-job-store/job-status-store'
import AuthStore from "../../store/auth-store/auth-store"
import { API_URL } from '../../config/'
import _ from 'lodash'

const { width, height } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const COLOR_PRIMARY: TextStyle = { color: color.primary }
const TOP_VIEW: ViewStyle = {
  // flex: Platform.OS == "ios" ? 0.8 : 1.1, 
  height: 140,
  backgroundColor: color.mainTheme,
  borderBottomRightRadius: 15, borderBottomLeftRadius: 15
}
const BOTTOM_VIEW: ViewStyle = { flex: 4 }
const PROFILE_IMG: ImageStyle = {
  width: 85, height: 85, borderRadius: 42.5,
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
  ...FLEX_ROW,
  justifyContent: 'center', alignItems: 'center',
  padding: 10,
  // paddingHorizontal: 20,
  // width: 300,
  // backgroundColor: 'red',
  // alignSelf: 'center'
}
const VIEW_NAME_NAD_PHONE: ViewStyle = {
  flexDirection: 'column',
  alignItems: 'center',
  padding: 15,
  // backgroundColor: 'red'
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
const BORDER_BOTTOM: ViewStyle = { borderBottomColor: color.mainGrey }
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
const MAIN_FLAT_LIST: ViewStyle = { paddingHorizontal: 10, flex: 1 }
const VIEW_SIGNIN: ViewStyle = { paddingHorizontal: 10, paddingVertical: 20, alignItems: 'center' }

const initVehicleList = [
  {
    title: "profileScreen.allVehicle",
    id: 1,
    data: []
  },
  {
    title: "profileScreen.allWorkZone",
    id: 2,
    data: []
  },
]
const initReportWorking = []
const SIGNIN_GROUP_VIEW: ViewStyle = {
  padding: 15,
  borderRadius: 25,
  backgroundColor: color.textWhite,
  marginTop: 10
}

export const ProfileScreen = observer(function ProfileScreen() {
  // console.tron.log('hello rendering world')
  const { tokenStore, versatileStore } = useStores()
  const navigation = useNavigation()
  const [menu1, setmenu1] = useState(true)
  const [menu2, setmenu2] = useState(false)
  const [renderNewProfile, setrenderNewProfile] = useState(false)
  const [profileState, setprofileState] = useState(null)

  useEffect(() => {
    ProfileStore.getTruckSummary()
  }, [])

  const _pressEditProfiel = () => {
    let token = tokenStore?.token?.accessToken || null
    if (!token || !ProfileStore.data) Alert.alert(translate("common.pleaseLogin"))
    else navigation.navigate("updateProfile")
  }

  useEffect(() => {
    let tmp_profile = JSON.parse(JSON.stringify(ProfileStore.data))
    if (tmp_profile && tmp_profile != profileState) {
      ProfileStore.getProfileReporterScreen(tmp_profile.userId)
      setprofileState(tmp_profile)
      setrenderNewProfile(!renderNewProfile)
    } else if (!tmp_profile || Object.keys(tmp_profile).length < 1) {
      ProfileStore.clearDataReportProfileScreen()
      ProfileStore.clearTruckSummary()
    }
  }, [ProfileStore.data])

  const [lang, setlang] = useState(null)
  const [swipe, setswipe] = useState(false)
  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
      setswipe(!swipe)
    }
  }, [versatileStore.language])

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
          <Text style={LINE_COLOR} tx={item.content} />
        </View>

      </View>
    </View>
  }

  const onRefresh = () => {
    let tmp_profile = JSON.parse(JSON.stringify(ProfileStore.data))
    if (tokenStore.token) {
      if (tmp_profile && tmp_profile.userId) ProfileStore.getProfileReporterScreen(tmp_profile.userId)
      ProfileStore.getProfileRequest(AuthStore.profile?.userProfile?.userId || tokenStore.profile.userId)
    }
  }

  const onRefreshTruckSummary = () => {
    let tmp_profile = JSON.parse(JSON.stringify(ProfileStore.data))
    if (tokenStore.token) {
      ProfileStore.getProfileRequest(AuthStore.profile?.userProfile?.userId || tokenStore.profile.userId)
      if (tmp_profile && tmp_profile.userId) ProfileStore.getProfileReporterScreen(tmp_profile.userId)
      ProfileStore.getTruckSummary()
    }
  }

  const [provinceTmp, setprovinceTmp] = useState(null)
  const [arrSection, setarrSection] = useState(initVehicleList)
  const [reportWorking, setreportWorking] = useState(initReportWorking)
  const [allCar, setallCar] = useState("")
  useEffect(() => {
    let tmp_report = JSON.parse(JSON.stringify(ProfileStore.data_report_profile_screen))
    if (tmp_report && tmp_report.trucks && tmp_report.trucks.length > 0) {
      let all_car = tmp_report.trucks.reduce((prev, next) => prev + next.total, 0)
      mappingSectionTruckType(tmp_report.trucks)
      // mappingRegionProvince(tmp_report.workingZones)
      mappingRegionProvince2(tmp_report.workingZones)
      mappingWorkingReport(tmp_report.totalJob)
      setallCar(all_car)
    } else {
      setallCar('')
      setreportWorking([])
      setarrSection(initVehicleList)
    }
  }, [JSON.stringify(ProfileStore.data_report_profile_screen)])

  const mappingWorkingReport = (totalJob) => {
    let tmp = [{ id: 1, title: "profileScreen.allPostJob", content: "common.totalJobText", number: totalJob }]
    setreportWorking(tmp)
    setswipe(!swipe)
  }

  const mappingRegionProvince = (workingZones) => {
    let list_all_province = i18n.locale == "th" ? provinceListTh : provinceListEn
    let list_all_region = i18n.locale == "th" ? regionListTh : regionListEn
    let tmp = []
    // wait for remove duplicate
    console.log("Working zone :: ", workingZones)
    workingZones.forEach((e, i) => {
      if (tmp.find(item => item.id == e.region)) { // old region
        let index = tmp.findIndex(p => p.id == e.region)
        let provicneObj = list_all_province.find(item => item.value == e.province)
        let pro_name = provicneObj ? provicneObj.label : translate("common.notFound")
        tmp[index].province_list.push(pro_name)
      } else {  // new region
        let objRegion = list_all_region.find(item => item.value == e.region)
        let name = objRegion ? (e.region == 7 ? translate("common.allRegion") : objRegion.label) : translate("common.notFound")
        let filterWorkingZones = workingZones.filter(item => item.region == e.region).length
        tmp.push({
          id: e.region,
          name: name,
          province_number: filterWorkingZones && filterWorkingZones > 0 ? filterWorkingZones - 1 : 0,
          province_list: []
        })
      }
    })
    // console.log("Tmp :: ", tmp)
    let tmp_section = arrSection
    tmp_section[1].data = tmp
    console.log("tmmp section :: ", tmp_section)
    setarrSection(tmp_section)
    setswipe(!swipe)
  }

  const mappingRegionProvince2 = (workingZones) => {
    let list_all_province = i18n.locale == "th" ? provinceListTh : provinceListEn
    let list_all_region = i18n.locale == "th" ? regionListTh : regionListEn

    // wait for remove duplicate
    const tmpWorkingZones = JSON.parse(JSON.stringify(workingZones))
    console.log("Working zone :: ", workingZones)

    const uniqueWorkZoneRegion = _.uniqBy(JSON.parse(JSON.stringify(workingZones)), 'region')
    const tmp = uniqueWorkZoneRegion.map((e, i) => {
      const regionObj = list_all_region.find(reg => e.region == reg.value)
      const provinceListId = tmpWorkingZones.filter(wr => wr.region == e.region)
      console.log("Province List :: ", provinceListId)
      const tmpProvinceListFilterHaveProvince = provinceListId.filter(tmpProvince => tmpProvince.province)
      const nameProvinceList = tmpProvinceListFilterHaveProvince.map(pl => list_all_province.find(la => la.value == pl.province).label)
      return {
        id: e.region,
        name: regionObj?.label || translate("common.notFound"),
        province_list: nameProvinceList,
        province_number: provinceListId.length
      }
    })

    console.log("Tmp 2 :: ", tmp)
    let tmp_section = arrSection
    tmp_section[1].data = tmp
    setarrSection(tmp_section)
    setswipe(!swipe)
  }

  const mappingSectionTruckType = (truckList) => {
    let list_all_truck = JSON.parse(JSON.stringify(versatileStore.list))
    let arr = truckList.map((e, i) => {
      let name = list_all_truck.find(item => e.truckType == item.id)
      return {
        id: e.truckType,
        name: name?.name || translate("common.notFound"),
        number: e.total
      }
    })
    let tmp = arrSection
    tmp[0].data = arr
    setarrSection(tmp)
    setswipe(!swipe)
  }

  const [tmpListTruckType, settmpListTruckType] = useState(null)

  useEffect(() => {
    let tmp_list_all = JSON.parse(JSON.stringify(versatileStore.list))
    if (tmp_list_all != tmpListTruckType) {
      let tmp_report = JSON.parse(JSON.stringify(ProfileStore.data_report_profile_screen))
      if (tmp_report && tmp_report.trucks && tmp_report.trucks.length > 0) {
        console.log("_______________ Mapping new Section List when Language change _______________")
        mappingSectionTruckType(tmp_report.trucks)
      }
      if (tmp_report && tmp_report.workingZones && tmp_report.workingZones.length > 0) {
        mappingRegionProvince2(tmp_report.workingZones)
      }
      settmpListTruckType(tmp_list_all)
    }
  }, [JSON.stringify(versatileStore.list)])

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
    if (!item.province_number && item.province_number != 0) {
      return <View style={MAIN_VIEW_LIST} key={`view-list-truck-${item.name}`}>
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
      if (item.province_number != 0) return (<View style={MIN_HEIGHT_LIST} key={`view-working-zones-${item.id}`}>
        <TouchableOpacity style={[PROVINCE_BUTTON, { borderBottomWidth: checker_view == item.id ? 0 : 1 }]} onPress={() => onChangeLayout(`${item.id}-${item.name}`)}>
          <View><Text style={COLOR_PRIMARY}>{item.name}</Text></View>

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
              return <Text key={`text-list-province-${i}`} style={TEXT_LIST_PROVINCE}>{(i + 1) + ". " + e.toString()}</Text>
            })}
          </View>}
      </View>)
      else return <View></View>
    }
  }

  const _renderTextProfile = (text) => {
    return <Text preset="default"
      style={[PADDING_LEFT_SMALL, { lineHeight: 30 }]} tx={text ? '' : 'profileScreen.nophone'}>{text || ''}
    </Text>
  }

  const _onPressEmpty = (link) => {

    let token = tokenStore?.token?.accessToken || null
    if (ProfileStore.data && token) {
      if (link == "postjob") {
        StatusStore.setStatusScreen("add")
        navigation.navigate('Home', { screen: link })
      } else navigation.navigate("myVehicle", { formScreen: 'profile' })
    }
    else Alert.alert(translate("common.pleaseLogin"))
  }

  const _renderSigninButtonGroup = () => {
    return <View>
      <Text tx={"profileScreen.everLogin"} preset={"topic"} />
      <TouchableOpacity style={SIGNIN_GROUP_VIEW} onPress={() => navigation.navigate("signin")}>
        <Text tx={"profileScreen.loginRegister"} />
      </TouchableOpacity>
    </View>
  }

  const _renderEmptyList = (s1, s2, s3, link) => {
    return <View style={EMPTY_VIEW}>
      <View>
        <Text tx={s1} />
      </View>
      <View>
        <Text tx={s2} />
      </View>

      <TouchableOpacity style={{ paddingTop: 20 }} onPress={() => _onPressEmpty(link)}>
        <Text tx={s3} preset={'topic'} style={{ color: color.primary }} />
      </TouchableOpacity>
    </View>
  }

  const { fullName, phoneNumber, avatar } = JSON.parse(JSON.stringify(ProfileStore.data)) || {}
  __DEV__ && console.tron.log("Profile data :: ", JSON.parse(JSON.stringify(ProfileStore.data)))

  __DEV__ && console.tron.log("Report data :: ", JSON.parse(JSON.stringify(ProfileStore.data_report_profile_screen)))


  let token = tokenStore?.token?.accessToken || ''

  return (
    <View testID="ProfileScreen" style={FULL}>
      <View style={TOP_VIEW}>
        <View style={VIEW_PROFILE}>

          {avatar ? <Image source={{
            uri: `${API_URL}/api/v1/media/file-stream?attachCode=` + avatar,
            method: 'GET',
            headers: {
              "Accept": "image/*"
            },
          }} style={PROFILE_IMG} /> : <View>
            <Ionicons name="person-circle-sharp" size={85} color={color.line} />
          </View>}

          <View style={VIEW_NAME_NAD_PHONE}>

            {(!token || !ProfileStore.data) ? _renderSigninButtonGroup() :
              <>
                {<View style={ROW_LAYOUT}>
                  <Ionicons name={"person-outline"} size={typography.mediumIcon} style={{ lineHeight: 30 }} />
                  {setrenderNewProfile ? _renderTextProfile(fullName) : _renderTextProfile(fullName)}
                </View>}

                {<View style={ROW_LAYOUT}>
                  <Ionicons name={"call-outline"} size={typography.mediumIcon} style={{ lineHeight: 30 }} />
                  {setrenderNewProfile ? _renderTextProfile(phoneNumber) : _renderTextProfile(phoneNumber)}
                </View>}
              </>
            }

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




        {menu1 && <>
          <View style={MAIN_FLAT_LIST}>
            {!!ProfileStore.data ? <FlatList
              data={reportWorking}
              renderItem={({ item, index }) => _renderVehice(item, index)}
              keyExtractor={(item, index) => 'key-' + index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={ProfileStore.loading_report_profile_screen || ProfileStore.loading || ProfileStore.loading_truck_summary}
                  onRefresh={onRefresh}
                />
              }
              ListEmptyComponent={() => _renderEmptyList("profileScreen.noEnoughWork", "profileScreen.fromAddWorkScreen",
                "profileScreen.goAddWorkScreen", "postjob")}
            /> : <FlatList
              data={[]}
              renderItem={({ item, index }) => _renderVehice(item, index)}
              keyExtractor={(item, index) => 'key-' + index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={ProfileStore.loading_report_profile_screen || ProfileStore.loading || ProfileStore.loading_truck_summary}
                  onRefresh={onRefresh}
                />
              }
              ListEmptyComponent={() => _renderEmptyList("profileScreen.noEnoughWork", "profileScreen.fromAddWorkScreen",
                "profileScreen.goAddWorkScreen", "postjob")}
            />}
          </View></>}

        {menu2 && <>
          <View style={[FULL, { paddingTop: Platform.OS == "ios" ? 10 : 0 }]}>
            {!!ProfileStore.data && ProfileStore.data_report_profile_screen && arrSection && arrSection[0].data.length > 0 ? <SectionList
              sections={arrSection}
              keyExtractor={(item: any, index: any) => 'section-list-' + (item.id.toString()) + index}
              renderItem={({ item, index }) => _renderSectionList(item, index)}
              stickySectionHeadersEnabled={false}
              refreshControl={
                <RefreshControl
                  refreshing={ProfileStore.loading_report_profile_screen || ProfileStore.loading_truck_summary}
                  onRefresh={onRefreshTruckSummary}
                />
              }
              renderSectionHeader={({ section: { title, id } }) => {
                if (id == 1) {
                  return <View>
                    <View style={[PADDING_PURE, PADDING_HORIZON_EXTRA]}>
                      <Text tx={"profileScreen.allCar"} preset="topic" />
                    </View>

                    <View style={[ROW_LAYOUT, JUSTIFY_BETWEEN, PADDING_PURE, PADDING_HORIZON_EXTRA]}>
                      <Text tx={"profileScreen.allVehicle"} />
                      <View style={FLEX_ROW}>
                        <Text style={PADDING_RIGHT}>{allCar.toString() + " "}</Text>
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
            /> : <SectionList
              sections={[]}
              keyExtractor={(item: any, index: any) => 'section-list-' + (item.id.toString()) + index}
              renderItem={({ item, index }) => _renderSectionList(item, index)}
              stickySectionHeadersEnabled={false}
              refreshControl={
                <RefreshControl
                  refreshing={ProfileStore.loading_report_profile_screen || ProfileStore.loading_truck_summary}
                  onRefresh={onRefreshTruckSummary}
                />
              }
              ListFooterComponent={
                <View style={{ height: 50 }}></View>
              }
              ListEmptyComponent={() => _renderEmptyList("profileScreen.noEnoughCar", "profileScreen.fromManageCar",
                "profileScreen.goManageCar", "myVehicle")}
            />}

            {(!!ProfileStore.data && !!token) && <RoundedButtonStandard onPress={() => navigation.navigate("myVehicle", { formScreen: 'profile' })}
              text={"homeScreen.manageCar"} />}

          </View>
        </>}


      </View>


    </View>
  )
})
