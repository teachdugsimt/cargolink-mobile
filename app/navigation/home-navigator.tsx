/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { Text, HeaderCenter, HeaderLeft } from "../components"
import {
  DetailScreen, HomeScreen, JobDetailScreen, PostJobScreen, SearchJobScreen,
  UploadVehicleScreen, SuccessUpload,
  CheckInformationScreen, SelectProvinceScreen,
  ShipperProfileScreen, ReceivePointScreen, FeedbackScreen, SearchTruckScreen,
  PostSuccessScreen, TruckDetailScreen, SelectJobScreen, CommentScreen,
  CarrierProfileScreen, SelectTruckScreen, AdvanceSearchJobScreen, AdvanceSearchTruckItemScreen, SelectTruckTypeScreen, SelectProductTypeScreen, AdvanceSearchTruckScreen,
  AdvanceSearchJobItemScreen, PremiumDetailScreen, PremiumConsentScreen, PremiumRegisterScreen,
  JobDetailOnlyScreen
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
  // advanceSearch: undefined
  jobDetail: undefined
  searchTruck: undefined
  uploadVehicleHome: undefined
  myVehicle: undefined
  vehicleDetail: undefined
  uploadSuccessHome: undefined
  shipperProfile: undefined
  receivePoint: undefined
  feedback: undefined
  // advanceSearchJob: undefined
  truckDetail: undefined,
  checkInformationHome: undefined
  postSuccess: undefined
  comment: undefined
  myJobList: undefined
  myTruckList: undefined
  carrierProfile: undefined
  jobDetailOwner: undefined
  truckDetailOwner: undefined
  advanceSearchJob: undefined
  advanceSearchTruck: undefined
  advanceSearchTruckItem: undefined
  advanceSearchJobItem: undefined
  selectTruckType: undefined
  selectProductType: undefined
  selectProvinceHome: undefined
  jobDetailOnly: undefined
  // addAddress: undefined
  premiumDetail: undefined
  premiumConsent: undefined
  premiumRegister: undefined
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
        // headerStyle: {
        //   backgroundColor: color.primary,
        // },
        stackAnimation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" component={HomeScreen}
        options={({ navigation, route }) => {
          return {
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
      <Stack.Screen name="checkInformationHome" component={CheckInformationScreen}
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
      {/* <Stack.Screen name="advanceSearch" component={AdvanceSearchScreen}
        options={({ navigation, route }) => ({
          headerRight: () => <Text tx={"searchJobScreen.clear"} onPress={() => console.log('Clear all!!')} />,
          headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} /> */}
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
      {/* <Stack.Screen name="advanceSearchJob" component={AdvanceSearchTruckScreen}
        options={({ navigation, route }) => ({
          headerRight: () => <Text tx={"searchJobScreen.clear"} onPress={() => console.log('Clear all!!')} />,
          headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} /> */}
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
      <Stack.Screen name="advanceSearchJob" component={AdvanceSearchJobScreen}
        options={({ navigation, route }) => ({
          headerRight: () => <Text tx={"searchJobScreen.clear"} onPress={() => console.log('Clear all!!')} />,
          headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen name="advanceSearchTruck" component={AdvanceSearchTruckScreen}
        options={({ navigation, route }) => ({
          headerRight: () => <Text tx={"searchJobScreen.clear"} onPress={() => console.log('Clear all!!')} />,
          headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen name="advanceSearchTruckItem" component={AdvanceSearchTruckItemScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen name="advanceSearchJobItem" component={AdvanceSearchJobItemScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"searchJobScreen.settingSearch"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
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
      <Stack.Screen name="selectProvinceHome" component={SelectProvinceScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"uploadVehicleScreen.workZone"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen name="uploadVehicleHome" component={UploadVehicleScreen}
        options={({ navigation, route }) => ({
          // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
          headerCenter: () => <HeaderCenter tx={"uploadVehicleScreen.addVehicle"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen
        name="uploadSuccessHome"
        component={SuccessUpload}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"myVehicleScreen.addNewCar"} />,
          headerLeft: () => (null),
        })}
      />

      <Stack.Screen name="premiumDetail" component={PremiumDetailScreen}
        options={({ navigation }) => ({
          headerCenter: () => <HeaderCenter text={"Cargolink Premium"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />

      <Stack.Screen name="premiumConsent" component={PremiumConsentScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter text={"?????????????????????????????????????????????????????????"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />

      <Stack.Screen name="premiumRegister" component={PremiumRegisterScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter text={"??????????????????????????????????????????"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
      <Stack.Screen name="jobDetailOnly" component={JobDetailOnlyScreen}
        options={({ navigation, route }) => ({
          headerCenter: () => <HeaderCenter tx={"jobDetailScreen.jobDetail"} />,
          headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
        })} />
    </Stack.Navigator >
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
