import React, { useEffect } from "react"
import { View, ViewStyle, TextStyle, Platform, StyleSheet, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Text, RoundedButton, AddJobElement, HeaderCenter } from "../../../components"
import { color, images } from "../../../theme"
import PostJobStore from "../../../store/post-job-store/post-job-store";
import LottieView from 'lottie-react-native';
import StatusStore from '../../../store/post-job-store/job-status-store'
const SuccessAnimmation = () => {
  return <LottieView source={require('../../../AnimationJson/order-packed.json')}
    autoPlay loop style={{ height: '100%' }} />
}

// const bowserLogo = require("./bowser.png")
const FULL: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  backgroundColor: color.textWhite
}

const TOP_VIEW: ViewStyle = {
  paddingTop: Platform.OS == "ios" ? 10 : 0,
  flex: Platform.OS == "ios" ? 0.65 : 0.85,
  backgroundColor: color.mainTheme,
  justifyContent: 'center',
}
const BOTTOM_VIEW: ViewStyle = {
  flex: Platform.OS == "ios" ? 5 : 5.5,
}
const ROW_TEXT: TextStyle = {
  flexDirection: 'row',
  justifyContent: 'center'
}
const TEXT_VIEW: ViewStyle = {
  flex: 7,
  justifyContent: 'center', alignItems: 'center',
  backgroundColor: color.textWhite,
}
const VIEW_BUTTON: ViewStyle = {
  flex: 1,
  backgroundColor: color.textWhite,
  justifyContent: 'center',
  alignItems: 'center',
  borderTopColor: color.line,
  borderTopWidth: 1,
  padding: 10,
}

const BUTTON_CONTAINER: ViewStyle = {
  borderColor: color.line,
  backgroundColor: color.line
}

const TEXT_TOPIC: TextStyle = { color: color.black }
const TEXT_SUB_TITLE: TextStyle = { color: color.primary }
const TEXT_BUTTTON_STYLE: TextStyle = { color: color.textWhite }
export const PostSuccessScreen = observer(function PostSuccessScreen() {
  const navigation = useNavigation()


  const list_status = [
    { key: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: false },
    { key: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
    { key: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
    { key: 4, no: 4, id: 4, name: 'postJobScreen.success', active: true },
  ]
  const id_post = (JSON.parse(JSON.stringify(PostJobStore.data_postjob))) || ''

  useEffect(() => {
    navigation.setOptions({
      headerCenter: () => (
        <HeaderCenter tx={"postJobScreen.updateJob"} />
      ),
      headerLeft: () => {}
    });
    return () => {
      PostJobStore.clearDataPostjob()
    }
  }, [])
  let status_action = JSON.parse(JSON.stringify(StatusStore.status))
  return (
    <View testID="PostSuccessScreen" style={FULL}>
      <View style={TOP_VIEW}>
        <AddJobElement data={list_status} />
      </View>
      <View style={BOTTOM_VIEW}>

        <View style={TEXT_VIEW}>
          <View style={{ flex: 5, justifyContent: 'center' }}>
            <SuccessAnimmation />
          </View>

          <View style={{ flex: 2, marginTop: -75 }}>
            <Text tx={status_action && status_action == "add" ? "postJobScreen.postJobSuccess" : "postJobScreen.updateJobSucess"} preset={'topic'} style={TEXT_TOPIC} />
            <View style={ROW_TEXT}>
              <Text tx={"common.id"} preset={'topicExtra'} style={TEXT_SUB_TITLE} />
              {!!id_post && <Text preset={'topicExtra'} style={TEXT_SUB_TITLE}>{" " + id_post}</Text>}
            </View>

          </View>
        </View>

        <View style={VIEW_BUTTON}>
          <RoundedButton testID={"success-vehicle-detail"} onPress={() => {
            if (status_action == "add")
              navigation.navigate("home")
            else navigation.navigate("MyJob", { screen: "myjob" })
          }} text={"common.ok"} containerStyle={BUTTON_CONTAINER} textStyle={TEXT_BUTTTON_STYLE} />
        </View>
      </View>
    </View>
  )
})
