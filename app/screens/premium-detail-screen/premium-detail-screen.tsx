import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle } from "react-native"
import { Button, RoundedButton, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.mainBackgrorund,
  flex: 1,
  padding: 10
}

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

export const PremiumDetailScreen = observer(function PremiumDetailScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  return (
    <Screen style={ROOT} unsafe>
      <View style={{ backgroundColor: 'white', borderRadius: 10, marginTop: 10, padding: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 20 }}>ความพิเศษเหนือคนอื่นที่คุณจะได้รับ</Text>
        <Text></Text>
        <Text style={{ fontSize: 18 }}>1. เพิ่มโอกาสได้งาน หรือได้รถก่อนใคร</Text>
        <Text style={{ fontSize: 18 }}>2. งานของคุณจะได้รับการประสานงานจากทีมงานคาร์โก้ลิ้งค์ เพื่อการขนส่งเป็นไปอย่างราบรื่น</Text>
        <Text style={{ fontSize: 18 }}>3. ...</Text>
        <Text style={{ fontSize: 18 }}>4. ...</Text>
        <Text style={{ fontSize: 18 }}>5. ...</Text>
        <Text></Text>

      </View>
      <RoundedButton onPress={() => {
        navigation.navigate('premiumConsent')
      }}
        text={"registerCargolinkPremium"}
        containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT}
      />
    </Screen>
  )
})
