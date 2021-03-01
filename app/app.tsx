/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app or storybook.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigation, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignore-warnings"
import { ModalPortal } from 'react-native-modals';
import React, { useState, useEffect, useRef } from "react"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAreaProvider, initialWindowSafeAreaInsets } from "react-native-safe-area-context"
import SplashScreen from 'react-native-splash-screen'
import * as storage from "./utils/storage"
import {
  useBackButtonHandler,
  RootNavigator,
  canExit,
  setRootNavigation,
  useNavigationPersistence,
} from "./navigation"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';
import ScreenOrientation, { PORTRAIT, LANDSCAPE } from "react-native-orientation-locker/ScreenOrientation";

// import crashlytics from '@react-native-firebase/crashlytics';

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from "react-native-screens"
enableScreens()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
function App(props: any) {
  const navigationRef = useRef<NavigationContainerRef>()
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)
  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY,
  )

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    ; (async () => {
      setupRootStore().then(setRootStore)
    })()
    SplashScreen.hide()
    // crashlytics().crash()
    // crashlytics().log('App mounted.')
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color. You can replace
  // with your own loading component if you wish.
  if (!rootStore) return null

  console.log("App js props : ", props)


  console.log(VersionCheck.getPackageName());        // com.reactnative.app
  console.log(VersionCheck.getCurrentBuildNumber()); // 10
  console.log(VersionCheck.getCurrentVersion());     // 0.1.1
  // VersionCheck.getAppStoreUrl({
  //   appID: "1526170990"
  // }).then(e => {
  //   console.log(e)
  // })

  VersionCheck.needUpdate({
    forceUpdate: true,
  }).then(async res => {
    console.log('Latest Version', res)
    console.log(res?.isNeeded);    // true
    if (res?.isNeeded) {
      Linking.openURL(res.storeUrl);  // open store if update is needed.
    }
  }).catch(async err => {
    console.log(err)
  });


  // otherwise, we're ready to render the app
  return (
    <RootStoreProvider value={rootStore}>
      <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
        <ScreenOrientation
          orientation={PORTRAIT}
          onChange={orientation => console.log('onChange', orientation)}
          onDeviceChange={orientation => console.log('onDeviceChange', orientation)}
        />
        <RootNavigator
          ref={navigationRef}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
        <ModalPortal />
      </SafeAreaProvider>
    </RootStoreProvider>
  )
}

export default App
