import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Dimensions, ImageStyle, Platform, TextStyle, TouchableHighlight, View, ViewStyle } from 'react-native';
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

interface LocationProps {
  label?: string
  value?: string
}

interface Input {
  firstLocation: string
  secondLocation: string
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
const PIN_ICON: ImageStyle = {
  width: 25,
  height: 25,
}
const ARROW_ICON: ImageStyle = {
  width: 26,
  height: 26,
  backgroundColor: color.disable,
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
}

export function SearchBar(props: SearchBarProps) {
  const navigation = useNavigation()
  const [{ firstLocation, secondLocation }, setState] = useState<Input>(initialState)

  const {
    fromText,
    toText,
    style,
    navigationTo,
    textStyle
  } = props

  const switching = () => {
    console.log('Click')
    setState({
      firstLocation: secondLocation,
      secondLocation: firstLocation,
    })
  }

  const onChangeValue = (value: object) => {
    setState(prevState => ({
      ...prevState,
      ...value
    }))
  }

  return (
    <View style={{ ...ROOT, ...style }}>

      <View style={LOCATION}>
        <Icon icon="pinDropYellow" style={PIN_ICON} />
        <Text
          text={`${translate('common.from')}  :`} // จาก
          style={LOCATION_TEXT}
        />
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
          <Icon icon="arrowUpDown" style={ARROW_ICON} containerStyle={{ width: 26, height: 26, transform: [{ rotate: '90deg' }] }} />
        </TouchableHighlight>
      </View>

      <View style={LOCATION}>
        <Icon icon="pinDropGreen" style={PIN_ICON} />
        <Text
          text={`${translate('common.to')}  :`} // ถึง
          style={LOCATION_TEXT}
        />
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
          text={translate('searchJobScreen.search')} // ค้นหาโดยละเอียด
          onPress={() => navigation.navigate(navigationTo)}
        />
      </View>
    </View>
  )
}
