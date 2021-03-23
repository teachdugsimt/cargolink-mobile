import React from "react"
import { TextInput, ViewStyle, View, TextStyle, Dimensions, TouchableOpacity, TextInputProps } from "react-native"
import { Text } from '../text/text'
import { color } from "../../theme"
import { translate } from "../../i18n"
import Ionicons from 'react-native-vector-icons/Ionicons'
// import { TouchableOpacity } from "react-native-gesture-handler"
// import { Text } from '../text/text'
/**
 * A component which has a label and an input together.
 */
const { width } = Dimensions.get('window')
interface TextInputNew {
  inputStyle?: ViewStyle
  actualPlaceholder?: string
  editable?: boolean
  keyboardType?: string
  underline?: boolean
  testID?: any
  prefix?: string
  suffix?: string
  icon?: string
  value?: any
  onChangeText?: any
}

const ROOT_VIEW: ViewStyle = { flexDirection: 'row', flex: 1, width: '100%' }

const ROOT_STYLE: ViewStyle = {
  height: 40,
  // paddingLeft: width / 3,
  paddingLeft: 10,
  flexShrink: 1,
  // backgroundColor: 'green'
}
const ROW: ViewStyle = { flexDirection: 'row' }
const ROW_CENTER: ViewStyle = { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
const TEXT_PREFIX: TextStyle = { paddingRight: 10, color: color.textBlack }
const TEXT_SUFFIX: TextStyle = { color: color.textBlack }

export function TextInputNew(props: TextInputNew) {
  const { inputStyle, actualPlaceholder, editable, prefix = "common.inputValue",
    icon, suffix = "profileScreen.unit",
    underline, ...rest } = props
  let underline_style: ViewStyle = {}
  if (underline) underline_style = {
    borderBottomColor: color.line, borderBottomWidth: 1
  }
  let forwardedRef: any
  return (
    <TouchableOpacity style={{ ...ROOT_VIEW, ...underline_style }} onPress={() => { if (forwardedRef) forwardedRef.focus() }}>
      <View style={ROW_CENTER}>
        <View style={ROW}>
          <Text style={TEXT_PREFIX} tx={prefix} />
          {!!icon && <TouchableOpacity onPress={() => { }} >
            <Ionicons name={icon} size={18} color={color.primary} />
          </TouchableOpacity>}
        </View>
        <TextInput
          editable={editable === false ? false : true}
          testID={"vehicle-upload-input"}
          placeholder={actualPlaceholder ? translate(actualPlaceholder) : translate("common.count")}
          placeholderTextColor={color.line}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={{ ...ROOT_STYLE, ...inputStyle }}
          ref={ref => forwardedRef = ref}
        />
        <Text style={TEXT_SUFFIX} tx={suffix} />
      </View>
    </TouchableOpacity >

  )
}
