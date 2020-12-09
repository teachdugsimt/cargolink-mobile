import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Dimensions, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native';
import { color, spacing } from '../../theme';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { SearchBarProps } from './search.bar.props';
import { Picker } from '@react-native-picker/picker';

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
  fontSize: FONT_SIZE_SMALL,
  paddingLeft: spacing[1],
  ...TEXT_BOLD,
  width: 250,
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
  paddingTop: spacing[4],
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
  const {
    fromText,
    toText,
    style,
    navigationTo,
    textStyle
  } = props
  return (
    <View style={{ ...ROOT, ...style }}>
      <View style={LOCATION}>
        <Icon icon="pinDropYellow" style={PIN_ICON} />
        <Picker
          selectedValue={LOCATIONS[0].value}
          style={{ ...LOCATION_TEXT, ...textStyle }}
          onValueChange={(itemValue, itemIndex) =>
            console.log('itemValue', itemValue)
          }>
          {LOCATIONS.map((location, index) => {
            return (<Picker.Item key={index + 1} label={location.label} value={location.value} />)
          })}
        </Picker>
      </View>
      <View style={LINE_ICON_ROOT}>
        <View style={LINE_ICON_CHILD}>
          <View style={LINE} />
          <Icon icon="arrowUpDown" style={ARROW_ICON} />
        </View>
      </View>
      <View style={LOCATION}>
        <Icon icon="pinDropGreen" style={PIN_ICON} />
        <Picker
          selectedValue={LOCATIONS[0].value}
          style={{ ...LOCATION_TEXT, ...textStyle }}
          onValueChange={(itemValue, itemIndex) =>
            console.log('itemValue', itemValue)
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
          text={'ค้นหาโดยละเอียด'}
          onPress={() => navigation.navigate(navigationTo)}
        />
      </View>
    </View>
  )
}
