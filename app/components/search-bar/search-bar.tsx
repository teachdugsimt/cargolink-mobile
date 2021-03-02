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
import { flow } from 'mobx';

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

const DatePicker = ({ value, label, province, onChangeValue }) => {

  const onChange = onChangeValue ? (data: string) => onChangeValue && onChangeValue(data) : null

  return (
    <RNPickerSelect
      // testID={"picker_vehicle_type"}
      value={value}
      onValueChange={(val) => onChange(val)}
      items={province}
      placeholder={{
        label: label,
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
  )
}

export function SearchBar(props: SearchBarProps) {
  const navigation = useNavigation()

  const [progress, setProgress] = useState(new Animated.Value(0))
  const [firstLocation, setFirstLocation] = useState<string>('')
  const [secondLocation, setSecondLocation] = useState<string>('')
  const [isSwitching, setIsSwitching] = useState<boolean>(false)
  const [autoPlay, setAutoPlay] = useState<boolean>(false)
  const [placeholder, setPlaceholder] = useState<string>(translate("uploadVehicleScreen.province"))

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
    setFirstLocation(secondLocation || null)
    setSecondLocation(firstLocation || null)
    setIsSwitching(true)
    runAnimation()
  }

  const runAnimation = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1200,
      // easing: Easing.linear,
      useNativeDriver: true
    }).start();
    setProgress(new Animated.Value(0))
  }

  useEffect(() => {
    if (!firstLocation) {
      setFirstLocation('')
    }
    if (!secondLocation) {
      setSecondLocation('')
    }
    setPlaceholder(translate("uploadVehicleScreen.province"))
  }, [i18n.locale])

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

  const _sortProvince  = (data) => {
    return data.sort(function (a, b) {
      if (a.label.charAt(0).toLowerCase() < b.label.charAt(0).toLowerCase()) { return -1; }
      if (a.label.charAt(0).toLowerCase() > b.label.charAt(0).toLowerCase()) { return 1; }
      return 0;
    })
  }

  const textStyleContainer = { ...LOCATION_TEXT, ...textStyle }

  const province = i18n.locale === 'th' ? _sortProvince(provinceListTh) : _sortProvince(provinceListEn)

  return (
    <View style={{ ...ROOT, ...style }}>
      <View style={LOCATION}>
        <MaterialIcons name={'pin-drop'} color={color.primary} size={25} />
        <Text text={`${fromText}  :`} style={textStyleContainer} />
        <DatePicker
          value={firstLocation}
          label={placeholder}
          province={province}
          onChangeValue={(val) => setFirstLocation(val)}
        />
      </View>

      <View style={SWITCHING}>
        <TouchableHighlight onPress={switching}>
          <ReverseArrows />
        </TouchableHighlight>
      </View>

      <View style={LOCATION}>
        <MaterialIcons name={'pin-drop'} color={color.success} size={22} />
        <Text text={`${toText}  :`} style={textStyleContainer} />
        <DatePicker
          value={secondLocation}
          label={placeholder}
          province={province}
          onChangeValue={(val) => setSecondLocation(val)}
        />
      </View>

      <View style={[SEARCH_BOTTON_ROOT,]}>
        <Button
          testID="search-button"
          style={SEARCH_BOTTON}
          textStyle={SEARCH_TEXT}
          text={buttonText}
          onPress={onSearch}
        />
      </View>
    </View>
  )
}
