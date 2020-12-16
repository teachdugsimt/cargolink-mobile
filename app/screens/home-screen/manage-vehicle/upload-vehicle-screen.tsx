import React, { useState, useEffect } from "react"
import {
    View, ViewStyle, TextStyle,
    ScrollView, Switch, StyleSheet, Dimensions, Platform
} from "react-native"
import { observer } from "mobx-react-lite"
import { Text, TextInputTheme, Button, UploadVehicle, RoundedButton } from "../../../components"
import { spacing, color, typography, images } from "../../../theme"

import RNPickerSelect from 'react-native-picker-select';
import { translate } from "../../../i18n"
import Ionicons from 'react-native-vector-icons/Ionicons'
// import FetchStore from '../../../store/fetch-store/fetch-store'
// import { TestApi } from '../../../services/api'
// const apiUsers = new TestApi()


const vehicleList = [
    { label: 'Car', value: 'car' },
    { label: 'Truck', value: 'truck', },
    { label: 'Taxi', value: 'taxi', },
]

const regionList = [{ label: "center", value: "center" },
{ label: "north", value: "north" },
{ label: "north-east", value: "north-east" },
{ label: "south", value: "south" },
{ label: "west", value: "west", },
]

const provinceList = [{ label: "center", value: "center" },
{ label: "nakhonpathom", value: "nakhonpathom" },
{ label: "bangkok", value: "bangkok" },
{ label: "nontaburee", value: "nontaburee" },
{ label: "pathumthani", value: "pathumthani", }
]

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const GREY_TEXT: TextStyle = { color: color.grey }

const PADDING_LEFT5: TextStyle = {
    paddingLeft: 5
}
const TOP_VIEW: ViewStyle = {
    flex: 1,
    backgroundColor: color.textWhite,
}
const WRAPPER_TOP: ViewStyle = {
    flex: 1,
    padding: 10
}
const ALIGN_RIGHT: TextStyle = {
    alignSelf: 'flex-end',
    color: color.grey
}
const MARGIN_TOP_BIG: ViewStyle = { marginTop: 10 }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
const MARGIN_TOP: ViewStyle = { marginTop: 5 }
const MARGIN_BOTTOM_BIG: ViewStyle = { marginBottom: 10 }
const TITLE_TOPIC: TextStyle = {
    fontFamily: 'Kanit-Bold',
    color: color.black,
    fontSize: typography.title
}
const CONTENT_TEXT: TextStyle = {
    fontFamily: 'Kanit-Medium',
    color: color.black,
    fontSize: typography.title
}
const HAVE_DUMP_VIEW: ViewStyle = {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 20
}
const COLUMN_UPLOAD: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center'
}
const ADD_VEHICLE_BUTTON: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 20,
    alignSelf: 'center',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.grey,
    backgroundColor: color.textWhite
}

const ROW_UPLOAD: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
}
const ROUND_BUTTON_CONTAINER: ViewStyle = {
    backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
    color: color.textWhite
}
const WRAP_DROPDOWN: ViewStyle = {
    flex: 1, borderColor: color.grey, borderWidth: 1, padding: Platform.OS == "ios" ? 12 : 0,
    borderRadius: 2.5, marginTop: 20
}
const DROPDOWN_ICON_CONTAINER: ViewStyle = {
    paddingTop: 12.5, paddingRight: 5
}

