import React, { useEffect } from "react"
import { View, ViewStyle, TextStyle, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Text, RoundedButton, HeaderCenter } from "../../../components"
import { color, spacing } from "../../../theme"
import StatusStore from '../../../store/my-vehicle-store/status-vehicle-store'
// const bowserLogo = require("./bowser.png")
import i18n from 'i18n-js'
const FULL: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.textWhite
}

const TEXT_VIEW: ViewStyle = {
    flex: 7,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: color.textWhite,
}
const VIEW_BUTTON: ViewStyle = {
    flex: 1,
    backgroundColor: color.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: color.line,
    borderTopWidth: 1,
}

const BUTTON_CONTAINER: ViewStyle = {
    backgroundColor: color.primary
}

const TEXT_TOPIC: TextStyle = { color: color.primary }
const TEXT_SUB_TITLE: TextStyle = { color: color.line }
const TEXT_BUTTTON_STYLE: TextStyle = { color: color.textWhite }
export const SuccessUpload = observer(function SuccessUpload() {
    const navigation = useNavigation()

    useEffect(() => {
        let editStatus = JSON.parse(JSON.stringify(StatusStore.status))
        if (editStatus && editStatus == "edit") {
            navigation.setOptions({
                headerCenter: () => (
                    <HeaderCenter tx={"common.edit"} />
                ),
            });
        }
    }, [])

    let status = JSON.parse(JSON.stringify(StatusStore.status))
    return (
        <View testID="SuccessUpload" style={FULL}>

            <View style={TEXT_VIEW}>
                <Text tx={status == "edit" ? "myVehicleScreen.editVehicleSuccess" : "myVehicleScreen.addVehicleSuccess"} preset={'topic'} style={TEXT_TOPIC} />
                <Text tx={"myVehicleScreen.pendingVehicleDetail"} preset={'default'} style={TEXT_SUB_TITLE} />
                <Text tx={"myVehicleScreen.pendingVehicleDetail2"} preset={'default'} style={TEXT_SUB_TITLE} />
            </View>

            <View style={VIEW_BUTTON}>
                <RoundedButton testID={"success-vehicle-detail"} onPress={() => navigation.navigate("home")} text={"common.ok"} containerStyle={BUTTON_CONTAINER} textStyle={TEXT_BUTTTON_STYLE} />
            </View>
        </View>
    )
})
