import React, { useState, useEffect } from "react"
import {
  View, ViewStyle, TextStyle,
  ScrollView, Switch, Dimensions, Platform, Alert, ImageStyle, PermissionsAndroid
} from "react-native"
import { useForm, Controller } from "react-hook-form";
import { observer } from "mobx-react-lite"
import { Text, TextInputTheme, Button, UploadVehicle, RoundedButton, HeaderCenter } from "../../../components"
import { spacing, color, typography, images } from "../../../theme"

import RNPickerSelect from 'react-native-picker-select';
import { translate } from "../../../i18n"
import Ionicons from 'react-native-vector-icons/Ionicons'
import FetchStore from '../../../store/fetch-store/fetch-store'
import CreateVehicleStore from '../../../store/my-vehicle-store/create-vehicle-store'
// import ImagePicker from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { vehicleEn, vehicleTh, regionListEn, regionListTh, provinceListEn, provinceListTh } from './datasource'
import i18n from 'i18n-js'
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native"
import MyVehicleStore from '../../../store/my-vehicle-store/my-vehicle-store'
import StatusStore from '../../../store/my-vehicle-store/status-vehicle-store'

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
  flex: 1, borderColor: color.grey, borderWidth: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
  borderRadius: 2.5
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

const ADD_DROPDOWN_REGION: ViewStyle = {
  alignSelf: 'flex-end',
  paddingLeft: 10,
  paddingTop: Platform.OS == "ios" ? 8 : 12
}

const WRAPPER_REGION_DROPDOWN: ViewStyle = {
  ...MARGIN_BOTTOM_BIG,
  ...ROW_UPLOAD,
}

