






import React from 'react'
import { translate } from "../../i18n"
import { TextStyle, ViewStyle, View, Platform } from "react-native"
import { NormalDropdownProps } from "./normal-dropdown.props"
import { spacing, color, typography, images } from "../../theme"
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons'

const CONTENT_TEXT: TextStyle = {
  fontFamily: 'Kanit-Medium',
  color: color.black,
  fontSize: typography.content,
  textAlignVertical: 'center'
}
const DROPDOWN_ICON_CONTAINER: ViewStyle = {
  paddingTop: 7.5, paddingRight: 5
}
const WRAP_DROPDOWN: ViewStyle = {
  height: 80, padding: Platform.OS == "ios" ? 7.5 : 0,
}
const UNDER_LINE: ViewStyle = {
  borderBottomColor: color.mainGrey, borderBottomWidth: 1
}
export function NormalDropdown(props: NormalDropdownProps) {

  const { value, onChange, items, placeholder, keyer, underline = true, border = false, containerStyle } = props

  const borderStyle: ViewStyle = border ?
    { borderWidth: 1, borderColor: color.disable, borderRadius: spacing[1] } : {}

  const mixStyle: ViewStyle = containerStyle ? { ...WRAP_DROPDOWN, ...containerStyle } : { ...WRAP_DROPDOWN }
  return (
    <View style={[mixStyle, underline ? UNDER_LINE : {}]} key={'view-dropdown-vehicle-height-' + keyer}>
      <RNPickerSelect
        value={value || ''}
        onValueChange={(val) => {
          console.log("Onchange Value NORMAL DROPDOWN HERE :::::: >> ", val)
          onChange(val || '')
        }}
        items={items}
        placeholder={{
          label: translate(placeholder),
          color: color.black
        }}
        useNativeAndroidPickerStyle={false}
        style={{
          inputAndroid: { ...CONTENT_TEXT }, inputIOS: { ...CONTENT_TEXT },
          iconContainer: Platform.OS == "ios" ? {} : { ...DROPDOWN_ICON_CONTAINER },
          viewContainer: { flex: 1, justifyContent: 'center', ...borderStyle },
          placeholder: { color: color.black }
        }}
        Icon={() => {
          return <Ionicons size={20} color={color.black} name={"chevron-down"} />;
        }}
      />
    </View>
  )
}
