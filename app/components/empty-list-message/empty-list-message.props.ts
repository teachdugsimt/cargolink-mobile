import { ReactNode } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { TextPresets } from "../text/text.presets"

export interface EmptyListMessageProps {

    text?: string

    textPreset?: TextPresets

    textPosition?: 'top' | 'bottom'

    featherIconName?: string

    featherIconSize?: number

    containerStyle?: ViewStyle

    textStyle?: TextStyle

    iconComponent?: ReactNode

}