import React, { useEffect } from "react"
import { View, ViewStyle, TextStyle, Platform } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Text, RoundedButton, HeaderCenter } from "../../../components"
import { color } from "../../../theme"
import StatusStore from '../../../store/my-vehicle-store/status-vehicle-store'
import LottieView from 'lottie-react-native';
import ProfileStore from "../../../store/profile-store/profile-store"
import AuthStore from "../../../store/auth-store/auth-store"
import { useStores } from "../../../models/root-store/root-store-context";


// const SuccessAnimmation = () => {
//   return <LottieView source={require('../../../AnimationJson/order-packed.json')}
//     autoPlay loop style={{ height: '100%' }} />
// }

const FULL: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: color.textWhite
}

const TEXT_VIEW: ViewStyle = {
  alignItems: 'center',
  backgroundColor: color.textWhite,
  paddingTop: 20
}
const VIEW_BUTTON: ViewStyle = {
  flex: 1,
  backgroundColor: color.textWhite,
  justifyContent: 'center',
  alignItems: 'center',
  borderTopColor: color.line,
  borderTopWidth: 1,
}

const BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.primary
}

const ICON_VIEW: ViewStyle = { alignItems: 'center', justifyContent: 'center', marginTop: -20 }

const TEXT_TOPIC: TextStyle = { color: color.success }
const TEXT_SUB_TITLE: TextStyle = { color: color.line }
const TEXT_BUTTTON_STYLE: TextStyle = {
  // color: color.textWhite 
}
export const SuccessUpload = observer(function SuccessUpload() {
  const navigation = useNavigation()
  const route = useRoute()
  const { tokenStore } = useStores()
  const { from = null }: any = route?.params || {}
  let status = JSON.parse(JSON.stringify(StatusStore.status))

  useEffect(() => {
    let editStatus = JSON.parse(JSON.stringify(StatusStore.status))
    if (editStatus && editStatus == "edit") {
      navigation.setOptions({
        headerCenter: () => (
          <HeaderCenter tx={"common.edit"} />
        ),
      });
    }
    return () => {
      if (status != "edit") {
        let tmp_profile = JSON.parse(JSON.stringify(ProfileStore.data))
        if (tokenStore.token) {
          ProfileStore.getProfileRequest(AuthStore.profile?.userProfile?.userId || tokenStore.profile.userId)
          if (tmp_profile && tmp_profile.userId) ProfileStore.getProfileReporterScreen(tmp_profile.userId)
          ProfileStore.getTruckSummary()
        }
      }
    }
  }, [])


  console.log("Success upload :: screen")
  return (
    <View testID="SuccessUpload" style={FULL}>

      <View style={{ flex: 7 }}>
        <View style={[FULL]}>
          <View style={ICON_VIEW}>
            <LottieView
              source={require('../../../AnimationJson/correct-2.json')}
              style={{ height: 120, width: 120 }}
              autoPlay
              loop={false}
              speed={0.7}
            />
          </View>
          <View style={[TEXT_VIEW]}>
            <Text tx={status == "edit" ? "myVehicleScreen.editVehicleSuccess" : "myVehicleScreen.addVehicleSuccess"} preset={'topic'} style={TEXT_TOPIC} />
            <Text tx={"myVehicleScreen.pendingVehicleDetail"} preset={'default'} style={TEXT_SUB_TITLE} />
            <Text tx={"myVehicleScreen.pendingVehicleDetail2"} preset={'default'} style={TEXT_SUB_TITLE} />
          </View>
        </View>
      </View>

      <View style={VIEW_BUTTON}>
        <RoundedButton testID={"success-vehicle-detail"} onPress={() => navigation.navigate(from && from == "home" ? "home" : "profile")} text={"common.ok"} containerStyle={BUTTON_CONTAINER} textStyle={TEXT_BUTTTON_STYLE} />
      </View>
    </View>
  )
})
