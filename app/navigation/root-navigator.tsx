/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your PrimaryNavigator) which the user
 * will use once logged in.
 */
import React from "react"
import { StatusBar, Text } from 'react-native'
import { NavigationContainer, NavigationContainerRef, DefaultTheme } from "@react-navigation/native"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { PrimaryNavigator } from "./primary-navigator"
import { color } from '../theme'
// import util from 'util'

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
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // background: 'red'
    // primary: 'red'  // don't thtis
    card: color.primary
  }
}
const RootStack = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          // headerStyle: { backgroundColor: color.primary }
          // stackPresentation: "modal",
        }}
        initialRouteName={"primaryStack"}
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

  // console.log('NAV STATE', state)
  const config = {
    screens: {
      primaryStack: {
        screens: {
          home: {
            screens: {
              Home: {
                screens: {
                  jobDetail: {
                    path: 'job/detail/:jobId',
                  }
                }
              }
            }
          }
        },
      },
    },
  };
  const linking = {
    prefixes: ["cgl://"],
    config
  };

  return (
    <NavigationContainer {...props} theme={MyTheme} ref={ref} linking={linking} fallback={<Text>Loading...</Text>}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" animated={true} />
      <RootStack />
    </NavigationContainer>
  )
})

RootNavigator.displayName = "RootNavigator"
