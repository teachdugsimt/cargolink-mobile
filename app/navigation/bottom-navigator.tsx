// import React from "react"
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { HomeScreen, SettingScreen } from "../screens"
// import { HomeNavigator } from './home-navigator'
// import { MyJobNavigator } from './myjob-navigator'
// import { FavoriteNavigator } from './favorite-navigator'
// import { ProfileNavigator } from './profile-navigator'
// import { MoreNavigator } from './more-navigator'
// import { color } from '../theme'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// const Tab = createBottomTabNavigator();
// export default function BottomNavigator() {
//     return (
//         <Tab.Navigator
//             screenOptions={({ route }) => ({
//                 tabBarIcon: ({ focused, color, size }) => {
//                     console.log("ICON :: ", Ionicons)
//                     let iconName;
//                     if (route.name === 'Home') {
//                         iconName = focused
//                             ? 'home'
//                             : 'home';
//                     } else if (route.name === 'setting') {
//                         iconName = focused
//                             ? 'clipboard'
//                             : 'clipboard';
//                     } else if (route.name === 'My Job') {
//                         iconName = focused
//                             ? 'clipboard'
//                             : 'clipboard';
//                     } else if (route.name === 'Favorite') {
//                         iconName = focused
//                             ? 'heart'
//                             : 'heart';
//                     } else if (route.name === 'Profile') {
//                         iconName = focused
//                             ? 'person'
//                             : 'person';
//                     } else if (route.name === 'More') {
//                         iconName = focused
//                             ? 'ellipsis-horizontal-sharp'
//                             : 'ellipsis-horizontal';
//                     }

//                     return <Ionicons name={iconName} size={24} color={color}/>;
//                 },
//             })}
//             tabBarOptions={{
//                 activeTintColor: color.mainTheme,
//                 inactiveTintColor: color.grey,
//             }}
//         >
//             <Tab.Screen name="Home" component={HomeNavigator} />
//             <Tab.Screen name="My Job" component={MyJobNavigator} />
//             <Tab.Screen name="Favorite" component={FavoriteNavigator} />
//             <Tab.Screen name="Profile" component={ProfileNavigator} />
//             <Tab.Screen name="More" component={MoreNavigator} />
//         </Tab.Navigator>
//     );
// }






// // ignite add vector-icons // link + info.plist
// import React from "react"
// import { Platform } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { HomeScreen, SettingScreen } from "../screens"
// import { HomeNavigator } from './home-navigator'
// import { MyJobNavigator } from './myjob-navigator'
// import { FavoriteNavigator } from './favorite-navigator'
// import { ProfileNavigator } from './profile-navigator'
// import { MoreNavigator } from './more-navigator'
// import { color } from '../theme'
// import Icon22 from 'react-native-vector-icons/Ionicons'

// const Tab = createBottomTabNavigator();
// export default function BottomNavigator() {
//     return (
//         <Tab.Navigator
//             screenOptions={({ route }) => ({
//                 tabBarIcon: ({ focused, color, size }) => {
//                     console.log("ICON :: ", Icon22)
//                     let iconName;
//                     if (route.name === 'Home') {
//                         iconName = focused
//                             ? (Platform.OS === 'ios' ? 'ios-home' : "md-home")
//                             : (Platform.OS === 'ios' ? 'ios-home' : "md-home");
//                     } else if (route.name === 'My Job') {
//                         iconName = focused
//                             ? (Platform.OS === 'ios' ? 'ios-clipboard' : "md-clipboard")
//                             : (Platform.OS === 'ios' ? 'ios-clipboard' : "md-clipboard");
//                     } else if (route.name === 'Favorite') {
//                         iconName = focused
//                             ? (Platform.OS === 'ios' ? 'ios-heart' : "md-heart")
//                             : (Platform.OS === 'ios' ? 'ios-heart' : "md-heart")
//                     } else if (route.name === 'Profile') {
//                         iconName = focused
//                             ? (Platform.OS === 'ios' ? 'ios-person' : "md-person")
//                             : (Platform.OS === 'ios' ? 'ios-person' : "md-person")
//                     } else if (route.name === 'More') {
//                         iconName = focused
//                             ? (Platform.OS === 'ios' ? 'ios-ellipsis' : "md-ellipsis")
//                             : (Platform.OS === 'ios' ? 'ios-ellipsis' : "md-ellipsis")
//                     }

//                     return <Icon22 name={iconName} size={24} color={color} />;
//                 },
//             })}
//             tabBarOptions={{
//                 activeTintColor: color.mainTheme,
//                 inactiveTintColor: color.grey,
//             }}
//         >
//             <Tab.Screen name="Home" component={HomeNavigator} />
//             <Tab.Screen name="My Job" component={MyJobNavigator} />
//             <Tab.Screen name="Favorite" component={FavoriteNavigator} />
//             <Tab.Screen name="Profile" component={ProfileNavigator} />
//             <Tab.Screen name="More" component={MoreNavigator} />
//         </Tab.Navigator>
//     );
// }









// npm install --save react-native-vector-icons
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

const Tab = createBottomTabNavigator();
export default function BottomNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {

                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'home' : "home")
                            : (Platform.OS === 'ios' ? 'home-outline' : "home-outline");
                    } else if (route.name === 'My Job') {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'clipboard' : "clipboard")
                            : (Platform.OS === 'ios' ? 'clipboard-outline' : "clipboard-outline");
                    } else if (route.name === 'Favorite') {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'heart' : "heart")
                            : (Platform.OS === 'ios' ? 'heart-outline' : "heart-outline")
                    } else if (route.name === 'Profile') {
                        iconName = focused
                            ? (Platform.OS === 'ios' ? 'person' : "person")
                            : (Platform.OS === 'ios' ? 'person-outline' : "person-outline")
                    } else if (route.name === 'More') {
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
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen name="My Job" component={MyJobNavigator} />
            <Tab.Screen name="Favorite" component={FavoriteNavigator} />
            <Tab.Screen name="Profile" component={ProfileNavigator} />
            <Tab.Screen name="More" component={MoreNavigator} />
        </Tab.Navigator>
    );
}