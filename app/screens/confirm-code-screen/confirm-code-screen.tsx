import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { Dimensions, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Button, CountDown, HeaderLeft, ModalAlert, ModalLoading, Screen, Text } from '../../components';
import { color, spacing } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import AuthStore from '../../store/auth-store/auth-store'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { useStores } from "../../models/root-store/root-store-context";
import ProfileStore from '../../store/profile-store/profile-store'
import './shim.js'
import crypto from 'crypto'

const ROOT: ViewStyle = {
  height: Dimensions.get("window").height,
  paddingTop: 50,
  backgroundColor: color.backgroundWhite
}
const CODE_FIELD_ROOT: TextStyle = {
  width: 280,
  marginTop: 20,
  marginLeft: 'auto',
  marginRight: 'auto',
}
const CODE_INFORMATION_ROOT: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginLeft: spacing[5],
  marginRight: spacing[5],
}
const CODE_INFORMATION: ViewStyle = {
  flexDirection: 'row',
}
const RESEND_CODE_TEXT: TextStyle = {
  color: color.line
}
const CONFIRM_CODE_ROOT: ViewStyle = {
  flexDirection: "column-reverse",
  paddingBottom: spacing[5],
  marginHorizontal: spacing[5]
}
const COUNT_DOWN: TextStyle = {
  paddingLeft: 5
}
const CONTINUE_BUTTON: ViewStyle = {
  width: '100%',
  borderRadius: Math.floor(Dimensions.get('window').height / 2)
}
const CONTINUE_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 14,
  paddingTop: spacing[1],
  paddingBottom: spacing[1]
}
const CODE_INPUT_FILED_STYLE: TextStyle = {
  borderColor: color.transparent,
  borderBottomWidth: 2,
  borderBottomColor: color.line,
  fontSize: 24,
  color: color.dim
}
const CODE_INPUT_HIGHTLIGHT_STYLE: ViewStyle = {
  borderColor: color.transparent,
  borderBottomWidth: 2,
  borderBottomColor: color.primary
}

const CELL_COUNT: number = 4;
const MINUTE: number = 60;

const initialState = {
  isExpired: false,
  disabled: true,
  buttonColor: color.line,
  resendCode: true,
  autoFocus: true,
  isLoading: false,
  visibleModal: false,
}

