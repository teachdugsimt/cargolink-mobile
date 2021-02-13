import React, { useState } from 'react'
import { View, TouchableOpacity, Platform, SafeAreaView, Dimensions, Animated, ViewStyle } from 'react-native';
import Icon22 from 'react-native-vector-icons/Ionicons'
import { color, spacing } from '../../theme';
import { Text } from '../text/text';

const CONTAINER: ViewStyle = {
  flexDirection: 'row',
  backgroundColor: color.backgroundWhite,
  position: 'relative',
  borderTopWidth: 2,
  borderTopColor: color.disable,
}
const ROOT_ICON: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: -25,
  width: 50,
  height: 50,
  borderRadius: 25,
  borderWidth: 5,
  overflow: 'hidden',
  borderColor: color.backgroundWhite,
  // borderColor: '#f2f2f2',
}

const Icon = ({ routeName, focused, color }) => {
  let iconName: string = null;
  if (routeName === 'Home' || routeName == "หน้าแรก") {
    iconName = focused
      ? (Platform.OS === 'ios' ? 'home' : "home")
      : (Platform.OS === 'ios' ? 'home-outline' : "home-outline");
  } else if (routeName === 'MyJob' || routeName == "งานของฉัน") {
    iconName = focused
      ? (Platform.OS === 'ios' ? 'clipboard' : "clipboard")
      : (Platform.OS === 'ios' ? 'clipboard-outline' : "clipboard-outline");
  } else if (routeName === 'Favorite' || routeName == "ถูกใจ") {
    iconName = focused
      ? (Platform.OS === 'ios' ? 'heart' : "heart")
      : (Platform.OS === 'ios' ? 'heart-outline' : "heart-outline")
  } else if (routeName === 'Profile' || routeName == "โปรไฟล์") {
    iconName = focused
      ? (Platform.OS === 'ios' ? 'person' : "person")
      : (Platform.OS === 'ios' ? 'person-outline' : "person-outline")
  } else if (routeName === 'More' || routeName == "อื่นๆ") {
    iconName = focused
      ? (Platform.OS === 'ios' ? 'ellipsis-horizontal' : "ellipsis-horizontal")
      : (Platform.OS === 'ios' ? 'ellipsis-horizontal-outline' : "ellipsis-horizontal-outline")
  }
  return <Icon22 name={iconName} size={24} color={color} />;
}

export const BottomTabNavigation = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  const [bottomValue] = useState(new Animated.Value(0))

  const onMoveUp = () => {
    Animated.timing(bottomValue, {
      toValue: -5,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onMoveDown()
      }
    })
  }

  const onMoveDown = () => {
    Animated.timing(bottomValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <SafeAreaView style={CONTAINER}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }

          onMoveUp()
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const isColor = isFocused ? color.primary : color.line

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', paddingTop: spacing[2] }}
            key={index}
            activeOpacity={1}
          >
            {isFocused ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Animated.View style={[ROOT_ICON, {
                  backgroundColor: color.primary,
                  transform: [{
                    translateY: bottomValue
                  }],
                }]}>
                  <Icon routeName={route.name} focused={isFocused} color={isFocused ? color.textWhite : color.line} />
                </Animated.View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Text text={label} style={{ color: isColor }} preset={'small'} />
                </View>
              </View>
            ) : (
                <View style={{ alignItems: 'center' }}>
                  <Icon routeName={route.name} focused={isFocused} color={isColor} />
                  <Text text={label} style={{ color: isColor }} preset={'small'} />
                </View>
              )}
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
}