let initForm = 0
export const UploadVehicleScreen = observer((props) => {
  const navigation = useNavigation()
  const [toggleDump, settoggleDump] = useState(false)
  // const [carRegistration, setcarRegistration] = useState('')
  // const [province, setprovince] = useState([])
  // const [region, setregion] = useState([])

  const [stateData, setstateData] = useState(null)


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



  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        Alert.alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type, status: string) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          Alert.alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          Alert.alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          Alert.alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          Alert.alert(response.errorMessage);
          return;
        }
        console.log('base64 -> ', response.base64);
        console.log('uri -> ', response.uri);
        console.log('width -> ', response.width);
        console.log('height -> ', response.height);
        console.log('fileSize -> ', response.fileSize);
        console.log('type -> ', response.type);
        console.log('fileName -> ', response.fileName);

        ImageResizer.createResizedImage(response.uri, 1024, 1024, 'JPEG', 100, 0, null)
          .then((response) => {
            // ****** Send this to API ******
            const newImageResize = {
              uri: response.uri,
              type: 'image/jpeg',
              name: response.name,
              size: response.size,
              tmp_name: response.path
            }
            if (status == "front") setfileFront(newImageResize);
            else if (status == "back") setfileBack(newImageResize);
            else if (status == "left") setfileLeft(newImageResize);
            else if (status == "right") setfileRight(newImageResize);
            // ****** Send this to API ******

          }).catch((err) => {
            console.log("Image Resize Error :: => ", err)
          });

        // setFilePath(response);
      });
    }
  };

  const chooseFile = (type, status: string) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);

      ImageResizer.createResizedImage(response.uri, 1024, 1024, 'JPEG', 100, 0, null)
        .then((response) => {
          // ****** Send this to API ******
          const newImageResize = {
            uri: response.uri,
            type: 'image/jpeg',
            name: response.name,
            size: response.size,
            tmp_name: response.path
          }
          if (status == "front") setfileFront(newImageResize);
          else if (status == "back") setfileBack(newImageResize);
          else if (status == "left") setfileLeft(newImageResize);
          else if (status == "right") setfileRight(newImageResize);
          // ****** Send this to API ******

        }).catch((err) => {
          console.log("Image Resize Error :: => ", err)
        });

      // setFilePath(response);
    });

  };









  const [fileFront, setfileFront] = useState({});
  const [fileBack, setfileBack] = useState({});
  const [fileLeft, setfileLeft] = useState({});
  const [fileRight, setfileRight] = useState({});

  const _chooseFile = (status) => {
    console.log("Status Image :: ", status)
    chooseFile('photo', status)
    // captureImage('photo', status)
  };










  const [inputRegistration, setinputRegistration] = useState({})
  console.log("Mapping data Here :: => ", MyVehicleStore.MappingData)
  const { control, handleSubmit, errors } = useForm({
    defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : MyVehicleStore.MappingData
    //     {
    //     // ** Initial value
    //     "vehicle-type": "4 Wheels - High Stall Truck",  // must be use English value Only
    //     "vehicle-height": '3',
    //     "registration-0": "1234-xx",
    //     "controller-region-0" : "north",
    //     "controller-province-0": "Chaing Mai",
    // }

  });

  const _alert = (field) => {
    Alert.alert(
      translate('common.pleaseInputCorrect'),
      i18n.locale == "en" ? `Field ${field} was null` : `กรุณาใส่ ${field} ให้ถูกต้อง`,
      [
        {
          text: translate('common.ok'), onPress: () => { }
        }
      ]
      , { cancelable: false }
    )
    return;
  }

  const onSubmit = data => {
    setinputRegistration(data)
    console.log("Form data :: => ", data)

    if (!data['vehicle-type']) {
      _alert(translate('common.vehicleTypeField'))
      return;
    }
    else if (!data['vehicle-height']) {
      _alert(translate('common.vehicleHeightField'))
      return;
    }
    else if (!data['registration-0']) {
      _alert(translate('common.registrationVehicleField'))
      return;
    }
    // else if (!data['controller-region-0']) {
    //   _alert(translate('common.regionField'))
    //   return;
    // }


    const data_mock_call = {
      car_type: data['vehicle-type'],
      have_dump: toggleDump,
      vehicle_height: data['vehicle-height'],
      registrationNumber: [],
      images: [],
      workingZones: [],
    }

    if (data['registration-0']) data_mock_call.registrationNumber.push(data['registration-0'])

    if (fileFront && Object.keys(fileFront).length) data_mock_call.images.push(fileFront)
    if (fileBack && Object.keys(fileBack).length) data_mock_call.images.push(fileBack)
    if (fileLeft && Object.keys(fileLeft).length) data_mock_call.images.push(fileLeft)
    if (fileRight && Object.keys(fileRight).length) data_mock_call.images.push(fileRight)

    let tmp_region = []
    let tmp_province = []
    Object.keys(data).map(function (key) {
      if (key.includes("region"))
        tmp_region.push(data[key])
      if (key.includes("province"))
        tmp_province.push(data[key])
    })
    tmp_region.map((reg, ir) => {
      data_mock_call['workingZones'].push({
        province: reg,
        region: tmp_province[ir] ? tmp_province[ir] : ""
      })
    })
    console.log("Finish FINAL submit data :: ", data_mock_call)

    let editStatus = JSON.parse(JSON.stringify(StatusStore.status))

    if (editStatus && editStatus == "add") {
      CreateVehicleStore.createVehicleProfile(data_mock_call)
    }
    else {
      CreateVehicleStore.patchVehicleDetailsRequest(data_mock_call)
    }
    navigation.navigate('uploadSuccess')
  }



  const [textInput, settextInput] = useState([])
  // const [dropdownRegion, setdropdownRegion] = useState([])

  const [renderNew, setrenderNew] = useState(false)

  //function to add TextInput dynamically
  const addTextInput = (index) => {
    let textInputTmp = textInput;
    textInputTmp.push(<Controller
      control={control}
      render={({ onChange, onBlur, value }) => (
        <TextInputTheme
          testID={"registration-vehicle-input"}
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

    let initData = JSON.parse(JSON.stringify(MyVehicleStore.data))
    let editStatus = JSON.parse(JSON.stringify(StatusStore.status))
    if (editStatus && editStatus == "edit") {
      settoggleDump(initData.have_dump)
      if (initData.images && initData.images.length) {
        if (initData.images[0]) setfileFront({ uri: initData.images[0].url })
        if (initData.images[1]) setfileBack({ uri: initData.images[1].url })
        if (initData.images[2]) setfileLeft({ uri: initData.images[2].url })
        if (initData.images[3]) setfileRight({ uri: initData.images[3].url })
      }

      if (initData.workingZones && initData.workingZones.length) {
        let tmpDropdownRegion = ddRegion
        let tmpDropdownProvince = ddProvince

        let valRegionTmp = valRegion
        initData.workingZones.forEach((e, index) => {
          tmpDropdownRegion.push({
            id: index + 1,
            index: index,
            type: 'region'
          })
          tmpDropdownProvince.splice(index, 1, {
            id: index + 1,
            index: index,
            type: 'province'
          })

          valRegionTmp[index] = e.region
        })
        // setddRegion(tmpDropdownRegion)
        setddProvince(tmpDropdownProvince)
        setrenderProvince(!renderProvince)
        // setrenderNewRegion(!renderNewRegion)
      }
      console.log("INITIAL DATA UPLOAD SCREEN :: ", initData)
      console.log("INITIAL DATA UPLOAD SCREEN :: ", initData)
    }

    if (initForm == 0) {
      initForm = 1
      addTextInput(textInput.length)
      // addDropdown(dropdownRegion.length)
      if (editStatus && editStatus != "edit") {
        _addRowDropdown()
      }
    }
    console.log("Mobx state data : : ", JSON.parse(JSON.stringify(FetchStore.getUserData)))
    console.log("State data :: ", stateData)
    FetchStore.getUserRequest()
    return () => {
      initForm = 0
      settextInput([])
      setrenderNew(false)
    }
  }, [])

  useEffect(() => {
    let tmp = JSON.parse(JSON.stringify(FetchStore.getUserData))
    console.log("Fetch Store :: ", JSON.parse(JSON.stringify(FetchStore.data)))
    if (tmp.length && tmp != stateData) {
      setstateData(tmp)
      console.log("Fetstore data : ", JSON.parse(JSON.stringify(tmp)))
    }
    return () => {
      setstateData(null)
    }
    // }, [FetchStore.data])
  }, [FetchStore.data])

  const [valRegion, setvalRegion] = useState([])
  const [ddRegion, setddRegion] = useState([])

  const [ddProvince, setddProvince] = useState([])

  const [renderNewRegion, setrenderNewRegion] = useState(false)
  const [renderProvince, setrenderProvince] = useState(true)
  const _addRowDropdown = () => {
    let tmpDropdownRegion = ddRegion
    tmpDropdownRegion.push({
      id: ddRegion.length + 1,
      index: ddRegion.length,
      type: 'region'
    })
    setddRegion(tmpDropdownRegion)
    setrenderNewRegion(!renderNewRegion)
  }
  // console.log("Dropdown region :: => ", dropdownRegion)
  console.log("Dropdown Province DD  :: ", ddProvince)
  console.log("Dropdown Regions VALUE :: ", valRegion)
  return (
    <View testID="UploadVehicleScreen" style={FULL}>
      <ScrollView testID={"scrollViewUpload"} style={FULL}>

        <View style={TOP_VIEW}>
          <View style={WRAPPER_TOP}>
            <Text tx={"uploadVehicleScreen.selectVehicleType"} style={{ ...TITLE_TOPIC, ...MARGIN_TOP_BIG }} />
            <View style={WRAP_DROPDOWN}>
              <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                  <RNPickerSelect
                    testID={"picker_vehicle_type"}
                    value={value}
                    onValueChange={(value) => onChange(value)}
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
                )}
                key={'controller-dropdown-vehicle-type'}
                name={"vehicle-type"}
                defaultValue=""
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
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <TextInputTheme
                  testID={"upload-vehicle-height"}
                  inputStyle={MARGIN_TOP_BIG} value={value} onChangeText={(text) => onChange(text)} />
              )}
              key={'text-input-vehicle-height'}
              name={"vehicle-height"}
              defaultValue=""
            />
          </View>
        </View>

        <View style={{ ...TOP_VIEW, ...MARGIN_TOP }}>
          <View style={WRAPPER_TOP}>
            <Text tx={"uploadVehicleScreen.detailVehicle"} style={TITLE_TOPIC} />
            <Text tx={"uploadVehicleScreen.atLeastOneRegister"} style={{ ...CONTENT_TEXT, ...ALIGN_RIGHT }}></Text>

            <Text tx={"uploadVehicleScreen.carRegistration"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_BIG }} />






            <View>
              {textInput.map(e => { return e })}
            </View>
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
        { }


        <View style={{ ...TOP_VIEW, ...MARGIN_TOP }}>
          <View style={WRAPPER_TOP}>
            <Text tx={"uploadVehicleScreen.workZone"} style={TITLE_TOPIC}>Upload Vehicle 15151515</Text>











            {/* ********************** DROPDOWN ZONE ********************** */}
            {ddRegion.length ? ddRegion.map((e, index) => {
              return <View key={'view-dropdown-region-' + index} style={WRAPPER_REGION_DROPDOWN}>
                <View style={{ ...WRAP_DROPDOWN, marginLeft: 5 }} key={'view-dropdown-province-' + index}>
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => {
                      return (
                        <RNPickerSelect
                          value={value}
                          onValueChange={(value) => {
                            onChange(value)

                            console.log("Select Value Drpodown Regions : ", value)

                            let valRegionTmp = valRegion
                            valRegionTmp.splice(index, 1, value)
                            setvalRegion(valRegionTmp)

                            let tmpDropdownProvince = ddProvince
                            tmpDropdownProvince.splice(index, 1, {
                              id: index + 1,
                              index: index,
                              type: 'province'
                            })
                            setddProvince(tmpDropdownProvince)

                            setrenderProvince(!renderProvince)

                          }}
                          items={i18n.locale == "en" ? regionListEn : regionListTh}
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
                      )
                    }}
                    key={'controller-dropdown-region-' + index}
                    name={"controller-region-" + index}
                    defaultValue=""
                  /></View>

                {ddProvince.length ? ddProvince.map((pro, indexPro) => {
                  console.log("All Val region :: ", valRegion)
                  console.log("Render Dropdown Province :: ", valRegion[index])
                  if (indexPro == index)
                    return (<View style={{ ...WRAP_DROPDOWN, marginLeft: 5 }} key={'view-dropdown-province-' + index}><Controller
                      control={control}
                      render={({ onChange, onBlur, value }) => {
                        return (
                          <RNPickerSelect
                            value={value}
                            onValueChange={(value) => onChange(value)}
                            items={i18n.locale == "en" ?
                              (valRegion[index] ? provinceListEn.filter(e => e.region == valRegion[index]) : provinceListEn) :
                              (valRegion[index] ? provinceListTh.filter(e => e.region == valRegion[index]) : provinceListTh)}
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
                        )
                      }}
                      key={'controller-dropdown-province-' + index}
                      name={"controller-province-" + index}
                      defaultValue=""
                    /></View>)
                }) : <></>}
                {index == ddRegion.length - 1 && <TouchableOpacity key={'icon-add-circle-' + index} style={ADD_DROPDOWN_REGION} onPress={() => _addRowDropdown()}>
                  <Ionicons size={22} color={color.darkGreen} name={"add-circle-outline"} />
                </TouchableOpacity>}
              </View>

            }) : <></>}
            {/* ********************** DROPDOWN ZONE ********************** */}













          </View>
        </View>



        <View style={{ ...TOP_VIEW, ...MARGIN_TOP_EXTRA }}>
          <View style={WRAPPER_TOP}>
            <RoundedButton testID={"submit-vehicle"} onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
})













