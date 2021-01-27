import React from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'
import { color, spacing } from "../../theme";
import Feather from 'react-native-vector-icons/Feather'
import { Text } from "../text/text";
import { EmptyListMessageProps } from './empty-list-message.props';
import { translate } from '../../i18n';

const EMPTY_CONTAINER_STYLE: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -spacing[5],
}
const EMPTY_TEXT_STYLE: TextStyle = {
    color: color.line,
}

export function EmptyListMessage(props: EmptyListMessageProps) {

    const {
        featherIconName = 'inbox',
        featherIconSize = 50,
        text = translate('common.notFound'),
        textPreset = 'topicExtra',
        textPosition = 'bottom',
        textStyle,
        containerStyle,
        iconComponent
    } = props

    const renderIconWithTextBottom = () => (
        <>
            {iconComponent ? iconComponent : <Feather name={featherIconName} size={featherIconSize} color={color.line} />}
            <Text text={text} style={emptyTextStyle} preset={textPreset} />
        </>
    )

    const renderIconWithTextTop = () => (
        <>
            <Text text={text} style={emptyTextStyle} preset={textPreset} />
            {iconComponent ? iconComponent : <Feather name={featherIconName} size={featherIconSize} color={color.line} />}
        </>
    )

    const emptyContainerStyle = { ...EMPTY_CONTAINER_STYLE, ...containerStyle }
    const emptyTextStyle = { ...EMPTY_TEXT_STYLE, ...textStyle }

    return (
        <View style={emptyContainerStyle}>
            {textPosition === 'bottom' ? renderIconWithTextBottom() : renderIconWithTextTop()}
        </View>
    )
}