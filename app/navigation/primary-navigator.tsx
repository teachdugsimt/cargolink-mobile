/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import {
  ConfirmCodeScreen, AcceptPolicyScreen, SigninScreen, LocationPickerScreen,
  AddAddressScreen, UpdateProfileScreen
} from "../screens"
import { HeaderCenter, HeaderLeft } from "../components"
import BottomNavigator from './bottom-navigator'
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type PrimaryParamList = {
  signin: undefined
  confirmCode: undefined
  acceptPolicy: undefined
  home: undefined
  locationPicker: undefined
  addAddress: undefined
  // premiumDetail: undefined
  updateProfileWithoutBottomTab: undefined
}

// Documentation: https://github.com/software-mansion/react-native-screens/tree/master/native-stack
const Stack = createNativeStackNavigator<PrimaryParamList>()
const initProps: any = { fromOtp: true }
export function PrimaryNavigator() {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        stackAnimation: 'slide_from_right',
      }}
      initialRouteName={'home'}
    >
      <Stack.Screen name="signin" component={SigninScreen} />
      <Stack.Screen name="confirmCode" component={ConfirmCodeScreen} />
      <Stack.Screen name="acceptPolicy" component={AcceptPolicyScreen} />
      <Stack.Screen name="home" component={BottomNavigator} />
      <Stack.Screen name="locationPicker" component={LocationPickerScreen} />
      <Stack.Screen name="updateProfileWithoutBottomTab"
        options={({ navigation, route }) => ({
          headerShown: true,
          headerCenter: () => <HeaderCenter tx={"profileScreen.profile"} />,
          headerLeft: () => (<></>),
        })} component={UpdateProfileScreen} initialParams={initProps} />
      <Stack.Screen
        name="addAddress"
        component={AddAddressScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerCenter: () => <HeaderCenter tx={"addAddressScreen.isSaveAddress"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />

    </Stack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome", 'signin']
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
