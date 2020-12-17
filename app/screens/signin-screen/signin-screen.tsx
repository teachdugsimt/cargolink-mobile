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
import { Button, Icon, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
import CountryPicker, {
  Country,
  CountryCode,
  DEFAULT_THEME,
} from "react-native-country-picker-modal"
import { color, spacing } from "../../theme"
import { translate } from "../../i18n"

const logo = require("./logo.png")

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
  fontWeight: "bold",
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
  fontWeight: "bold",
  paddingBottom: spacing[2],
}

const FIRST_MOBILE_NO: string = "0"

export const SigninScreen = observer(function SigninScreen() {
  const navigation = useNavigation()
  // const goBack = () => navigation.goBack()
  const [disabled, setDisabled] = useState(true)
  const [buttonColor, setButtonColor] = useState(color.disable)
  const [value, setValue] = useState<string>("")
  const [countryCode, setCountryCode] = useState<CountryCode>("TH")
  const [country, setCountry] = useState<Country>(null)
  const [withCountryNameButton, setWithCountryNameButton] = useState<boolean>(false)
  const [withFlag, setWithFlag] = useState<boolean>(true)
  const [withEmoji, setWithEmoji] = useState<boolean>(true)
  const [withFilter, setWithFilter] = useState<boolean>(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false)
  const [withCallingCode, setWithCallingCode] = useState<boolean>(true)
  const CUSTOM_DEFAULT_THEME: Partial<typeof DEFAULT_THEME> = {
    ...DEFAULT_THEME,
    flagSizeButton: Platform.select({ android: 30, ios: 30 }),
  }
  const onSelect = (countryData: Country) => {
    setCountryCode(countryData.cca2)
    setCountry(countryData)
  }
  const validateMobileNumberSuccess = () => {
    setDisabled(false)
    setButtonColor(color.primary)
    Keyboard.dismiss()
  }
  const onChangeText = (text: string) => {
    setValue(text)
    const firstMobileNo = text.substr(0, 1)
    if (firstMobileNo === FIRST_MOBILE_NO && text.length === 10) {
      validateMobileNumberSuccess()
    } else if (firstMobileNo !== FIRST_MOBILE_NO && text.length === 9) {
      validateMobileNumberSuccess()
    } else {
      setDisabled(true)
      setButtonColor(color.disable)
    }
  }

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
          onPress={() => {
            setValue("")
            navigation.navigate("confirmCode")
          }}
        />
      </View>
    </View>
  )
})
