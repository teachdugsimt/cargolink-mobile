import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle } from "react-native"
import { Button, RoundedButton, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models/root-store/root-store-context";
import { color } from "../../theme"
import ProfileStore from "../../store/profile-store/profile-store"
import PartnerRegisterStore from "../../store/profile-store/partner-register-store"

const ROOT: ViewStyle = {
  backgroundColor: color.mainBackgrorund,
  flex: 1,
  padding: 10
}

const PENDING_TEXT: TextStyle = { color: color.darkGreen }

const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.darkGreen,
  borderColor: color.transparent,
  width: '100%',
  borderRadius: 10
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.snow,
  fontSize: 18
}

const CONTAINER_TEXT: ViewStyle = {
  backgroundColor: 'white', borderRadius: 10,
  marginTop: 10, padding: 20, marginBottom: 10
}

export const PremiumDetailScreen = observer(function PremiumDetailScreen() {
  const { tokenStore } = useStores()
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  let tmp_data: any = JSON.parse(JSON.stringify(ProfileStore.data))

  useEffect(() => {

    if (tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT") {
      PartnerRegisterStore.getPartnerTermAndCondition(tmp_data.userId || tokenStore.profile.userId)
      // get term And Condition
    }
  }, [])

  const _renderPremiumUseful = () => (<><Text style={{ fontSize: 20 }}>ความพิเศษเหนือคนอื่นที่คุณจะได้รับ</Text>
    <Text></Text>
    <Text style={{ fontSize: 18 }}>1. เพิ่มโอกาสได้งาน หรือได้รถก่อนใคร</Text>
    <Text style={{ fontSize: 18 }}>2. งานของคุณจะได้รับการประสานงานจากทีมงานคาร์โก้ลิ้งค์ เพื่อการขนส่งเป็นไปอย่างราบรื่น</Text>
    <Text style={{ fontSize: 18 }}>3. ...</Text>
    <Text style={{ fontSize: 18 }}>4. ...</Text>
    <Text style={{ fontSize: 18 }}>5. ...</Text>
    <Text></Text></>)

  const navigation = useNavigation()
  return (
    <Screen style={ROOT} unsafe>
      <View style={CONTAINER_TEXT}>
        {tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT" ?
          _renderPremiumUseful() : <>
            <View>
              {tmp_data && <Text tx={"partnerRegister.pending"} preset={"header"} style={PENDING_TEXT} />}
              {_renderPremiumUseful()}
            </View>
          </>}

      </View>
      {tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT" && <RoundedButton onPress={() => {
        navigation.navigate('premiumConsent')
      }}
        text={"partnerRegister.registerCargolinkPremium"}
        containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT}
      />}
    </Screen>
  )
})
