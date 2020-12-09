import React, { useState } from 'react';
import { observer } from "mobx-react-lite"
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { Dimensions, SafeAreaView, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Button, CountDown } from '../../components';
import { color } from '../../theme';
import { useNavigation } from '@react-navigation/native';

const ROOT: ViewStyle = {
  // flex: 1,
  height: Dimensions.get("window").height,
  paddingTop: 50,
  paddingRight: 20,
  paddingBottom: 20,
  paddingLeft: 20,
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
  marginLeft: 10,
  marginRight: 10,
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
  paddingBottom: 30
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

const ShowCountDown = ({ setIsExpired }) => {
  return (
    <CountDown
      until={MINUTE * 1 + 30}
      size={14}
      style={COUNT_DOWN}
      onFinish={() => {
        console.log('Finished')
        setIsExpired(true)
      }}
      digitStyle={{}}
      digitTxtStyle={{}}
      timeToShow={['M', 'SS']}
      timeLabels={{ m: '', s: '' }}
      showSeparator={true}
    />
  )
}

export const ConfirmCodeScreen = observer(function ConfirmCodeScreen() {
  const navigation = useNavigation()
  const [value, setValue] = useState<string>('');
  const [buttonColor, setButtonColor] = useState<string>('e5e5e5')
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [isExpired, setIsExpired] = useState<boolean>(false)

  const onChangeText = (val) => {
    setValue(val)
    // setButtonColor('e5e5e5')
  }

  return (
    <SafeAreaView style={ROOT}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={(val) => onChangeText(val)}
        // onTouchCancel={() => console.log('touch cancel')}
        // onContentSizeChange={() => console.log('size change')}
        onEndEditing={() => setButtonColor(color.primary)}
        onFocus={() => setButtonColor(color.disable)}
        cellCount={CELL_COUNT}
        rootStyle={CODE_FIELD_ROOT}
        keyboardType="number-pad"
        autoFocus={true}
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
          <Text>รหัสจะหมดอายุใน</Text>
          <ShowCountDown {...{
            setIsExpired
          }} />
          <Text style={CODE_REF}>(Ref: {'ABD1234'})</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {isExpired && <Text style={TEXT_EXPIRE}>รหัสหมดอายุแล้ว</Text>}
        </View>
        <View style={RESEND_CODE_ROOT}>
          <Text style={RESEND_CODE_TEXT}>ขอรับรหัส OTP ใหม่</Text>
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
          text={'ยืนยันรหัส OTP'}
          onPress={() => navigation.navigate("acceptPolicy")}
        />
      </View>
    </SafeAreaView>
  );
})