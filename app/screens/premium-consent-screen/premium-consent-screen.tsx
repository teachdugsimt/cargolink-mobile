import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView, Dimensions } from "react-native"
import { RoundedButton, Screen, Text, ModalLoading } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import HTML from "react-native-render-html";
import PartnerRegisterStore from "../../store/profile-store/partner-register-store"

const { width } = Dimensions.get('window')

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


export const PremiumConsentScreen = observer(function PremiumConsentScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()

  return (
    <Screen style={ROOT} unsafe>
      <ScrollView style={{
        backgroundColor: 'white', borderRadius: 10,
        marginTop: 10, padding: 20, marginBottom: 10,
        paddingBottom: 20
      }}>
        <ModalLoading size={'large'} color={color.primary} visible={PartnerRegisterStore.loading} />
        {PartnerRegisterStore.data && PartnerRegisterStore.data.data ?
          <HTML source={{ html: PartnerRegisterStore.data.data }}
            containerStyle={{ padding: 10, paddingBottom: 40 }}
            contentWidth={width - 40}
            tagsStyles={{ span: { fontStyle: 'bold' }, p: { textAlign: 'justify' } }}
            ignoredStyles={['font-weight', 'fontWeight']}
            onParsed={(dom, RNElements) => {
              // Find the index of the first paragraph
              console.log("RneElement :: ", RNElements)
              let all_slot = RNElements.map(e => {
                console.log("E:", e)
                let slot = { ...e }
                if (slot?.attribs?.style && typeof slot.attribs.style == "string" && slot.attribs.style.includes('Sarabun, sans-serif')) {
                  let oriTxt = slot.attribs.style
                  let parseTxt = oriTxt.replace("Sarabun, sans-serif", "Kanit-Medium")
                  slot.attribs.style = parseTxt
                }
                if (slot.tagName == "p" && slot.wrapper == "Text"
                  && Object.keys(slot.attribs).length == 0
                  && slot?.children.length > 0
                  && slot?.children[0]?.data) {
                  slot.attribs.style = `font-family:Kanit-Medium`
                }
                return slot
              })
              return all_slot;
            }}
          />
          : <Text>{""}</Text>}

      </ScrollView>

      <RoundedButton onPress={() => {
        navigation.navigate('premiumRegister')
      }}
        text={"partnerRegister.acceptPremiumConsent"}
        containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT}
      />
    </Screen>
  )
})
