import React from 'react'
import { Dimensions, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { color, spacing } from '../../theme'
import { Button } from '../button/button'
import { Text } from '../text/text'
import { AdvanceSearchTabProps } from './advance-search-tab.props'

const BTN_CONTAINER: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
}
const FULL_SEARCH_BOTTON: ViewStyle = {
    backgroundColor: color.transparent,
    borderRadius: Dimensions.get('window').width / 2,
    borderWidth: 1,
    borderColor: color.primary,
    marginVertical: spacing[1],
    marginHorizontal: spacing[1],
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
    color: color.textWhite,
}

export function AdvanceSearchTab(props: AdvanceSearchTabProps) {

    const {
        mainText,
        subButtons,
        parentStyle,
        count,
        onPress,
        onAdvanceSeach
    } = props

    const onChecked = (id: number) => {
        if (id === -1) onAdvanceSeach()
        else onPress(id)
    }

    const advanceStyle: ViewStyle = { ...FULL_SEARCH_BOTTON, ...parentStyle }

    const mapMenu = [{
        id: -1,
        label: mainText,
        isChecked: true,
    }, ...subButtons]

    return (
        <View style={BTN_CONTAINER}>
            {mapMenu.length && mapMenu.map((button, index) => {
                if (index >= 3) return null
                const borderColor = button.isChecked ? color.primary : color.line
                const customStyle: ViewStyle = {
                    flex: 3,
                    paddingRight: spacing[2],
                    borderRightWidth: 1,
                    borderRightColor: color.line,
                    position: 'relative',
                }

                return (
                    <View key={index} style={index === 0 ? customStyle : index === 1 ? { paddingLeft: spacing[2], flex: 2 } : { flex: 2 }} >
                        <TouchableOpacity
                            testID={`btn-select-search-${index + 1}`}
                            style={{ ...advanceStyle, borderColor }}
                            onPress={() => onChecked(button.id)}
                        >
                            <Text
                                style={FULL_SEARCH_TEXT}
                                text={button.label}
                                numberOfLines={1}
                            />
                            {index === 0 && !!count && <View style={COUNT}><Text style={COUNT_TEXT}>{count}</Text></View>}
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    )
}