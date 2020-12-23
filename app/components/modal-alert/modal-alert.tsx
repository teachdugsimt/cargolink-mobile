import React from 'react'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Modal, TextStyle, View, ViewStyle } from "react-native";
import { ModalAlertProps } from './modal-alert.props';
import { color, spacing } from "../../theme"
import { Text } from "../"
import { translate } from '../../i18n';

const BACKGROUND: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000004d'
}

const INITIAL_CONTAINER_STYLE: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.backgroundWhite,
    width: '85%',
    borderRadius: spacing[2],
}

const TEXT_CENTER: TextStyle = {
    textAlign: 'center',
}

export function ModalAlert(props: ModalAlertProps) {

    const {
        containerStyle,
        iconStyle,
        headerStyle,
        contentStyle,
        iconName,
        header,
        headerTranslate,
        headerTranslateOptions,
        content,
        contentTranslate,
        contentTranslateOptions,
        visible = false,
        buttonContainerStyle,
        buttonComponent = null,
    } = props

    const i18nTextHeader = headerTranslate && translate(headerTranslate, headerTranslateOptions)
    const headerText = i18nTextHeader || header

    const i18nTextContent = contentTranslate && translate(contentTranslate, contentTranslateOptions)
    const contentText = i18nTextContent || content

    const containerViewStyle = { ...INITIAL_CONTAINER_STYLE, ...containerStyle }
    const headerTextStyle = { ...TEXT_CENTER, ...headerStyle }
    const contentTextStyle = { ...TEXT_CENTER, ...contentStyle }

    const renderButton = buttonComponent ? buttonComponent((comp) => comp) : null

    return (
        <Modal visible={visible} transparent={true}>
            <View style={BACKGROUND}>
                <View style={containerViewStyle}>
                    <View>
                        {!!iconName && <Icons name={iconName} {...iconStyle} />}
                    </View>
                    <View>
                        <Text style={headerTextStyle} text={headerText} preset={'topicExtra'} />
                    </View>
                    <View>
                        <Text style={contentTextStyle} text={contentText} />
                    </View>
                    <View style={buttonContainerStyle}>
                        {renderButton}
                    </View>
                </View>
            </View>
        </Modal>
    )
}