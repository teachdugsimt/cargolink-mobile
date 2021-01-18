import React, { useEffect, useState } from "react"
import {
    View, ViewStyle, Dimensions, TextStyle, FlatList,
    Platform, ImageStyle, Image, TouchableOpacity,
    SectionList, ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from 'react-native-picker-select';
import { observer } from "mobx-react-lite"
import { Text } from "../../../components"
import { translate } from "../../../i18n"
import {
    AddJobElement, MultiSelector,
    TextInputTheme, RoundedButton,
    Icon, DatePickerRemake, TimePickerRemake
} from '../../../components'
import i18n from 'i18n-js'
import { SafeAreaView } from "react-native-safe-area-context";
import TruckTypeStore from '../../../store/my-vehicle-store/truck-type-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { spacing, color, typography, images } from "../../../theme"
import date from 'date-and-time';
import { Modal, ModalContent } from 'react-native-modals';
import PostJobStore from "../../../store/post-job-store/post-job-store";
import _ from 'lodash'
import { MapTruckImageName } from '../../../utils/map-truck-image-name'
// const bowserLogo = require("./bowser.png")

const { width, height } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const BORDER_GREY: ViewStyle = {
    borderColor: color.grey, borderWidth: 1
}
const GREY_TEXT: ViewStyle = { backgroundColor: color.grey }
const BORDER_RADIUS_20: ViewStyle = {
    borderRadius: 20,
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
const WRAP_DROPDOWN_VALUE: ViewStyle = {
    flex: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
    borderRadius: 2.5
}
const WRAP_DROPDOWN: ViewStyle = {
    flex: 1, borderColor: color.grey, borderWidth: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
    borderRadius: 2.5
}
const IMAGE_LIST: ImageStyle = {
    // width: 50, height: 50,
    backgroundColor: color.grey, padding: 10,
    resizeMode: "cover",
    aspectRatio: 2 / 2,
    borderRadius: 30,
    borderColor: color.primary, borderWidth: 2,
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
const ROUND_BUTTON_CONTAINER_CONFIRM: ViewStyle = {
    backgroundColor: color.success, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
    color: color.textWhite
}
const MARGIN_MEDIUM: ViewStyle = {
    marginVertical: 10
}

const ROOT_FLAT_LIST: ViewStyle = {
    width: '98%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
}
const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }
const BORDER_BOTTOM: ViewStyle = { ...ROOT_FLAT_LIST, borderBottomWidth: 1, borderBottomColor: color.line, marginHorizontal: 10, }
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
const JUSTIFY_BETWEEN: ViewStyle = {
    justifyContent: 'space-between'
}
const PADDING_RIGHT_SMALL: ViewStyle = { paddingRight: 5 }
const PADDING_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
const PADDING_CHEVRON: ViewStyle = { paddingTop: 7.5, paddingRight: 5 }
const PADDING_TOP: ViewStyle = { marginTop: 10 }

export const CheckInformationScreen = observer(function CheckInformationScreen(props) {
    const navigation = useNavigation()
    const [fieldShippingCheck, setfieldShippingCheck] = useState([])

    const [rerender, setrerender] = useState(false)
    const [rerenderTime, setrerenderTime] = useState(false)
    const [initDatePicker, setinitDatePicker] = useState(new Date());

    const [swipe, setswipe] = useState(false)
    const [swipe2, setswipe2] = useState(false)
    const [visible, setvisible] = useState(false)
    const [visible0, setvisible0] = useState(false)

    const _mappingObject = (object) => {
        let tmp = object
        Object.keys(object).forEach(key => {
            if (key.includes('-date') || key.includes("-time")) {
                tmp[key] = new Date(object[key])
            }
        })
        return tmp
    }
    const initialData = _mappingObject(PostJobStore.MappingInitValue) || {}
    __DEV__ && console.tron.log("Initial Data Check Informationm :: ", initialData)
    __DEV__ && console.tron.log('Type of props date :: ', typeof initialData['shipping-date-1'])

    __DEV__ && console.tron.log("Receive Date from mobx  :: ", initialData['receive-date'])
    __DEV__ && console.tron.log("Receive Date types from mobx  :: ", typeof initialData['receive-date'])

    const { control, handleSubmit, errors } = useForm({
        defaultValues: initialData
    });

    const _renderSelectedList = (item, section) => {
        return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name} style={ROOT_FLAT_LIST} onPress={() => {
            if (section == 1) setvisible0(true)
            else if (section == 2) setvisible(true)
        }}>
            <View style={{ ...BORDER_BOTTOM }}>
                <View style={VIEW_LIST_IMAGE}>
                    {Platform.OS == "ios" ? <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
                        <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} />}
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

    const _renderSectionModal = (item: any, index: any, onChange: any, section: any) => {
        return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
            console.log("ITEM FUCK YEAH :: ", item)
            if (section == 1) setvisible0(false)
            else if (section == 2) setvisible(false)
            onChange(item.id)
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



    useEffect(() => {
        let tmp_field = fieldShippingCheck
        let postjob2_data = JSON.parse(JSON.stringify(PostJobStore.postjob2)) || null

        if (postjob2_data) {
            __DEV__ && console.tron.log("UseEffect postjob data :: ", postjob2_data)
            postjob2_data['shipping-information'].forEach((e, i) => {
                tmp_field.push({
                    id: i + 1,
                    showDate: false,
                    showTime: false,
                })
            })
            setfieldShippingCheck(tmp_field)
            __DEV__ && console.tron.log("State field array list :: ", tmp_field)
            setswipe2(true)
            setTimeout(() => {
                setswipe(!swipe)
            }, 2000);
        }
        return () => {
            setswipe2(false)
        }
    }, [])

    const onSubmit = (data) => {
        __DEV__ && console.tron.log("Raw Data Form Post job 3 : ", data)
        let tmp_data = JSON.parse(JSON.stringify(data))
        // let final = { ...tmp_data }
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

        // let shippingInformation = []
        // let pure_object = {}
        // Object.keys(tmp_data).forEach((key) => {
        //     if (key.includes("shipping-")) {
        //         pure_object[key] = tmp_data[key]
        //     }
        // })
        // fieldShippingCheck.forEach((e, i) => {
        //     shippingInformation.push({
        //         "shipping-address": pure_object[`shipping-address-${i + 1}`],
        //         "shipping-date": pure_object[`shipping-date-${i + 1}`],
        //         "shipping-time": pure_object[`shipping-time-${i + 1}`],
        //         "shipping-name": pure_object[`shipping-name-${i + 1}`],
        //         "shipping-tel-no": pure_object[`shipping-tel-no-${i + 1}`],
        //     })
        // })
        // final['shipping-information'] = shippingInformation
        // PostJobStore.setPostJob(2, newObj)
        // __DEV__ && console.tron.log("Final object postjob screen 2 :: => ", final)
    }

    const _setRenderDateAndTimeField = (val: boolean, index: number, field: string) => {
        let tmp_field_level = fieldShippingCheck
        if (field == "date") tmp_field_level[index].showDate = val
        else tmp_field_level[index].showTime = val
        setfieldShippingCheck(tmp_field_level)
        setswipe(!swipe)
    }

    const list_status = [
        { key: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: false },
        { key: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
        { key: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: true },
        { key: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
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
    const list_product_type = [
        {
            title: 'postJobScreen.popular',
            data: [{ id: 13, name: 'สินค้าการเกษตร', image: 'bell' },
            { id: 17, name: 'สินค้าการประมง', image: 'bell' },
            { id: 21, name: 'เครื่องดื่ม', image: 'bell' }]
        }
    ]
    let list_vehicle = JSON.parse(JSON.stringify(TruckTypeStore.data))

    let formControllerValue = control.getValues()
    let dropdown_item_type, dropdown_vehicle_type
    if (formControllerValue['item-type']) {
        dropdown_item_type = formControllerValue['item-type']
    }
    if (formControllerValue['vehicle-type']) {
        dropdown_vehicle_type = formControllerValue['vehicle-type']
    }
    __DEV__ && console.tron.log("Form control Check Information Screen : ", formControllerValue)

    __DEV__ && console.tron.log("Field shipping level :: ", fieldShippingCheck)
    return (
        <View testID="CheckInformationScreen" style={FULL}>
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
                                    {dropdown_vehicle_type && TruckTypeStore.data && TruckTypeStore.data.length && _renderSelectedList(JSON.parse(JSON.stringify(TruckTypeStore.data)).find(e => e.id == dropdown_vehicle_type), 1)}

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
                                                            {list_vehicle && list_vehicle.length && <MultiSelector
                                                                key="dd-01-type"
                                                                items={list_vehicle}
                                                                keyer={"list-vehicle-type-01"}
                                                                selectedItems={[value]}
                                                                selectText={translate("postJobScreen.pleaseSelectVehicleType")}
                                                                onSelectedItemsChange={(val: any) => {
                                                                    onChange(val[0])
                                                                    setvisible0(false)
                                                                }}
                                                            />}
                                                        </View>

                                                        <View>
                                                            <SectionList
                                                                sections={list_vehicle_popular}
                                                                keyExtractor={(item, index) => 'section-list-' + item.name + index}
                                                                renderItem={({ item, index }) => _renderSectionModal(item, index, onChange, 1)}
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

                            <View style={[PADDING_TOP, !dropdown_vehicle_type ? { ...WRAP_DROPDOWN } : { ...WRAP_DROPDOWN_VALUE }]}>

                                <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible(true)}>
                                    {!dropdown_item_type && <><Text style={{ padding: 10 }} tx={"postJobScreen.selectItemType"} />
                                        <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} />
                                    </>}
                                    {/* {dropdown_item_type && <Text style={{ padding: 10 }}>{list_product_type[0].data.find(e => e.id == dropdown_item_type).name}</Text>} */}
                                    {dropdown_item_type && _renderSelectedList(list_product_type[0].data.find(e => e.id == dropdown_item_type), 2)}

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
                                                            <Text style={{ color: color.primary }} preset={"topic"} tx={"postJobScreen.selectVehicleType"} />
                                                        </View>

                                                        <View style={[PADDING_TOP]}>

                                                            <MultiSelector
                                                                items={list_product_type[0].data}
                                                                keyer={"list-item-type-01"}
                                                                selectedItems={[value]}
                                                                selectText={translate("postJobScreen.pleaseSelectVehicleType")}
                                                                onSelectedItemsChange={(val: any) => {
                                                                    onChange(val[0])
                                                                    setvisible(false)
                                                                }}
                                                            />
                                                        </View>

                                                        <View>
                                                            <SectionList
                                                                sections={list_product_type}
                                                                keyExtractor={(item, index) => 'section-list-' + item.name + index}
                                                                renderItem={({ item, index }) => _renderSectionModal(item, index, onChange, 2)}
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










                    <View style={[TOP_VIEW_2, MARGIN_TOP]}>
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
                                <><View style={[FULL, PADDING_RIGHT_SMALL]}>
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
                                    // defaultValue={date.parse("2021-01-18T10:25:22.643Z", 'YYYY/MM/DD HH:mm:ss')}
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
                                        // defaultValue={date.parse("2021-01-18T10:25:22.643Z", 'YYYY/MM/DD HH:mm:ss')}
                                        />
                                    </View></>
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











                    {fieldShippingCheck && fieldShippingCheck.length > 0 ? fieldShippingCheck.map((e, i) => {
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
                                            defaultValue=""
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
                                            defaultValue=""
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
                    }) : <></>}









                    <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
                        <View style={ROW_TEXT}>
                            <View style={[WRAPPER_TOP, FULL]}>
                                <RoundedButton style={[FULL, BORDER_RADIUS_20, GREY_TEXT]} onPress={() => navigation.goBack()} text={"common.back"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                            </View>
                            <View style={[WRAPPER_TOP, FULL]}>
                                <RoundedButton style={[FULL, BORDER_RADIUS_20]} onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER_CONFIRM} textStyle={ROUND_BUTTON_TEXT} />
                            </View>
                        </View>
                    </View>


                </ScrollView>
            </View>
        </View>
    )
})