import React, { useCallback, useEffect, useState } from "react"
import {
  View,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Platform,
  TextInput,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from "react-native"
import { observer } from "mobx-react-lite"
import { Button, HeaderLeft, Icon, ModalAlert, Screen, Text, ModalLoading } from "../../components"
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import CountryPicker, { Country, CountryCode, DEFAULT_THEME, FlagButton } from 'react-native-country-picker-modal'
import { color, spacing, images } from '../../theme'
import { translate } from '../../i18n'
import i18n from 'i18n-js'
import AuthStore from '../../store/auth-store/auth-store'
import { AlertMessage } from "../../utils/alert-form";
import { useStores } from "../../models/root-store/root-store-context";
import ProfileStore from '../../store/profile-store/profile-store'
// import { APPLE_USER } from '../../config/env'
import { APPLE_USER, APPLE_PASSWORD } from '../../config'

i18n.defaultLocale = 'th'
i18n.locale = 'th'
i18n.fallbacks = true

const CONTENT_CENTER: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}
const FULL: ViewStyle = { flex: 1, backgroundColor: color.backgroundWhite }
const LOGO_PART: ViewStyle = {
  flex: 2,
  ...CONTENT_CENTER,
}
const MOBILE_FORM_PART: ViewStyle = {
  flex: 3,
  marginHorizontal: spacing[6],
}
const SIGNIN_PART: ViewStyle = {
  flex: 1,
  ...CONTENT_CENTER,
  paddingLeft: 22,
  paddingRight: 22,
}
const LOGO: ImageStyle = {
  height: 160,
}
const CONTINUE_BUTTON: ViewStyle = {
  width: "100%",
  borderRadius: 25,
}
const CONTINUE_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 14,
  paddingTop: 5,
  paddingBottom: 5,
}
const MOBILE_FORM: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: color.line,
  borderRadius: 4,
  paddingHorizontal: spacing[3],
  paddingVertical: spacing[1],
}
const MOBILE_INPUT: TextStyle = {
  marginLeft: spacing[5],
  padding: 2,
  width: Dimensions.get("window").width / 2,
  fontFamily: 'Kanit',
  fontSize: 18
}
const FLAG: ImageStyle = {
  width: 35,
  height: 35,
  borderRadius: 1,
  marginRight: spacing[2],
}
const LABEL: TextStyle = {
  paddingBottom: spacing[2],
}

const FIRST_MOBILE_NO: string = "0"

const initialState = {
  disabled: true,
  buttonColor: color.primary,
  value: '',
  visibleModal: true,
}

const normalizeMobileNo = (mobileNo: string) => {
  const firtMobileNo = mobileNo.slice(0, 1);
  if (firtMobileNo === FIRST_MOBILE_NO) {
    mobileNo = mobileNo.slice(1)
  }
  let result = mobileNo.split(' - ').join('')
  return `0${result}`;
}

