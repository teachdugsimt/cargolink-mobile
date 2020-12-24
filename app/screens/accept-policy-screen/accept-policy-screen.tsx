import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite"
import { Dimensions, ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { Button, ModalLoading, Text } from '../../components';
import { color } from "../../theme"
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import AuthStore from '../../store/auth-store/auth-store'

const ROOT: ViewStyle = {
  flex: 1,
  height: Dimensions.get("window").height,
  flexWrap: "nowrap",
  padding: 10,
  backgroundColor: color.backgroundWhite
}
const TITLE: TextStyle = {
  // flex: 1,
  fontSize: 16,
  fontWeight: "bold",
  textAlign: "center",
  paddingTop: 30,
  paddingBottom: 20,
  color: color.dim
}
const SCROLL_VIEW: ViewStyle = {
  // flex: 2,
  marginLeft: 10,
  marginRight: 10,
  backgroundColor: color.disable,
  borderRadius: 6
}
const CONTENT: TextStyle = {
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 10,
  paddingRight: 10,
  fontSize: 15
}
const BUTTON_ROOT: ViewStyle = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 20,
}
const CONTINUE_BUTTON: ViewStyle = {
  backgroundColor: color.disable,
  width: '100%',
  borderRadius: 20,
  marginBottom: 15
}
const CONTINUE_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 14,
  paddingTop: 5,
  paddingBottom: 5
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

const initialState = {
  isLoading: false,
}

export const AcceptPolicyScreen = observer(function AcceptPolicyScreen() {
  const navigation = useNavigation()
  // const [buttonColor, setButtonColor] = useState(color.disable)
  // const [disabled, setDisabled] = useState(true)
  const [{ isLoading }, setState] = useState(initialState)

  useEffect(() => {
    if (AuthStore.policyData && Object.keys(AuthStore.policyData).length) {
      console.log('AuthStore.policyData :>> ', JSON.parse(JSON.stringify(AuthStore.policyData)));
    }
  }, [AuthStore.policyData])

  const clearState = () => {
    setState({ ...initialState })
  }

  const onContinue = () => {
    setState({
      isLoading: true,
    })
    AuthStore.updatePolicyStatusRequest(AuthStore.profile.userProfile.id, {
      accept: true
    }).then(() => {
      clearState()
      navigation.navigate("home")
    })
  }

  console.log('AuthStore.policyData.data :>> ', AuthStore.policyData.data);

  return (
    <View style={ROOT} testID={"accept-policy-element"}>
      {isLoading && <ModalLoading size={'large'} color={color.primary} visible={isLoading} />}
      <Text style={TITLE} text={translate('acceptPolicyScreen.termAndCondition')} />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            console.log('End')
            // setButtonColor(color.primary)
            // setDisabled(false)
          }
        }}
        style={SCROLL_VIEW}
        scrollEventThrottle={400}
      >
        <Text style={CONTENT}>
          {AuthStore.policyData && AuthStore.policyData.data ? AuthStore.policyData.data : ''}
        </Text>
      </ScrollView>
      <View style={BUTTON_ROOT}>
        <Button
          testID="accept-policy"
          style={{
            ...CONTINUE_BUTTON,
            backgroundColor: color.primary
          }}
          textStyle={CONTINUE_TEXT}
          text={translate('acceptPolicyScreen.accept')} // 'ยอมรับเงื่อนไข
          // disabled={disabled}
          onPress={onContinue}
        />
        <Button
          testID="cancel-policy"
          style={CONTINUE_BUTTON}
          textStyle={CONTINUE_TEXT}
          text={translate('acceptPolicyScreen.cancel')} // ไม่ยอมรับเงื่อนไข
          onPress={() => navigation.navigate("signin")}
        />
      </View>
    </View>
  )
});