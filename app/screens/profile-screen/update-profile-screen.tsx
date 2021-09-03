import React, { useEffect, useState } from "react"
import {
  View, ViewStyle, TextStyle, TouchableOpacity,
  SafeAreaView, Dimensions, Image, KeyboardAvoidingView, Alert, Platform, PermissionsAndroid
} from "react-native"
import { observer } from "mobx-react-lite"
import { Text, TextInputTheme, RoundedButton, ModalLoading, Screen, NormalDropdown } from "../../components"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native"
import { color, images, typography } from "../../theme"
import { Modal } from 'react-native-modals';
import { ScrollView } from "react-native-gesture-handler"
import ProfileStore from '../../store/profile-store/profile-store'
import { useStores } from "../../models/root-store/root-store-context";
import { AlertMessage } from "../../utils/alert-form";
import { translate } from "../../i18n"
import AuthStore from "../../store/auth-store/auth-store"
import { API_URL } from '../../config/'
import { useRoute } from '@react-navigation/core';

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const COLOR_PRIMARY: TextStyle = { color: color.primary }
const COLOR_LINE: TextStyle = { color: color.line }
const PADDING_VERTICAL: TextStyle = { paddingVertical: 10 }
const PADDING_TOP_10: ViewStyle = { paddingTop: 10 }
const PADDING_TOP_20: ViewStyle = { paddingTop: 20 }
const MARGIN_HORI_10: ViewStyle = { marginHorizontal: 10 }
const BORDER_BOTTOM: ViewStyle = { borderBottomWidth: 1, borderBottomColor: color.mainGrey }
const VIEW_SUGGEST: ViewStyle = { ...MARGIN_HORI_10, ...BORDER_BOTTOM }
const ROW_TEXT: ViewStyle = {
  flexDirection: 'row',
}

const TOP_VIEW_2: ViewStyle = {
  backgroundColor: color.textWhite,
}
const CONTENT_TEXT: TextStyle = {
  fontFamily: 'Kanit-Medium',
  color: color.black,
  fontSize: typography.content
}
const WIDTH_WITH_MARGIN: ViewStyle = {
  width: width / 1.1
}
const MARGIN_MEDIUM: ViewStyle = {
  marginVertical: 10
}
const SAFE_AREA_MODAL: ViewStyle = {
  ...WIDTH_WITH_MARGIN,
  height: 100
}
const CONTAINER_MODAL: ViewStyle = {
  ...FULL,
  ...WIDTH_WITH_MARGIN
}
const RED_COLOR: ViewStyle = { color: color.red }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
const BORDER_MODAL_BUTTON: ViewStyle = {
  borderBottomWidth: 1,
  borderBottomColor: color.mainGrey
}
const WRAPPER_TOP: ViewStyle = {
  padding: 10
}
const BUTTON_MODAL1: ViewStyle = {
  ...WIDTH_WITH_MARGIN,
  ...BORDER_MODAL_BUTTON,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
}
const LAYOUT_REGISTRATION_FIELD: TextStyle = {
  textAlign: 'right', paddingRight: 10,
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.textWhite
}
const TEXT_MODAL_BUTTON: TextStyle = {
  color: color.black, paddingLeft: 20
}
const BUTTON_MODAL2: ViewStyle = {
  ...WIDTH_WITH_MARGIN,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
}

