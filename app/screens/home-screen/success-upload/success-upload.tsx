import React, { useEffect } from "react"
import { View, ViewStyle, TextStyle, FlatList, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Text, RoundedButton, HeaderCenter } from "../../../components"
import { color, spacing } from "../../../theme"
import StatusStore from '../../../store/my-vehicle-store/status-vehicle-store'
import LottieView from 'lottie-react-native';

const SuccessAnimmation = () => {
  return <LottieView source={require('../../../AnimationJson/order-packed.json')}
    autoPlay loop style={{ height: '100%' }} />
}

const FULL: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: color.textWhite
}

const TEXT_VIEW: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  backgroundColor: color.textWhite,
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

const TEXT_TOPIC: TextStyle = { color: color.primary }
const TEXT_SUB_TITLE: TextStyle = { color: color.line }
const TEXT_BUTTTON_STYLE: TextStyle = { color: color.textWhite }
export const SuccessUpload = observer(function SuccessUpload() {
  const navigation = useNavigation()

  useEffect(() => {
    let editStatus = JSON.parse(JSON.stringify(StatusStore.status))
    if (editStatus && editStatus == "edit") {
      navigation.setOptions({
        headerCenter: () => (
          <HeaderCenter tx={"common.edit"} />
        ),
      });
    }
  }, [])

  let status = JSON.parse(JSON.stringify(StatusStore.status))
  return (
    <View testID="SuccessUpload" style={FULL}>

      <View style={{ flex: 7 }}>

        <View style={{ flex: 2, alignItems: 'center' }}>
          <SuccessAnimmation />
        </View>
        <View style={[TEXT_VIEW, { marginTop: Platform.OS == "ios" ? -100 : -80 }]}>
          <Text tx={status == "edit" ? "myVehicleScreen.editVehicleSuccess" : "myVehicleScreen.addVehicleSuccess"} preset={'topic'} style={TEXT_TOPIC} />
          <Text tx={"myVehicleScreen.pendingVehicleDetail"} preset={'default'} style={TEXT_SUB_TITLE} />
          <Text tx={"myVehicleScreen.pendingVehicleDetail2"} preset={'default'} style={TEXT_SUB_TITLE} />
        </View>
      </View>

      <View style={VIEW_BUTTON}>
        <RoundedButton testID={"success-vehicle-detail"} onPress={() => navigation.navigate("home")} text={"common.ok"} containerStyle={BUTTON_CONTAINER} textStyle={TEXT_BUTTTON_STYLE} />
      </View>
    </View>
  )
})
