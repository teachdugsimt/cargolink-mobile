import React from 'react'
import { TextStyle, TouchableOpacity } from 'react-native'
import { spacing, typography, color } from '../../theme'
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ROOT_STYLE: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.title
}
export const HeaderLeft = (props: any) => {
    const { tx, txStyle, onLeftPress, iconName, iconSize, iconColor } = props
    if (tx)
        return (
            <TouchableOpacity onPress={onLeftPress}>
                <Text tx={tx} style={{ ...ROOT_STYLE, ...txStyle }} />
            </TouchableOpacity>
        )
    else if (iconName)
        return (<Ionicons onPress={onLeftPress} name={iconName} size={iconSize} color={iconColor} />)
    else
        return (
            <Ionicons onPress={onLeftPress} name={"chevron-back"} size={spacing[5]} color={color.black} />
        )
}

