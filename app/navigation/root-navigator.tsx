/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your PrimaryNavigator) which the user
 * will use once logged in.
 */
import React from "react"
import { StatusBar } from 'react-native'
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { PrimaryNavigator } from "./primary-navigator"

// import BottomNavigator from './bottom-navigator'
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * We recommend using MobX-State-Tree store(s) to handle state rather than navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type RootParamList = {
  primaryStack: undefined
}

const Stack = createNativeStackNavigator<RootParamList>()

// const RootStack = () => {
//   const isSignin = true
//   return (
//     <>
//       {isSignin == true ? <BottomNavigator /> : <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//           gestureEnabled: true,
//           stackPresentation: "modal",
//         }}
//       >
//         <Stack.Screen
//           name="primaryStack"
//           component={PrimaryNavigator}
//           options={{
//             headerShown: false,
//           }}
//         />
//       </Stack.Navigator>}
//     </>
//   )
// }

const RootStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          // stackPresentation: "modal",
        }}
      >
        <Stack.Screen
          name="primaryStack"
          component={PrimaryNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  )
}

export const RootNavigator = React.forwardRef<
  NavigationContainerRef,
  Partial<React.ComponentProps<typeof NavigationContainer>>
>((props, ref) => {
  return (
    <NavigationContainer {...props} ref={ref}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" animated={true} />
      <RootStack />
    </NavigationContainer>
  )
})

RootNavigator.displayName = "RootNavigator"
