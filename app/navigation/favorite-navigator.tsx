/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { HeaderCenter, HeaderLeft } from "../components"
import { FavoriteScreen, JobDetailScreen, TruckDetailScreen } from "../screens"
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
export type PrimaryFavoriteParamList = {
    favorite: undefined,
    favoriteJobDetail: undefined,
    favoriteTruckDetail: undefined,
}

// Documentation: https://github.com/software-mansion/react-native-screens/tree/master/native-stack
const Stack = createNativeStackNavigator<PrimaryFavoriteParamList>()

export function FavoriteNavigator() {

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
            <Stack.Screen name="favorite" component={FavoriteScreen}
                options={({ navigation, route }) => ({
                    headerCenter: () => <HeaderCenter tx={"favoriteScreen.favoriteList"} />,
                    headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
                    headerHideShadow: true
                })}
            />

            <Stack.Screen name="favoriteJobDetail" component={JobDetailScreen}
                options={({ navigation, route }) => ({
                    headerCenter: () => <HeaderCenter tx={"jobDetailScreen.jobDetail"} />,
                    headerLeft: () => (<HeaderLeft onLeftPress={() => navigation.goBack()} />),
                })} />

            <Stack.Screen name="favoriteTruckDetail" component={TruckDetailScreen}
                options={({ navigation, route }) => ({
                    headerCenter: () => <HeaderCenter tx={"truckDetailScreen.truckDetail"} />,
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
