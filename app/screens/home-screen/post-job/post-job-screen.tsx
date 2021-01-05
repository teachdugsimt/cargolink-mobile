import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Dimensions, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from 'react-native-picker-select';
import { observer } from "mobx-react-lite"
import { Text } from "../../../components"
import { translate } from "../../../i18n"
import { AddJobElement, TextInputTheme, RoundedButton } from '../../../components'
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import i18n from 'i18n-js'
import TruckTypeStore from '../../../store/my-vehicle-store/truck-type-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { spacing, color, typography, images } from "../../../theme"
import { Modal, ModalContent } from 'react-native-modals';
import MultiSelect from 'react-native-multiple-select';
import { SafeAreaView } from "react-native-safe-area-context";
const items = [{ id: '92iijs7yta', name: 'Ondo' }, { id: 'a0s0a8ssbsd', name: 'Ogun' }, { id: '16hbajsabsd', name: 'Calabar' }, { id: 'nahs75a5sg', name: 'Lagos' }, { id: '667atsas', name: 'Maiduguri' }, { id: 'hsyasajs', name: 'Anambra' }, { id: 'djsjudksjd', name: 'Benue' }, { id: 'sdhyaysdj', name: 'Kaduna' }, { id: 'suudydjsjd', name: 'Abuja' }];

