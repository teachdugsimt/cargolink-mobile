import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, Dimensions, ScrollView } from "react-native"
import { RoundedButton, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models/root-store/root-store-context";
import { color } from "../../theme"
import ProfileStore from "../../store/profile-store/profile-store"
import PartnerRegisterStore from "../../store/profile-store/partner-register-store"
import LottieView from 'lottie-react-native';


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

const PADDING10: ViewStyle = {
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
  ...FULL,
  backgroundColor: 'white', borderRadius: 10,
  marginTop: 10, padding: 20, marginBottom: 10
}

const partnerWording = [
  {
    id: 1, header: 'partnerRegister.partnerUsefull', items: [
      {
        id: 11,
        topic: "partnerRegister.ownerProduct", details: ["partnerRegister.findTruckEasy",
          "partnerRegister.easyToUse",
          "partnerRegister.reduceMoney",
          "partnerRegister.reduceManageTime",
          "partnerRegister.realTimeTracking",
          "partnerRegister.haveEmployeeManage",]
      },
      {
        id: 12,
        topic: "partnerRegister.ownerTruck", details: ["partnerRegister.easyToFindJob",
          "partnerRegister.reduceTimeToUse",
          "partnerRegister.rateUpForFindSalary",
          "partnerRegister.reduceFreeTrip",
          "partnerRegister.reduceCheat",
          "partnerRegister.haveStaffPrepare",]
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

export const PremiumDetailScreen = observer(function PremiumDetailScreen() {
  const { tokenStore } = useStores()

  let tmp_data: any = JSON.parse(JSON.stringify(ProfileStore.data))

  useEffect(() => {

    if (tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT") {
      PartnerRegisterStore.getPartnerTermAndCondition(tmp_data.userId || tokenStore.profile.userId)
    }
  }, [])

  const _renderPremiumUseful = () => (<>
    {partnerWording.map((e, i) => {
      console.log("E : ", e)
      return <View key={'root-text-' + i} style={{ paddingTop: 10 }}>
        <Text tx={e.header} preset="header" />
        {e.items.map((two, twoi) => {
          return <View key={`topic-view-${twoi}`}>
            <Text key={`topic-text-${twoi}`} tx={two.topic} preset="topicExtra" style={{ marginTop: two.topic ? 5 : -7.5 }} />
            {two.details.map((thd, thdi) => {
              return <Text key={`content-text-${thdi}`} tx={thd} />
            })}
          </View>
        })}
      </View>
    })}
  </>)

  const navigation = useNavigation()
  return (
    <Screen style={ROOT} unsafe>
      <View style={[FULL, PADDING10]}>
        <ScrollView showsVerticalScrollIndicator={false} style={FULL}>
          <View style={CONTAINER_TEXT}>

            {tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT" ?
              _renderPremiumUseful() : <View style={FULL}>

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

          </View>
          {tmp_data?.documentStatus && tmp_data.documentStatus == "NO_DOCUMENT" && <RoundedButton onPress={() => {
            navigation.navigate('premiumConsent')
          }}
            text={"partnerRegister.registerCargolinkPremium"}
            containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT}
          />}
        </ScrollView>
      </View>
    </Screen>
  )
})
