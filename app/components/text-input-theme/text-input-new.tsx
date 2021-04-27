import React from "react"
import { TextInput, ViewStyle, View, TextStyle, Dimensions, TouchableOpacity, TextInputProps, Platform } from "react-native"
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
  prefixWithoutTranslate?: string
  suffix?: string
  icon?: string
  value?: any
  onChangeText?: any
  prefixIconColor?: string
  prefixIcon?: any
}

const ROOT_VIEW: ViewStyle = { flexDirection: 'row', flex: 1, width: '100%' }

const ROOT_STYLE: ViewStyle = {
  height: 40,
  flex: 1,
  // paddingLeft: width / 3,
  paddingLeft: Platform.OS == "ios" ? 10 : 0,
  flexShrink: 1,
  // backgroundColor: 'green'
}
const ROW: ViewStyle = { flexDirection: 'row' }
const ROW_CENTER: ViewStyle = { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
const TEXT_PREFIX: TextStyle = { paddingRight: 10, color: color.textBlack }
const TEXT_SUFFIX: TextStyle = { color: color.textBlack }

export function TextInputNew(props: TextInputNew) {
  const { inputStyle, actualPlaceholder, editable, prefix = "common.inputValue",
    icon, suffix, prefixIcon, prefixIconColor, prefixWithoutTranslate,
    underline, ...rest } = props
  let underline_style: ViewStyle = {}
  if (underline) underline_style = {
    borderBottomColor: color.mainGrey, borderBottomWidth: 1
  }
  let forwardedRef: any
  let prefixProps = prefixWithoutTranslate ? { text: prefixWithoutTranslate } : { tx: prefix }
  return (
    <TouchableOpacity style={{ ...ROOT_VIEW, ...underline_style }} onPress={() => { if (forwardedRef) forwardedRef.focus() }}>
      <View style={ROW_CENTER}>
        <View style={ROW}>
          {prefixIcon && <Ionicons name={prefixIcon} size={18} color={prefixIconColor} style={Platform.OS == "ios" ? { paddingHorizontal: 10 } : { paddingRight: 10 }} />}
          <Text style={TEXT_PREFIX} {...prefixProps} />
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
        {suffix && <Text style={TEXT_SUFFIX} tx={suffix} />}
      </View>
    </TouchableOpacity >

  )
}
