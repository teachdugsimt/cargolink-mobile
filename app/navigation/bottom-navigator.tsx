import React from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { HomeScreen, SettingScreen } from "../screens"
import { HomeNavigator } from './home-navigator'
import { MyJobNavigator } from './myjob-navigator'
import { FavoriteNavigator } from './favorite-navigator'
import { ProfileNavigator } from './profile-navigator'
import { MoreNavigator } from './more-navigator'
import { color } from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'
const Tab = createBottomTabNavigator();
export default function BottomNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused
                            ? 'home'
                            : 'home-outline';
                    } else if (route.name === 'setting') {
                        iconName = focused
                            ? 'clipboard'
                            : 'clipboard-outline';
                    } else if (route.name === 'My Job') {
                        iconName = focused
                            ? 'settings'
                            : 'settings-outline';
                    } else if (route.name === 'Favorite') {
                        iconName = focused
                            ? 'heart'
                            : 'heart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused
                            ? 'person'
                            : 'person-outline';
                    } else if (route.name === 'More') {
                        iconName = focused
                            ? 'ellipsis-horizontal-sharp'
                            : 'ellipsis-horizontal-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: color.mainTheme,
                inactiveTintColor: color.grey,
            }}
        >
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen name="My Job" component={MyJobNavigator} />
            <Tab.Screen name="Favorite" component={FavoriteNavigator} />
            <Tab.Screen name="Profile" component={ProfileNavigator} />
            <Tab.Screen name="More" component={MoreNavigator} />
        </Tab.Navigator>
    );
}