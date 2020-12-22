import React from 'react'
import { Modal, ActivityIndicator, ViewStyle, View } from "react-native"
import { ModalLoadingProps } from "./modal-loading.props"

const INITIAL_CONTAINER_STYLE: ViewStyle = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#13121257'
}

export function ModalLoading(props: ModalLoadingProps) {
    const {
        containerStyle,
        size = 'small',
        color,
        presentationStyle = 'overFullScreen',
        transparent = true,
        visible = false,
    } = props

    const style = {
        ...INITIAL_CONTAINER_STYLE,
        ...containerStyle
    }

    return (
        <Modal presentationStyle={presentationStyle} transparent={transparent} visible={visible} >
            <View style={style}>
                <ActivityIndicator size={size} color={color} />
            </View>
        </Modal>
    )
}

// hidesWhenStopped={true}