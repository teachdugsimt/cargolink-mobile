import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Dimensions, Platform, ImageStyle, Image, SectionList, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from 'react-native-picker-select';
import { observer } from "mobx-react-lite"
import { translate } from "../../../i18n"
import { Text, AddJobElement, TextInputTheme, RoundedButton, MultiSelector } from '../../../components'
import i18n from 'i18n-js'
import PostJobStore from '../../../store/post-job-store/post-job-store'
import AdvanceSearchStore from '../../../store/shipper-job-store/advance-search-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { spacing, color, typography, images } from "../../../theme"
import { Modal, ModalContent, ModalPortal } from 'react-native-modals';
import { MapTruckImageName } from '../../../utils/map-truck-image-name'
import { AlertForm } from '../../../utils/alert-form'
import { FlatGrid } from 'react-native-super-grid';
import { useStores } from "../../../models/root-store/root-store-context";

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
    paddingTop: Platform.OS == "ios" ? 10 : 0,
    flex: Platform.OS == "ios" ? 0.65 : 0.85,
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

const BORDER_GREY: ViewStyle = {
    borderColor: color.line, borderWidth: 1
}

const WRAP_DROPDOWN_VALUE: ViewStyle = {
    flex: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
    borderRadius: 2.5
}
const WRAP_DROPDOWN: ViewStyle = {
    ...BORDER_GREY,
    ...WRAP_DROPDOWN_VALUE
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
    width: '98%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center'
}

const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }

const BORDER_BOTTOM: ViewStyle = {
    ...ROOT_FLAT_LIST,
    width: '100%',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: color.line, marginHorizontal: 10,
}
const IMAGE_LIST: ImageStyle = {
    // width: 50, height: 50,
    backgroundColor: color.line, padding: 10,
    resizeMode: "cover",
    aspectRatio: 2 / 2,
    borderRadius: 30,
    borderColor: color.primary, borderWidth: 2,
}
let check_load_truck_type = 0

