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
import { BottomTabNavigation } from "../components/bottom-tab-navigation/bottom-tab-navigation";
import { useNavigation } from "@react-navigation/native"
import { useStores } from '../models'
import { observer } from "mobx-react-lite"
// import { VersatileStore } from "../store/versatile-store/versatile-store";

const Tab = createBottomTabNavigator();

export default observer(function BottomNavigator() {

  const { versatileStore } = useStores()

  const navigation = useNavigation()
  useEffect(() => {
    navigation.navigate('Home', { screen: 'home' })
  }, [])

  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      screenOptions={({ route }) => {
        return {
        }
      }}
      tabBarOptions={{
        activeTintColor: color.mainTheme,
        inactiveTintColor: color.line,
      }}
      tabBar={props => <BottomTabNavigation {...props} />}
    >
      <Tab.Screen name={"Home"} component={HomeNavigator}
        options={{
          title: translate("bottomTab.home", { locale: versatileStore.language }),
          // tabBarLabel: translate("bottomTab.home", { locale: versatileStore.language })
          tabBarIcon: ({ focused, color, size }) => <Icon22 name={focused
            ? (Platform.OS === 'ios' ? 'home' : "home")
            : (Platform.OS === 'ios' ? 'home-outline' : "home-outline")}
            size={24} color={color} />
        }}
      />
      <Tab.Screen name={"MyJob"} component={MyJobNavigator}
        options={{
          tabBarLabel: translate("bottomTab.myJob", { locale: versatileStore.language }),
          tabBarIcon: ({ focused, color, size }) => <Icon22 name={focused
            ? (Platform.OS === 'ios' ? 'clipboard' : "clipboard")
            : (Platform.OS === 'ios' ? 'clipboard-outline' : "clipboard-outline")}
            size={24} color={color} />
        }}
      />
      <Tab.Screen name={"Favorite"} component={FavoriteNavigator}
        options={{
          tabBarLabel: translate("bottomTab.favorite", { locale: versatileStore.language }),
          tabBarIcon: ({ focused, color, size }) => <Icon22 name={focused
            ? (Platform.OS === 'ios' ? 'heart' : "heart")
            : (Platform.OS === 'ios' ? 'heart-outline' : "heart-outline")}
            size={24} color={color} />
        }}
      />
      <Tab.Screen name={"Profile"} component={ProfileNavigator}
        options={{
          tabBarLabel: translate("bottomTab.profile", { locale: versatileStore.language }),
          tabBarIcon: ({ focused, color, size }) => <Icon22 name={focused
            ? (Platform.OS === 'ios' ? 'person' : "person")
            : (Platform.OS === 'ios' ? 'person-outline' : "person-outline")}
            size={24} color={color} />
        }}
      />
      <Tab.Screen name={"More"} component={MoreNavigator}
        options={{
          tabBarLabel: translate("bottomTab.more", { locale: versatileStore.language }),
          tabBarIcon: ({ focused, color, size }) => <Icon22 name={focused
            ? (Platform.OS === 'ios' ? 'ellipsis-horizontal' : "ellipsis-horizontal")
            : (Platform.OS === 'ios' ? 'ellipsis-horizontal-outline' : "ellipsis-horizontal-outline")}
            size={24} color={color} />
        }}
      />

    </Tab.Navigator>
  );
})