const { width } = Dimensions.get("window")
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
    flex: Platform.OS == "ios" ? 1 : 1.25,
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
export const PostJobScreen = observer(function PostJobScreen() {
    const navigation = useNavigation()

    const { control, handleSubmit, errors } = useForm({
        // defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : MyVehicleStore.MappingData
    });

    useEffect(() => {
        TruckTypeStore.getTruckTypeDropdown(i18n.locale)
    }, [])

    const onSubmit = (data) => {
        console.log("Data Form Post job : ", data)
        // navigation.navigate("receivePoint")

    }
    const [visible, setvisible] = useState(false)
    const [selectValue, setselectValue] = useState([])
    const changeDropdown = (val) => setselectValue(val)
    const list_status = [
        { key: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: true },
        { key: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
        { key: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
        { key: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
    ]
    let multi_select
    console.log("Multi select Item :: ", multi_select)
    console.log("Multi select Item :: ", multi_select)
    return (
        <View testID="PostJobScreen" style={FULL}>
            <View style={TOP_VIEW}>
                <AddJobElement data={list_status} />
            </View>

            <View style={BOTTOM_VIEW}>
                <ScrollView style={FULL}>


                    <View style={TOP_VIEW_2}>
                        <View style={WRAPPER_TOP}>
                            <View style={ROW_TEXT}>
                                <Text tx={"postJobScreen.selectVehicleType"} preset={'topic'} style={MARGIN_TOP_BIG} />
                                <Text preset={'topic'} style={RED_DOT} >*</Text>
                            </View>


                            <View style={WRAP_DROPDOWN}>

                                {TruckTypeStore.data && TruckTypeStore.data.length ? <Controller
                                    control={control}
                                    render={({ onChange, onBlur, value }) => (<RNPickerSelect
                                        value={value}
                                        onValueChange={(value) => onChange(value)}
                                        items={JSON.parse(JSON.stringify(TruckTypeStore.data))}
                                        placeholder={{
                                            label: translate("postJobScreen.selectVehicleType"),
                                            color: color.black
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        style={{
                                            inputAndroid: { ...CONTENT_TEXT }, inputIOS: { ...CONTENT_TEXT },
                                            iconContainer: Platform.OS == "ios" ? {} : DROPDOWN_ICON_CONTAINER,
                                            placeholder: { color: color.black }
                                        }}
                                        Icon={() => {
                                            return <Ionicons size={20} color={color.black} name={"chevron-down"} />;
                                        }}
                                    />
                                    )}
                                    key={'controller-dropdown-vehicle-type'}
                                    name={"vehicle-type"}
                                    defaultValue=""
                                /> :
                                    <Controller
                                        control={control}
                                        render={({ onChange, onBlur, value }) => {
                                            return <RNPickerSelect
                                                value={value}
                                                onValueChange={(value) => onChange(value)}
                                                // items={i18n.locale == "en" ? vehicleEn : vehicleTh}
                                                items={[]}
                                                placeholder={{
                                                    label: translate("postJobScreen.selectVehicleType"),
                                                    color: color.black
                                                }}
                                                useNativeAndroidPickerStyle={false}
                                                style={{
                                                    inputAndroid: { ...CONTENT_TEXT }, inputIOS: { ...CONTENT_TEXT },
                                                    iconContainer: Platform.OS == "ios" ? {} : DROPDOWN_ICON_CONTAINER,
                                                    placeholder: { color: color.black }
                                                }}
                                                Icon={() => {
                                                    return <Ionicons size={20} color={color.black} name={"chevron-down"} />;
                                                }}
                                            />
                                        }}
                                        key={'controller-dropdown-vehicle-type-null'}
                                        name={"vehicle-type-null"}
                                        defaultValue=""
                                    />}
                            </View>

                            <Text tx={"postJobScreen.vehicleNum"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInputTheme
                                        testID={"car-num"}
                                        placeholder={'คัน'}
                                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                )}
                                key={'text-input-car-num'}
                                name={"car-num"}
                                defaultValue=""
                            />
                        </View>
                    </View>








                    <View style={[TOP_VIEW_2, MARGIN_TOP]}>
                        <View style={WRAPPER_TOP}>
                            <View style={ROW_TEXT}>
                                <Text tx={"postJobScreen.itemDetail"} preset={'topic'} style={MARGIN_TOP_BIG} />
                                <Text preset={'topic'} style={RED_DOT} >*</Text>
                            </View>


                            <View style={WRAP_DROPDOWN}>

                                <TouchableOpacity onPress={() => setvisible(true)}>
                                    <Text style={{ padding: 10, backgroundColor: 'blue' }}>dropdown</Text>
                                </TouchableOpacity>


                                <Modal
                                    visible={visible}
                                    onTouchOutside={() => setvisible(false)}
                                    onSwipeOut={() => setvisible(false)}
                                    swipeDirection={['up', 'down']} // can be string or an array
                                    swipeThreshold={200} // default 100
                                // modalTitle={
                                //     <SafeAreaView style={{ flex: 1 }}>
                                //         <View style={{
                                //             flexDirection: 'row', height: 60,
                                //             // marginTop: (width / 2.5),
                                //             justifyContent: 'center', alignItems: 'center'
                                //         }}>
                                //             <Text preset="topic"> Title Select </Text>
                                //         </View>
                                //     </SafeAreaView>}
                                >
                                    <ModalContent >
                                        <View style={{ width: (width / 1.1), height: '100%', justifyContent: 'flex-start' }}>
                                            <SafeAreaView style={{ flex: 1 }}>
                                                <View style={{ height: 60 }}><Text>Test Title</Text></View>
                                                <Controller
                                                    control={control}
                                                    render={({ onChange, onBlur, value }) => (
                                                        <>
                                                            <MultiSelect
                                                                hideTags
                                                                items={items}
                                                                uniqueKey="id"
                                                                ref={(component) => { multi_select = component }}
                                                                onSelectedItemsChange={(val) => onChange(val[0])}
                                                                selectedItems={[value]}
                                                                selectText="Pick Items"
                                                                searchIcon={<Ionicons name="search-outline" size={20} color={color.primary} />}
                                                                hideSubmitButton={true}
                                                                single={true}
                                                                searchInputPlaceholderText="Search Items..."
                                                                onChangeInput={(text) => console.log(text)}
                                                                altFontFamily="Kanit-Medium"
                                                                tagRemoveIconColor="#CCC"
                                                                tagBorderColor="#CCC"
                                                                tagTextColor="#CCC"
                                                                selectedItemTextColor="#CCC"
                                                                selectedItemIconColor="#CCC"
                                                                itemTextColor="#000"
                                                                displayKey="name"
                                                                searchInputStyle={{ color: '#CCC' }}
                                                            // submitButtonColor="#CCC"
                                                            // submitButtonText="Submit"
                                                            />

                                                        </>
                                                    )}
                                                    key={'controller-dropdown-item-type'}
                                                    name={"item-type"}
                                                    defaultValue=""
                                                />
                                            </SafeAreaView>

                                        </View>
                                    </ModalContent>
                                </Modal>











                                {/* {TruckTypeStore.data && TruckTypeStore.data.length ? <Controller
                                    control={control}
                                    render={({ onChange, onBlur, value }) => (<RNPickerSelect
                                        value={value}
                                        onValueChange={(value) => onChange(value)}
                                        items={JSON.parse(JSON.stringify(TruckTypeStore.data))}
                                        placeholder={{
                                            label: translate("postJobScreen.selectItemType"),
                                            color: color.black
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        style={{
                                            inputAndroid: { ...CONTENT_TEXT }, inputIOS: { ...CONTENT_TEXT },
                                            iconContainer: Platform.OS == "ios" ? {} : DROPDOWN_ICON_CONTAINER,
                                            placeholder: { color: color.black }
                                        }}
                                        Icon={() => {
                                            return <Ionicons size={20} color={color.black} name={"chevron-down"} />;
                                        }}
                                    />
                                    )}
                                    key={'controller-dropdown-item-type'}
                                    name={"item-type"}
                                    defaultValue=""
                                /> :
                                    <Controller
                                        control={control}
                                        render={({ onChange, onBlur, value }) => {
                                            return <RNPickerSelect
                                                value={value}
                                                onValueChange={(value) => onChange(value)}
                                                // items={i18n.locale == "en" ? vehicleEn : vehicleTh}
                                                items={[]}
                                                placeholder={{
                                                    label: translate("postJobScreen.selectItemType"),
                                                    color: color.black
                                                }}
                                                useNativeAndroidPickerStyle={false}
                                                style={{
                                                    inputAndroid: { ...CONTENT_TEXT }, inputIOS: { ...CONTENT_TEXT },
                                                    iconContainer: Platform.OS == "ios" ? {} : DROPDOWN_ICON_CONTAINER,
                                                    placeholder: { color: color.black }
                                                }}
                                                Icon={() => {
                                                    return <Ionicons size={20} color={color.black} name={"chevron-down"} />;
                                                }}
                                            />
                                        }}
                                        key={'controller-dropdown-item-type-null'}
                                        name={"item-type-null"}
                                        defaultValue=""
                                    />} */}
                            </View>

                            <Text tx={"postJobScreen.inputYourItem"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInputTheme
                                        testID={"item-name"}
                                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                )}
                                key={'text-input-item-name'}
                                name={"item-name"}
                                defaultValue=""
                            />

                            <Text tx={"postJobScreen.weightNumber"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInputTheme
                                        testID={"item-weight"}
                                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                                )}
                                key={'text-input-item-weight'}
                                name={"item-weight"}
                                defaultValue=""
                            />
                        </View>
                    </View>



                    <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
                        <View style={WRAPPER_TOP}>
                            <RoundedButton onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                        </View>
                    </View>


                </ScrollView>
            </View>
        </View>
    )
})


