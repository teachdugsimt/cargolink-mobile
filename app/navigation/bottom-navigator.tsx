import React, { useEffect } from "react"
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
      initialRouteName={'Home'}
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home' || route.name == "หน้าแรก") {
              iconName = focused
                ? (Platform.OS === 'ios' ? 'home' : "home")
                : (Platform.OS === 'ios' ? 'home-outline' : "home-outline");
            } else if (route.name === 'MyJob' || route.name == "งานของฉัน") {
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
        }
      }}
      tabBarOptions={{
        activeTintColor: color.mainTheme,
        inactiveTintColor: color.line,
      }}
    >
      <Tab.Screen name={"Home"} component={HomeNavigator}
        options={{ tabBarLabel: translate("bottomTab.home") }}
      />
      <Tab.Screen name={"MyJob"} component={MyJobNavigator}
        options={{ tabBarLabel: translate("bottomTab.myJob") }}
      />
      <Tab.Screen name={"Favorite"} component={FavoriteNavigator}
        options={{ tabBarLabel: translate("bottomTab.favorite") }}
      />
      <Tab.Screen name={"Profile"} component={ProfileNavigator}
        options={{ tabBarLabel: translate("bottomTab.profile") }}
      />
      <Tab.Screen name={"More"} component={MoreNavigator}
        options={{ tabBarLabel: translate("bottomTab.more") }}
      />

    </Tab.Navigator>
  );
}

