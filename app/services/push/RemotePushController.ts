import React, { useEffect } from 'react'

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification'

import { useLinkTo } from '@react-navigation/native';

const RemotePushController = () => {

  // const linkTo = useLinkTo();

  useEffect(() => {
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      // onRegister: function (token) {
      //   console.log("TOKEN:", token);
      // },
      // priority: "max",
      // visibility: "public",
      // importance: "max",
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("REMOTE NOTIFICATION:", notification);


        // PushNotification.localNotification({
        //   /* Android Only Properties */
        //   channelId: "new-job", // (required) channelId, if the channel doesn't exist, notification will not trigger.
        //   // ticker: "My Notification Ticker",
        //   // vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        //   priority: "max",
        //   visibility: "public",
        //   importance: "max",
        //   /* iOS and Android properties */
        //   title: notification.title,
        //   message: notification.body,
        //   actions: ['ดูข้อมูล'],
        //   invokeApp: false,


        //   // reply_placeholder_text: "Write your response...", // (required)
        //   // reply_button_text: "Reply" // (required)

        // });
        // linkTo('cgl://job/detail/1111')

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      actions: ['ดูข้อมูล'],
      // // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("REMOTE NOTIFICATION:", notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      invokeApp: false,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });

  }, [])
  return null
}

export default RemotePushController
