import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, Platform, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from 'react-native-picker-select';
import { observer } from "mobx-react-lite"
import { Text } from "../../../components"
import { translate } from "../../../i18n"
import { AddJobElement, TextInputTheme, RoundedButton, Icon, DatePickerRemake, TimePickerRemake } from '../../../components'
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import i18n from 'i18n-js'
import TruckTypeStore from '../../../store/my-vehicle-store/truck-type-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { spacing, color, typography, images } from "../../../theme"
import DateTimePicker from '@react-native-community/datetimepicker';
import date from 'date-and-time';
import PostJobStore from "../../../store/post-job-store/post-job-store";
import _ from 'lodash'
import mapValues from 'lodash/mapValues';
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }

const BOLD: TextStyle = { fontWeight: "bold" }
const SPACE_BETWEEN: ViewStyle = { justifyContent: 'space-between' }
const GREY_TEXT: ViewStyle = { backgroundColor: color.grey }
const BORDER_RADIUS_20: ViewStyle = {
    borderRadius: 20,
}
const DATE_BUTTON: ViewStyle = {
    borderRadius: spacing[1],
    height: 40,
    borderWidth: 1,
    borderColor: color.grey,
    paddingLeft: 10
}
const ADD_NEW_POINT: ViewStyle = {
    backgroundColor: color.transparent2,
    borderWidth: 1,
    borderColor: color.primary,
    ...BORDER_RADIUS_20
}
const PADDING_PURE: ViewStyle = { padding: 5 }

const TOP_VIEW: ViewStyle = {
    flex: Platform.OS == "ios" ? 1.25 : 1.25,
    backgroundColor: color.mainTheme,
    justifyContent: 'center',
}
const BOTTOM_VIEW: ViewStyle = {
    flex: 5,
}

const TOP_VIEW_2: ViewStyle = {
    flex: 1,
    backgroundColor: color.textWhite,
}
const WRAPPER_TOP: ViewStyle = {
    flex: 1,
    padding: 10
}

const WRAP_DROPDOWN: ViewStyle = {
    flex: 1, borderColor: color.grey, borderWidth: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
    borderRadius: 2.5
}

