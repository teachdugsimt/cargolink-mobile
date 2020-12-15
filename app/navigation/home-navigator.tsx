/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { ViewStyle, View, Image } from 'react-native'
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { Icon, Text, HeaderCenter, HeaderLeft, HeaderRight } from "../components"
import { color, images } from '../theme'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
    DetailScreen, HomeScreen, JobDetailScreen, PostJobScreen, SearchCarScreen, SearchJobScreen, SettingSearchScreen,
    UploadVehicleScreen
} from "../screens"
import { translate } from "../i18n"
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
    settingSearch: undefined
    jobDetail: undefined
    searchCar: undefined
    uploadVehicle: undefined
}

// Documentation: https://github.com/software-mansion/react-native-screens/tree/master/native-stack
const Stack = createNativeStackNavigator<PrimaryHomeParamList>()

const SHADOW: ViewStyle = {
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
}

const HEADER_STYLE: ViewStyle = {
    width: '100%'
}

export function HomeNavigator() {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                gestureEnabled: true,
                headerStyle: {
                    backgroundColor: color.mainTheme,
                },
                headerTitleStyle: {
                    fontFamily: 'Kanit-Medium',
                    fontSize: 20
                },
            }}
        >
            <Stack.Screen name="home" component={HomeScreen}
                options={({ navigation, route }) => {
                    return { // title: route.params.name,
                        headerRight: () => (
                            <Ionicons
                                onPress={() => console.log("++ Press notofication icon ++")}
                                name={"notifications-outline"}
                                color={color.black}
                                size={24}
                            />
                        ),
                        headerTitle: '',
                        headerHideShadow: true
                    }
                }}
            />
            <Stack.Screen name="detail" component={DetailScreen} />




            <Stack.Screen name="postjob" component={PostJobScreen}
                options={({ navigation, route }) => ({
                    // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
                    headerCenter: () => <HeaderCenter tx={"postJobScreen.postjob"} />,
                    headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
                    headerHideShadow: true
                })}

            />




            <Stack.Screen name="searchJob"
                component={SearchJobScreen}
                options={({ navigation, route }) => ({
                    // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
                    headerCenter: () => <HeaderCenter tx={"searchJobScreen.searchJob"} />,
                    headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
                    headerHideShadow: true
                })} />
            <Stack.Screen name="settingSearch" component={SettingSearchScreen} />
            <Stack.Screen name="jobDetail" component={JobDetailScreen} />
            <Stack.Screen name="searchCar" component={SearchCarScreen} />

            <Stack.Screen name="uploadVehicle" component={UploadVehicleScreen}
                options={({ navigation, route }) => ({
                    // headerRight: () => <HeaderRight iconName={"notifications-outline"} iconSize={24} iconColor={'red'} onRightPress={() => console.log("Right press:::")}/>,
                    headerCenter: () => <HeaderCenter tx={"uploadVehicleScreen.addVehicle"} />,
                    headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
                })} />
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