export const SigninScreen = observer(function SigninScreen() {
  const navigation = useNavigation()
  const { tokenStore } = useStores()
  // const goBack = () => navigation.goBack()
  const [{ disabled, buttonColor, value, visibleModal }, setState] = useState(initialState)
  const [countryCode, setCountryCode] = useState<CountryCode>('TH')
  const [callingCode, setCallingCode] = useState<string>('+66')
  const [pressSignin, setPressSignin] = useState<boolean>(false)
  const [pressApple, setPressApple] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {
      return () => {
        setPressSignin(false)
        setPressApple(false)
        setState(initialState)
        setCountryCode('TH')
        // setCountry(null)
      }
    }, [])
  );

  const CUSTOM_DEFAULT_THEME: Partial<typeof DEFAULT_THEME> = {
    ...DEFAULT_THEME,
    flagSizeButton: Platform.select({ android: 20, ios: 24 }),
    fontFamily: 'Kanit-Medium',
    fontSize: 16,
  }

  const onSelect = (countryData: Country) => {
    setCountryCode(countryData.cca2)
    setCallingCode(`+${countryData.callingCode[0]}`)
    setState(initialState)
  }

  const validateMobileNumberSuccess = () => {
    setState(prevState => ({
      ...prevState,
      disabled: false,
      buttonColor: color.primary,
    }))
    Keyboard.dismiss()
  }

  const normalizeInput = (value: string, previousValue: string) => {
    if (!value) return value;
    if (countryCode === 'TH') {
      const currentValue = value.replace(/[^\d]/g, '');
      const cvLength = currentValue.length;
      const firstMobileNo = value.slice(0, 1)

      if (!previousValue || value.length > previousValue.length) {
        if (firstMobileNo === FIRST_MOBILE_NO) {
          if (cvLength === 10) validateMobileNumberSuccess()
          if (cvLength < 4) return currentValue;
          if (cvLength < 7) return `${currentValue.slice(0, 3)} - ${currentValue.slice(3)}`;
          return `${currentValue.slice(0, 3)} - ${currentValue.slice(3, 6)} - ${currentValue.slice(6, 10)}`;
        } else {
          if (cvLength === 9) validateMobileNumberSuccess()
          if (cvLength < 3) return currentValue;
          if (cvLength < 6) return `${currentValue.slice(0, 2)} - ${currentValue.slice(2)}`;
          return `${currentValue.slice(0, 2)} - ${currentValue.slice(2, 5)} - ${currentValue.slice(5, 9)}`;
        }
      } else {
        setState(prevState => ({
          ...prevState,
          disabled: true,
          buttonColor: color.line,
        }))
        if (value.slice(-3).match(' - ')) value = value.slice(0, -3)
        return value;
      }
    } else {
      if (value.length > 6) {
        setState(prevState => ({
          ...prevState,
          disabled: false,
          buttonColor: color.primary,
        }))
      } else {
        setState(prevState => ({
          ...prevState,
          disabled: true,
          buttonColor: color.line,
        }))
      }
      return value
    }
  };

  const onChangeText = (text: string) => {
    const mobileNo = normalizeInput(text, value)
    setState(prevState => ({
      ...prevState,
      value: mobileNo
    }))
  }

  useEffect(() => {
    let error_signin = AuthStore.error
    let data_signin = AuthStore.data.refCode
    if (pressSignin && !error_signin && data_signin && !AuthStore.loading) {
      navigation.navigate("confirmCode")
    }
    else if (pressSignin && error_signin && !AuthStore.loading) {
      console.log("Error signin screen :: ", error_signin)
      if (error_signin.includes('timeout'))
        AlertMessage("common.somethingWrong", "common.timeout", true)
      else
        AlertMessage("common.somethingWrong", "common.InvalidPhoneNumber", true)
    }
  }, [pressSignin, AuthStore.error, JSON.stringify(AuthStore.data)])

  useEffect(() => {
    let error_signinApple = AuthStore.error
    let data_signinApple = JSON.parse(JSON.stringify(AuthStore.profile))
    if (pressApple && !error_signinApple && data_signinApple && !AuthStore.loading) {
      // console.log("Come to true if")
      tokenStore.setToken(data_signinApple.token || null)
      tokenStore.setProfile(data_signinApple.userProfile || null)
      navigation.navigate("home", { screen: 'Home' })
      if (AuthStore?.profile?.userProfile?.userId)
        ProfileStore.getProfileRequest(AuthStore.profile.userProfile.userId)
      console.log("Local navigate to home ")
    }
    else if (pressApple && error_signinApple && !AuthStore.loading) AlertMessage("common.somethingWrong", "common.InvalidPhoneNumber", true)
  }, [pressApple, AuthStore.error, JSON.stringify(AuthStore.profile)])

  const onPress = (mobileNo: string, countryCode: string) => {
    const phoneNumber = normalizeMobileNo(mobileNo).substr(1)
    __DEV__ && console.tron.logImportant("Mobile no:: ", phoneNumber)
    if (phoneNumber.toString().includes("011223344")) {
      setPressApple(true)
      AuthStore.AppleSignin({
        "email": APPLE_USER || "admin.test@cargolink.co.th",
        "password": APPLE_PASSWORD || "123456aQ@"
      })
    }
    else {
      console.log("Counttry Code :: ", countryCode)
      AuthStore.setPhoneNumber(phoneNumber, countryCode)
      AuthStore.signInRequest({ phoneNumber, countryCode })
      setState(initialState)
      setPressSignin(true)
    }
  }

  const onCloseModal = () => {
    AuthStore.clearError()
    setState(prevState => ({
      ...prevState,
      visibleModal: false//!prevState.visibleModal
    }))
  }

  const RenderButtonAlert = () => (<Button
    testID="ok"
    style={{ ...CONTINUE_BUTTON, backgroundColor: buttonColor }}
    textStyle={CONTINUE_TEXT}
    text={translate("common.ok")}
    onPress={() => onCloseModal()}
  />)

  // const isError = !!(AuthStore.error && AuthStore.error === 'SERVER_ERROR')
  const isError = !!AuthStore.error

  return (
    <Screen style={FULL} statusBar={'dark-content'}>
      <TouchableOpacity style={{ paddingLeft: spacing[4] + spacing[1] }} onPress={() => navigation.goBack()}>
        <HeaderLeft onLeftPress={() => navigation.goBack()} />
      </TouchableOpacity>
      <View testID="Logo" style={LOGO_PART}>
        <Image source={images.logoNewYellow} style={LOGO} resizeMode={"contain"} />
      </View>
      <ModalLoading color={color.primary} visible={AuthStore.loading} size={'large'} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View testID="MobileForm" style={MOBILE_FORM_PART}>
          <Text style={LABEL} text={translate("signinScreen.enterYourPhoneNumber")} />
          <View style={MOBILE_FORM}>
            <CountryPicker
              countryCode={countryCode ?? "TH"}
              withFilter={true}
              withFlag={true}
              withCountryNameButton={false}
              withAlphaFilter={false}
              withCallingCode={true}
              withEmoji={false}
              withCallingCodeButton
              containerButtonStyle={{
                marginBottom: spacing[1],
              }}
              onSelect={onSelect}
              // countryCodes={['TH']}
              theme={CUSTOM_DEFAULT_THEME}
              withCloseButton={true}
            />
            {/* <Icon icon="thFlag" style={FLAG} /> */}
            {/* <Text>+66</Text> */}
            <TextInput
              testID={'phone-number-signin'}
              style={MOBILE_INPUT}
              keyboardType={"numeric"}
              maxLength={30}
              placeholder={"xx - xxx - xxxx"}
              onChangeText={(text) => onChangeText(text)}
              value={value}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View testID="ButtonSignin" style={SIGNIN_PART}>
        <Button
          testID="continue-with-signin"
          style={{ ...CONTINUE_BUTTON, backgroundColor: buttonColor }}
          textStyle={CONTINUE_TEXT}
          disabled={disabled}
          // tx="goHome"
          text={translate("signinScreen.signin")}
          onPress={() => onPress(value, callingCode)}
        />
      </View>

      {!!AuthStore.error && <ModalAlert // !!isError
        containerStyle={{ paddingVertical: spacing[3] }}
        iconName={'bell-alert-outline'}
        iconStyle={{
          color: color.line,
          size: 100
        }}
        header={'?????????????????????????????????????????????????????????????????????'}
        headerStyle={{ paddingVertical: spacing[3], color: color.primary }}
        // content={'????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 12.00 - 20.00 ???. ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????'}
        content={'?????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????????????????'}
        contentStyle={{ paddingTop: spacing[3], paddingBottom: spacing[5], paddingHorizontal: spacing[7], color: color.line }}
        buttonContainerStyle={{ width: '90%' }}
        buttonComponent={RenderButtonAlert}
        visible={visibleModal}
      />}

    </Screen>
  )
})
