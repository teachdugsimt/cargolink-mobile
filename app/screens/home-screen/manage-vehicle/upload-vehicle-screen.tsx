import React, { useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, Platform, ScrollView, ViewToken } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Header, Text, Switch } from "../../../components"
import { spacing, color, typography } from "../../../theme"
import { AddJobElement } from '../../../components'
import DropDownPicker from 'react-native-dropdown-picker';
import { translate } from "../../../i18n"
// const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }

const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
    paddingTop: spacing[3],
    paddingBottom: spacing[5] - 1,
    paddingHorizontal: 0,
    backgroundColor: color.mainTheme
}
const HEADER_TITLE: TextStyle = {
    ...BOLD,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
    color: color.black
}

const TOP_VIEW: ViewStyle = {
    flex: 1,
    backgroundColor: color.textWhite,
}
const WRAPPER_TOP: ViewStyle = {
    flex: 1,
    padding: 10
}
const MARGIN_TOP: ViewStyle = {
    marginTop: 5
}
const TITLE_TOPIC: TextStyle = {
    fontFamily: 'Kanit-Medium',
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
    justifyContent: 'space-between'
}
export const UploadVehicleScreen = observer(function UploadVehicleScreen() {
    // const navigation = useNavigation()
    const [vehicle, setvehicle] = useState('')
    return (
        <View testID="UploadVehicleScreen" style={FULL}>
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
                            {/* <Switch onToggle={() => settoggle}/> */}
                        </View>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
                        <Text>Upload Vehicle 15151515</Text>
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
        </View>
    )
})


