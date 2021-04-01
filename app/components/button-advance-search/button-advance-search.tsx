import React from 'react'
import { Dimensions, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { color, images, spacing } from "../../theme"
import { Text } from '../text/text'
import { ButtonAdvanceSearchProps } from './button-advance-search.props'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const FULL_SEARCH_BOTTON: ViewStyle = {
  backgroundColor: color.primary,
  borderRadius: Dimensions.get('window').width / 2,
  borderWidth: 1,
  borderColor: color.primary,
  marginVertical: spacing[1],
  marginHorizontal: spacing[1],
  paddingHorizontal: spacing[3],
}
const FULL_SEARCH_TEXT: TextStyle = {
  fontSize: 16,
  color: color.textBlack,
  paddingHorizontal: spacing[2],
  paddingVertical: spacing[1],
  textAlign: 'center'
}
const COUNT: ViewStyle = {
  backgroundColor: color.red,
  borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
  position: 'absolute',
  right: -5,
  top: 0,
  width: 15,
  height: 15,
  justifyContent: 'center',
  alignItems: 'center',
}
const COUNT_TEXT: TextStyle = {
  fontSize: 10,
  textAlign: 'center',
  color: color.textWhite,
}
const TEXT_CENTER: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center'
}

export function ButtonAdvanceSearch(props: ButtonAdvanceSearchProps) {

  const {
    label,
    count,
    onPress
  } = props

  const onToggle = onPress ? () => onPress() : null

  return (
    <TouchableOpacity
      testID={`btn-advance-search`}
      style={FULL_SEARCH_BOTTON}
      activeOpacity={1}
      onPress={onToggle}
    >
      <View style={TEXT_CENTER}>
        <MaterialIcons name={'search'} size={20} color={color.textBlack} />
        <Text
          style={FULL_SEARCH_TEXT}
          text={label}
          numberOfLines={1}
        />
      </View>
      {!!count && <View style={COUNT}><Text style={COUNT_TEXT}>{count}</Text></View>}
    </TouchableOpacity>
  )
}
