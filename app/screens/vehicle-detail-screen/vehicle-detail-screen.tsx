import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Dimensions,
  Image,
  ImageStyle,
  ScrollView,
  Switch,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Button, Text } from "../../components"
import { translate } from "../../i18n"
import { color, images, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"

const deviceWidht = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const TEXT_BOLD: TextStyle = { fontWeight: "bold" }
const CONTAINER: ViewStyle = {
  flex: 1,
}
const COLUMN: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite,
  marginBottom: spacing[1],
  paddingTop: spacing[4],
  paddingBottom: spacing[4],
  paddingLeft: spacing[4],
  paddingRight: spacing[4],
}
const ROW: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}
const TOPIC: TextStyle = {
  ...TEXT_BOLD,
  fontSize: 16,
  marginBottom: spacing[3],
}
const IMAGES: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
}
const IMAGE: ImageStyle = {
  height: "100%",
  width: deviceWidht / 2 - spacing[5],
  resizeMode: "cover",
  aspectRatio: 4 / 2,
  margin: spacing[1],
  borderRadius: 4,
}
const BUTTON_EDIT: ViewStyle = {
  backgroundColor: color.disable,
  borderRadius: 20,
  marginLeft: spacing[3],
  marginRight: spacing[3],
  marginTop: spacing[2],
  marginBottom: spacing[2],
}
const TEXT_EDIT: TextStyle = {
  fontSize: 16,
}
const SUB_TOPIC: TextStyle = {
  ...TEXT_BOLD,
  paddingBottom: spacing[2],
}
const TEXT_OF_VALUE: TextStyle = {
  textAlign: "right",
  borderWidth: 1,
  borderRadius: 4,
  borderColor: color.disable,
  padding: spacing[3],
}
const SUB_TOPIC_ROOT: ViewStyle = {
  ...COLUMN,
  paddingLeft: 0,
  paddingRight: 0,
}
const OUTER_CIRCLE: ViewStyle = {
  borderRadius: 40,
  width: 58,
  height: 58,
  backgroundColor: color.primary,
  justifyContent: "center",
  alignItems: "center",
}
const LOGO: ImageStyle = {
  width: 55,
  height: 55,
  // borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
  borderRadius: 35,
  backgroundColor: color.disable,
}
const TYPE_CAR_NAME: TextStyle = {
  paddingLeft: spacing[4],
}

const initialState = {
  isChecked: false,
}

export const VehicleDetailScreen = observer(function VehicleDetailScreen() {
  const navigation = useNavigation()

  const [state, setState] = useState(initialState)

  const data = {
    images: [
      "https://truck.in.th/images/T03/T030709955_1_1551238177.jpeg",
      "https://img.kaidee.com/prd/20180706/339715226/b/dafc9446-9a85-439b-ab38-eba1a0a3c164.jpg",
      "https://imgc1.taladrod.com/c/cidx/008/421/14_1.jpg",
      "https://truck.in.th/images/P09/P090598458_1_1506054693.jpg",
    ],
  }

  const onValueChange = () => {
    setState((prevState) => ({
      ...prevState,
      isChecked: !prevState.isChecked,
    }))
  }

  return (
    <View style={CONTAINER}>
      <ScrollView onScroll={({ nativeEvent }) => {}} style={{}} scrollEventThrottle={400}>
        <View style={COLUMN}>
          <View style={ROW}>
            <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleImage")} />
          </View>
          <View style={ROW}>
            <View style={IMAGES}>
              {data.images &&
                data.images.map((image, index) => {
                  return <Image style={IMAGE} source={{ uri: image }} key={index} />
                })}
            </View>
          </View>
        </View>

        <View style={COLUMN}>
          <View style={ROW}>
            <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleType")} />
          </View>
          <View style={{ ...ROW, alignItems: "center" }}>
            <View style={OUTER_CIRCLE}>
              <Image source={images["truck17"]} style={LOGO} />
            </View>
            <Text style={TYPE_CAR_NAME} text={"รถขนสินค้าแบบกระตู้"} />
          </View>
          <View style={ROW}>
            <View style={SUB_TOPIC_ROOT}>
              <Text style={SUB_TOPIC} text={translate("vehicleDetailScreen.heightOfTheCarStall")} />
              <Text style={TEXT_OF_VALUE} text={"Value"} />
            </View>
          </View>
          <View style={{ ...ROW, justifyContent: "space-between" }}>
            <Text text={translate("vehicleDetailScreen.carHaveDum")} />
            <Switch value={state.isChecked} onValueChange={onValueChange} />
          </View>
        </View>

        <View style={COLUMN}>
          <View style={ROW}>
            <Text style={TOPIC} text={translate("vehicleDetailScreen.myVehicleDetail")} />
          </View>
          <View style={ROW}>
            <View
              style={{
                ...SUB_TOPIC_ROOT,
                backgroundColor: "#f8f8f8",
                paddingLeft: spacing[3],
                paddingRight: spacing[3],
                borderRadius: 4,
              }}
            >
              <Text
                style={SUB_TOPIC}
                text={translate("vehicleDetailScreen.vehicleRegistrationNumber")}
              />
              <Text style={TEXT_OF_VALUE} text={"กข - 12345"} />
            </View>
          </View>
        </View>

        <View style={COLUMN}>
          <Button
            testID="edit-vehicle"
            style={BUTTON_EDIT}
            textStyle={TEXT_EDIT}
            text={translate("vehicleDetailScreen.edit")}
            onPress={() => {
              navigation.navigate("uploadVehicle")
            }}
          />
        </View>
      </ScrollView>
    </View>
  )
})
