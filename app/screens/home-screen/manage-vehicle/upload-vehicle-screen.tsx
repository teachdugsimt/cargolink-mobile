import React, { useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, Platform, ScrollView, ViewToken, Switch, StyleSheet, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Header, Text, TextInputTheme, Button, UploadVehicle } from "../../../components"
import { spacing, color, typography } from "../../../theme"
import { AddJobElement } from '../../../components'
import DropDownPicker from 'react-native-dropdown-picker';
import { translate } from "../../../i18n"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from 'react-native-vector-icons/Ionicons'
// const bowserLogo = require("./bowser.png")
const { width, height } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const GREY_TEXT: TextStyle = { color: color.grey }
const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
    paddingTop: spacing[3],
    paddingBottom: spacing[5] - 1,
    paddingHorizontal: 0,
    backgroundColor: color.mainTheme
}
const PADDING_LEFT10: TextStyle = {
    paddingLeft: 10
}
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
const MARGIN_TOP: ViewStyle = {
    marginTop: 5
}
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
    paddingTop: 10
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
export const UploadVehicleScreen = observer(function UploadVehicleScreen() {
    // const navigation = useNavigation()
    const [vehicle, setvehicle] = useState('')
    const [toggleDump, settoggleDump] = useState(false)
    const [vehicleHeight, setvehicleHeight] = useState('')
    const [carRegistration, setcarRegistration] = useState('')

    return (
        <View testID="UploadVehicleScreen" style={FULL}>
            <SafeAreaView style={FULL}>
                <ScrollView style={FULL}>

                    <View style={TOP_VIEW}>
                        <View style={WRAPPER_TOP}>
                            <Text tx={"uploadVehicleScreen.selectVehicleType"} style={TITLE_TOPIC} />
                            <DropDownPicker
                                items={[
                                    { label: 'Car', value: 'car', hidden: true },
                                    { label: 'Truck', value: 'truck', },
                                    { label: 'Taxi', value: 'taxi', },
                                ]}
                                defaultValue={vehicle}
                                containerStyle={{ height: 40, marginTop: 10 }}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                placeholder={translate("uploadVehicleScreen.selectVehicleType")}
                                placeholderStyle={CONTENT_TEXT}
                                labelStyle={CONTENT_TEXT}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={item => setvehicle(item.value)}
                            />
                            <View style={HAVE_DUMP_VIEW}>
                                <Text tx={"uploadVehicleScreen.haveDump"} style={CONTENT_TEXT} />
                                {/* <Text>test</Text> */}
                                {<Switch
                                    trackColor={{ false: "#767577", true: color.darkGreen }}
                                    thumbColor={toggleDump ? color.success : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => settoggleDump(!toggleDump)}
                                    value={toggleDump}
                                />}

                            </View>
                            <Text tx={"uploadVehicleScreen.heightVehicle"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_BIG }} />
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
                            <View style={MARGIN_TOP_EXTRA}>
                                <UploadVehicle />
                                <UploadVehicle />
                            </View>
                        </View>
                    </View>
                    <View style={{ ...TOP_VIEW, ...MARGIN_TOP }}>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                    </View>
                    <View style={{ ...TOP_VIEW, ...MARGIN_TOP }}>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
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