import React, { useEffect, useState } from "react"
import {
    View, ViewStyle, TextStyle, TouchableOpacity,
    ScrollView, Dimensions, Image, ImageStyle, FlatList, Platform
} from "react-native"
import { observer } from "mobx-react-lite"
import { Text, Icon } from "../../components"
import { color, images, typography } from "../../theme"
import ProfileStore from '../../store/profile-store/profile-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Pie from 'react-native-pie'

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }

const TOP_VIEW: ViewStyle = {
    flex: Platform.OS == "ios" ? 1.8 : 2.2, backgroundColor: color.mainTheme,
    borderBottomRightRadius: 15, borderBottomLeftRadius: 15
}
const BOTTOM_VIEW: ViewStyle = { flex: 4 }
const PROFILE_IMG: ImageStyle = {
    width: 75, height: 75, borderRadius: 37.5
}
const ICON_STYLE: ImageStyle = {
    width: 15, height: 15, borderRadius: 7.5, alignSelf: 'flex-end', marginLeft: 5, marginTop: 2.5
}
const ROW_LAYOUT: ViewStyle = {
    flexDirection: 'row',
    width: '100%'
}
const VIEW_PROFILE: ViewStyle = {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 10
}
const VIEW_NAME_NAD_PHONE: ViewStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15
}
const PADDING_LEFT_SMALL: TextStyle = { paddingLeft: 10 }
const ROW_STATIC: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
    flex: 1,
}

const VIEW_COLUMN_STAT: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
}

const VIEW_COLUMN_STAT_1: ViewStyle = {
    ...VIEW_COLUMN_STAT,
    borderRightWidth: 1
}

const TEXT_STAT: TextStyle = {
    paddingTop: 10
}
const VIEW_MENU_TITLE: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
}
const PADDING_PURE: ViewStyle = {
    padding: 10
}
const PURE_ROW_LAYOUT: ViewStyle = {
    flexDirection: 'row',
    ...PADDING_PURE
}

const VIEW_MENU_TOUCH: ViewStyle = { justifyContent: 'center', alignItems: 'center', flex: 1 }
const VIEW_MENU_TOUCH_ACTIVE: ViewStyle = { ...VIEW_MENU_TOUCH, borderBottomWidth: 2 }
const TEXT_MENU_STYLE: TextStyle = { padding: 10 }
const VIEW_RESULT_VEHICLE: ViewStyle = { flexDirection: 'row', justifyContent: 'space-between' }
const PADDING_RIGHT: ViewStyle = {
    paddingRight: 10
}
const ROOT_FLAT_LIST: ViewStyle = {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
}
const IMAGE_LIST: ImageStyle = {
    // width: 50, height: 50,
    backgroundColor: color.grey, padding: 10,
    resizeMode: "cover",
    aspectRatio: 2 / 2,
    borderRadius: 30,
    borderColor: color.primary, borderWidth: 2,
}
const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }

const BORDER_BOTTOM: ViewStyle = { ...ROOT_FLAT_LIST, borderBottomWidth: 1, borderBottomColor: color.line, marginHorizontal: 10, }

const NORMAL_WRAPPER_LIST: ViewStyle = {
    ...ROOT_FLAT_LIST,
    // paddingTop: 20,
    marginHorizontal: 10,
}

const MARGIN_TOP20: ViewStyle = { marginTop: 20 }
const VIEW_LABEL_COLOR: ViewStyle = { height: 5, borderRadius: 5, padding: 5, marginRight: 5, marginTop: 5 }
const VIEW_LABEL_PURE: ViewStyle = { flexDirection: 'row', justifyContent: 'flex-start' }

const ROOT_VIEW_WORK_ZONE: ViewStyle = { flex: 0.70, padding: 10, flexDirection: 'row', justifyContent: 'space-around', }

