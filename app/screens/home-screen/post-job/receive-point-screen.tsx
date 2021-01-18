import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Platform, ImageStyle, SafeAreaView, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import { observer } from "mobx-react-lite"
import { Text } from "../../../components"
import { AddJobElement, TextInputTheme, RoundedButton, Icon, DatePickerRemake, TimePickerRemake } from '../../../components'
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { color, typography } from "../../../theme"
import PostJobStore from "../../../store/post-job-store/post-job-store";
import _ from 'lodash'
import { Modal, ModalContent } from 'react-native-modals';
import Geolocation from '@react-native-community/geolocation';
import MapView, {
    Polyline,
    Marker,
    Callout,
    PROVIDER_GOOGLE,
} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons'

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }

const GREY_TEXT: ViewStyle = { backgroundColor: color.line }
const BORDER_RADIUS_20: ViewStyle = {
    borderRadius: 20,
}
const ADD_NEW_POINT: ViewStyle = {
    backgroundColor: color.transparent2,
    borderWidth: 1,
    borderColor: color.primary,
    ...BORDER_RADIUS_20
}

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
const CONTENT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    color: color.black,
    fontSize: typography.title
}
const MARGIN_HORIZONTTAL_MEDIUM: ViewStyle = { paddingHorizontal: 10 }
const MARGIN_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
const MARGIN_TOP: ViewStyle = { marginTop: 5 }
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
    const [initDatePicker] = useState(new Date());

    const [visibleMap, setvisibleMap] = useState(false)

    const [swipe, setswipe] = useState(false)

    const [position, setposition] = useState({})

    const { control, handleSubmit } = useForm({
        defaultValues: {
            // "receive-date": initDatePicker,
            // "receive-time": initDatePicker
        }
        // defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : MyVehicleStore.MappingData
    });

    useEffect(() => {
        _addFieldInputShipping()
        // Geolocation.getCurrentPosition((position) => {
        //     __DEV__ && console.tron.log("Position current :: ", position)
        //     setposition(position)
        // }, (error) => {
        //     __DEV__ && console.tron.log("Error get location :: ", error)
        //     // alert(JSON.stringify(error))
        // }, {
        //     enableHighAccuracy: true,
        //     timeout: 20000,
        //     maximumAge: 1000
        // });
    }, [])

    const onSubmit = (data) => {
        __DEV__ && console.tron.log("Raw Data Form Post job : ", data)
        console.log("Raw Data Form Post job : ", data)
        let tmp_data = JSON.parse(JSON.stringify(data))
        let final = { ...tmp_data }

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
                "shipping-name": pure_object[`shipping-name-${i + 1}`],
                "shipping-tel-no": pure_object[`shipping-tel-no-${i + 1}`],
            })
        })
        final['shipping-information'] = shippingInformation
        Object.keys(final).forEach((key) => {
            if (key.includes("shipping-address-") || key.includes("shipping-date-") ||
                key.includes("shipping-time-") || key.includes("shipping-name-") ||
                key.includes("shipping-tel-no-")) {
                delete final[key]
            }
        })

        PostJobStore.setPostJob(2, final)

        __DEV__ && console.tron.log("Final object postjob screen 2 :: => ", final)
        navigation.navigate("checkInformation")
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


    __DEV__ && console.tron.log("show date format : ", formControllerValue)
    // const { longitude, latitude } = position?.coords || {}
    return (
        <View testID="ReceivePointScreen" style={FULL}>
            <View style={TOP_VIEW}>
                <AddJobElement data={list_status} />
            </View>

            <View style={BOTTOM_VIEW}>
                <ScrollView style={FULL}>



                    {/* <Modal
                        visible={visibleMap}
                        onTouchOutside={() => setvisibleMap(false)}
                        onSwipeOut={() => setvisibleMap(false)}
                    // swipeDirection={['down']} // can be string or an array
                    // swipeThreshold={200} // default 100
                    >
                        <ModalContent >
                            <View style={{ width: (width / 1), height: '100%', justifyContent: 'flex-start' }}>
                                <SafeAreaView style={{ flex: 1 }}>
                                    <TouchableOpacity style={{}}>
                                        <Ionicons name={"close-circle"} size={24} />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, position: 'relative' }}>


                                        {!!longitude && !!longitude && <MapView
                                            style={{ height: Dimensions.get('window').height }}
                                            provider={PROVIDER_GOOGLE}
                                            initialRegion={{
                                                latitude: +latitude - 0.03,
                                                longitude: +longitude,
                                                latitudeDelta: 0.1,
                                                longitudeDelta: 0.1
                                            }}>
                                        

                                                       {!!coordinates.length && coordinates.map((attr, index) => (
                                       <Marker
                                           key={index}
                                           coordinate={{ latitude: +attr.lat, longitude: +attr.lng }}
                                           pinColor="green"
                                       >
                                           <Callout>
                                               <Text>{attr.contactName}</Text>
                                           </Callout>
                                       </Marker>
                                   ))}
                                   {JSON.parse(JSON.stringify(ShipperJobStore.directions)).map((attr, index) => {
                                       return (<Polyline key={index} coordinates={attr} strokeWidth={4} strokeColor={'red'} />)
                                   })}


                                        </MapView>}
                                    </View>

                                </SafeAreaView>

                            </View>
                        </ModalContent>
                    </Modal> */}




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
                                    <>
                                        {/* {!formControllerValue["receive-location"] && <TouchableOpacity
                                            onPress={() => setvisibleMap(true)}
                                            style={{ padding: 10, borderWidth: 1, borderRadius: 2.5, borderColor: color.line }}>
                                            <Text>receive location</Text>
                                        </TouchableOpacity>} */}
                                        {/* {!!formControllerValue["receive-location"] && <TextInputTheme
                                            testID={"receive-location-01"}
                                            inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />} */}
                                        <TextInputTheme
                                            testID={"receive-location-01"}
                                            inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                    </>
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
                        return <View style={[TOP_VIEW_2, MARGIN_TOP]} key={`view-shippping-${i + 1}`}>
                            <View key={`view-shippping-wrapper-top-${i + 1}`} style={WRAPPER_TOP}>
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