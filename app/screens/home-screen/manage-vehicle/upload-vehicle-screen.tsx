import React, { useState, useEffect } from "react"
import {
    View, ViewStyle, TextStyle,
    ScrollView, Switch, StyleSheet, Dimensions, Platform, Alert, ImageStyle
} from "react-native"
import { useForm, Controller } from "react-hook-form";
import { observer } from "mobx-react-lite"
import { Text, TextInputTheme, Button, UploadVehicle, RoundedButton } from "../../../components"
import { spacing, color, typography, images } from "../../../theme"

import RNPickerSelect from 'react-native-picker-select';
import { translate } from "../../../i18n"
import Ionicons from 'react-native-vector-icons/Ionicons'
import FetchStore from '../../../store/fetch-store/fetch-store'
import FormRegistration from "./form-registration"
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { TestApi } from '../../../services/api'
// const apiUsers = new TestApi()
import ImagePicker from 'react-native-image-picker';
import { vehicleEn, vehicleTh } from './vehicle-type'
import i18n from 'i18n-js'



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
const MARGIN_MEDIUM: ViewStyle = {
    marginVertical: 10
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
const MARGIN_TOP_MEDIUM: ViewStyle = { marginTop: 15 }
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
const PLACEHOLDER_IMAGE: ImageStyle = {
    width: 50, height: 75
}
const PLACEHOLDER_IMAGE2: ImageStyle = {
    width: 95, height: 37.5
}
const LAYOUT_REGISTRATION_FIELD: TextStyle = {
    textAlign: 'right', paddingRight: 10,
}
export const UploadVehicleScreen = () => {
    // const navigation = useNavigation()
    const [vehicle, setvehicle] = useState('')
    const [toggleDump, settoggleDump] = useState(false)
    const [vehicleHeight, setvehicleHeight] = useState('')
    // const [carRegistration, setcarRegistration] = useState('')
    const [province, setprovince] = useState(null)
    const [region, setregion] = useState(null)

    const [stateData, setstateData] = useState(null)







    const [fileFront, setfileFront] = useState({});
    const [fileBack, setfileBack] = useState({});
    const [fileLeft, setfileLeft] = useState({});
    const [fileRight, setfileRight] = useState({});

    const _chooseFile = (status) => {
        console.log("Status Image :: ", status)
        let options = {
            title: 'Select Image',
            customButtons: [
                {
                    name: 'customOptionKey',
                    title: 'Choose Photo from Custom Option'
                },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }

            else {
                let source = { uri: response.uri };
                if (status == "front") setfileFront(source);
                else if (status == "back") setfileBack(source);
                else if (status == "left") setfileLeft(source);
                else if (status == "right") setfileRight(source);
                // Alert.alert(
                //     'Vehicle Image',
                //     "Upload Success",
                //     [
                //         {
                //             text: "OK", onPress: () => { }
                //         }
                //     ]
                //     , { cancelable: false }
                // )
            }

        });
    };

    const [inputRegistration, setinputRegistration] = useState({})

    const { control, handleSubmit, errors } = useForm();
    const onSubmit = data => {
        setinputRegistration(data)
        console.log(data)
    }



    const [textInput, settextInput] = useState([])
    // const [inputData, setinputData] = useState([])
    const [renderNew, setrenderNew] = useState(false)

    //function to add TextInput dynamically
    const addTextInput = (index) => {
        let textInputTmp = textInput;
        textInputTmp.push(<Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
                <TextInputTheme
                    inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                />
            )}
            key={"registration-key-" + index}
            name={"registration-" + index}
            defaultValue=""
        />);
        settextInput(textInputTmp);
        setrenderNew(!renderNew)
    }

    useEffect(() => {
        addTextInput(textInput.length)
        console.log("Mobx state data : : ", JSON.parse(JSON.stringify(FetchStore.getUserData)))
        console.log("State data :: ", stateData)
        FetchStore.getUserRequest()
    }, [])

    useEffect(() => {
        let tmp = JSON.parse(JSON.stringify(FetchStore.getUserData))
        if (tmp.length && tmp != stateData) {
            setstateData(tmp)
            console.log("Fetstore data : ", JSON.parse(JSON.stringify(tmp)))
        }
        return () => {
            setstateData(null)
        }
    // }, [FetchStore.data])
    }, [FetchStore.getUserData])

    console.log("File path :: => ", fileFront)

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
                                items={i18n.locale == "en" ? vehicleEn : vehicleTh}
                                placeholder={{
                                    label: translate("uploadVehicleScreen.selectVehicleType"),
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






                        <View>
                            {textInput.map(e => { return e })}
                            {/* <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInputTheme
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="firstName"
                                defaultValue=""
                            />

                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <TextInputTheme
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="lastName"
                                defaultValue=""
                            /> */}

                            {/* <Button onPress={handleSubmit(onSubmit)} ><Text>Submit</Text></Button> */}
                        </View>


                        {/* {renderNew && textInput.map(value => { return value })}
                        {!renderNew && textInput.map(value => { return value })} */}
                        <Button onPress={() => addTextInput(textInput.length)} style={{ ...ADD_VEHICLE_BUTTON, ...MARGIN_TOP_EXTRA }}>
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
                                <UploadVehicle
                                    haveImage={Object.keys(fileFront).length ? true : false}
                                    deleteImage={() => setfileFront({})}
                                    onPress={() => _chooseFile('front')}
                                    viewImageStyle={Object.keys(fileFront).length ? MARGIN_TOP_EXTRA : MARGIN_TOP_MEDIUM}
                                    tx={Object.keys(fileFront).length ? '' : "uploadVehicleScreen.exampleImageFront"}
                                    txStyle={Object.keys(fileFront).length ? {} : { paddingTop: 5 }}
                                    uploadStyle={{ padding: 5, minHeight: 120 }}
                                    source={Object.keys(fileFront).length ? fileFront : images.addTruck2B}
                                    imageStyle={Object.keys(fileFront).length ? {} : PLACEHOLDER_IMAGE} />
                                <UploadVehicle
                                    haveImage={Object.keys(fileBack).length ? true : false}
                                    deleteImage={() => setfileBack({})}
                                    onPress={() => _chooseFile('back')}
                                    viewImageStyle={Object.keys(fileBack).length ? MARGIN_TOP_EXTRA : MARGIN_TOP_MEDIUM}
                                    tx={Object.keys(fileBack).length ? '' : "uploadVehicleScreen.exampleImageBack"}
                                    txStyle={Object.keys(fileBack).length ? {} : { paddingTop: 5 }}
                                    uploadStyle={{ padding: 5, minHeight: 120 }}
                                    source={Object.keys(fileBack).length ? fileBack : images.addTruck2F}
                                    imageStyle={Object.keys(fileBack).length ? {} : PLACEHOLDER_IMAGE} />
                            </View>
                            <View style={ROW_UPLOAD}>
                                <UploadVehicle
                                    haveImage={Object.keys(fileLeft).length ? true : false}
                                    deleteImage={() => setfileLeft({})}
                                    onPress={() => _chooseFile('left')}
                                    tx={Object.keys(fileLeft).length ? '' : "uploadVehicleScreen.exampleImageLeft"}
                                    viewImageStyle={Object.keys(fileLeft).length ? MARGIN_TOP_EXTRA : {}}
                                    txStyle={Object.keys(fileLeft).length ? {} : { paddingTop: 5 }}
                                    uploadStyle={{ padding: 5, minHeight: 120 }}
                                    source={Object.keys(fileLeft).length ? fileLeft : images.addTruck1}
                                    imageStyle={Object.keys(fileLeft).length ? {} : PLACEHOLDER_IMAGE2} />
                                <UploadVehicle
                                    haveImage={Object.keys(fileRight).length ? true : false}
                                    deleteImage={() => setfileRight({})}
                                    onPress={() => _chooseFile('right')}
                                    tx={Object.keys(fileRight).length ? '' : "uploadVehicleScreen.exampleImageRight"}
                                    viewImageStyle={Object.keys(fileRight).length ? MARGIN_TOP_EXTRA : {}}
                                    txStyle={Object.keys(fileRight).length ? {} : { paddingTop: 5 }}
                                    uploadStyle={{ padding: 5, minHeight: 120 }}
                                    source={Object.keys(fileRight).length ? fileRight : images.addTruck2}
                                    imageStyle={Object.keys(fileRight).length ? {} : PLACEHOLDER_IMAGE2} />
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
                                        label: translate("uploadVehicleScreen.region"),
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
                            </View>

                            <View style={{ ...WRAP_DROPDOWN, marginLeft: 5 }}>
                                <RNPickerSelect
                                    value={province}
                                    onValueChange={(value) => setprovince(value)}
                                    items={provinceList}
                                    placeholder={{
                                        label: translate("uploadVehicleScreen.province"),
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
                            </View>


                        </View>


                    </View>
                </View>




                <View style={{ ...TOP_VIEW, ...MARGIN_TOP_EXTRA }}>
                    <View style={WRAPPER_TOP}>
                        <RoundedButton onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
