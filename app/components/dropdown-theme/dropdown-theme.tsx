import React from "react"
import { TextStyle, ViewStyle, Dimensions, View, Platform } from "react-native"
import { color, spacing, typography } from "../../theme"
import { Button } from '../button/button'
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
import RNPickerSelect from 'react-native-picker-select';
import { translate } from "../../i18n"

/**
 * A component which has a label and an input together.
 */

const CONTENT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.title
}

const WRAP_DROPDOWN: ViewStyle = {
    flex: 1, borderColor: color.line, borderWidth: 1, padding: Platform.OS == "ios" ? 12 : 0,
    borderRadius: 2.5, marginTop: 20
}
const DROPDOWN_ICON_CONTAINER: ViewStyle = {
    paddingTop: 12.5, paddingRight: 5
}

export function DropdownTheme(props: any) {
    const { value, onValueChange, items } = props
    return (
        <View style={WRAP_DROPDOWN}>
            <RNPickerSelect
                value={value}
                onValueChange={() => onValueChange()}
                items={items}
                placeholder={{
                    label: translate("uploadVehicleScreen.selectVehicleType"),
                    color: color.black
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                    inputAndroid: { ...CONTENT_TEXT }, inputIOS: { ...CONTENT_TEXT },
                    iconContainer: Platform.OS == "ios" ? {} : DROPDOWN_ICON_CONTAINER
                }}
                Icon={() => {
                    return <Ionicons size={20} color={color.black} name={"chevron-down"} />;
                }}
            />
        </View>
    )
}
