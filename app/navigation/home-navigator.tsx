/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { Text, HeaderCenter, HeaderLeft } from "../components"
import { color } from '../theme'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  DetailScreen, HomeScreen, JobDetailScreen, MyVehicle, PostJobScreen, SearchJobScreen, AdvanceSearchScreen,
  UploadVehicleScreen, SuccessUpload,
  VehicleDetailScreen, CheckInformationScreen,
  ShipperProfileScreen, ReceivePointScreen, FeedbackScreen, SearchTruckScreen,
  PostSuccessScreen, AdvanceSearchTruckScreen, TruckDetailScreen, SelectJobScreen, CommentScreen,
  CarrierProfileScreen, SelectTruckScreen
} from "../screens"
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
export type PrimaryHomeParamList = {
  detail: undefined
  home: undefined
  postjob: undefined
  searchJob: undefined
  advanceSearch: undefined
  jobDetail: undefined
  searchTruck: undefined
  uploadVehicle: undefined
  myVehicle: undefined
  vehicleDetail: undefined
  uploadSuccess: undefined
  shipperProfile: undefined
  receivePoint: undefined
  feedback: undefined
  advanceSearchJob: undefined
  truckDetail: undefined,
  checkInformation: undefined
  postSuccess: undefined
  comment: undefined
  myJobList: undefined
  myTruckList: undefined
  carrierProfile: undefined
  jobDetailOwner: undefined
  truckDetailOwner: undefined
}

// Documentation: https://github.com/software-mansion/react-native-screens/tree/master/native-stack
const Stack = createNativeStackNavigator<PrimaryHomeParamList>()

export function HomeNavigator() {

  return (
    <Stack.Navigator
      initialRouteName={"home"}
      screenOptions={{
        gestureEnabled: true,
        headerShown: true,
        // gestureEnabled: true,
        headerStyle: {
          backgroundColor: color.primary,
        },
        headerTitleStyle: {
          fontFamily: 'Kanit-Medium',
          fontSize: 20
        },
        stackAnimation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" component={HomeScreen}
        options={({ navigation, route }) => {
          return {
            // headerRight: () => (
            //   <Ionicons
            //     onPress={() => console.log("++ Press notofication icon ++")}
            //     name={"notifications-outline"}
            //     color={color.black}
            //     size={24}
            //   />
            // ),
            headerTitle: '',
            headerHideShadow: true
          }
        }}
      />
      <Stack.Screen name="detail" component={DetailScreen} />
      <Stack.Screen name="comment" component={CommentScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"commentScreen.yourComment"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
          headerHideShadow: true
        })}
      />



      <Stack.Screen name="postjob" component={PostJobScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"postJobScreen.postjob"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
          headerHideShadow: true
        })}
      />
      <Stack.Screen name="receivePoint" component={ReceivePointScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"postJobScreen.postjob"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
          headerHideShadow: true
        })}
      />
      <Stack.Screen name="checkInformation" component={CheckInformationScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"postJobScreen.postjob"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
          headerHideShadow: true
        })}
      />
      <Stack.Screen name="postSuccess" component={PostSuccessScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"postJobScreen.postjob"} />,
          // headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
          headerHideShadow: true
        })}
      />




      <Stack.Screen name="searchJob"
        component={SearchJobScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"homeScreen.findJob"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
          headerHideShadow: true
        })} />
      <Stack.Screen name="advanceSearch" component={AdvanceSearchScreen}
        options={({ navigation, route }) => ({
          headerRight: () => <Text tx={"searchJobScreen.clear"} onPress={() => console.log('Clear all!!')} />,
          headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen name="jobDetail" component={JobDetailScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"jobDetailScreen.jobDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen name="jobDetailOwner" component={JobDetailScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"jobDetailScreen.jobDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen name="searchTruck" component={SearchTruckScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"searchTruckScreen.findTruck"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />

      <Stack.Screen name="uploadVehicle" component={UploadVehicleScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"uploadVehicleScreen.addVehicle"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />

      <Stack.Screen
        name="myVehicle"
        component={MyVehicle}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"myVehicleScreen.myTruckHeader"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen
        name="vehicleDetail"
        component={VehicleDetailScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"myVehicleScreen.myTruckHeader"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen
        name="uploadSuccess"
        component={SuccessUpload}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"myVehicleScreen.addNewCar"} />,
          headerLeft: () => (null),
        })}
      />
      <Stack.Screen
        name="shipperProfile"
        component={ShipperProfileScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"profileScreen.profile"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen
        name="carrierProfile"
        component={CarrierProfileScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"profileScreen.profile"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen
        name="feedback"
        component={FeedbackScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"feedbackScreen.yourOpinion"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen name="advanceSearchJob" component={AdvanceSearchTruckScreen}
        options={({ navigation, route }) => ({
          headerRight: () => <Text tx={"searchJobScreen.clear"} onPress={() => console.log('Clear all!!')} />,
          headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen
        name="truckDetail"
        component={TruckDetailScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"truckDetailScreen.truckDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen
        name="truckDetailOwner"
        component={TruckDetailScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"truckDetailScreen.truckDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen
        name="myJobList"
        component={SelectJobScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"myJobScreen.myJob"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })}
      />
      <Stack.Screen
        name="myTruckList"
        component={SelectTruckScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"myVehicleScreen.myTruck"} />,
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
// const exitRoutes = ["home"]
// export const canExit = (routeName: string) => exitRoutes.includes(routeName)
