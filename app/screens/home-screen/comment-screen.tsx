import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, TextInput } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { TextInputTheme, Text, RoundedButton } from "../../components"
import { typography, color } from "../../theme"
import { useForm, Controller } from "react-hook-form";
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }
const CENTER: ViewStyle = { width: '100%', alignItems: 'center' }
const BUTTON_MAIN: ViewStyle = {
  flex: 1,
  height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  margin: 10
}
const WRAPPER_BUTTON: ViewStyle = { flexDirection: 'row', justifyContent: 'space-evenly', width: '70%' }
const LAYOUT_REGISTRATION_FIELD: TextStyle = {
  textAlign: 'right', paddingRight: 10,
  marginHorizontal: 10,
}
const MARGIN_MEDIUM: ViewStyle = {
  marginVertical: 10
}
const VIEW_TEXT_INPUT: ViewStyle = { marginHorizontal: 20, width: '100%' }

const CONTENT_TEXT: TextStyle = {
  fontFamily: 'Kanit-Medium',
  color: color.black,
  fontSize: typography.title
}
const MARGIN_TOP_5: ViewStyle = { marginTop: 5 }
const MARGIN_TOP_20: ViewStyle = { marginTop: 20 }
const VIEW_TEXT_INPUT2: ViewStyle = { marginHorizontal: 20, width: '100%' }
const TEXT_INPUT: ViewStyle = { height: 80, width: '90%', borderWidth: 1, borderRadius: 2.5, borderColor: color.line, padding: 10 }
const WRAPPER_BUTTON2: ViewStyle = { flexDirection: 'row', justifyContent: 'space-evenly', width: '90%' }

const TOP_VIEW_2: ViewStyle = { backgroundColor: color.textWhite, }
const ROUND_BUTTON_CONTAINER: ViewStyle = { backgroundColor: color.primary, borderColor: color.transparent }
const ROUND_BUTTON_TEXT: TextStyle = { color: color.textWhite }
const WRAPPER_TOP: ViewStyle = { padding: 10 }


export const CommentScreen = observer(function CommentScreen() {
  const { control, handleSubmit, errors } = useForm({
    // defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : MyVehicleStore.MappingData
  });

  const _renderButton = (name, col) => {
    return <TouchableOpacity style={[BUTTON_MAIN, { backgroundColor: color[col] }]}>
      <Text tx={name} />
    </TouchableOpacity>
  }
  let formControllerValue = control.getValues()

  return (
    <View testID="CommentScreen" style={FULL}>
      <View style={{ flex: 1, backgroundColor: color.textWhite }}>
        <View style={[CENTER, MARGIN_TOP_20]}>
          <Text tx={"commentScreen.canDealInApp"} />
        </View>

        <View style={CENTER}>
          <View style={WRAPPER_BUTTON}>
            {_renderButton("commentScreen.canPassApp", "primary")}
            {_renderButton("commentScreen.notPassApp", "line")}
          </View>
        </View>

        <View style={CENTER}>
          <Text tx={"commentScreen.howMuchDeal"} />
        </View>

        <View style={CENTER}>
          <View style={VIEW_TEXT_INPUT}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <TextInputTheme
                  testID={"deal-price"}
                  keyboardType="numeric"
                  inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
              )}
              key={'text-input-deal-price'}
              name={"deal-price"}
              rules={{ pattern: /^[0-9]+$/ }}
              defaultValue=""
            />
          </View>
        </View>

        <View style={CENTER}>
          <Text tx={"commentScreen.rateUs"} />
          <Text tx={"commentScreen.star"} />
        </View>

        <View style={CENTER}>
          <View style={[VIEW_TEXT_INPUT2, { alignItems: 'center' }]}>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => {
                return (<TextInput
                  multiline={true}
                  clearButtonMode="while-editing"
                  style={TEXT_INPUT}
                  onChangeText={(text) => onChange(text)}
                  value={value}
                />)
              }}
              key={'controller-dropdown-detail'}
              name={"controller-detail"}
              defaultValue=""
            />
          </View>
        </View>

        <View style={CENTER}>
          <View style={WRAPPER_BUTTON2}>
            {_renderButton("commentScreen.fastFindCar", "primary")}
            {_renderButton("commentScreen.fastFindCar", "line")}
            {_renderButton("commentScreen.fastFindCar", "line")}
          </View>
        </View>


      </View>

      <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_5 }}>
        <View style={WRAPPER_TOP}>
          <RoundedButton onPress={() => console.log("Press")} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
        </View>
      </View>
    </View>
  )
})
