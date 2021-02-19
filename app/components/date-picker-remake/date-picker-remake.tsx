


import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { spacing, color } from "../../theme"
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
import date from 'date-and-time';
import i18n from 'i18n-js'

const PADDING_PURE: ViewStyle = { padding: 5 }
const FULL: ViewStyle = { flex: 1 }
const DATE_BUTTON: ViewStyle = {
  borderRadius: spacing[1],
  height: 40,
  borderWidth: 1,
  borderColor: color.line,
  paddingLeft: 10
}
const MARGIN_MEDIUM: ViewStyle = {
  marginVertical: 10
}
const ROW_TEXT: ViewStyle = {
  flexDirection: 'row',
}
const SPACE_BETWEEN: ViewStyle = { justifyContent: 'space-between' }
const showing = Platform.OS == "ios" ? true : false
export const DatePickerRemake = (props) => {

  const [show, setShow] = useState(showing);

  const _openDatePicker = () => setShow(true)

  const { testID, value, onChange, label,
    rerender, rerenderFunction, mode, iconName, keyer
  } = props
  return (

    <View key={"root-date-picker-" + keyer} style={[FULL, MARGIN_MEDIUM]}>

      {Platform.OS == "android" && <TouchableOpacity key={"button-date-picker-" + keyer} style={DATE_BUTTON} onPress={_openDatePicker}>
        <View style={[ROW_TEXT, SPACE_BETWEEN]}>
          <View>
            {rerender ? <Text style={PADDING_PURE}>{label && typeof label != undefined ?
              date.format(label, "YYYY-MM-DD") : (value ? date.format(value, "YYYY-MM-DD") : '')}</Text> :
              <Text style={PADDING_PURE}>{label && typeof label != undefined ?
                date.format(label, "YYYY-MM-DD") : value ? date.format(value, "YYYY-MM-DD") : ''}</Text>}
          </View>
          <Ionicons name={iconName} size={20} style={PADDING_PURE} />
        </View>
      </TouchableOpacity>}

      {!!value && <View>{show && (
        <>
          <DateTimePicker
            testID={testID}
            value={value}
            mode={mode}
            is24Hour={true}
            display="default"
            timeZoneOffsetInMinutes={420}
            timeZoneOffsetInSeconds={25200}
            textColor={color.primary}
            locale={i18n.locale == "th" ? 'th-TH' : 'en-EN'}
            onTouchCancel={() => setShow(Platform.OS === 'ios')}
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setShow(Platform.OS === 'ios');
                onChange(selectedDate)
                rerenderFunction()
              }
            }}
          />
        </>
      )}
      </View>}
    </View>
  );
};
