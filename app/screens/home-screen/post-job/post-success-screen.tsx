import React, { useEffect } from "react"
import { View, ViewStyle, TextStyle, Platform, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Text, RoundedButton, AddJobElement } from "../../../components"
import { color, images } from "../../../theme"
import PostJobStore from "../../../store/post-job-store/post-job-store";
// const bowserLogo = require("./bowser.png")
const FULL: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: color.textWhite
}

const TOP_VIEW: ViewStyle = {
    flex: Platform.OS == "ios" ? 1 : 1.25,
    backgroundColor: color.mainTheme,
    justifyContent: 'center',
}
const BOTTOM_VIEW: ViewStyle = {
    flex: Platform.OS == "ios" ? 5 : 5.5,
}
const ROW_TEXT: TextStyle = {
    flexDirection: 'row',
    justifyContent: 'center'
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
    padding: 20,
}

const BUTTON_CONTAINER: ViewStyle = {
    backgroundColor: color.darkGrey
}

const TEXT_TOPIC: TextStyle = { color: color.black }
const TEXT_SUB_TITLE: TextStyle = { color: color.primary }
const TEXT_BUTTTON_STYLE: TextStyle = { color: color.textWhite }
export const PostSuccessScreen = observer(function PostSuccessScreen() {
    const navigation = useNavigation()


    const list_status = [
        { key: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: false },
        { key: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
        { key: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
        { key: 4, no: 4, id: 4, name: 'postJobScreen.success', active: true },
    ]
    const id_post = (JSON.parse(JSON.stringify(PostJobStore.data_postjob))) || ''

    useEffect(() => {
        return () => {
            PostJobStore.clearDataPostjob()
        }
    }, [])

    return (
        <View testID="PostSuccessScreen" style={FULL}>
            <View style={TOP_VIEW}>
                <AddJobElement data={list_status} />
            </View>
            <View style={BOTTOM_VIEW}>
                <View style={TEXT_VIEW}>
                    {/* <View>
                        <Image source={images.postJobSuccess} width={50} height={50} resizeMode={"stretch"} />
                    </View> */}
                    <Text tx={"postJobScreen.postJobSuccess"} preset={'topic'} style={TEXT_TOPIC} />
                    <View style={ROW_TEXT}>
                        <Text tx={"common.id"} preset={'topicExtra'} style={TEXT_SUB_TITLE} />
                        {!!id_post && <Text preset={'topicExtra'} style={TEXT_SUB_TITLE}>{" " + id_post}</Text>}
                    </View>
                </View>

                <View style={VIEW_BUTTON}>
                    <RoundedButton testID={"success-vehicle-detail"} onPress={() => navigation.navigate("home")} text={"common.ok"} containerStyle={BUTTON_CONTAINER} textStyle={TEXT_BUTTTON_STYLE} />
                </View>
            </View>
        </View>
    )
})