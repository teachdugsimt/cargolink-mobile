import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, Dimensions, ScrollView, Text as Wording } from "react-native"
import { RoundedButton, Screen, Text, ModalLoading } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models/root-store/root-store-context";
import { color } from "../../theme"
import ProfileStore from "../../store/profile-store/profile-store"
import PartnerRegisterStore from "../../store/profile-store/partner-register-store"
import LottieView from 'lottie-react-native';
import { translate } from "../../i18n"


const { width, height } = Dimensions.get("window")
const MAX_HEIGHT: ViewStyle = { height: '100%' }
const PendingStatus = () => {
  return <LottieView source={require('../../AnimationJson/wait-register.json')}
    autoPlay loop style={MAX_HEIGHT} />
}
const PartnerStatus = () => {
  return <LottieView source={require('../../AnimationJson/we-are-partner.json')}
    autoPlay loop style={MAX_HEIGHT} />
}
const ROOT: ViewStyle = {
  backgroundColor: color.mainBackgrorund,
  flex: 1,
}

const FULL: ViewStyle = {
  flex: 1
}
const KANIT: TextStyle = { fontFamily: "Kanit-Medium" }
const FONT_DETAIL: TextStyle = { color: color.line, ...KANIT }
const ROW_STYLE: ViewStyle = {
  flexDirection: 'row'
}

const PENDING_TEXT: TextStyle = { color: color.darkGreen }

const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.darkGreen,
  borderColor: color.transparent,
  borderRadius: 10,
  margin: 10
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.snow,
  fontSize: 18
}

const CONTAINER_TEXT: ViewStyle = {
  ...FULL,
  backgroundColor: 'white', borderRadius: 10,
  marginTop: 10, padding: 20, marginHorizontal: 10
}

const partnerWording = [
  {
    id: 1, header: 'partnerRegister.partnerUsefull', items: [
      {
        id: 11,
        topic: "partnerRegister.ownerProduct", details: ["partnerRegister.useFullShipper1",
          "partnerRegister.useFullShipper2",
          "partnerRegister.useFullShipper3",
          "partnerRegister.useFullShipper4",
          "partnerRegister.useFullShipper5",]
      },
      {
        id: 12,
        topic: "partnerRegister.ownerTruck", details: ["partnerRegister.useFullCarrier1",
          "partnerRegister.useFullCarrier2",
          "partnerRegister.useFullCarrier3",
          "partnerRegister.useFullCarrier4",
          "partnerRegister.useFullCarrier5",]
      }
    ]
  },
  {
    id: 2, header: "partnerRegister.property", items: [
      {
        id: 13,
        topic: "", details: ["partnerRegister.regionThai",
          "partnerRegister.18+"]
      }
    ]
  },
  {
    id: 3, header: "partnerRegister.documentRegister", items: [
      {
        id: 14,
        topic: "partnerRegister.ownerProductDoc", details: ["partnerRegister.ownerProductDoc1",
          "partnerRegister.ownerProductDoc2"]
      },
      {
        id: 15,
        topic: "partnerRegister.ownerTruckDoc", details: ["partnerRegister.ownerTruckDoc1",
          "partnerRegister.ownerTruckDoc2",
          "partnerRegister.ownerTruckDoc3",
          "partnerRegister.ownerTruckDoc4"]
      }
    ]
  }
]

const listAddSubWording: string[] = ['ownerProductDoc2', 'ownerTruckDoc1', 'ownerTruckDoc2',
  'ownerTruckDoc3', 'ownerTruckDoc4',]

export const PremiumDetailScreen = observer(function PremiumDetailScreen() {
  const { tokenStore } = useStores()

  let tmp_data: any = JSON.parse(JSON.stringify(ProfileStore.data))

  useEffect(() => {

    if (tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT") {
      PartnerRegisterStore.getPartnerTermAndCondition(tmp_data.userId || tokenStore.profile.userId)
    }
  }, [])

  const _renderPremiumUseful = () => (<View style={{ paddingBottom: 40 }}>
    {partnerWording.map((e, i) => {
      console.log("E : ", e)
      return <View key={'root-text-' + i} style={{ paddingTop: 10 }}>
        <Text tx={e.header} preset="header" />
        {e.items.map((two, twoi) => {
          return <View key={`topic-view-${twoi}`}>
            <Text key={`topic-text-${twoi}`} tx={two.topic} preset="topicExtra" style={{ marginTop: two.topic ? 5 : -7.5 }} />
            {two.details.map((thd, thdi) => {
              if (listAddSubWording.filter(word => thd.includes(word)).length > 0)
                return <View style={ROW_STYLE}>
                  <Wording key={`content-text-${thdi}`} style={KANIT}>{translate(thd)}
                    <Wording key={`sub-content-text-${thdi}`}
                      style={FONT_DETAIL} >{translate('partnerRegister.sendDocument')}</Wording>
                  </Wording>
                </View>
              else
                return <Text key={`content-text-${thdi}`} tx={thd} />
            })}
          </View>
        })}
      </View>
    })}
  </View>)

  const navigation = useNavigation()
  return (
    <Screen style={ROOT} unsafe>
      <ScrollView style={[FULL, CONTAINER_TEXT,
        tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT" ?
          {} : { marginBottom: 10 }]}>
        <ModalLoading size={'large'} color={color.primary} visible={PartnerRegisterStore.loading} />
        {tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT" ?
          _renderPremiumUseful() : <View style={[FULL]}>

            {!!tmp_data && !!tmp_data.userType && tmp_data.documentStatus == "WAIT_FOR_VERIFIED" ? <View
              style={[FULL]}>
              <Text tx={"partnerRegister.pending"} preset={"header"} style={PENDING_TEXT} />
              <View style={{ width: width - 40, height: height / 4.2, alignItems: 'center' }}>
                <PendingStatus />
              </View>
            </View>

              :

              <View style={[FULL]}>
                {tmp_data && <Text tx={"partnerRegister.verify"} preset={"header"} style={PENDING_TEXT} />}
                <View style={{ width: width - 40, height: height / 4.2 }}>
                  <PartnerStatus />
                </View>
              </View>}

          </View>}
      </ScrollView>
      {tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT" && <RoundedButton onPress={() => {
        navigation.navigate('premiumConsent')
      }}
        text={"partnerRegister.registerCargolinkPremium"}
        containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT}
      />}
    </Screen>
  )
})
