


import React, { useState, useEffect } from 'react';
import { View, Platform, TouchableOpacity, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from "react-hook-form";
import { spacing, color, typography, images } from "../../theme"
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
import date from 'date-and-time';

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

export const TimePickerRemake = (props) => {

    const [show, setShow] = useState(false);

    const _openDatePicker = () => {
        setShow(true)
    }

    const { testID, value, onChange, label,
        rerender, rerenderFunction, mode, iconName, keyer
    } = props
    // __DEV__ && console.tron.log("Show time status :: ", show)

    return (

        <View key={"root-time-picker-" + keyer} style={[FULL, MARGIN_MEDIUM]}>

            <Button keyer={keyer} label={label} iconName={iconName} openDatePicker={_openDatePicker} />

            {show &&
                <DateTimePicker
                    testID={testID}
                    value={value}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    timeZoneOffsetInMinutes={420}
                    timeZoneOffsetInSeconds={25200}
                    onTouchCancel={() => setShow(Platform.OS === 'ios')}
                    onChange={(event, selectedDate) => {
                        if (selectedDate) {
                            setShow(Platform.OS === 'ios');
                            onChange(selectedDate)
                            rerenderFunction()  // for render text show time
                        }
                    }}
                />
            }

        </View>
    );
};

const Button = (props) => {

    const { keyer, label, iconName, openDatePicker } = props

    return <TouchableOpacity key={"button-time-picker-" + keyer} style={DATE_BUTTON} onPress={openDatePicker}>
        <View style={[ROW_TEXT, SPACE_BETWEEN]} key={'v-time-' + keyer}>
            <View key={"v-time2-" + keyer}>
                <Text style={PADDING_PURE}>{label && typeof label != undefined ?
                    (Platform.OS == 'android' ? date.format(label, "HH:mm") : '') : ''}</Text>
            </View>
            <Ionicons name={iconName} size={20} style={PADDING_PURE} />
        </View>
    </TouchableOpacity>
}