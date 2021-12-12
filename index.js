// This is the first file that ReactNative will run when it starts up.
//
// We jump out of here immediately and into our main entry point instead.
//
// It is possible to have React Native load our main module first, but we'd have to
// change that in both AppDelegate.m and MainApplication.java.  This would have the
// side effect of breaking other tooling like mobile-center and react-native-rename.
//
// It's easier just to leave it here.
import App from "./app/app.tsx"
import { AppRegistry, Linking } from "react-native"
// import { NativeModules } from 'react-native'
// console.log(NativeModules.CargoLinkMobile)

import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from "react-native-push-notification";

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "CargoLinkMobile"

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.
const SHOW_STORYBOOK = false

let RootComponent = App
if (__DEV__ && SHOW_STORYBOOK) {
  // Only include Storybook if we're in dev mode
  const { StorybookUIRoot } = require("./storybook")
  RootComponent = StorybookUIRoot
}



messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('BACKGROUND MESSAGE:', remoteMessage);


  PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    // onNotification: function (notification) {
    //   console.log('LOCAL NOTIFICATION ==>', notification)
    // },
    popInitialNotification: true,
    requestPermissions: true,

    // priority: "max",
    // visibility: "public",
    // importance: "max",
    onAction: async (notification) => {
      console.log(notification)
      // PushNotification.invokeApp(notification)
      const url = remoteMessage.data.url
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }
  })

  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "new-job", // (required) channelId, if the channel doesn't exist, notification will not trigger.
    // ticker: "My Notification Ticker",
    // vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    priority: "max",
    visibility: "public",
    importance: "max",
    /* iOS and Android properties */
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
    actions: ['ดูข้อมูลเพิ่มเติม'],
    invokeApp: false,


    // reply_placeholder_text: "Write your response...", // (required)
    // reply_button_text: "Reply" // (required)

  });
});

AppRegistry.registerComponent(APP_NAME, () => RootComponent)
