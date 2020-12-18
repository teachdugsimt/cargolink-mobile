import React, { useEffect } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Image, ImageStyle, Dimensions, Platform } from "react-native"
import { observer } from "mobx-react-lite"
import { Text, Icon } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { color, images, typography } from "../../theme"
import ProfileStore from '../../store/profile-store/profile-store'
// const bowserLogo = require("./bowser.png")

const { width, height } = Dimensions.get('window')
const FULL: ViewStyle = { flex: 1 }

const TOP_VIEW: ViewStyle = { flex: Platform.OS == "ios" ? 0.6 : 0.7, backgroundColor: color.mainTheme }
const BOTTOM_VIEW: ViewStyle = { flex: 4 }
const PROFILE_IMG: ImageStyle = {
    width: 100, height: 100, borderRadius: 50
}
const BOX_PIC: ViewStyle = {
    alignSelf: 'center',
    marginTop: Platform.OS == "ios" ? (height / 2) - (height / 1.78) : (height / 2) - (height / 1.7)
}
const ICON_STYLE: ImageStyle = {
    width: 20, height: 20, borderRadius: 10, alignSelf: 'flex-end',
    position: 'absolute', bottom: 0, right: 5,
}
const CONTENT_PROFILE_VIEW: ViewStyle = {
    paddingTop: 10,
    flex: 1,
}
const NAME_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.mainTitle,
    alignSelf: 'center'
}
const ACCOUNT_TYPE_TEXT: TextStyle = {
    fontFamily: 'Kanit-Regular',
    fontSize: typography.title,
}
const CROWN_ICON: ImageStyle = { width: 25, height: 25, marginLeft: 5, marginTop: -2.5 }
const VIEW_ICON_CROWN: ViewStyle = { flexDirection: 'row', justifyContent: 'center' }
const DETAIL_PROFILE: ViewStyle = {
    flex: 1,
    padding: 20
}
const DETAIL_TOPIC_NO: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.mainTitle
}
const DETAIL_VEHICLE_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.mainTitle
}
const SIGNOUT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Regular',
    fontSize: typography.content,
    alignSelf: 'center',
    paddingVertical: 20
}
const ROW_LAYOUT: ViewStyle = {
    flexDirection: 'row'
}
export const ProfileScreen = observer(function ProfileScreen() {
    console.tron.log('hello rendering world')
    const navigation = useNavigation()
    const data_vehicle = ['สิบล้อ 6 คัน', 'บรรทุก 6 คัน']

    const logoutFunction = () => {
        navigation.navigate('signin')
    }

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

    return (
        <View testID="ProfileScreen" style={FULL}>
            <View style={TOP_VIEW}>
            </View>

            <View style={BOTTOM_VIEW}>
                <View style={BOX_PIC}>
                    {/* <Image source={images.pinbox} style={PROFILE_IMG} /> */}
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576944%29_%28cropped%29.jpg' }} style={PROFILE_IMG} />
                    <Icon icon={'checkActive'} style={ICON_STYLE} />
                </View>

                <View style={CONTENT_PROFILE_VIEW}>
                    <Text style={NAME_TEXT}>
                        {ProfileStore.data && ProfileStore.data.first_name && `${ProfileStore.data.first_name} ${ProfileStore.data.last_name ? ProfileStore.data.last_name : ''}`}
                    </Text>
                    <View style={VIEW_ICON_CROWN}>
                        <Text style={ACCOUNT_TYPE_TEXT} >{ProfileStore.data && ProfileStore.data.account_type && ProfileStore.data.account_type}</Text>
                        {ProfileStore.data && ProfileStore.data.account_type && <Icon icon={'crown'} style={CROWN_ICON} />}
                    </View>

                    <View style={DETAIL_PROFILE}>
                        <View style={ROW_LAYOUT}>
                            <Text tx={"profileScreen.telNo"} style={DETAIL_TOPIC_NO} />
                            <Text style={DETAIL_TOPIC_NO} >{ProfileStore.data && ProfileStore.data.tel_no && ProfileStore.data.tel_no}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text tx={"profileScreen.zoneDrive"} style={DETAIL_TOPIC_NO} />
                            <View style={{ flexDirection: 'column' }}>
                                {ProfileStore.data && ProfileStore.data.work_zone.length && ProfileStore.data.work_zone.map((e, i) =>
                                    <Text key={"profile-detail-vehicle-" + (i + 1)} style={DETAIL_VEHICLE_TEXT}>{e}</Text>
                                )}
                            </View>
                        </View>



                        <View style={{ flexDirection: 'row' }}>
                            <Text tx={"profileScreen.carInformation"} style={DETAIL_TOPIC_NO} />
                            <View style={{ flexDirection: 'column' }}>
                                {ProfileStore.data && ProfileStore.data.vehicle_details.length && ProfileStore.data.vehicle_details.map((e, i) =>
                                    <Text key={"profile-detail-vehicle-" + (i + 1)} style={DETAIL_VEHICLE_TEXT}>{e.type}</Text>)}
                            </View>
                        </View>

                    </View>

                    <TouchableOpacity onPress={logoutFunction}>
                        <Text style={SIGNOUT_TEXT}>Signout</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </View>
    )
})
