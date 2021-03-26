import React, { useState, useEffect } from "react"
import {
  View, ViewStyle, TextStyle, Platform, KeyboardAvoidingView,
  TextInput, Keyboard, TouchableWithoutFeedback
} from "react-native"
import { observer } from "mobx-react-lite"
import { Button, NormalDropdown, Text, RoundedButton, HeaderCenter } from "../../components"
import { color, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"
import { translate } from "../../i18n"
import i18n from 'i18n-js'
import { useStores } from "../../models/root-store/root-store-context";
import AuthStore from "../../store/auth-store/auth-store"
import { useForm, Controller } from "react-hook-form";

const FULL: ViewStyle = { flex: 1 }
const MAIN_VIEW: ViewStyle = { backgroundColor: color.textWhite, paddingBottom: 20 }
const PADDING_TOP_20: ViewStyle = { paddingTop: 20 }
const COLOR_LINE: TextStyle = { color: color.line }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
const MARGIN_HORI_20: ViewStyle = { marginHorizontal: 20 }

const TOP_VIEW_2: ViewStyle = { backgroundColor: color.textWhite, }
const ROUND_BUTTON_CONTAINER: ViewStyle = { backgroundColor: color.primary, borderColor: color.transparent }
const ROUND_BUTTON_TEXT: TextStyle = { color: color.textWhite }
const WRAPPER_TOP: ViewStyle = { padding: 10 }
const TEXT_INPUT: ViewStyle = { height: 80, borderWidth: 1, borderRadius: 2.5, borderColor: color.mainGrey, padding: 10 }

export const ReportScreen = observer(function ReportScreen() {
  const navigation = useNavigation()
  const { control, handleSubmit, errors } = useForm({});
  // const { versatileStore, tokenStore } = useStores()

  const onSubmit = (data) => {
    __DEV__ && console.tron.log("data RAW :: ", data)
  }

  let formControllerValue = control.getValues()
  const list = [
    { label: 'Football', value: 'football' },
    { label: 'Baseball', value: 'baseball' },
    { label: 'Hockey', value: 'hockey' },
  ]
  __DEV__ && console.tron.logImportant("Form in render :: ", formControllerValue)
  return (
    <View testID="ReportScreen" style={FULL}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 10}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={MAIN_VIEW}>
            <View style={MARGIN_HORI_20}>
              <View style={PADDING_TOP_20}>
                <Text tx={'moreScreen.explanText'} style={COLOR_LINE} />
              </View>

              <View style={PADDING_TOP_20}>
                <Text tx={"moreScreen.reportTopic"} />

                <View style={{ height: 10 }}></View>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => {
                    return (
                      <NormalDropdown
                        value={value}
                        onValueChange={onChange}
                        items={list}
                        placeholder={"uploadVehicleScreen.region"}
                      />
                    )
                  }}
                  key={'controller-dropdown-task'}
                  name={"controller-task"}
                  defaultValue=""
                />
              </View>

              <View style={PADDING_TOP_20}>
                <Text tx={"moreScreen.moreDetail"} />
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
          </View>


        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
        <View style={WRAPPER_TOP}>
          <RoundedButton onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
        </View>
      </View>
    </View>
  )


})
