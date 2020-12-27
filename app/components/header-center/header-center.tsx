import React from 'react'
import { TextStyle } from 'react-native'
import { typography } from '../../theme'
import { Text } from '../text/text'
const ROOT_STYLE: TextStyle = {
    fontFamily: 'Kanit-Medium',
    fontSize: typography.title
}
export const HeaderCenter = (props: any) => {
    const { tx } = props
    return (<Text tx={tx} style={ROOT_STYLE} />)
}

