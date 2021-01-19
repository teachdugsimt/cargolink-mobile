import React, { useState, useEffect } from "react"
import {
  View, ViewStyle, TextStyle,
  ScrollView, Switch, Dimensions, Platform, Alert, ImageStyle, PermissionsAndroid,
  SafeAreaView, SectionList, Image, TouchableOpacity
} from "react-native"
import { useForm, Controller } from "react-hook-form";
import { observer } from "mobx-react-lite"
import { Text, TextInputTheme, Button, UploadVehicle, RoundedButton, HeaderCenter, MultiSelector, ModalLoading } from "../../../components"
import { spacing, color, typography, images } from "../../../theme"

import RNPickerSelect from 'react-native-picker-select';
import { translate } from "../../../i18n"
import Ionicons from 'react-native-vector-icons/Ionicons'
import CreateVehicleStore from '../../../store/my-vehicle-store/create-vehicle-store'
// import ImagePicker from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { vehicleEn, vehicleTh, regionListEn, regionListTh, provinceListEn, provinceListTh } from './datasource'
import i18n from 'i18n-js'
import { useNavigation } from "@react-navigation/native"
import MyVehicleStore from '../../../store/my-vehicle-store/my-vehicle-store'
import StatusStore from '../../../store/my-vehicle-store/status-vehicle-store'
import UploadFileStore from '../../../store/my-vehicle-store/upload-file-store'
import TruckTypeStore from '../../../store/my-vehicle-store/truck-type-store'
import AddressStore from '../../../store/my-vehicle-store/address-store'
import { Modal, ModalContent, ModalFooter, ModalButton } from 'react-native-modals';
import { useStores } from "../../../models/root-store/root-store-context";

const { width, height } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const GREY_TEXT: TextStyle = { color: color.grey }

