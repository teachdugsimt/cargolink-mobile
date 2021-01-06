import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Dimensions, Platform, ImageStyle, Image, SectionList } from "react-native"
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
const items = [{ id: '92iijs7yta', name: 'Ondo', value: 'dd' }, { id: 'a0s0a8ssbsd', name: 'Ogun' }, { id: '16hbajsabsd', name: 'Calabar' }, { id: 'nahs75a5sg', name: 'Lagos' }, { id: '667atsas', name: 'Maiduguri' }, { id: 'hsyasajs', name: 'Anambra' }, { id: 'djsjudksjd', name: 'Benue' }, { id: 'sdhyaysdj', name: 'Kaduna' }, { id: 'suudydjsjd', name: 'Abuja' }];

const { width, height } = Dimensions.get("window")
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
const JUSTIFY_BETWEEN: ViewStyle = {
    justifyContent: 'space-between'
}
const RED_DOT: TextStyle = {
    color: color.red,
    paddingTop: 10, paddingLeft: 7.5
}
const PADDING_CHEVRON: ViewStyle = { paddingTop: 7.5, paddingRight: 5 }
const PADDING_TOP: ViewStyle = { marginTop: 10 }

const ROOT_FLAT_LIST: ViewStyle = {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
}

const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }

const BORDER_BOTTOM: ViewStyle = { ...ROOT_FLAT_LIST, borderBottomWidth: 1, borderBottomColor: color.line, marginHorizontal: 10, }
const IMAGE_LIST: ImageStyle = {
    // width: 50, height: 50,
    backgroundColor: color.grey, padding: 10,
    resizeMode: "cover",
    aspectRatio: 2 / 2,
    borderRadius: 30,
    borderColor: color.primary, borderWidth: 2,
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

    const _renderSectionModal = (item: any, index: any, onChange: any) => {
        return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
            console.log("ITEM FUCK YEAH :: ", item)
            onChange(item.id)
            setvisible0(false)
        }}>
            <View style={BORDER_BOTTOM}>
                <View style={VIEW_LIST_IMAGE}>
                    {Platform.OS == "ios" ? <Image source={images[item.image]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
                        <Image source={images[item.image]} style={IMAGE_LIST} height={60} width={60} />}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <Text style={{ width: '50%', paddingLeft: 20 }}>{item.name}</Text>
                    <Ionicons name="chevron-forward" size={24} style={{ marginRight: 5 }} />
                </View>
            </View>
        </TouchableOpacity>
    }

    const [visible, setvisible] = useState(false)
    const [visible0, setvisible0] = useState(false)
    // const changeDropdown = (val) => setselectValue(val)
    const list_status = [
        { key: 1, ID: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: true },
        { key: 2, ID: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
        { key: 3, ID: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
        { key: 4, ID: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
    ]
    const list_vehicle_popular = [
        {
            title: 'postJobScreen.popular',
            data: [{ id: 13, name: 'รถบรรทุกของเหลว 6 ล้อ', image: 'truck2' },
            { id: 17, name: 'รถกระบะ 4 ล้อตู้ทึบ', image: 'truck3' },
            { id: 21, name: 'รถ 6 ล้อ ตู้ทึบ', image: 'truck4' }]
        },
        {
            title: 'postJobScreen.4maxType',
            data: [
                { id: 24, name: 'รถ 6 ล้อ กระบะ', image: 'truck5' },
            ]
        }
    ]

    let multi_select
    console.log("Multi select Item :: ", multi_select)
    let dropdown_truck_type
    let dropdown_vehicle_type
    if (control.fieldsRef.current['item-type'] && control.fieldsRef.current['item-type'].ref.value) {
        dropdown_truck_type = control.fieldsRef.current['item-type'].ref.value
    }
    if (control.fieldsRef.current['vehicle-type'] && control.fieldsRef.current['vehicle-type'].ref.value) {
        dropdown_vehicle_type = control.fieldsRef.current['vehicle-type'].ref.value
    }
    let list_vehicle = JSON.parse(JSON.stringify(TruckTypeStore.data))

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


                            <View style={[WRAP_DROPDOWN, PADDING_TOP]}>







                                <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible0(true)}>
                                    {!dropdown_vehicle_type && <Text style={{ padding: 10 }} tx={"postJobScreen.pleaseSelectVehicleType"} />}
                                    {dropdown_vehicle_type && <Text style={{ padding: 10 }}>{JSON.parse(JSON.stringify(TruckTypeStore.data)).find(e => e.id == dropdown_vehicle_type).name}</Text>}
                                    <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} />
                                </TouchableOpacity>

                                <Controller
                                    control={control}
                                    render={({ onChange, onBlur, value }) => (
                                        <Modal
                                            visible={visible0}
                                            onTouchOutside={() => setvisible0(false)}
                                            onSwipeOut={() => setvisible0(false)}
                                            swipeDirection={['up', 'down']} // can be string or an array
                                            swipeThreshold={200} // default 100
                                        >
                                            <ModalContent >
                                                <View style={{ width: (width / 1.1), height: '100%', justifyContent: 'flex-start' }}>
                                                    <SafeAreaView style={{ flex: 1 }}>
                                                        <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ color: color.primary }} preset={"topic"} tx={"postJobScreen.selectVehicleType"} />
                                                        </View>

                                                        <View style={PADDING_TOP}>
                                                            {list_vehicle && list_vehicle.length && <MultiSelect
                                                                key={"list-vehicle-01"}
                                                                hideTags
                                                                items={list_vehicle}
                                                                uniqueKey="id"
                                                                ref={(component) => { multi_select = component }}
                                                                onSelectedItemsChange={(val) => {
                                                                    onChange(val[0])
                                                                    setvisible0(false)
                                                                }}
                                                                selectedItems={[value]}
                                                                selectText={translate("postJobScreen.pleaseSelectVehicleType")}
                                                                searchIcon={<Ionicons name="search-outline" size={20} color={color.primary} />}
                                                                hideSubmitButton={true}
                                                                single={true}
                                                                searchInputPlaceholderText={translate("common.search")}
                                                                onChangeInput={(text) => console.log(text)}

                                                                styleListContainer={{ maxHeight: height - width / 2 }}

                                                                styleTextDropdown={{ fontFamily: 'Kanit-Medium' }}
                                                                styleTextDropdownSelected={{ fontFamily: 'Kanit-Medium' }}
                                                                altFontFamily="Kanit-Medium"
                                                                fontFamily="Kanit-Medium"
                                                                selectedItemFontFamily="Kanit-Medium"
                                                                itemFontFamily="Kanit-Medium"

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
                                                            />}
                                                        </View>

                                                        <View>
                                                            <SectionList
                                                                sections={list_vehicle_popular}
                                                                keyExtractor={(item, index) => 'section-list-' + item.name + index}
                                                                renderItem={({ item, index }) => _renderSectionModal(item, index, onChange)}
                                                                renderSectionHeader={({ section: { title } }) => (
                                                                    <Text tx={title} style={PADDING_TOP} />
                                                                )}
                                                            />
                                                        </View>
                                                    </SafeAreaView>

                                                </View>
                                            </ModalContent>
                                        </Modal>


                                    )}
                                    key={'controller-dropdown-vehicle-type'}
                                    name={"vehicle-type"}
                                    defaultValue=""
                                />






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







                            <View style={[WRAP_DROPDOWN, PADDING_TOP]}>

                                <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible(true)}>
                                    {!dropdown_truck_type && <Text style={{ padding: 10 }} tx={"postJobScreen.selectItemType"} />}
                                    {dropdown_truck_type && <Text style={{ padding: 10 }}>{items.find(e => e.id == dropdown_truck_type).name}</Text>}
                                    <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} />
                                </TouchableOpacity>

                                <Controller
                                    control={control}
                                    render={({ onChange, onBlur, value }) => (
                                        <Modal
                                            visible={visible}
                                            onTouchOutside={() => setvisible(false)}
                                            onSwipeOut={() => setvisible(false)}
                                            swipeDirection={['up', 'down']} // can be string or an array
                                            swipeThreshold={200} // default 100
                                        >
                                            <ModalContent >
                                                <View style={{ width: (width / 1.1), height: '100%', justifyContent: 'flex-start' }}>
                                                    <SafeAreaView style={{ flex: 1 }}>
                                                        <View style={{ height: 60 }}><Text>Test Title</Text></View>

                                                        <View>
                                                            <MultiSelect
                                                                hideTags
                                                                items={items}
                                                                uniqueKey="id"
                                                                ref={(component) => { multi_select = component }}
                                                                onSelectedItemsChange={(val) => onChange(val[0])}
                                                                selectedItems={[value]}
                                                                selectText={translate("postJobScreen.selectItemType")}
                                                                searchIcon={<Ionicons name="search-outline" size={20} color={color.primary} />}
                                                                hideSubmitButton={true}
                                                                single={true}
                                                                searchInputPlaceholderText={translate("common.search")}
                                                                onChangeInput={(text) => console.log(text)}
                                                                styleTextDropdown={{ fontFamily: 'Kanit-Medium' }}
                                                                styleTextDropdownSelected={{ fontFamily: 'Kanit-Medium' }}
                                                                altFontFamily="Kanit-Medium"
                                                                fontFamily="Kanit-Medium"
                                                                selectedItemFontFamily="Kanit-Medium"
                                                                itemFontFamily="Kanit-Medium"
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
                                                        </View>

                                                    </SafeAreaView>

                                                </View>
                                            </ModalContent>
                                        </Modal>


                                    )}
                                    key={'controller-dropdown-item-type'}
                                    name={"item-type"}
                                    defaultValue=""
                                />

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


