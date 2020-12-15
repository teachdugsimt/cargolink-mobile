import React from 'react'
import { TextStyle, TouchableOpacity } from 'react-native'
import { typography } from '../../theme'
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ROOT_STYLE: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.title
}
export const HeaderRight = (props: any) => {
    const { tx, txStyle, onRightPress, iconName, iconSize, iconColor } = props
    if (tx)
        return (
            <TouchableOpacity onPress={onRightPress}>
                <Text tx={tx} style={{ ...ROOT_STYLE, ...txStyle }} />
            </TouchableOpacity>
        )
    else
        return (
            <Ionicons onPress={onRightPress} name={iconName} size={iconSize} color={iconColor} />
        )
}