export const ConfirmCodeScreen = observer(function ConfirmCodeScreen() {
  const navigation = useNavigation()
  const { tokenStore } = useStores()

  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [{ isExpired, disabled, buttonColor, resendCode, autoFocus, isLoading, visibleModal }, setState] = useState(initialState)
  const [isShow, setIsShow] = useState(true)

  const clearState = () => {
    setState(initialState)
  }

  const onChangeText = (code: string) => {
    setValue(code)
    if (code.length === 4) {
      setState(prevState => ({
        ...prevState,
        disabled: isExpired,
        buttonColor: isExpired ? color.line : color.primary,
        autoFocus: false
      }))
    } else {
      setState(prevState => ({
        ...prevState,
        disabled: true,
        buttonColor: color.line,
      }))
    }
  }

  const onResendCode = () => {
    AuthStore.signInRequest({ phoneNumber: AuthStore.phoneNumber, countryCode: AuthStore.countryCode, userType: 7 })
    clearState()
    setValue('')
  }

  const onFinish = () => {
    setState(prevState => ({
      ...prevState,
      resendCode: !prevState.resendCode,
      isExpired: !prevState.isExpired,
      disabled: true,
      buttonColor: color.line,
      visibleModal: true
    }))
  }

  const onPress = (value: string) => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
    }))
    AuthStore.otpVerifyRequest({
      variant: crypto.createHmac('sha256', `${AuthStore?.data?.refCode}${AuthStore.countryCode}${AuthStore.phoneNumber}${value}`).digest('hex'),
      countryCode: AuthStore.countryCode,
      phoneNumber: AuthStore.phoneNumber
    })
      .then(() => {
        let profile = JSON.parse(JSON.stringify(AuthStore.profile))
        __DEV__ && console.tron.log(profile)
        if (profile && profile.termOfService) {
          tokenStore.setToken(profile.token || null)
          tokenStore.setProfile(profile.userProfile || null)
          let screen = 'acceptPolicy'
          if (profile.termOfService.accepted) {
            ProfileStore.getProfileRequest(profile.userProfile.userId)
            screen = 'home'
          }
          clearState()
          navigation.navigate(screen)
          return;
        }
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          visibleModal: true,
        }))
      })
  }

  const onCloseModal = () => {
    setState(prevState => ({
      ...prevState,
      visibleModal: !prevState.visibleModal
    }))
  }

  const RenderButtonAlert = () => (<Button
    testID="ok"
    style={{ ...CONTINUE_BUTTON, backgroundColor: color.primary }}
    textStyle={CONTINUE_TEXT}
    text={translate("common.ok")}
    onPress={() => onCloseModal()}
  />)

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      isExpired: false
    }))
    return () => {
      clearState()
    }
  }, [])

  useEffect(() => {
    if (!resendCode && isExpired) {
      setIsShow(false)
    } else {
      setIsShow(true)
    }
  }, [resendCode, isExpired, autoFocus])

  useEffect(() => {
    if (AuthStore.getAuthData && AuthStore.getAuthData.refCode) {
      console.log('AuthStore.getAuthData :>> ', JSON.parse(JSON.stringify(AuthStore.getAuthData)));
    }
  }, [AuthStore.getAuthData])

  return (
    <Screen style={ROOT} statusBar={'dark-content'}>
      <ModalLoading size={'large'} color={color.primary} visible={isLoading || (AuthStore.loading || AuthStore.loadingApple)} />

      <TouchableOpacity style={{ paddingLeft: spacing[4] + spacing[1] }} onPress={() => navigation.goBack()}>
        <HeaderLeft onLeftPress={() => navigation.goBack()} />
      </TouchableOpacity>

      <View style={CODE_FIELD_ROOT} accessible={true}
        accessibilityLabel="otp-input-new" >
        <OTPInputView
          // testID={"countdown-otp"}
          style={{ width: '100%', height: 120 }}
          pinCount={CELL_COUNT}
          code={value}
          onCodeChanged={(code) => onChangeText(code)}
          keyboardType="number-pad"
          autoFocusOnLoad
          codeInputFieldStyle={CODE_INPUT_FILED_STYLE}
          codeInputHighlightStyle={CODE_INPUT_HIGHTLIGHT_STYLE}
          onCodeFilled={(code) => {
            setValue(code)
            onPress(code)
          }}
        />
      </View>
      <View testID="InformationCodeRoot" style={CODE_INFORMATION_ROOT}>
        <View style={CODE_INFORMATION}>
          <Text text={translate('confirmCodeScreen.codeWillExpire')} />
          {isShow ?
            <CountDown
              until={MINUTE * 1 + 30}
              size={14}
              style={COUNT_DOWN}
              // onChange={(second) => console.log('second :>> ', second)}
              onFinish={onFinish}
              digitStyle={{}}
              digitTxtStyle={{}}
              timeToShow={['MM', 'SS']}
              timeLabels={{ m: '', s: '' }}
              showSeparator={true}
            />
            : <Text style={COUNT_DOWN}>00:00</Text>
          }
        </View>
        <TouchableOpacity disabled={!isExpired} onPress={onResendCode}>
          <Text style={RESEND_CODE_TEXT} text={translate('confirmCodeScreen.requestNewOTP')} />
        </TouchableOpacity>
      </View>

      {!tokenStore.token && (isExpired || !!AuthStore.error) && <ModalAlert // !!isError
        containerStyle={{ paddingVertical: spacing[5] }}
        iconName={'bell-alert-outline'}
        iconStyle={{
          color: color.line,
          size: 100
        }}
        header={translate('confirmCodeScreen.codeExpiredOrIncorrect')}
        headerStyle={{ padding: spacing[3], color: color.primary }}
        content={translate('confirmCodeScreen.confirmOTPAgianOrRequestNewOTP')}
        contentStyle={{ paddingTop: spacing[3], paddingBottom: spacing[5], paddingHorizontal: spacing[7], color: color.line }}
        buttonContainerStyle={{ width: '90%' }}
        buttonComponent={RenderButtonAlert}
        visible={visibleModal}
      />
      }

      <View testID="ConfirmCodeRoot" style={CONFIRM_CODE_ROOT}>
        <Button
          testID="continue-with-otp"
          style={{
            ...CONTINUE_BUTTON,
            backgroundColor: buttonColor
          }}
          textStyle={CONTINUE_TEXT}
          disabled={disabled}
          text={translate('confirmCodeScreen.confirmOTP')} // ยืนยันรหัส OTP
          onPress={() => onPress(value)}
        />
      </View>
    </Screen>
  );
})
