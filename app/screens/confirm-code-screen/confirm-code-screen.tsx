import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Dimensions, SafeAreaView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Button, CountDown, ModalLoading, Text } from '../../components';
import { color, spacing } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import AuthStore from '../../store/auth-store/auth-store'
import OTPInputView from '@twotalltotems/react-native-otp-input'

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
  marginLeft: spacing[5],
  marginRight: spacing[5],
}
const CELL_ROOT: TextStyle = {
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  borderBottomColor: '#ccc',
  borderBottomWidth: 1,
}
const CELL_TEXT: TextStyle = {
  color: color.textBlack,
  fontSize: 36,
  textAlign: 'center',
}
const FOCUS_CELL: TextStyle = {
  borderBottomColor: color.disable,
  borderBottomWidth: 2,
}
const CODE_INFORMATION: ViewStyle = {
  flexDirection: 'row',
  justifyContent: "center",
  alignItems: 'center'
}
const RESEND_CODE_ROOT: ViewStyle = {
  marginVertical: spacing[3],
  alignItems: "center",
}
const RESEND_CODE_TEXT: TextStyle = {
  color: color.disable
}
const CONFIRM_CODE_ROOT: ViewStyle = {
  flexDirection: "column-reverse",
  paddingBottom: spacing[5],
  marginHorizontal: spacing[5]
}
const COUNT_DOWN: TextStyle = {
  paddingLeft: 5
}
const CODE_REF: TextStyle = {
  marginLeft: "auto"
}
const CONTINUE_BUTTON: ViewStyle = {
  // backgroundColor: '#e5e5e5',
  width: '100%',
  borderRadius: 20
}
const CONTINUE_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 14,
  paddingTop: spacing[1],
  paddingBottom: spacing[1]
}
const TEXT_EXPIRE: TextStyle = {
  color: color.error
}
const CODE_INPUT_FILED_STYLE: TextStyle = {
  borderColor: color.transparent,
  borderBottomWidth: 2,
  borderBottomColor: color.line,
  fontSize: 25,
  color: color.dim,
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
  buttonColor: color.disable,
  resendCode: true,
  autoFocus: true,
  isLoading: false,
}

export const ConfirmCodeScreen = observer(function ConfirmCodeScreen() {
  const navigation = useNavigation()
  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [{ isExpired, disabled, buttonColor, resendCode, autoFocus, isLoading }, setState] = useState(initialState)
  const [isShow, setIsShow] = useState(true)

  const clearState = () => {
    setState({ ...initialState })
  }

  const onChangeText = (code: string) => {
    setValue(code)
    if (code.length === 4) {
      setState(prevState => ({
        ...prevState,
        disabled: isExpired,
        buttonColor: isExpired ? color.disable : color.primary,
        autoFocus: false
      }))
    } else {
      setState(prevState => ({
        ...prevState,
        disabled: true,
        buttonColor: color.disable,
      }))
    }
  }

  const onResendCode = () => {
    setState({ ...initialState })
    setValue('')
  }

  const setButtonColor = (_color: string) => {
    setState(prevState => ({
      ...prevState,
      buttonColor: _color
    }))
  }

  const onFinish = () => {
    setState(prevState => ({
      ...prevState,
      resendCode: !prevState.resendCode,
      isExpired: !prevState.isExpired,
      disabled: true,
      buttonColor: color.disable
    }))
  }

  const onPress = (value: string) => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
    }))
    AuthStore.otpVerifyRequest({
      token: AuthStore.getAuthData.token,
      otp: value
    })
      .then(() => {
        AuthStore.getPolicyRequest(AuthStore.profile.userProfile.id)
          .then(() => {
            if (AuthStore.policyData.accepted) {
              return 'home'
            }
            return 'acceptPolicy'
          }).then((screen) => {
            clearState()
            navigation.navigate(screen)
          })
      })
  }

  useEffect(() => {
    if (!resendCode && isExpired) {
      setIsShow(false)
    } else {
      setIsShow(true)
    }
  }, [resendCode, isExpired, autoFocus])

  useEffect(() => {
    if (AuthStore.getAuthData && AuthStore.getAuthData.token) {
      console.log('AuthStore.getAuthData :>> ', JSON.parse(JSON.stringify(AuthStore.getAuthData)));
    }
  }, [AuthStore.getAuthData])

  return (
    <SafeAreaView style={ROOT}>
      {isLoading && <ModalLoading size={'large'} color={color.primary} visible={isLoading} />}

      <View style={CODE_FIELD_ROOT} accessible={true}
        accessibilityLabel="otp-input-new" >
        <OTPInputView
          // testID={"countdown-otp"}
          style={{ width: '100%', height: 120 }}
          pinCount={CELL_COUNT}
          code={value} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
          onCodeChanged={(code) => onChangeText(code)}
          keyboardType="number-pad"
          autoFocusOnLoad
          codeInputFieldStyle={CODE_INPUT_FILED_STYLE}
          codeInputHighlightStyle={CODE_INPUT_HIGHTLIGHT_STYLE}
          onCodeFilled={(code) => {
            setValue(code)
            console.log(`Code is ${code}, you are good to go!`)
          }}
        />
      </View>

      {/* <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={(val) => onChangeText(val)}
        // onTouchCancel={() => console.log('touch cancel')}
        // onContentSizeChange={() => console.log('size change')}
        // onEndEditing={() => setButtonColor(color.primary)}
        onFocus={() => setButtonColor(color.disable)}
        cellCount={CELL_COUNT}
        rootStyle={CODE_FIELD_ROOT}
        keyboardType="number-pad"
        autoFocus={autoFocus}
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[CELL_ROOT, isFocused && FOCUS_CELL]}>
            <Text style={CELL_TEXT}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      /> */}
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
              timeToShow={['M', 'SS']}
              timeLabels={{ m: '', s: '' }}
              showSeparator={true}
            /> :
            <Text style={COUNT_DOWN}>0:00</Text>
          }
          <Text style={CODE_REF}>(Ref: {'ABCD'})</Text>
        </View>
        <View style={RESEND_CODE_ROOT}>
          {isExpired && <Text style={TEXT_EXPIRE} text={translate('confirmCodeScreen.codeExpired')} />}
        </View>
        <View style={RESEND_CODE_ROOT}>
          <TouchableOpacity disabled={!isExpired} onPress={onResendCode}>
            <Text style={RESEND_CODE_TEXT} text={translate('confirmCodeScreen.requestNewOTP')} />
          </TouchableOpacity>
        </View>
      </View>
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
    </SafeAreaView>
  );
})