import React, { useState } from "react"
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
} from "react-native"
import { observer } from "mobx-react-lite"
import { Button, Icon, ModalAlert, Text } from "../../components"
import { useNavigation } from '@react-navigation/native'
// import CountryPicker, { Country, CountryCode, DEFAULT_THEME } from 'react-native-country-picker-modal'
import { color, spacing } from '../../theme'
import { translate } from '../../i18n'
import i18n from 'i18n-js'
import AuthStore from '../../store/auth-store/auth-store'

i18n.defaultLocale = 'th'
i18n.locale = 'th'
i18n.fallbacks = true
const logo = require('./logo.png')

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
  height: "60%",
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
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: color.disable,
  borderRadius: 4,
  paddingHorizontal: spacing[3],
  paddingVertical: spacing[1],
}
const MOBILE_INPUT: TextStyle = {
  marginLeft: spacing[5],
  padding: 2,
  width: Dimensions.get("window").width / 2,
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
  buttonColor: color.disable,
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
  // const goBack = () => navigation.goBack()
  const [{ disabled, buttonColor, value, visibleModal }, setState] = useState(initialState)
  const [countryCode, setCountryCode] = useState("TH")
  // const [country, setCountry] = useState<Country>(null)
  const [withCountryNameButton, setWithCountryNameButton] = useState<boolean>(false)
  const [withFlag, setWithFlag] = useState<boolean>(true)
  const [withEmoji, setWithEmoji] = useState<boolean>(true)
  const [withFilter, setWithFilter] = useState<boolean>(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false)
  const [withCallingCode, setWithCallingCode] = useState<boolean>(true)
  // const CUSTOM_DEFAULT_THEME: Partial<typeof DEFAULT_THEME> = {
  //   ...DEFAULT_THEME,
  //   flagSizeButton: Platform.select({ android: 30, ios: 30 }),
  // }
  // const onSelect = (countryData: Country) => {
  //   setCountryCode(countryData.cca2)
  //   setCountry(countryData)
  // }
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
        buttonColor: color.disable,
      }))
      if (value.slice(-3).match(' - ')) value = value.slice(0, -3)
      return value;
    }
  };

  const onChangeText = (text: string) => {
    const mobileNo = normalizeInput(text, value)
    setState(prevState => ({
      ...prevState,
      value: mobileNo
    }))
  }

  const onPress = (mobileNo: string) => {
    AuthStore.signInRequest({ phoneNumber: normalizeMobileNo(mobileNo), userType: 7 })
    setState(initialState)
    navigation.navigate("confirmCode")
  }

  const onCloseModal = () => {
    setState(prevState => ({
      ...prevState,
      visibleModal: !prevState.visibleModal
    }))
  }

  const RenderButtonAlert = () => (<Button
    testID="ok"
    style={{ ...CONTINUE_BUTTON, backgroundColor: buttonColor }}
    textStyle={CONTINUE_TEXT}
    text={translate("common.ok")}
    onPress={() => onCloseModal()}
  />)

  const isError = !!(AuthStore.error && AuthStore.error === 'SERVER_ERROR')

  return (
    <View testID="SigninScreen" style={FULL}>
      <View testID="Logo" style={LOGO_PART}>
        <Image source={logo} style={LOGO} resizeMode={"contain"} />
      </View>
      <View testID="MobileForm" style={MOBILE_FORM_PART}>
        <Text style={LABEL} text={translate("signinScreen.enterYourPhoneNumber")} />
        <View style={MOBILE_FORM}>
          {/* <CountryPicker
            {...{
              countryCode,
              withFilter,
              withFlag,
              withCountryNameButton,
              withAlphaFilter,
              withCallingCode,
              withEmoji,
              withCallingCodeButton: true,
              containerButtonStyle: CONTAINER_BUTTON_STYLE,
              onSelect,
              countryCodes: ['TH'],
            }}
            theme={CUSTOM_DEFAULT_THEME}
          /> */}
          <Icon icon="thFlag" style={FLAG} />
          <Text>+66</Text>
          <TextInput
            testID={'phone-number-signin'}
            style={MOBILE_INPUT}
            keyboardType={"numeric"}
            maxLength={16}
            placeholder={"xx - xxx - xxxx"} // ใส่ข้อมูลเบอร์โทรศัพท์ของคุณ
            onChangeText={(text) => onChangeText(text)}
            value={value}
          />
        </View>
      </View>
      <View testID="ButtonSignin" style={SIGNIN_PART}>
        <Button
          testID="continue-with-signin"
          style={{ ...CONTINUE_BUTTON, backgroundColor: buttonColor }}
          textStyle={CONTINUE_TEXT}
          disabled={disabled}
          // tx="goHome"
          text={translate("signinScreen.signin")}
          onPress={() => onPress(value)}
        />
      </View>

      {isError && <ModalAlert // !!isError
        containerStyle={{ paddingVertical: spacing[3] }}
        iconName={'bell-alert-outline'}
        iconStyle={{
          color: color.disable,
          size: 100
        }}
        header={'ไม่สามารถเข้าสู่ระบบได้'}
        headerStyle={{ paddingVertical: spacing[3], color: color.primary }}
        content={'เนื่องจากมีการปิดปรับปรุงระบบในช่วงเวลา 12.00 - 20.00 น. คุณสามารถเข้าสู่ระบบหลังช่วงเวลาดังกล่าว'}
        contentStyle={{ paddingTop: spacing[3], paddingBottom: spacing[5], paddingHorizontal: spacing[7], color: color.disable }}
        buttonContainerStyle={{ width: '90%' }}
        buttonComponent={RenderButtonAlert}
        visible={visibleModal}
      />}

    </View>
  )
})
