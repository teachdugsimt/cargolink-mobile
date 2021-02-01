import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, ImageStyle, Platform, TextStyle, TouchableHighlight, View, ViewStyle, Animated, Easing } from 'react-native';
import { color, spacing } from '../../theme';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { SearchBarProps } from './search.bar.props';
// import { Picker } from '@react-native-picker/picker';
import { Text } from '../text/text';
import { translate } from '../../i18n';
import RNPickerSelect from 'react-native-picker-select';
import i18n from 'i18n-js'
import { provinceListEn, provinceListTh } from '../../screens/home-screen/manage-vehicle/datasource'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LottieView from 'lottie-react-native';

interface Input {
  firstLocation: string
  secondLocation: string
  progress: any
}

const ROOT: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 5,
  elevation: 6,
  flexDirection: 'row',
  justifyContent: 'center',
  flexWrap: 'wrap',
}
const LOCATION: ViewStyle = {
  flexDirection: 'row',
  flexBasis: '45%',
  alignItems: 'center',
  paddingHorizontal: spacing[2]
}
const SWITCHING: ViewStyle = {
  flexDirection: 'row',
  flexBasis: '10%',
  alignItems: 'center',
  paddingHorizontal: spacing[2]
}
const ARROW_ICON: ImageStyle = {
  width: 26,
  height: 26,
  backgroundColor: color.line,
  resizeMode: 'cover',
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
}
const LOCATION_TEXT: TextStyle = {
  paddingLeft: spacing[1],
  // width: 35
}
const SEARCH_BOTTON_ROOT: ViewStyle = {
  alignItems: 'center',
  flexBasis: '100%',
  paddingTop: spacing[3],
}
const SEARCH_BOTTON: ViewStyle = {
  backgroundColor: color.primary,
  width: '30%',
  paddingVertical: spacing[1],
  paddingHorizontal: spacing[1],
  borderRadius: Dimensions.get('window').width / 2
}
const SEARCH_TEXT: TextStyle = {
  color: color.textBlack,
  fontSize: 14,
}

const initialState = {
  firstLocation: '',
  secondLocation: '',
  progress: new Animated.Value(0),
}

export function SearchBar(props: SearchBarProps) {
  const navigation = useNavigation()
  const [{ firstLocation, secondLocation, progress }, setState] = useState<Input>(initialState)
  const [isSwitching, setIsSwitching] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)

  const {
    fromText,
    toText,
    style,
    navigationTo,
    textStyle,
    buttonText,
    onToggle,
    onSearch
  } = props

  useEffect(() => {
    if (isSwitching) {
      setAutoPlay(true)
    }
  }, [isSwitching])

  const switching = () => {
    setState(prevState => ({
      ...prevState,
      firstLocation: secondLocation,
      secondLocation: firstLocation,
    }))
    setIsSwitching(true)
    runAnimation()
  }

  const onChangeValue = (value: object) => {
    setState(prevState => ({
      ...prevState,
      ...value
    }))
  }

  const runAnimation = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1200,
      // easing: Easing.linear,
      useNativeDriver: true
    }).start();
    setState(prevState => ({
      ...prevState,
      progress: new Animated.Value(0)
    }))
  }

  const onAnimationFinish = () => {
    setIsSwitching(false)
  }

  useEffect(() => {
    onToggle(firstLocation || undefined, secondLocation || undefined)
  }, [firstLocation, secondLocation])

  const ReverseArrows = () => (<LottieView
    source={require('../../AnimationJson/reverse-arrows.json')}
    style={{ height: 25, width: 25 }}
    colorFilters={[
      { keypath: 'bac/arrow_finish_22 Outlines', color: color.disable },
      { keypath: 'w', color: color.textWhite },
      { keypath: 'g', color: color.textWhite }
    ]}
    autoPlay={!!(autoPlay && isSwitching)}
    loop={false}
    progress={progress}
    onAnimationFinish={onAnimationFinish}
  />)

  const textStyleContainer = { ...LOCATION_TEXT, ...textStyle }

  return (
    <View style={{ ...ROOT, ...style }}>

      <View style={LOCATION}>
        <MaterialIcons name={'pin-drop'} color={color.primary} size={25} />
        <Text text={`${fromText}  :`} style={textStyleContainer} />
        <RNPickerSelect
          // testID={"picker_vehicle_type"}
          value={firstLocation}
          onValueChange={(value) => onChangeValue({ firstLocation: value })}
          items={i18n.locale == "en" ? provinceListEn : provinceListTh}
          placeholder={{
            label: translate("uploadVehicleScreen.province"),
            color: color.black
          }}
          useNativeAndroidPickerStyle={false}
          style={{
            inputAndroidContainer: {
              // marginTop: 1,
            },
            inputAndroid: {
              color: color.textBlack,
            },
            inputIOSContainer: {
              marginTop: 1,
              paddingVertical: spacing[2]
            },
            inputIOS: {
              color: color.textBlack,
              marginLeft: spacing[1],
            },
          }}
        />
      </View>

      <View style={SWITCHING}>
        <TouchableHighlight onPress={switching}>
          {/* <View style={{}}> */}
          {/* <Icon icon="arrowUpDown" style={ARROW_ICON} containerStyle={{ width: 26, height: 26, transform: [{ rotate: '90deg' }] }} /> */}
          <ReverseArrows />
          {/* </View> */}
        </TouchableHighlight>
      </View>

      <View style={LOCATION}>
        <MaterialIcons name={'pin-drop'} color={color.success} size={22} />
        <Text text={`${toText}  :`} style={textStyleContainer} />
        <RNPickerSelect
          // testID={"picker_vehicle_type"}
          value={secondLocation}
          onValueChange={(value) => onChangeValue({ secondLocation: value })}
          onDonePress={() => console.log('Done')}
          items={i18n.locale == "en" ? provinceListEn : provinceListTh}
          placeholder={{
            label: translate("uploadVehicleScreen.province"),
            color: color.black
          }}
          useNativeAndroidPickerStyle={false}
          style={{
            inputAndroidContainer: {
              // marginTop: 1,
            },
            inputAndroid: {
              color: color.textBlack,
              // marginLeft: spacing[0],
            },
            inputIOSContainer: {
              marginTop: 1,
              paddingVertical: spacing[2]
            },
            inputIOS: {
              color: color.textBlack,
              marginLeft: spacing[1],
            },
          }}
        />
      </View>

      <View style={[SEARCH_BOTTON_ROOT,]}>
        <Button
          testID="search-button"
          style={SEARCH_BOTTON}
          textStyle={SEARCH_TEXT}
          text={buttonText} // ค้นหาโดยละเอียด
          onPress={onSearch}
        />
      </View>
    </View>
  )
}
