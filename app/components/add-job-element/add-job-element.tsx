import React from 'react'
import { BackHandler, TextStyle, View, ViewStyle, Dimensions } from 'react-native'
import { color, typography } from '../../theme'
import { Text } from '../text/text'

const { width, height } = Dimensions.get('window')
const ROOT_TEXT_STYLE: TextStyle = {
    fontFamily: 'Kanit-SemiBold',
    fontSize: typography.content,
    alignSelf: 'center',
}

const ROOT_VIEW: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
}

const SLOT_STYLE: ViewStyle = { flexDirection: 'row' }
const DETAIL_VIEW: ViewStyle = { justifyContent: 'center' }
const SEQUENCE_TEXT: TextStyle = { fontFamily: 'Kanit-Regular', fontSize: typography.mainTitle, color: color.textWhite }
const CIRCLE_STYLE: ViewStyle = {
    justifyContent: 'center', alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: color.textWhite,
    borderWidth: 2
}
const CIRCLE_GREEN_STYLE: ViewStyle = {
    justifyContent: 'center', alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: color.success
}
const WRAP_LINE: ViewStyle = {
    justifyContent: 'center',
}
const LINE_STYLE: ViewStyle = {
    width: (width / 4) - 60,
    height: 2,
    borderTopColor: color.lightWeightGrey,
    backgroundColor: color.lightWeightGrey,
    borderTopWidth: 2,
    marginHorizontal: 10,
    marginTop: -15
}

export const AddJobElement = (props: any) => {

    const { tx, data } = props

    return (
        <View style={ROOT_VIEW}>
            {data.map((e, i) => {
                return (
                    <View style={SLOT_STYLE}>
                        <View style={DETAIL_VIEW}>
                            <View style={e.active ? CIRCLE_GREEN_STYLE : CIRCLE_STYLE}>
                                <Text style={SEQUENCE_TEXT}>{e.no}</Text>
                            </View>
                            {/* <Text tx={e.name} style={[ROOT_TEXT_STYLE, { color: e.active ? color.success : color.textWhite }]} /> */}
                            <Text style={[ROOT_TEXT_STYLE, { color: e.active ? color.success : color.textWhite }]} >
                                {`tier ${i + 1}`}</Text>
                        </View>
                        {i != data.length - 1 && <View style={WRAP_LINE}><View style={LINE_STYLE}></View>
                        </View>}
                    </View>
                )
            })}
        </View>
    )
}