const CONTENT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    color: color.black,
    fontSize: typography.title
}
const MARGIN_HORIZONTTAL_MEDIUM: ViewStyle = { paddingHorizontal: 10 }
const MARGIN_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
const MARGIN_TOP: ViewStyle = { marginTop: 5 }
const DROPDOWN_ICON_CONTAINER: ViewStyle = {
    paddingTop: 12.5, paddingRight: 5
}
const MARGIN_TOP_BIG: ViewStyle = { marginTop: 10 }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
const LAYOUT_REGISTRATION_FIELD: TextStyle = {
    textAlign: 'right', paddingRight: 10,
}
const ROUND_BUTTON_CONTAINER: ViewStyle = {
    backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
    color: color.textWhite
}
const MARGIN_MEDIUM: ViewStyle = {
    marginVertical: 10
}
const ROW_TEXT: ViewStyle = {
    flexDirection: 'row',
}
const RED_DOT: TextStyle = {
    color: color.red,
    paddingTop: 10, paddingLeft: 7.5
}
const ICON_PIN_YELLOW: ImageStyle = {
    height: 20, width: 20,
    marginTop: 10
}
const PADDING_RIGHT_SMALL: ViewStyle = { paddingRight: 5 }
const PADDING_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
export const ReceivePointScreen = observer(function ReceivePointScreen() {
    const navigation = useNavigation()
    const [fieldShipping, setfieldShipping] = useState([])

    const [rerender, setrerender] = useState(false)
    const [rerenderTime, setrerenderTime] = useState(false)
    const [initDatePicker, setinitDatePicker] = useState(new Date());

    const [swipe, setswipe] = useState(false)

    const { control, handleSubmit, errors } = useForm({
        defaultValues: {
            // "receive-date": initDatePicker,
            // "receive-time": initDatePicker
        }
        // defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : MyVehicleStore.MappingData
    });

    useEffect(() => {
        _addFieldInputShipping()
    }, [])

    const onSubmit = (data) => {
        __DEV__ && console.tron.log("Raw Data Form Post job : ", data)
        console.log("Raw Data Form Post job : ", data)
        let tmp_data = JSON.parse(JSON.stringify(data))
        let final = { ...tmp_data }
        // Object.keys(tmp_data).forEach((key) => {
        //     let arr = key.split("-")
        //     let indexing = arr[arr.length - 1]
        //     if (key.includes("shipping-date-")) {
        //         final[key] = date.format(data['shipping-date-' + indexing], "YYYY:MM:DD")
        //     }
        //     if (key.includes("shipping-time-")) {
        //         final[key] = date.format(data['shipping-time-' + indexing], "HH:mm")
        //     }
        //     if (key.includes("receive-date")) {
        //         final[key] = date.format(data['receive-date'], "YYYY:MM:DD")
        //     }
        //     if (key.includes("receive-time")) {
        //         final[key] = date.format(data['receive-time'], "HH:mm")
        //     }
        // })






        let shippingInformation = []
        let pure_object = {}
        Object.keys(tmp_data).forEach((key) => {
            if (key.includes("shipping-")) {
                pure_object[key] = tmp_data[key]
            }
        })
        fieldShipping.forEach((e, i) => {
            shippingInformation.push({
                "shipping-address": pure_object[`shipping-address-${i + 1}`],
                "shipping-date": pure_object[`shipping-date-${i + 1}`],
                "shipping-time": pure_object[`shipping-time-${i + 1}`],
                "shipper-name": pure_object[`shipping-name-${i + 1}`],
                "shipper-tel-no": pure_object[`shipping-tel-no-${i + 1}`],
            })
        })
        final['shipping-information'] = shippingInformation
        // PostJobStore.setPostJob(2, newObj)
        __DEV__ && console.tron.log("Final object postjob screen 2 :: => ", final)







    }

    const _addFieldInputShipping = () => {
        let tmp_field_level = fieldShipping
        tmp_field_level.push({
            id: tmp_field_level.length + 1,
            showDate: false,
            showTime: false,
        })
        setfieldShipping(tmp_field_level)
        setswipe(!swipe)
    }
    const _setRenderDateAndTimeField = (val: boolean, index: number, field: string) => {
        let tmp_field_level = fieldShipping
        if (field == "date") tmp_field_level[index].showDate = val
        else tmp_field_level[index].showTime = val
        setfieldShipping(tmp_field_level)
        setswipe(!swipe)
    }

    const list_status = [
        { key: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: false },
        { key: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: true },
        { key: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
        { key: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
    ]
    let formControllerValue = control.getValues()

    // __DEV__ && console.tron.log("show date format : ", formControllerValue)
    return (
        <View testID="ReceivePointScreen" style={FULL}>
            <View style={TOP_VIEW}>
                <AddJobElement data={list_status} />
            </View>

            <View style={BOTTOM_VIEW}>
                <ScrollView style={FULL}>


                    <View style={TOP_VIEW_2}>
                        <View style={WRAPPER_TOP}>
                            <View style={ROW_TEXT}>
                                <Icon icon={'pinDropYellow'} style={ICON_PIN_YELLOW} />
                                <Text tx={"postJobScreen.acceptPointProduct"} preset={'topic'} style={[MARGIN_TOP_BIG, MARGIN_LEFT_SMALL]} />
                                <Text preset={'topic'} style={RED_DOT} >*</Text>
                            </View>
                            <View style={ROW_TEXT}>
                                <Text tx={"postJobScreen.inputLocationReceive"} preset={'topic'} style={[MARGIN_TOP_BIG, MARGIN_LEFT_SMALL]} />
                            </View>


                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInputTheme
                                        testID={"receive-location"}
                                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                )}
                                key={'text-input-receive-location'}
                                name={"receive-location"}
                                defaultValue=""
                            />



                            <View style={ROW_TEXT}>
                                <View style={[FULL, PADDING_RIGHT_SMALL]}>
                                    <Text tx={"postJobScreen.dateReceive"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                                    <Controller
                                        control={control}
                                        render={({ onChange, onBlur, value }) => (
                                            <DatePickerRemake
                                                keyer={"receive-date1"}
                                                testID={"testID-receive-date"}
                                                value={value}
                                                onChange={onChange}
                                                label={formControllerValue['receive-date']}
                                                iconName={"calendar-sharp"}
                                                mode={"date"}
                                                rerender={rerender}
                                                rerenderFunction={() => setrerender(!rerender)}
                                            />
                                        )}
                                        key={'text-input-receive-date'}
                                        name={"receive-date"}
                                        defaultValue={initDatePicker}
                                    />
                                </View>
                                <View style={[FULL, PADDING_LEFT_SMALL]}>
                                    <Text tx={"postJobScreen.timeReceive"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                                    <Controller
                                        control={control}
                                        render={({ onChange, onBlur, value }) => (
                                            <TimePickerRemake
                                                keyer={"receive-time1"}
                                                testID={"testID-receive-date2"}
                                                value={value}
                                                onChange={onChange}
                                                label={formControllerValue['receive-time']}
                                                mode={"time"}
                                                iconName={"time-outline"}
                                                rerender={rerenderTime}
                                                rerenderFunction={() => setrerenderTime(!rerenderTime)}
                                            />
                                        )}
                                        key={'text-input-receive-time'}
                                        name={"receive-time"}
                                        defaultValue={initDatePicker}
                                    />
                                </View>
                            </View>



                            <Text tx={"postJobScreen.receiverInfo"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                            <Text tx={"postJobScreen.receiverName"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInputTheme
                                        testID={"receive-name"}
                                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                )}
                                key={'text-input-receive-name'}
                                name={"receive-name"}
                                defaultValue=""
                            />

                            <Text tx={"postJobScreen.receiverTel"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInputTheme
                                        testID={"receive-tel-no"}
                                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                )}
                                key={'text-input-receive-tel-no'}
                                name={"receive-tel-no"}
                                defaultValue=""
                            />

                        </View>
                    </View>






















                    {fieldShipping && fieldShipping.length > 0 && fieldShipping.map((e, i) => {
                        return <View style={[TOP_VIEW_2, MARGIN_TOP]}>
                            <View style={WRAPPER_TOP}>
                                <View style={ROW_TEXT}>
                                    <Icon icon={'pinDropGreen'} style={ICON_PIN_YELLOW} />
                                    <Text tx={"postJobScreen.shipingPoint"} preset={'topic'} style={MARGIN_TOP_BIG} />
                                    <Text preset={'topic'} style={MARGIN_TOP_BIG}>{i + 1}</Text>
                                    <Text preset={'topic'} style={RED_DOT} >*</Text>
                                </View>

                                <Text tx={"postJobScreen.shippingAddr"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                                <Controller
                                    control={control}
                                    render={({ onChange, onBlur, value }) => (
                                        <TextInputTheme
                                            testID={"shipping-address-" + e.id}
                                            inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                    )}
                                    key={'text-input-shipping-address-' + e.id}
                                    name={"shipping-address-" + e.id}
                                    defaultValue=""
                                />

                                <View style={ROW_TEXT}>
                                    <View style={[FULL, PADDING_RIGHT_SMALL]}>
                                        <Text tx={"postJobScreen.dateShipping"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                                        <Controller
                                            control={control}
                                            render={({ onChange, onBlur, value }) => (
                                                <DatePickerRemake
                                                    key={"shipping-date-" + e.id}
                                                    testID={"testID-shipping-date-" + e.id}
                                                    value={value}
                                                    onChange={onChange}
                                                    label={formControllerValue["shipping-date-" + e.id]}
                                                    iconName={"calendar-sharp"}
                                                    mode={"date"}
                                                    rerender={e.showDate}
                                                    rerenderFunction={() => _setRenderDateAndTimeField(!e.showDate, i, 'date')}
                                                />
                                            )}
                                            key={'text-input-shipping-date-' + e.id}
                                            name={"shipping-date-" + e.id}
                                            defaultValue={initDatePicker}
                                        />
                                    </View>
                                    <View style={[FULL, PADDING_LEFT_SMALL]}>
                                        <Text tx={"postJobScreen.timeShipping"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                                        <Controller
                                            control={control}
                                            render={({ onChange, onBlur, value }) => (
                                                <TimePickerRemake
                                                    key={"shipping-time-" + e.id}
                                                    testID={"testID-shipping-time-" + e.id}
                                                    value={value}
                                                    onChange={onChange}
                                                    label={formControllerValue["shipping-time-" + e.id]}
                                                    rerender={e.showTime}
                                                    mode={"time"}
                                                    iconName={"time-outline"}
                                                    rerenderFunction={() => _setRenderDateAndTimeField(!e.showTime, i, 'time')}
                                                />
                                            )}
                                            key={'text-input-shipping-time-' + e.id}
                                            name={"shipping-time-" + e.id}
                                            defaultValue={initDatePicker}
                                        />
                                    </View>
                                </View>

                                <Text tx={"postJobScreen.shipperInfo"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                                <Text tx={"postJobScreen.shipperName"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                                <Controller
                                    control={control}
                                    render={({ onChange, onBlur, value }) => (
                                        <TextInputTheme
                                            testID={"shipping-name-" + e.id}
                                            inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                    )}
                                    key={'text-input-shipping-name-' + e.id}
                                    name={"shipping-name-" + e.id}
                                    defaultValue=""
                                />

                                <Text tx={"postJobScreen.shipperTel"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                                <Controller
                                    control={control}
                                    render={({ onChange, onBlur, value }) => (
                                        <TextInputTheme
                                            testID={"shipping-tel-no-" + e.id}
                                            inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                    )}
                                    key={'text-input-shipping-tel-no-' + e.id}
                                    name={"shipping-tel-no-" + e.id}
                                    defaultValue=""
                                />

                            </View>
                        </View>
                    })}











                    <View style={[MARGIN_TOP_EXTRA, MARGIN_HORIZONTTAL_MEDIUM]}>
                        <RoundedButton
                            style={ADD_NEW_POINT}
                            onPress={() => _addFieldInputShipping()} text={"postJobScreen.addShippingPoint"}
                            textStyle={{ color: color.primary }}
                            leftIconName="add-circle-outline"
                            leftIconColor={color.primary}
                        />
                    </View>



                    <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
                        <View style={ROW_TEXT}>
                            <View style={[WRAPPER_TOP, FULL]}>
                                <RoundedButton style={[FULL, BORDER_RADIUS_20, GREY_TEXT]} onPress={() => navigation.goBack()} text={"common.back"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                            </View>
                            <View style={[WRAPPER_TOP, FULL]}>
                                <RoundedButton style={[FULL, BORDER_RADIUS_20]} onPress={handleSubmit(onSubmit)} text={"common.next"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                            </View>
                        </View>
                    </View>


                </ScrollView>
            </View>
        </View>
    )
})