export const ProfileScreen = observer(function ProfileScreen() {
    // console.tron.log('hello rendering world')
    const [menu1, setmenu1] = useState(true)
    const [menu2, setmenu2] = useState(false)

    useEffect(() => {
        ProfileStore.getProfileRequest('tokenaksdfjlaisejofiasjefilasjkldfmasdfljak')
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
        console.log("ITEM : ", item, index)
        return <TouchableOpacity key={"view-list-" + index} style={ROOT_FLAT_LIST} onPress={() => console.log("Press index : ", index)}>
            <View style={index == ProfileStore.data.vehicle_details.length - 1 ? NORMAL_WRAPPER_LIST : BORDER_BOTTOM}>
                <View style={VIEW_LIST_IMAGE}>
                    {Platform.OS == "ios" ? <Image source={images.truck2} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
                        <Image source={images.truck2} style={IMAGE_LIST} height={60} width={60} />}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={{ width: '50%', paddingLeft: 20 }}>{item.type}</Text>
                    <Text >{item.number}</Text>
                    <Text style={{ paddingRight: 10 }} tx={'profileScreen.unit'} />
                </View>
            </View>
        </TouchableOpacity>
    }

    const chart_work_zone = [
        { id: 1, name: 'north', percentage: 15, color: '#C70039' },
        { id: 2, name: 'south', percentage: 40, color: '#44CD40' },
        { id: 3, name: 'east', percentage: 25, color: '#404FCD' },
        { id: 4, name: 'west', percentage: 20, color: '#EBD22F' },
    ]

    const province_mock = ['สงขลา', 'สตูล']

    return (
        <View testID="ProfileScreen" style={FULL}>
            <View style={TOP_VIEW}>
                <View style={VIEW_PROFILE}>
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg' }} style={PROFILE_IMG} />
                    <View style={VIEW_NAME_NAD_PHONE}>
                        <View style={ROW_LAYOUT}>
                            <Ionicons name={"person-outline"} size={typography.mediumIcon} />
                            <Text preset={"default"} style={PADDING_LEFT_SMALL}>
                                {ProfileStore.data && ProfileStore.data.first_name && `${ProfileStore.data.first_name} ${ProfileStore.data.last_name ? ProfileStore.data.last_name : ''}`}
                            </Text>
                            <Icon icon={'checkActive'} style={ICON_STYLE} />
                        </View>
                        <View style={ROW_LAYOUT}>
                            <Ionicons name={"call-outline"} size={typography.mediumIcon} />
                            <Text preset="default" style={PADDING_LEFT_SMALL}>{ProfileStore.data && ProfileStore.data.tel_no && ProfileStore.data.tel_no}</Text>
                        </View>
                    </View>
                </View>


                <View style={ROW_STATIC}>
                    {list_analatic_work.map((e, i) => {
                        return (
                            <View key={'result-view-' + i} style={i != list_analatic_work.length - 1 ? VIEW_COLUMN_STAT_1 : VIEW_COLUMN_STAT}>
                                <Text preset={'topic'} >{e.value}</Text>
                                <Text preset={'default'} tx={e.name} style={TEXT_STAT} />
                            </View>
                        )
                    })}
                </View>
            </View>






            <View style={BOTTOM_VIEW}>
                <View style={VIEW_MENU_TITLE}>
                    <TouchableOpacity style={menu1 == true ? VIEW_MENU_TOUCH_ACTIVE : VIEW_MENU_TOUCH} onPress={() => _onPressMenu('menu1')}>
                        <Text style={TEXT_MENU_STYLE} tx={"profileScreen.allYourVehicle"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={menu2 == true ? VIEW_MENU_TOUCH_ACTIVE : VIEW_MENU_TOUCH} onPress={() => _onPressMenu('menu2')}>
                        <Text style={TEXT_MENU_STYLE} tx={"profileScreen.workZone"} />
                    </TouchableOpacity>
                </View>









                {menu1 && <View style={VIEW_RESULT_VEHICLE}>
                    <Text tx={"profileScreen.allVehicle"} style={{ padding: 10 }} />
                    <View style={PURE_ROW_LAYOUT}>
                        {ProfileStore.data && ProfileStore.data.vehicle_details.length && <Text style={PADDING_RIGHT}>{ProfileStore.data.vehicle_details.length}</Text>}
                        <Text tx={'profileScreen.unit'} />
                    </View>
                </View>}



                {menu1 && <FlatList
                    data={ProfileStore.data && ProfileStore.data.vehicle_details.length && ProfileStore.data.vehicle_details ?
                        JSON.parse(JSON.stringify(ProfileStore.data.vehicle_details)) : []}
                    renderItem={({ item, index }) => _renderVehice(item, index)}
                    keyExtractor={(item, index) => 'key' + index}
                />}


                {menu2 == true && <View style={FULL}>
                    <View style={ROOT_VIEW_WORK_ZONE}>
                        <Pie
                            radius={80}
                            innerRadius={60}
                            sections={chart_work_zone}
                            dividerSize={6}
                            strokeCap={'butt'}
                        />
                        <View style={MARGIN_TOP20}>
                            {chart_work_zone.map((e, i) => {
                                return <View style={VIEW_LABEL_PURE}>
                                    <View style={{ ...VIEW_LABEL_COLOR, backgroundColor: e.color }} >
                                    </View>
                                    <Text tx={`common.${e.name}`}></Text>
                                </View>
                            })}
                        </View>


                    </View>


                    <View style={{ width: '100%', flex: 0.5 }}>
                        <View style={{ borderTopColor: color.line, borderTopWidth: 1, marginHorizontal: 15, paddingTop: 10, }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text tx={"profileScreen.allProvinceSouth"} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '30%' }}>
                                    <Text>2</Text>
                                    <Text tx={"uploadVehicleScreen.province"} />
                                </View>

                            </View>


                            {province_mock.map((e, i) => {
                                return (
                                    <View style={{ borderBottomColor: color.line, borderBottomWidth: 1, padding: 5 }}>
                                        <Text>{(i + 1) + ". " + e}</Text>
                                    </View>
                                )
                            })}

                        </View>
                    </View>


                </View>}


            </View>


        </View>
    )
})
