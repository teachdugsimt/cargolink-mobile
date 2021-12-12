import React, { useState } from 'react';
import { observer } from "mobx-react-lite"
import { Dimensions, ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { Button, ModalLoading, Text } from '../../components';
import { color } from "../../theme"
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../i18n';
import AuthStore from '../../store/auth-store/auth-store'
import { useStores } from "../../models/root-store/root-store-context";
import HTML from "react-native-render-html";
import ProfileStore from '../../store/profile-store/profile-store';

const ROOT: ViewStyle = {
  flex: 1,
  height: Dimensions.get("window").height,
  flexWrap: "nowrap",
  padding: 10,
  backgroundColor: color.backgroundWhite
}
const TITLE: TextStyle = {
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
const BUTTON_ROOT: ViewStyle = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 20,
}
const CONTINUE_BUTTON: ViewStyle = {
  backgroundColor: color.line,
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

  const { tokenStore } = useStores()
  const [{ isLoading }, setState] = useState(initialState)

  const clearState = () => {
    setState({ ...initialState })
  }

  const onContinue = () => {
    setState({
      isLoading: true,
    })
    AuthStore.updatePolicyStatusRequest(AuthStore.profile.token.accessToken, AuthStore.profile.userProfile.userId, {
      accept: true,
      version: AuthStore.profile.termOfService.version
    }).then(() => {
      clearState()
      ProfileStore.getProfileRequest(AuthStore.profile.userProfile.userId)
      navigation.navigate("home")
    })
  }

  __DEV__ && console.tron.logImportant("Policy data :: ", AuthStore?.policyData?.data)


  return (
    <View style={ROOT} testID={"accept-policy-element"}>
      {isLoading && <ModalLoading size={'large'} color={color.primary} visible={isLoading} />}
      <Text style={TITLE} preset="topicExtra" text={translate('acceptPolicyScreen.termAndCondition')} />
      <ScrollView style={SCROLL_VIEW}>
        {AuthStore.policyData && AuthStore.policyData.data ?
          <HTML source={{ html: AuthStore.policyData.data }}
            containerStyle={{ padding: 10 }}
            contentWidth={Dimensions.get("window").width - 40}
            // tagsStyles={{ span: { fontStyle: 'bold' } }}
            ignoredStyles={['font-weight', 'fontWeight']}
            onParsed={(dom, RNElements) => {
              // Find the index of the first paragraph
              console.log("RneElement :: ", RNElements)
              let all_slot = RNElements.map(e => {
                let slot = { ...e }
                if (slot?.attribs?.style && typeof slot.attribs.style == "string" && slot.attribs.style.includes('Sarabun, sans-serif')) {
                  let oriTxt = slot.attribs.style
                  let parseTxt = oriTxt.replace("Sarabun, sans-serif", "Kanit-Medium")
                  slot.attribs.style = parseTxt
                }
                return slot
              })
              return all_slot;
            }}
          />
          : <Text>{""}</Text>}
      </ScrollView>
      <View style={BUTTON_ROOT}>
        <Button
          testID="accept-policy"
          style={{
            ...CONTINUE_BUTTON,
            backgroundColor: color.primary
          }}
          textStyle={CONTINUE_TEXT}
          text={translate('acceptPolicyScreen.accept')}
          onPress={onContinue}
        />
        <Button
          testID="cancel-policy"
          style={CONTINUE_BUTTON}
          textStyle={CONTINUE_TEXT}
          text={translate('acceptPolicyScreen.cancel')}
          onPress={() => {
            AuthStore.clearAuthProfile()
            tokenStore.clearToken()
            navigation.navigate("signin")
          }}
        />
      </View>
    </View>
  )
});