export const PostJobScreen = observer(function PostJobScreen() {
    const { versatileStore } = useStores()
    const navigation = useNavigation()

    // const [listProductState, setlistProductState] = useState(null)

    const [swipe, setswipe] = useState(false)
    const { control, handleSubmit, errors } = useForm({
        // defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : MyVehicleStore.MappingData
    });

    useEffect(() => {
        AdvanceSearchStore.getProductTypes()
    }, [])

    const onSubmit = (data) => {
        __DEV__ && console.tron.log("Data Form Post job : ", data)

        if (!data['vehicle-type']) { AlertForm("postJobScreen.truckType"); return; }
        else if (!data['item-type']) { AlertForm("postJobScreen.productType"); return; }
        PostJobStore.setPostJob(1, data)
        navigation.navigate("receivePoint")
    }

    const _renderSectionModal = (item: any, index: any, onChange: any, section: any) => {
        return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
            if (section == 1) setvisible0(false)
            else if (section == 2) setvisible(false)
            onChange(item.id)
        }}>
            <View style={BORDER_BOTTOM}>
                <View style={VIEW_LIST_IMAGE}>
                    {Platform.OS == "ios" ? <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
                        <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} />}
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={{ paddingLeft: 40 }}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    const _renderSelectedList = (item, section) => {
        __DEV__ && console.tron.log('Item :: ', item)
        return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name} style={ROOT_FLAT_LIST} onPress={() => {
            if (section == 1) setvisible0(true)
            else if (section == 2) setvisible(true)
        }}>
            <View style={{ ...BORDER_BOTTOM }}>
                <View style={VIEW_LIST_IMAGE}>
                    {/* {Platform.OS == "ios" ? <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
                        <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} />} */}
                    {Platform.OS == "ios" ? <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images.bell} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
                        <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images.bell} style={IMAGE_LIST} height={60} width={60} />}
                </View>
                <View style={{ flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'space-between' }}>
                    <View style={{ width: '80%', alignItems: 'center' }}>
                        <Text style={{ marginLeft: 20 }}>{item.name}</Text>
                    </View>

                    <Ionicons name="chevron-forward" size={24} style={{}} />
                </View>
            </View>
        </TouchableOpacity>
    }



    const [vehicleType, setvehicleType] = useState([])
    const [sectionTruckType, setsectionTruckType] = useState([])
    const [initSection, setinitSection] = useState([])
    useEffect(() => {
        let grouping = JSON.parse(JSON.stringify(versatileStore.listGroup))
        let truckTyping = JSON.parse(JSON.stringify(versatileStore.list))
        __DEV__ && console.tron.log('Grouping useEffect :: ', grouping)
        __DEV__ && console.tron.log('Truck type useEffect:: ', truckTyping)
        if (grouping && truckTyping && grouping.length > 0 && truckTyping.length > 0) {
            let tmp_section = []
            grouping.map((gr, igr) => {
                tmp_section.push({
                    title: gr.name,
                    id: gr.id,
                    image: gr.image,
                    data: truckTyping.filter(e => e.groupId == gr.id)
                })
            })
            __DEV__ && console.tron.log("Origin section tmp :: ", tmp_section)
            __DEV__ && console.tron.log("Origin section tmp :: ", tmp_section)
            __DEV__ && console.tron.log("Origin section tmp :: ", tmp_section)
            __DEV__ && console.tron.log("Origin section tmp :: ", tmp_section)
            __DEV__ && console.tron.log("Origin section tmp :: ", tmp_section)
            setsectionTruckType(tmp_section)
            setinitSection(tmp_section)
        }

    }, [versatileStore.list, versatileStore.listGroup])
    const _closeTruckType = () => {
        setvisible0(false)
        const list_all_real = JSON.parse(JSON.stringify(versatileStore.list))
        setsectionTruckType(initSection)
        setvehicleType(list_all_real)
    }
    const _filterGroupTruck = (item) => {
        const list_all_real = JSON.parse(JSON.stringify(versatileStore.list))

        let tmp_list, tmp_section_list
        tmp_list = list_all_real.filter(e => e.groupId == item.id)
        tmp_section_list = initSection.filter(e => e.id == item.id)

        setsectionTruckType(tmp_section_list)
        setvehicleType(tmp_list)
    }
    useEffect(() => {
        let tmpProductList = JSON.parse(JSON.stringify(versatileStore.list))
        if (tmpProductList && tmpProductList.length > 0) {
            setvehicleType(tmpProductList)
        }
    }, [versatileStore.list])
    const _renderGroupTruck = (list) => {
        return <FlatGrid
            itemDimension={100}
            data={list}
            // fixed={true}
            renderItem={({ item }) => (<TouchableOpacity
                style={{ flex: 1, borderColor: color.primary, borderRadius: 15, borderWidth: 1 }}
                onPress={() => _filterGroupTruck(item)}>
                <View style={{ flex: 1, width: '100%', height: 30, justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'center' }}>{item.name}</Text>
                </View>
            </TouchableOpacity>)}
        />
    }





    const [visible, setvisible] = useState(false)
    const [visible0, setvisible0] = useState(false)
    const list_status = [
        { key: 1, ID: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: true },
        { key: 2, ID: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
        { key: 3, ID: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
        { key: 4, ID: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
    ]

    const list_product_type = [
        {
            title: 'postJobScreen.popular',
            data: [{ id: 1, name: 'วัสดุก่อสร้าง', image: 'bell' },
            { id: 2, name: 'สินค้าเกษตร', image: 'bell' },
            { id: 3, name: 'อาหาร และสินค้าบริโภค', image: 'bell' }]
        }
    ]



    let multi_select: object, multi_select2: object
    console.log("Multi select Item :: ", multi_select, multi_select2)
    let formControllerValue = control.getValues()

    let dropdown_item_type
    let dropdown_vehicle_type
    if (formControllerValue['item-type']) {
        dropdown_item_type = formControllerValue['item-type']
    }
    if (formControllerValue['vehicle-type']) {
        dropdown_vehicle_type = formControllerValue['vehicle-type']
    }
    // let list_vehicle = JSON.parse(JSON.stringify(versatileStore.data))
    let defaultVehicleType = JSON.parse(JSON.stringify(versatileStore.list))
    let list_product_type_all = JSON.parse(JSON.stringify(AdvanceSearchStore.productTypes))


    const listGroup = JSON.parse(JSON.stringify(versatileStore.listGroup))
    __DEV__ && console.tron.log("State list vehicle type :: ", vehicleType)
    __DEV__ && console.tron.log("State section list vehicle type :: ", sectionTruckType)

    __DEV__ && console.tron.log("List group =>  :: ", list_product_type_all)





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

                            <View style={[PADDING_TOP, !dropdown_vehicle_type ? { ...WRAP_DROPDOWN } : { ...WRAP_DROPDOWN_VALUE }]}>



                                <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible0(true)}>
                                    {!dropdown_vehicle_type && <><Text style={{ padding: 10 }} tx={"postJobScreen.pleaseSelectVehicleType"} />
                                        <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} /></>}
                                    {dropdown_vehicle_type && versatileStore.list && _renderSelectedList(JSON.parse(JSON.stringify(versatileStore.list)).find(e => e.id == dropdown_vehicle_type), 1)}

                                </TouchableOpacity>

                                <Controller
                                    control={control}
                                    render={({ onChange, onBlur, value }) => (
                                        <Modal
                                            id="modal-truck-type"
                                            visible={visible0}
                                            onTouchOutside={() => _closeTruckType()}
                                            onSwipeOut={() => _closeTruckType()}
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
                                                            {!!defaultVehicleType && defaultVehicleType.length > 0 && <MultiSelector
                                                                items={vehicleType && vehicleType.length > 0 ? vehicleType : defaultVehicleType}
                                                                selectedItems={[value]}
                                                                selectText={translate("postJobScreen.pleaseSelectVehicleType")}
                                                                onSelectedItemsChange={(val: any) => {
                                                                    onChange(val[0])
                                                                    _closeTruckType()
                                                                }}
                                                            />}
                                                        </View>

                                                        {listGroup && listGroup.length > 1 && <View>
                                                            {_renderGroupTruck(listGroup)}
                                                        </View>}

                                                        <View style={{ flex: 1 }}>

                                                            <SectionList
                                                                sections={sectionTruckType}
                                                                keyExtractor={(item, index) => 'section-list-' + (item.name || item.title) + index}
                                                                renderItem={({ item, index }) => _renderSectionModal(item, index, onChange, 1)}
                                                                renderSectionHeader={({ section: { title } }) => (
                                                                    <Text style={PADDING_TOP} >{title}</Text>
                                                                )}
                                                                ListFooterComponent={
                                                                    <View style={{ height: 50 }}></View>
                                                                }
                                                            />

                                                        </View>

                                                    </SafeAreaView>

                                                </View>
                                            </ModalContent>
                                        </Modal>

                                    )}
                                    key={'controller-dropdown-vehicle-type'}
                                    name={"vehicle-type"}
                                    rules={{ required: true, pattern: /^[a-zA-Z0-9 .!?"-]+$/ }}
                                    defaultValue=""
                                />
                            </View>
                            {errors['vehicle-type'] && <Text style={{ color: color.red }} tx={"postJobScreen.validateTruckType"} />}


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
                                rules={{ pattern: /^[0-9]+$/ }}
                                defaultValue=""
                            />
                            {errors['car-num'] && <Text style={{ color: color.red }} tx={"common.noSignAndCharacter"} />}
                        </View>
                    </View>








                    <View style={[TOP_VIEW_2, MARGIN_TOP]}>
                        <View style={WRAPPER_TOP}>
                            <View style={ROW_TEXT}>
                                <Text tx={"postJobScreen.itemDetail"} preset={'topic'} style={MARGIN_TOP_BIG} />
                                <Text preset={'topic'} style={RED_DOT} >*</Text>
                            </View>







                            <View style={[PADDING_TOP, !dropdown_vehicle_type ? { ...WRAP_DROPDOWN } : { ...WRAP_DROPDOWN_VALUE }]}>

                                <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible(true)}>
                                    {!dropdown_item_type && <><Text style={{ padding: 10 }} tx={"postJobScreen.selectItemType"} />
                                        <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} />
                                    </>}
                                    {dropdown_item_type && list_product_type_all && _renderSelectedList(list_product_type_all.find(e => e.id == dropdown_item_type), 2)}

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
                                                        <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ color: color.primary }} preset={"topic"} tx={"postJobScreen.selectItemType"} />
                                                        </View>

                                                        <View style={[PADDING_TOP]}>

                                                            {!!list_product_type_all && list_product_type_all.length > 0 && <MultiSelector
                                                                items={list_product_type_all}
                                                                keyer={"list-item-type-01"}
                                                                selectedItems={[value]}
                                                                selectText={translate("postJobScreen.validateProductType")}
                                                                onSelectedItemsChange={(val: any) => {
                                                                    onChange(val[0])
                                                                    setvisible(false)
                                                                }}
                                                            />}

                                                        </View>

                                                        <View>
                                                            {!!list_product_type_all && list_product_type_all.length > 0 && <SectionList
                                                                sections={list_product_type}
                                                                keyExtractor={(item, index) => 'section-list-' + item.name + item.id + index}
                                                                renderItem={({ item, index }) => _renderSectionModal(item, index, onChange, 2)}
                                                                renderSectionHeader={({ section: { title } }) => (
                                                                    <Text tx={title} style={PADDING_TOP} />
                                                                )}
                                                            />}
                                                        </View>
                                                    </SafeAreaView>

                                                </View>
                                            </ModalContent>
                                        </Modal>


                                    )}
                                    key={'controller-dropdown-item-type'}
                                    name={"item-type"}
                                    rules={{ required: true, pattern: /^[a-zA-Z0-9 .!?"-]+$/ }}
                                    defaultValue=""
                                />

                            </View>
                            {errors['item-type'] && <Text style={{ color: color.red }} tx={"postJobScreen.validateProductType"} />}





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
                                rules={{ pattern: /^[a-zA-Z0-9 .!?"-]+$/ }}
                                defaultValue=""
                            />
                            {errors['item-name'] && <Text style={{ color: color.red }} tx={"common.noSign"} />}

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
                                rules={{ pattern: /^[+-]?\d+(\.\d+)?$/ }}
                                defaultValue=""
                            />
                            {errors['item-weight'] && <Text style={{ color: color.red }} tx={"common.noSignAndCharacter"} />}
                        </View>
                    </View>



                    <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
                        <View style={WRAPPER_TOP}>
                            <RoundedButton onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                        </View>
                    </View>

                </ScrollView>
            </View>
        </View >
    )
})


