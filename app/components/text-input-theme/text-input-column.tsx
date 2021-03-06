import React from "react"
import { TextInput, ViewStyle, View, TextStyle, TouchableOpacity } from "react-native"
import { color, spacing } from "../../theme"
import { Text } from '../text/text'
import { translate } from "../../i18n"

/**
 * A component which has a label and an input together.
 */
interface TextInputColumnProps {
  inputStyle?: ViewStyle
  actualPlaceholder?: string
  editable?: boolean
  keyboardType?: string
  underline?: boolean
  testID?: any
  prefix?: string
  suffix?: string
  icon?: string
  value?: any
  onChangeText?: any
  topic?: string
  length?: number
  maxLength?: number
  showTopic?: boolean
  textAlign?: string
}
const ROOT_STYLE: ViewStyle = {
  height: 40,
  flexShrink: 1,
  alignSelf: 'flex-start'
}
const ROW: ViewStyle = { flexDirection: 'row' }
const SPACE_BETWEEN: ViewStyle = { justifyContent: 'space-between' }
const RED: TextStyle = { color: color.error }
const LINE: TextStyle = { color: color.line }
export function TextInputColumn(props: TextInputColumnProps) {
  const { inputStyle, length, maxLength, underline, topic, showTopic = true,
    actualPlaceholder = translate("common.count"), editable, ...rest } = props
  let underline_style: ViewStyle = { backgroundColor: 'red' }
  if (underline) underline_style = {
    borderBottomColor: color.mainGrey, borderBottomWidth: 1
  }
  let forwardedRef: any
  return (
    <View style={underline_style}>
      {showTopic && <View style={[ROW, SPACE_BETWEEN]}>
        <View style={ROW}>
          <Text tx={topic} />
          <Text style={RED}> *</Text>
        </View>
        <View style={ROW}>
          <Text style={LINE}>{length ? length : 0}</Text>
          <Text style={LINE}>/{maxLength}</Text>
        </View>
      </View>}
      <TouchableOpacity onPress={() => forwardedRef?.focus()}>
        <TextInput
          maxLength={maxLength}
          editable={editable === false ? false : true}
          testID={"vehicle-upload-input"}
          placeholder={translate(actualPlaceholder)}
          placeholderTextColor={color.line}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={{ ...ROOT_STYLE, ...inputStyle }}
          ref={ref => forwardedRef = ref}
        />
      </TouchableOpacity>
    </View>
  )
}