const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.primary, borderColor: color.transparent
}
const BACKGROUND_WHITE: ViewStyle = { backgroundColor: color.textWhite }
interface Options {
  mediaType: string
  maxWidth: number
  maxHeight: number
  quality: number
}
const options: Options = {
  mediaType: 'photo',
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 1,
};
export const UpdateProfileScreen = observer(function UpdateProfileScreen() {

  const navigation = useNavigation()
  const [selectCapture, setSelectCapture] = useState(false)
  const [imageProfile, setImageProfile] = useState(null)
  const { tokenStore } = useStores()

  const route = useRoute()
  const { fromOtp } = route?.params ? JSON.parse(JSON.stringify(route?.params)) : { fromOtp: null }

  __DEV__ && console.tron.logImportant(`FROM OTP : ${fromOtp}` || 'NO FROM OTP')

  const _uploadFile = (response) => {
    __DEV__ && console.tron.log("Response File before upload :: ", response)
    // UploadFileStore.uploadImage(file, position)
    ProfileStore.uploadPicture(response)
  }

  useEffect(() => {
    let tmp_profile = JSON.parse(JSON.stringify(ProfileStore.data))
    if (tmp_profile && tmp_profile.avatar) setImageProfile({
      uri: `${API_URL}/api/v1/media/file-stream?attachCode=` + tmp_profile.avatar,
      method: 'GET',
      headers: {
        Accept: 'image/*'
      },
    })
  }, [ProfileStore.data])

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

  const captureImage = async () => {
    setSelectCapture(false)

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

        _uploadFile(response)
        setImageProfile(response);

      });
    }
  };

  const chooseFile = () => {
    setSelectCapture(false)
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

      _uploadFile(response)
      setImageProfile(response);
    });

  };

  const { control, handleSubmit, errors } = ProfileStore?.data?.id ? useForm({
    defaultValues: ProfileStore.ProfileData
  }) : useForm({ defaultValues: AuthStore.ProfileData })

  const onSubmit = (data) => {
    __DEV__ && console.tron.log("Raw data :: ", data)
    let tmp_profile_store = JSON.parse(JSON.stringify(ProfileStore.data))
    let finalData = {
      "fullName": data["name-lastname"],
      "phoneNumber": data["phone-number"],
      "avatar": null,
      "email": data["email"],
      "userId": tokenStore.profile.userId,
      "userType": data["user-type"]
    }
    if (!fromOtp && imageProfile) finalData['avatar'] = ProfileStore?.data_upload_picture?.token || tmp_profile_store.avatar
    else if (fromOtp && imageProfile) {
      let tmpProfileFromOtp: any = AuthStore.ProfileData
      finalData['avatar'] = ProfileStore?.data_upload_picture?.token || tmpProfileFromOtp.avatar
    }
    ProfileStore.updateProfile(finalData)

    if (fromOtp) {
      let profileFromOtp = AuthStore.ProfileData
      if (profileFromOtp['accept-policies']) navigation.navigate('Home', { screen: 'home' })
      else navigation.navigate('acceptPolicy')
    }
  }

  useEffect(() => {
    // if (fromOtp) ProfileStore.getProfileRequest(fromOtp)
    let tmp_profile: any = AuthStore.ProfileData
    if (tmp_profile && tmp_profile.avatar) setImageProfile({
      uri: `${API_URL}/api/v1/media/file-stream?attachCode=` + tmp_profile.avatar,
      method: 'GET',
      headers: {
        Accept: 'image/*'
      },
    })
    return () => {
      ProfileStore.clearData()
      ProfileStore.getProfileRequest(AuthStore.profile?.userProfile?.userId || tokenStore.profile.userId)
    }
  }, [])

  useEffect(() => {
    // if (fromOtp) ProfileStore.getProfileRequest("DLG448ZX")
  }, [fromOtp])

  useEffect(() => {
    let tmp_update = JSON.parse(JSON.stringify(ProfileStore.data_update_profile))
    if (tmp_update && tmp_update != null) {
      AlertMessage(translate('common.successTransaction'), translate('common.updateSuccess'))
      ProfileStore.clearUpdateData('data_update_profile')
    }
  }, [ProfileStore.data_update_profile])

  useEffect(() => {
    let error_update = JSON.parse(JSON.stringify(ProfileStore.error_update_profile))
    if (error_update && error_update != null) {
      if (error_update == "Invalid entry for email address") AlertMessage(translate('common.somethingWrong'), translate('common.invalidEmail'))
      else AlertMessage(translate('common.somethingWrong'), translate('common.pleaseCheckYourData'))
      ProfileStore.clearUpdateData('error_update_profile')
    }
  }, [ProfileStore.error_update_profile])


  let formControllerValue = control.getValues()
  __DEV__ && console.tron.logImportant("Form in render :: ", formControllerValue)

  let tmp_profile = JSON.parse(JSON.stringify(ProfileStore.data))
  __DEV__ && console.tron.logImportant("Profile Data :: ", tmp_profile)

  const role_array = [{ label: translate('homeScreen.carriers'), value: 0 },
  { label: translate('homeScreen.shippers'), value: 1 },
  { label: translate('homeScreen.both'), value: 2 }]


  return <View testID="UpdateProfileScreen" style={FULL}>
    <Screen preset={'scroll'} unsafe>
      <ScrollView style={FULL}>
        <View style={[PADDING_TOP_20, BACKGROUND_WHITE]}>
          <View style={VIEW_SUGGEST}>
            <Text tx={"profileScreen.weSuggest"} style={COLOR_PRIMARY} />
            <Text tx={"profileScreen.fullSuggestText"} style={[COLOR_LINE, PADDING_VERTICAL]} />
          </View>
        </View>

        <ModalLoading
          containerStyle={{ zIndex: 2 }}
          size={'large'} color={color.primary} visible={(ProfileStore.loading || ProfileStore.loading_update_profile)} />

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
              <TouchableOpacity style={BUTTON_MODAL1} onPress={() => captureImage()}>
                <View style={ROW_TEXT}>
                  <Ionicons name="camera" size={20} color={color.primary} />
                  <Text style={TEXT_MODAL_BUTTON} tx={"uploadVehicleScreen.captureNew"} /></View>
              </TouchableOpacity>
              <TouchableOpacity style={BUTTON_MODAL2} onPress={() => chooseFile()}>
                <View style={ROW_TEXT}>
                  <Ionicons name="library" size={20} color={color.primary} />
                  <Text style={TEXT_MODAL_BUTTON} tx={"uploadVehicleScreen.selectFromLibrary"} /></View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        <View style={[FULL, BACKGROUND_WHITE]}>


          <View style={MARGIN_HORI_10}>
            <View style={PADDING_TOP_20}>

              <View style={{ flexDirection: 'row' }}>
                <Text>1.</Text>
                <Text tx={"profileScreen.uploadYourPic"} />
              </View>

              <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <TouchableOpacity onPress={() => setSelectCapture(true)}>
                  <View>
                    {!!imageProfile && <TouchableOpacity style={{ alignItems: 'flex-end', position: 'absolute', top: 0, right: 0, zIndex: 2 }} onPress={() => setImageProfile(null)}>
                      <Ionicons name={"close"} size={22} color={color.error} />
                    </TouchableOpacity>}
                    {/* <Image source={imageProfile ? imageProfile : images.addProfilePic} resizeMode="stretch" style={{ maxHeight: 120, maxWidth: 120 }} /> */}
                    <Image source={(imageProfile ? imageProfile : images.addProfilePic)} resizeMode="stretch" style={{ width: 120, height: 120 }} />
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </View>

          <View style={MARGIN_HORI_10}>
            <View style={PADDING_TOP_20}>
              <View style={{ flexDirection: 'row' }}>
                <Text>2.</Text>
                <Text tx={"profileScreen.inputMoreDetail"} />
              </View>


              <View style={PADDING_TOP_10}>
                <View style={{ flexDirection: 'row' }}>
                  <Text tx={"profileScreen.nameLastName"} />
                  <Text style={{ color: color.error }}> *</Text>
                </View>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"name-lastname-input"}
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }}
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                    />
                  )}
                  key={"key-name-lastname"}
                  name={"name-lastname"}
                  rules={{ required: true }}
                  defaultValue=""
                />
              </View>
              {errors['name-lastname'] && <Text style={{ color: color.red }} tx={"profileScreen.inputName"} />}

              <View style={PADDING_TOP_10}>
                <Text tx={"profileScreen.phoneNumber"} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"phone-number-input"}
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }}
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                    />
                  )}
                  key={"key-phone-number"}
                  name={"phone-number"}
                  defaultValue=""
                />
              </View>

              <View style={PADDING_TOP_10}>
                <Text tx={"profileScreen.email"} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"email-input"}
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }}
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={value}
                    />
                  )}
                  key={"key-email"}
                  name={"email"}
                  defaultValue=""
                />
              </View>

              <View style={PADDING_TOP_10}>
                <Text tx={"common.userType"} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <NormalDropdown
                      key={'common.userTypeSelect'}
                      value={value || ""}
                      onChange={onChange}
                      items={role_array}
                      placeholder={"common.userTypeSelect"}
                      border={true}
                      underline={false}
                      containerStyle={{ height: 65, paddingHorizontal: 0, paddingVertical: 10 }}
                    />
                  )}
                  key={'dropdown-user-type'}
                  name={"user-type"}
                  rules={{ required: true }}
                  defaultValue=""
                />
                {errors['user-type'] && <Text style={[RED_COLOR, fromOtp ? { paddingBottom: 10 } : {}]} tx={"common.userTypeSelect"} />}
              </View>

            </View>
          </View>

        </View>

        <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
          <View style={WRAPPER_TOP}>
            <RoundedButton onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
          </View>
        </View>

      </ScrollView>
    </Screen>
  </View>

})
