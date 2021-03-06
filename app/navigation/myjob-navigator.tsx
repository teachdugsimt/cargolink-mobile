/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React, { } from "react"
import { observer } from 'mobx-react-lite'
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { HeaderCenter, RenderHeader, HeaderLeft, TabBar } from "../components"
import {
  FeedbackScreen, JobDetailScreen, MyJobScreen, ReceivePointScreen, PostJobScreen,
  CheckInformationScreen,
  PostSuccessScreen,
  ShipperProfileScreen, SelectTruckTypeScreen, SelectProductTypeScreen,
  CarrierProfileScreen, TruckDetailOnlyScreen, TruckDetailWithProfile
} from "../screens"
import { color } from "../theme"
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
export type PrimaryMyJobParamList = {
  myjob: undefined
  myJobDetail: undefined
  myFeedback: undefined
  receivePoint: undefined
  postjob: undefined
  checkInformation: undefined
  postSuccess: undefined
  bookerProfile: undefined
  truckDetailOnly: undefined
  myJobDetailOwner: undefined
  truckDetailWithProfile: undefined
  selectTruckType: undefined
  selectProductType: undefined
}

// Documentation: https://github.com/software-mansion/react-native-screens/tree/master/native-stack
const Stack = createNativeStackNavigator<PrimaryMyJobParamList>()

export function MyJobNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={"myjob"}
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        // headerStyle: { backgroundColor: color.mainTheme, },
        stackAnimation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="myjob" component={MyJobScreen}
        options={({ navigation, route }) => ({
          // headerStyle: { backgroundColor: color.mainTheme, },
          headerTitle: '',
          headerCenter: () => <RenderHeader text={"myJobScreen.myJob"} />,
          headerLeft: () => null,
          headerHideShadow: true,
        })}
      />

      <Stack.Screen name="myJobDetail" component={JobDetailScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"jobDetailScreen.jobDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />

      <Stack.Screen name="myFeedback" component={FeedbackScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"feedbackScreen.yourOpinion"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />

      <Stack.Screen name="postjob" component={PostJobScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"postJobScreen.postjob"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.navigate("MyJob", { screen: "myjob" })} />),
          headerHideShadow: true
        })}
      />

      <Stack.Screen name="receivePoint" component={ReceivePointScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"feedbackScreen.yourOpinion"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.navigate("MyJob", { screen: "postjob" })} />),
          headerHideShadow: true
        })}
      />

      <Stack.Screen name="checkInformation" component={CheckInformationScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"postJobScreen.postjob"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.navigate("MyJob", { screen: "receivePoint" })} />),
          headerHideShadow: true
        })}
      />
      <Stack.Screen name="postSuccess" component={PostSuccessScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"postJobScreen.postjob"} />,
          // headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.navigate("MyJob", { screen: "checkInformation" })} />),
          headerHideShadow: true
        })}
      />

      <Stack.Screen name="bookerProfile" component={CarrierProfileScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"feedbackScreen.yourOpinion"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />

      <Stack.Screen name="truckDetailOnly" component={TruckDetailOnlyScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"truckDetailScreen.truckDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />

      <Stack.Screen name="myJobDetailOwner" component={JobDetailScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"jobDetailScreen.jobDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />

      <Stack.Screen name="truckDetailWithProfile" component={TruckDetailWithProfile}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"truckDetailScreen.truckDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />

      <Stack.Screen
        name="selectTruckType"
        component={SelectTruckTypeScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"postJobScreen.selectVehicleType"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen
        name="selectProductType"
        component={SelectProductTypeScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"postJobScreen.selectItemType"} />,
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
// const exitRoutes = ["myjob"]
// export const canExitMyJob = (routeName: string) => exitRoutes.includes(routeName)
