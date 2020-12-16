import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Dimensions, SafeAreaView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Button, CountDown, Text } from '../../components';
import { color, spacing } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';

const ROOT: ViewStyle = {
  // flex: 1,
  height: Dimensions.get("window").height,
  paddingTop: 50,
  paddingBottom: 20,
  backgroundColor: color.backgroundWhite
}
const CODE_FIELD_ROOT: TextStyle = {
  flex: 1,
  width: 280,
  marginTop: 20,
  marginLeft: 'auto',
  marginRight: 'auto',
}
const CODE_INFORMATION_ROOT: ViewStyle = {
  flex: 1,
  marginLeft: spacing[5],
  marginRight: spacing[5],
  marginTop: -30
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
  flex: 1,
  flexDirection: 'row',
  // justifyContent: "center"
}
const RESEND_CODE_ROOT: ViewStyle = {
  flex: 1,
  alignItems: "center",
}
const RESEND_CODE_TEXT: TextStyle = {
  color: color.disable
}
const CONFIRM_CODE_ROOT: ViewStyle = {
  flex: 3,
  flexDirection: "column-reverse",
  paddingBottom: 30,
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
  paddingTop: 5,
  paddingBottom: 5
}
const TEXT_EXPIRE: TextStyle = {
  color: color.error
}

const CELL_COUNT: number = 4;
const MINUTE: number = 60;

const initialState = {
  isExpired: false,
  disabled: true,
  buttonColor: color.disable,
  resendCode: true,
  autoFocus: true,
}

export const ConfirmCodeScreen = observer(function ConfirmCodeScreen() {
  const navigation = useNavigation()
  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [{ isExpired, disabled, buttonColor, resendCode, autoFocus }, setState] = useState(initialState)
  const [isShow, setIsShow] = useState(true)

  const clearState = () => {
    setState({ ...initialState })
  }

  const onChangeText = (val: string) => {
    setValue(val)
    if (val.length === 4) {
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

  useEffect(() => {
    if (!resendCode && isExpired) {
      setIsShow(false)
    } else {
      setIsShow(true)
    }
  }, [resendCode, isExpired, autoFocus])

  return (
    <SafeAreaView style={ROOT}>
      <CodeField
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
      />
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
          <Text style={CODE_REF}>(Ref: {'ABD1234'})</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
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
          testID="continue-with-signin"
          style={{
            ...CONTINUE_BUTTON,
            backgroundColor: buttonColor
          }}
          textStyle={CONTINUE_TEXT}
          disabled={disabled}
          text={translate('confirmCodeScreen.confirmOTP')} // ยืนยันรหัส OTP
          onPress={() => {
            clearState()
            navigation.navigate("acceptPolicy")
          }}
        />
      </View>
    </SafeAreaView>
  );
})