import React from "react"
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { HomeScreen, SettingScreen } from "../screens"
import { HomeNavigator } from './home-navigator'
import { MyJobNavigator } from './myjob-navigator'
import { FavoriteNavigator } from './favorite-navigator'
import { ProfileNavigator } from './profile-navigator'
import { MoreNavigator } from './more-navigator'
import { color } from '../theme'
import Icon22 from 'react-native-vector-icons/Ionicons'
import { translate } from "../i18n"

const Tab = createBottomTabNavigator();
export default function BottomNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home' || route.name == "หน้าแรก") {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'home' : "home")
                            : (Platform.OS === 'ios' ? 'home-outline' : "home-outline");
                    } else if (route.name === 'My Job' || route.name == "งานของฉัน") {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'clipboard' : "clipboard")
                            : (Platform.OS === 'ios' ? 'clipboard-outline' : "clipboard-outline");
                    } else if (route.name === 'Favorite' || route.name == "ถูกใจ") {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'heart' : "heart")
                            : (Platform.OS === 'ios' ? 'heart-outline' : "heart-outline")
                    } else if (route.name === 'Profile' || route.name == "โปรไฟล์") {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'person' : "person")
                            : (Platform.OS === 'ios' ? 'person-outline' : "person-outline")
                    } else if (route.name === 'More' || route.name == "อื่นๆ") {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'ellipsis-horizontal' : "ellipsis-horizontal")
                            : (Platform.OS === 'ios' ? 'ellipsis-horizontal-outline' : "ellipsis-horizontal-outline")
                    }

                    return <Icon22 name={iconName} size={24} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: color.mainTheme,
                inactiveTintColor: color.grey,
            }}
        >
            <Tab.Screen name={translate("bottomTab.home")} component={HomeNavigator} />
            <Tab.Screen name={translate("bottomTab.myJob")} component={MyJobNavigator} />
            <Tab.Screen name={translate("bottomTab.favorite")} component={FavoriteNavigator} />
            <Tab.Screen name={translate("bottomTab.profile")} component={ProfileNavigator} />
            <Tab.Screen name={translate("bottomTab.more")} component={MoreNavigator} />
        </Tab.Navigator>
    );
}