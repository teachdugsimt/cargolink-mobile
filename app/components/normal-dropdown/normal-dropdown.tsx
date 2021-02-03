






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
  fontSize: typography.content
}
const DROPDOWN_ICON_CONTAINER: ViewStyle = {
  paddingTop: 7.5, paddingRight: 5
}
const WRAP_DROPDOWN: ViewStyle = {
  height: 40, borderColor: color.line, borderWidth: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
  borderRadius: 2.5
}
export function NormalDropdown(props: NormalDropdownProps) {

  const { value, onValueChange, items, placeholder } = props
  return (
    <View style={{ ...WRAP_DROPDOWN }} key={'view-dropdown-vehicle-height'}>
      <RNPickerSelect
        value={value}
        onValueChange={(val) => onValueChange(val)}
        items={items}
        placeholder={{
          label: translate(placeholder),
          color: color.black
        }}
        useNativeAndroidPickerStyle={false}
        style={{
          inputAndroid: { ...CONTENT_TEXT }, inputIOS: { ...CONTENT_TEXT },
          iconContainer: Platform.OS == "ios" ? {} : { ...DROPDOWN_ICON_CONTAINER },
          placeholder: { color: color.black }
        }}
        Icon={() => {
          return <Ionicons size={20} color={color.black} name={"chevron-down"} />;
        }}
      />
    </View>
  )
}
