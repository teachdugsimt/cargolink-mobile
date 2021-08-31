import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextInput, View } from "react-native"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.mainBackgrorund,
  flex: 1,
  padding: 20,

}

export const PremiumRegisterScreen = observer(function PremiumRegisterScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} unsafe>
      <View style={{ marginTop: 20 }}>
        <Text style={{ marginBottom: 10 }}>ชื่อบริษัท</Text>
        <TextInput style={{
          width: '100%', height: 45,
          backgroundColor: 'white', borderRadius: 5,
          paddingHorizontal: 10, marginBottom: 20
        }} />

        <Text style={{ marginBottom: 10 }}>เลขทะเบียนนิติบุคคล</Text>
        <TextInput style={{
          width: '100%', height: 45,
          backgroundColor: 'white', borderRadius: 5,
          paddingHorizontal: 10, marginBottom: 20
        }} />
      </View>
    </Screen>
  )
})
