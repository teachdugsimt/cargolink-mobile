import * as React from "react"
import { Text as ReactNativeText, TextStyle } from "react-native"
import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { translate } from "../../i18n"
import { mergeAll, flatten } from "ramda"
import { color } from '../../theme/'

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
const ROOT_STYLE: TextStyle = {
  fontFamily: 'Kanit-Bold',
  color: color.black
}
export function Text(props: TextProps) {
  // grab the props
  const { preset = "default", tx, txOptions, text, children, style: styleOverride, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const style = mergeAll(flatten([presets[preset] || presets.default, styleOverride]))

  return (
    <ReactNativeText {...rest} style={{ ...ROOT_STYLE, ...style }}>
      {content}
    </ReactNativeText>
  )
}