const WIDTH_WITH_MARGIN: ViewStyle = {
  width: width / 1.1
}
const SAFE_AREA_MODAL: ViewStyle = {
  ...WIDTH_WITH_MARGIN,
  height: 100
}
const CONTAINER_MODAL: ViewStyle = {
  ...FULL,
  ...WIDTH_WITH_MARGIN
}
const BORDER_MODAL_BUTTON: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: color.line
}
const BUTTON_MODAL1: ViewStyle = {
  ...WIDTH_WITH_MARGIN,
  ...BORDER_MODAL_BUTTON,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
}
const BUTTON_MODAL2: ViewStyle = {
  ...WIDTH_WITH_MARGIN,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
}
const TEXT_MODAL_BUTTON: TextStyle = {
  color: color.black, paddingLeft: 20
}

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
const ROW_TEXT: ViewStyle = {
  flexDirection: 'row',
}
const JUSTIFY_BETWEEN: ViewStyle = {
  justifyContent: 'space-between',
}
const PADDING_TOP: ViewStyle = { marginTop: 10 }
const PADDING_CHEVRON: ViewStyle = { paddingRight: 5 }
const ROOT_FLAT_LIST: ViewStyle = {
  width: '100%',
  height: 100,
  flexDirection: 'row',
  alignItems: 'center',
  zIndex: 5,
}
const ROOT_FLAT_LIST2: ViewStyle = {
  width: '100%',
  height: 60,
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



let initForm = 0
let initModal = Array(77).fill(false)
export const UploadVehicleScreen = observer((props) => {
  const navigation = useNavigation()
  const [toggleDump, settoggleDump] = useState(false)
  const { tokenStore } = useStores()

  const [visibleModal, setvisibleModal] = useState(initModal)
  const [stateData, setstateData] = useState(null)


  useEffect(() => {

    AddressStore.getRegion(i18n.locale)
    // AddressStore.getProvince(i18n.locale)
    TruckTypeStore.getTruckTypeDropdown(i18n.locale)


    let editStatus = JSON.parse(JSON.stringify(StatusStore.status))
    if (editStatus && editStatus == "edit") {
      navigation.setOptions({
        headerCenter: () => (
          <HeaderCenter tx={"common.edit"} />
        ),
      });
    }

    return () => {
      CreateVehicleStore.clearDataCreate()
      CreateVehicleStore.clearDataPatchVehicle()
      setsubmitReady(false)
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
    setSelectCapture(false)
    let options = {
      mediaType: type,
      maxWidth: 1024,
      maxHeight: 1024,
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

        let newImageResize = response
        if (status == "front") {
          newImageResize.id = 0
          _uploadFile(response, 'front')
          setfileFront(newImageResize);
        }
        else if (status == "back") {
          newImageResize.id = 1
          _uploadFile(response, 'back')
          setfileBack(newImageResize);
        }
        else if (status == "left") {
          newImageResize.id = 2
          _uploadFile(response, 'left')
          setfileLeft(newImageResize);
        }
        else if (status == "right") {
          newImageResize.id = 3
          _uploadFile(response, 'right')
          setfileRight(newImageResize);
        }

        // setFilePath(response);
      });
    }
  };


  const _uploadFile = (file, position) => {
    UploadFileStore.uploadImage(file, position)
  }
  const chooseFile = (type, status: string) => {
    setSelectCapture(false)
    let options = {
      mediaType: type,
      maxWidth: 1024,
      maxHeight: 1024,
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
      __DEV__ && console.tron.log('Image base64 -> ', response);

      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);

      let newImageResize = response
      if (status == "front") {
        newImageResize.id = 0
        _uploadFile(response, 'front')
        setfileFront(newImageResize);
      }
      else if (status == "back") {
        newImageResize.id = 1
        _uploadFile(response, 'back')
        setfileBack(newImageResize);
      }
      else if (status == "left") {
        newImageResize.id = 2
        _uploadFile(response, 'left')
        setfileLeft(newImageResize);
      }
      else if (status == "right") {
        newImageResize.id = 3
        _uploadFile(response, 'right')
        setfileRight(newImageResize);
      }
    });

  };








  const [visible, setvisible] = useState(false)
  const [visible0, setvisible0] = useState(false)

  const [fileFront, setfileFront] = useState({});
  const [fileBack, setfileBack] = useState({});
  const [fileLeft, setfileLeft] = useState({});
  const [fileRight, setfileRight] = useState({});

  const [positionFile, setpositionFile] = useState(null)

  const _chooseFile = (status) => {
    console.log("Status Image :: ", status)
    // chooseFile('photo', status)
    // captureImage('photo', status)
    setpositionFile(status)
    setSelectCapture(true)
  };









  const [inputRegistration, setinputRegistration] = useState({})
  console.log("Mapping data Here :: => ", MyVehicleStore.MappingData)
  const { control, handleSubmit, errors } = useForm({
    defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : MyVehicleStore.MappingData
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

  const [submitReady, setsubmitReady] = useState(false)

  const onSubmit = data => {
    let editStatus = JSON.parse(JSON.stringify(StatusStore.status))
    setinputRegistration(data)
    console.tron.log("Raw Form Data :: => ", data)

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

    const data_mock_call = {
      // id: tokenStore.profile.id,
      carrierId: editStatus == "add" ? tokenStore.profile.id : MyVehicleStore.data.id,
      truckType: data['vehicle-type'],

      loadingWeight: 2.5,
      // stallHeight: Number(parseFloat(data['vehicle-height']).toFixed(1)),
      stallHeight: data['vehicle-height'],


      tipper: toggleDump,
      registrationNumber: [],
      // "createdAt": "2020-12-25T07:14:23.687Z",
      // "updatedAt": "2020-12-25T07:14:23.687Z",
      // "approveStatus": "Pending",


      truckPhotos: {
        front: null,
        back: null,
        left: null,
        right: null
      },
      workingZones: [],
    }

    let uploadData = JSON.parse(JSON.stringify(UploadFileStore.data))
    __DEV__ && console.tron.log("Upload file data onSubmit Form :: ", uploadData)
    __DEV__ && console.log("Upload file data onSubmit Form :: ", uploadData)
    // ** EDIT 2
    const statusAction = JSON.parse(JSON.stringify(StatusStore.status))
    if (statusAction && statusAction == "edit") {

      // DELETE ZONE - NEW ZONE
      let initData = JSON.parse(JSON.stringify(MyVehicleStore.data))
      let objectTmpImage = {
        front: fileFront.uri ? fileFront.uri : null,
        back: fileBack.uri ? fileBack.uri : null,
        left: fileLeft.uri ? fileLeft.uri : null,
        right: fileRight.uri ? fileRight.uri : null
      }

      if (initData.truckPhotos.front && !objectTmpImage.front) {
        data_mock_call.truckPhotos.front = { url: null, action: 'DELETE' }
      } else if (initData.truckPhotos.front && objectTmpImage.front && initData.truckPhotos.front == objectTmpImage.front) {
        data_mock_call.truckPhotos.front = { url: objectTmpImage.front, action: "NOCHANGE" }
      }

      if (initData.truckPhotos.back && !objectTmpImage.back) {
        data_mock_call.truckPhotos.back = { url: null, action: 'DELETE' }
      } else if (initData.truckPhotos.back && objectTmpImage.back && initData.truckPhotos.back == objectTmpImage.back) {
        data_mock_call.truckPhotos.back = { url: objectTmpImage.back, action: "NOCHANGE" }
      }

      if (initData.truckPhotos.left && !objectTmpImage.left) {
        data_mock_call.truckPhotos.left = { url: null, action: 'DELETE' }
      } else if (initData.truckPhotos.left && objectTmpImage.left && initData.truckPhotos.left == objectTmpImage.left) {
        data_mock_call.truckPhotos.left = { url: objectTmpImage.left, action: "NOCHANGE" }
      }

      if (initData.truckPhotos.right && !objectTmpImage.right) {
        data_mock_call.truckPhotos.right = { url: null, action: 'DELETE' }
      } else if (initData.truckPhotos.right && objectTmpImage.right && initData.truckPhotos.right == objectTmpImage.right) {
        data_mock_call.truckPhotos.right = { url: objectTmpImage.right, action: "NOCHANGE" }
      }

      // REPLACE ZONE - NEW ZONE
      if (uploadData.length) {
        uploadData.map((e, i) => {
          if (e.position == "front") {

            if (!initData.truckPhotos.front && objectTmpImage.front) {
              data_mock_call.truckPhotos.front = { url: objectTmpImage.front, action: 'NEW' }
            } else if (initData.truckPhotos.front && objectTmpImage.front) {
              data_mock_call.truckPhotos.front = { url: e.url, action: 'REPLACE' }
            }

          } else if (e.position == "back") {

            if (!initData.truckPhotos.back && objectTmpImage.back) {
              data_mock_call.truckPhotos.back = { url: objectTmpImage.back, action: 'NEW' }
            } else if (initData.truckPhotos.back && objectTmpImage.back) {
              data_mock_call.truckPhotos.back = { url: e.url, action: 'REPLACE' }
            }

          } else if (e.position == "left") {

            if (!initData.truckPhotos.left && objectTmpImage.left) {
              data_mock_call.truckPhotos.left = { url: objectTmpImage.left, action: 'NEW' }
            } else if (initData.truckPhotos.left && objectTmpImage.left) {
              data_mock_call.truckPhotos.left = { url: e.url, action: 'REPLACE' }
            }

          } else if (e.position == "right") {

            if (!initData.truckPhotos.right && objectTmpImage.right) {
              data_mock_call.truckPhotos.right = { url: objectTmpImage.right, action: 'NEW' }
            } else if (initData.truckPhotos.right && objectTmpImage.right) {
              data_mock_call.truckPhotos.right = { url: e.url, action: 'REPLACE' }
            }

          }
        })
      }


    } else {
      let cnt = 0
      if (fileFront && Object.keys(fileFront).length) {
        let fileFrontTmp = uploadData.find(e => e.position == "front")
        if (fileFrontTmp) data_mock_call.truckPhotos.front = fileFrontTmp.url
        else cnt++
      }
      if (fileBack && Object.keys(fileBack).length) {
        let fileBackTmp = uploadData.find(e => e.position == "back")
        if (fileBackTmp) data_mock_call.truckPhotos.back = fileBackTmp.url
        else cnt++
      }
      if (fileLeft && Object.keys(fileLeft).length) {
        let fileLeftTmp = uploadData.find(e => e.position == "left")
        if (fileLeftTmp) data_mock_call.truckPhotos.left = fileLeftTmp.url
        else cnt++
      }
      if (fileRight && Object.keys(fileRight).length) {
        let fileRightTmp = uploadData.find(e => e.position == "right")
        if (fileRightTmp) data_mock_call.truckPhotos.right = fileRightTmp.url
        else cnt++
      }
      if (cnt == 4) data_mock_call.truckPhotos = null
    }
    let tmp_region = []
    let tmp_province = []
    let tmp_registration = []
    Object.keys(data).map(function (key) {
      if (key.includes("region"))
        tmp_region.push(data[key])
      if (key.includes("province"))
        tmp_province.push(data[key])
      if (key.includes('registration'))
        tmp_registration.push(data[key])
    })

    data_mock_call.registrationNumber = tmp_registration


    tmp_region.map((reg, ir) => {
      if (reg == 7) {
        data_mock_call['workingZones'].push({
          region: reg,
        })
      } else {
        data_mock_call['workingZones'].push({
          region: reg || "",
          province: tmp_province[ir] || ""
        })
      }

    })
    // data_mock_call['workingZones'] = [{ region: 1, province: 2 }]
    // console.log("Finish FINAL submit data :: ", data_mock_call)

    // let editStatus = JSON.parse(JSON.stringify(StatusStore.status))

    __DEV__ && console.tron.log("Finish FINAL submit data :: ", data_mock_call)
    if (editStatus && editStatus == "add") {
      CreateVehicleStore.createVehicleProfile(data_mock_call)
      setsubmitReady(true)
    }
    else {
      CreateVehicleStore.patchVehicleDetailsRequest(data_mock_call)
      setsubmitReady(true)
    }
    // navigation.navigate('uploadSuccess')
  }


  useEffect(() => {
    let data_create = JSON.parse(JSON.stringify(CreateVehicleStore.data))

    if (data_create && data_create != null && submitReady) {
      navigation.navigate('uploadSuccess')
    }

  }, [CreateVehicleStore.data])

  useEffect(() => {
    let data_patch = JSON.parse(JSON.stringify(CreateVehicleStore.patchMyVehicle))

    if (data_patch && data_patch != null && submitReady) {
      navigation.navigate('uploadSuccess')
    }

  }, [CreateVehicleStore.patchMyVehicle])


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
      settoggleDump(initData.tipper)
      if (initData.truckPhotos) {
        if (initData.truckPhotos.front) setfileFront({
          uri: initData.truckPhotos.front,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenStore.token.accessToken}`
          },
        })
        if (initData.truckPhotos.back) setfileBack({
          uri: initData.truckPhotos.back,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenStore.token.accessToken}`
          },
        })
        if (initData.truckPhotos.left) setfileLeft({
          uri: initData.truckPhotos.left,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenStore.token.accessToken}`
          },
        })
        if (initData.truckPhotos.right) setfileRight({
          uri: initData.truckPhotos.right,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenStore.token.accessToken}`
          },
        })
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
      if (editStatus && editStatus == "edit") {
        console.log("Initt data :: => ", initData)
        if (initData && initData.registrationNumber.length) {
          initData.registrationNumber.map((e, i) => {
            addTextInput(i)
          })
        }
      } else
        addTextInput(textInput.length)
      // addDropdown(dropdownRegion.length)
      if (editStatus && editStatus != "edit") {
        _addRowDropdown()
      }
    }

    return () => {
      UploadFileStore.deleteUploadData() // data = []
      initForm = 0
      settextInput([])
      setrenderNew(false)
    }
  }, [])


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


  const _renderSectionModal = (item: any, index: any, onChange: any) => {
    return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
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

  const _renderSectionModalProvince = (item: any, index: any, onChange: any, indexX: number) => {
    return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={{ ...ROOT_FLAT_LIST2 }} onPress={() => {
      onChange(item.id)
      // setvisible(false)
      _updateVisibleModal(false, indexX)
    }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: color.line, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginVertical: 20 }}>
          <Text style={{ width: '50%' }}>{item.name}</Text>
          <Ionicons name="chevron-forward" size={24} color={color.line} style={{ marginRight: 5 }} />
        </View>
      </View>
    </TouchableOpacity>
  }

  const _updateVisibleModal = (visibleX, index) => {
    let tmp = visibleModal
    tmp[index] = visibleX
    setvisible(!visible)
    setvisibleModal(tmp)
  }

  const [selectCapture, setSelectCapture] = useState(false)

  const list_province_popular = [
    {
      title: 'postJobScreen.popular',
      data: [{ id: 1, name: 'กรุงเทพมหานคร' },
      { id: 10, name: 'เชียงใหม่' },
      { id: 48, name: 'ภูเก็ต' }]
    },
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
  let formControllerValue = control.getValues()
  let dropdown_vehicle_type
  if (formControllerValue['vehicle-type'] && formControllerValue['vehicle-type']) {
    dropdown_vehicle_type = formControllerValue['vehicle-type']
  }
  __DEV__ && console.tron.logImportant("Form in render :: ", formControllerValue)
  // __DEV__ && console.tron.logImportant("Controller pure : ", control.setValue())
  __DEV__ && console.tron.log("Fetching Trucktype :: ", TruckTypeStore.loading)
  let list_vehicle = JSON.parse(JSON.stringify(TruckTypeStore.data))

  return (
    <View testID="UploadVehicleScreen" style={FULL}>

      <ModalLoading
        containerStyle={{ zIndex: 2 }}
        size={'large'} color={color.primary} visible={TruckTypeStore.loading || UploadFileStore.loading ||
          CreateVehicleStore.loading || CreateVehicleStore.loadingPatchMyVehicle} />

      <ScrollView testID={"scrollViewUpload"} style={FULL}>

        {/* {JSON.parse(JSON.stringify(TruckTypeStore.loading)) || JSON.parse(JSON.stringify(AddressStore.loading)) && <ModalLoading size={'large'} color={color.primary} visible={JSON.parse(JSON.stringify(TruckTypeStore.loading)) || JSON.parse(JSON.stringify(AddressStore.loading))} />} */}




        <Modal
          visible={selectCapture}
          onTouchOutside={() => setSelectCapture(false)}
          onSwipeOut={() => setSelectCapture(false)}
          onDismiss={() => setSelectCapture(false)}
          swipeDirection={['up', 'down']} // can be string or an array
          swipeThreshold={100} // default 100
        >
          <SafeAreaView style={SAFE_AREA_MODAL}>
            <View style={CONTAINER_MODAL}>
              <TouchableOpacity style={BUTTON_MODAL1} onPress={() => captureImage("photo", positionFile)}>
                <View style={ROW_TEXT}>
                  <Ionicons name="camera" size={20} color={color.primary} />
                  <Text style={TEXT_MODAL_BUTTON} tx={"uploadVehicleScreen.captureNew"} /></View>
              </TouchableOpacity>
              <TouchableOpacity style={BUTTON_MODAL2} onPress={() => chooseFile("photo", positionFile)}>
                <View style={ROW_TEXT}>
                  <Ionicons name="library" size={20} color={color.primary} />
                  <Text style={TEXT_MODAL_BUTTON} tx={"uploadVehicleScreen.selectFromLibrary"} /></View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>




        <View style={TOP_VIEW}>

          <View style={WRAPPER_TOP}>
            <Text tx={"uploadVehicleScreen.selectVehicleType"} style={{ ...TITLE_TOPIC, ...MARGIN_TOP_BIG }} />
            <View style={WRAP_DROPDOWN}>




              <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible0(true)}>
                {!dropdown_vehicle_type && <Text style={{ padding: 10 }} tx={"postJobScreen.pleaseSelectVehicleType"} />}
                {dropdown_vehicle_type && TruckTypeStore.data && TruckTypeStore.data.length && <Text style={{ padding: 10 }}>{JSON.parse(JSON.stringify(TruckTypeStore.data)).find(e => e.id == dropdown_vehicle_type).name}</Text>}
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
                              sections={list_vehicle_popular ? list_vehicle_popular : []}
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



        <View style={{ ...TOP_VIEW, ...MARGIN_TOP }}>
          <View style={WRAPPER_TOP}>
            <Text tx={"uploadVehicleScreen.workZone"} style={TITLE_TOPIC}>Upload Vehicle 15151515</Text>











            {/* ********************** DROPDOWN ZONE ********************** */}
            {ddRegion.length && AddressStore.region && AddressStore.region.length ? ddRegion.map((e, index) => {
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
                          // items={i18n.locale == "en" ? regionListEn : regionListTh}
                          items={JSON.parse(JSON.stringify(AddressStore.region))}
                          placeholder={{
                            label: translate("uploadVehicleScreen.region"),
                            color: color.black
                          }}
                          useNativeAndroidPickerStyle={false}
                          style={{
                            inputAndroid: { ...CONTENT_TEXT }, inputIOS: { ...CONTENT_TEXT },
                            iconContainer: Platform.OS == "ios" ? {} : { ...DROPDOWN_ICON_CONTAINER },
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












                  if (indexPro == index && valRegion[index] != 7) {

                    // __DEV__ && console.tron.log("PROVINCE :: ", formControllerValue["controller-province-" + index])
                    return (<View style={{ ...WRAP_DROPDOWN, marginLeft: 5 }} key={'view-dropdown-province-' + index}>



                      <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN, Platform.OS == "ios" ? {} : {
                        paddingTop: 10
                      }]} onPress={async () => {
                        __DEV__ && console.tron.log("REGION :: ", index)
                        await AddressStore.getProvince({ regionId: valRegion[index] }, i18n.locale)
                        _updateVisibleModal(true, index)
                        // setvisible(true)
                      }}>
                        {!formControllerValue["controller-province-" + index] && <Text style={CONTENT_TEXT} tx={"uploadVehicleScreen.pleaseSelectProvince"} />}

                        {!!formControllerValue["controller-province-" + index] && <Text style={CONTENT_TEXT} >{
                          i18n.locale == 'th' ?
                            provinceListTh.find(e => e.value == formControllerValue["controller-province-" + index]).label :
                            provinceListEn.find(e => e.value == formControllerValue["controller-province-" + index]).label
                        }</Text>}

                        <Ionicons name="chevron-down" size={20} style={PADDING_CHEVRON} />
                      </TouchableOpacity>

                      <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                          <Modal
                            visible={visibleModal[index]}
                            onTouchOutside={() => _updateVisibleModal(false, index)}
                            onSwipeOut={() => _updateVisibleModal(false, index)}
                            swipeDirection={['up', 'down']} // can be string or an array
                            swipeThreshold={200} // default 100
                          >
                            <ModalContent >
                              <View style={{ width: (width / 1.1), height: '100%', justifyContent: 'flex-start' }}>
                                <SafeAreaView style={{ flex: 1 }}>
                                  <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: color.primary }} preset={"topic"} tx={"uploadVehicleScreen.pleaseSelectProvince"} />
                                  </View>

                                  <View style={PADDING_TOP}>
                                    {AddressStore.province && AddressStore.province.length && <MultiSelector
                                      key={"dd-province-" + index}
                                      items={JSON.parse(JSON.stringify(AddressStore.province))}
                                      keyer={"list-province-" + index}
                                      selectedItems={[value]}
                                      selectText={translate("uploadVehicleScreen.pleaseSelectProvince")}
                                      onSelectedItemsChange={(val: any) => {
                                        onChange(val[0])
                                        _updateVisibleModal(false, index)
                                      }}
                                    />}
                                  </View>

                                  <View>
                                    <SectionList
                                      sections={list_province_popular ? list_province_popular : []}
                                      keyExtractor={(item, indexX) => 'section-list-' + item.name + indexX}
                                      renderItem={(data) => _renderSectionModalProvince(data.item, data.index, onChange, index)}
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
                        key={'controller-dropdown-province-' + index}
                        name={"controller-province-" + index}
                        defaultValue=""
                      />






                    </View>)
                  }
                }) : <></>














                }
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













