import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Dimensions, ImageStyle, TextStyle, TouchableHighlight, View, ViewStyle } from 'react-native';
import { color, spacing } from '../../theme';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { SearchBarProps } from './search.bar.props';
import { Picker } from '@react-native-picker/picker';
import { Text } from '../text/text';
import { translate } from '../../i18n';

interface LocationProps {
  label?: string
  value?: string
}

const FONT_SIZE_SMALL = 15

const TEXT_BOLD: TextStyle = { fontWeight: "bold" }
const ROOT: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 5,
  elevation: 6
}
const LOCATION: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}
const PIN_ICON: ImageStyle = {
  width: 22,
  height: 22,
}
const ARROW_ICON: ImageStyle = {
  width: 26,
  height: 26,
  backgroundColor: color.disable,
  resizeMode: 'cover',
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
}
const LOCATION_TEXT: TextStyle = {
  paddingLeft: spacing[2],
  width: 45
}
const LOCATION_TEXT_RESULT: TextStyle = {
  paddingLeft: spacing[1],
  width: '75%',
}
const LINE_ICON_ROOT: ViewStyle = {
  paddingLeft: spacing[5],
  paddingRight: spacing[5]
}
const LINE_ICON_CHILD: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center'
}
const LINE: ViewStyle = {
  flex: 1,
  height: 1,
  backgroundColor: color.disable
}
const SEARCH_BOTTON_ROOT: ViewStyle = {
  alignItems: 'center',
  paddingTop: spacing[3],
}
const SEARCH_BOTTON: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  borderColor: color.primary,
  borderWidth: 1,
  width: '40%',
  paddingVertical: spacing[1],
  paddingHorizontal: spacing[1],
}
const SEARCH_TEXT: TextStyle = {
  color: color.textBlack,
  fontSize: 14,
}

const LOCATIONS: Array<LocationProps> = [
  {
    label: 'ภาคเหนือ',
    value: 'N'
  },
  {
    label: 'ภาคตะวันออกเฉียงเหนือ',
    value: 'NE'
  },
  {
    label: 'ภาคตะวันตก',
    value: 'W'
  },
  {
    label: 'ภาคกลาง',
    value: 'C'
  },
  {
    label: 'ภาคตะวันออก',
    value: 'E'
  },
  {
    label: 'ภาคใต้',
    value: 'S'
  },
]

export function SearchBar(props: SearchBarProps) {
  const navigation = useNavigation()
  const [firstLocation, setFirstLocation] = useState<string>('C')
  const [secondLocation, setSecondLocation] = useState<string>('C')

  const {
    fromText,
    toText,
    style,
    navigationTo,
    textStyle
  } = props

  const switching = () => {
    console.log('Click')
    setFirstLocation(secondLocation)
    setSecondLocation(firstLocation)
  }

  return (
    <View style={{ ...ROOT, ...style }}>
      <View style={LOCATION}>
        <Icon icon="pinDropYellow" style={PIN_ICON} />
        <Text
          text={translate('common.from')} // จาก
          style={LOCATION_TEXT}
        />
        <Text text={' :'} />
        <Picker
          selectedValue={firstLocation}
          style={{ ...LOCATION_TEXT_RESULT, ...textStyle }}
          onValueChange={(itemValue, itemIndex) =>
            setFirstLocation(itemValue.toString())
          }>
          {LOCATIONS.map((location, index) => {
            return (<Picker.Item key={index + 1} label={location.label} value={location.value} />)
          })}
        </Picker>
      </View>
      <View style={LINE_ICON_ROOT}>
        <View style={LINE_ICON_CHILD}>
          <View style={LINE} />
          <TouchableHighlight onPress={switching}>
            <Icon icon="arrowUpDown" style={ARROW_ICON} containerStyle={{ width: 26, height: 26 }} />
          </TouchableHighlight>
          {/* <Button
          testID="continue-with-signin"
          style={{ backgroundColor: color.transparent}}
          textStyle={{}}
          text={'ยืนยันรหัส OTP'}
          onPress={() => navigation.navigate("acceptPolicy")}
        /> */}
        </View>
      </View>
      <View style={LOCATION}>
        <Icon icon="pinDropGreen" style={PIN_ICON} />
        <Text
          text={translate('common.to')} // ถึง
          style={LOCATION_TEXT}
        />
        <Text text={' :'} />
        <Picker
          selectedValue={secondLocation}
          style={{ ...LOCATION_TEXT_RESULT, ...textStyle }}
          onValueChange={(itemValue, itemIndex) =>
            setSecondLocation(itemValue.toString())
          }>
          {LOCATIONS.map((location, index) => {
            return (<Picker.Item key={index + 1} label={location.label} value={location.value} />)
          })}
        </Picker>
      </View>
      <View style={SEARCH_BOTTON_ROOT}>
        <Button
          testID="search-button"
          style={SEARCH_BOTTON}
          textStyle={SEARCH_TEXT}
          text={translate('searchBarComponent.fullSearch')} // ค้นหาโดยละเอียด
          onPress={() => navigation.navigate(navigationTo)}
        />
      </View>
    </View>
  )
}