export const UploadVehicleScreen = observer(function UploadVehicleScreen() {
    // const navigation = useNavigation()
    const [vehicle, setvehicle] = useState('')
    const [toggleDump, settoggleDump] = useState(false)
    const [vehicleHeight, setvehicleHeight] = useState('')
    const [carRegistration, setcarRegistration] = useState('')
    const [province, setprovince] = useState(null)
    const [region, setregion] = useState(null)
    
    // useEffect(() => {
    //     // FetchStore.getUserRequest()

    //     // fetch('https://jsonplaceholder.typicode.com/todos/1')
    //     //     .then(response => response.json())
    //     //     .then(json => console.log("FETCH JSON :: ", json))

    //     // apiUsers.getUsers().then(response => console.log("RESPONSE CALL API UEF :: ", response)).catch(err => console.log("ERROR : ?? : ", err))
    // }, [])

    // useEffect(() => {
    //     const data = FetchStore.getUserData
    //     console.log("Fetstore data : ", JSON.parse(JSON.stringify(data)))
    //     if (data && Object.keys(data).length != 0) {
    //     }
    // }, [FetchStore])

    return (
        <View testID="UploadVehicleScreen" style={FULL}>
            <ScrollView style={FULL}>

                <View style={TOP_VIEW}>
                    <View style={WRAPPER_TOP}>
                        <Text tx={"uploadVehicleScreen.selectVehicleType"} style={{ ...TITLE_TOPIC, ...MARGIN_TOP_BIG }} />
                        <View style={WRAP_DROPDOWN}>
                            <RNPickerSelect
                                value={vehicle}
                                onValueChange={(value) => setvehicle(value)}
                                items={vehicleList}
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
                        <View style={HAVE_DUMP_VIEW}>
                            <Text tx={"uploadVehicleScreen.haveDump"} style={CONTENT_TEXT} />
                            <Switch
                                trackColor={{ false: "#767577", true: color.darkGreen }}
                                thumbColor={toggleDump ? color.success : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => settoggleDump(!toggleDump)}
                                value={toggleDump}
                            />
                        </View>
                        <Text tx={"uploadVehicleScreen.heightVehicle"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                        <TextInputTheme inputStyle={MARGIN_TOP_BIG} value={vehicleHeight} onChangeText={(text) => setvehicleHeight(text)} />

                    </View>
                </View>

                <View style={{ ...TOP_VIEW, ...MARGIN_TOP }}>
                    <View style={WRAPPER_TOP}>
                        <Text tx={"uploadVehicleScreen.detailVehicle"} style={TITLE_TOPIC} />
                        <Text tx={"uploadVehicleScreen.atLeastOneRegister"} style={{ ...CONTENT_TEXT, ...ALIGN_RIGHT }}></Text>

                        <Text tx={"uploadVehicleScreen.carRegistration"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_BIG }} />
                        <TextInputTheme inputStyle={MARGIN_TOP_BIG} value={carRegistration} onChangeText={(text) => setcarRegistration(text)} />
                        <Button onPress={() => console.log("Add Vehicle Registration ")} style={{ ...ADD_VEHICLE_BUTTON, ...MARGIN_TOP_EXTRA }}>
                            <Ionicons name={"add-circle-outline"} size={spacing[5]} color={color.grey} />
                            <Text tx={"uploadVehicleScreen.addVehicleRegistration"} style={{ ...CONTENT_TEXT, ...GREY_TEXT, ...PADDING_LEFT5 }} />
                        </Button>
                    </View>
                </View>
                <View style={{ ...TOP_VIEW, ...MARGIN_TOP }}>
                    <View style={WRAPPER_TOP}>
                        <Text tx={"uploadVehicleScreen.uploadVehicleImage"} style={{ ...TITLE_TOPIC, ...MARGIN_TOP_EXTRA }} />
                        <View style={{ ...MARGIN_TOP_EXTRA, ...COLUMN_UPLOAD, ...MARGIN_BOTTOM_BIG }}>
                            <View style={ROW_UPLOAD}>
                                <UploadVehicle uploadStyle={{ padding: 5, minHeight: 120 }} source={images.addTruck1} imageStyle={{ width: 95, height: 37.5 }} />
                                <UploadVehicle uploadStyle={{ padding: 5, minHeight: 120 }} source={images.addTruck2} imageStyle={{ width: 95, height: 37.5 }} />
                            </View>
                            <View style={ROW_UPLOAD}>
                                <UploadVehicle uploadStyle={{ padding: 5, minHeight: 120 }} source={images.addTruck1} imageStyle={{ width: 95, height: 37.5 }} />
                                <UploadVehicle uploadStyle={{ padding: 5, minHeight: 120 }} source={images.addTruck2} imageStyle={{ width: 95, height: 37.5 }} />
                            </View>
                        </View>
                    </View>
                </View>


                <View style={{ ...TOP_VIEW, ...MARGIN_TOP }}>
                    <View style={WRAPPER_TOP}>
                        <Text tx={"uploadVehicleScreen.workZone"} style={TITLE_TOPIC}>Upload Vehicle 15151515</Text>

                        <View style={{ ...ROW_UPLOAD, ...MARGIN_BOTTOM_BIG }}>



                            <View style={{ ...WRAP_DROPDOWN, marginRight: 5 }}>
                                <RNPickerSelect
                                    value={region}
                                    onValueChange={(value) => setregion(value)}
                                    items={regionList}
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

                            <View style={{ ...WRAP_DROPDOWN, marginLeft: 5 }}>
                                <RNPickerSelect
                                    value={province}
                                    onValueChange={(value) => setprovince(value)}
                                    items={provinceList}
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


                        </View>


                    </View>
                </View>




                <View style={{ ...TOP_VIEW, ...MARGIN_TOP_EXTRA }}>
                    <View style={WRAPPER_TOP}>
                        <RoundedButton text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
})


const inline_styles = StyleSheet.create({
    switchEnableBorder: {
        borderColor: '#6fa6d3',
        borderWidth: 1
    },

    switchDisableBorder: {
        borderColor: '#f2f2f2',
        borderWidth: 1,
    },
});