import React from 'react'
import { TextStyle, View, ViewStyle, Dimensions } from 'react-native'
import { color, typography } from '../../theme'
import { Text } from '../text/text'

const CIRCLE_WIDTH = 45
const CIRCLE_HEIGHT = 45
const CIRCLE_RADIUS = CIRCLE_WIDTH / 2
const MIN_CIRCLE_VIEW_WIDTH = CIRCLE_WIDTH + 5

const BINDING = -5
const LINE_HEIGHT = 2.5
const LINE_WIDTH = CIRCLE_WIDTH - 10
const LINE_POSITION_FROM_CIRCLE = CIRCLE_WIDTH - ((CIRCLE_WIDTH * 2) - (CIRCLE_RADIUS - BINDING))

export const AddJobElement = (props: any) => {
    const { tx, data } = props
    return (
        <View style={{ flex: 1, marginHorizontal: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                {data.map((e, i) => {
                    return <View style={{ flex: 1, flexDirection: 'row' }}>
                        <ColumnNumber number={e.no} active={e.active} name={e.name} />
                        {i != data.length - 1 && <View style={{
                            flexDirection: 'row', height: LINE_HEIGHT, width: LINE_WIDTH,
                            position: 'absolute', right: LINE_POSITION_FROM_CIRCLE, top: CIRCLE_RADIUS
                        }}>
                            <View style={{ flex: 1, backgroundColor: color.lightWeightGrey, }}></View>
                        </View>}
                    </View>
                })}
            </View>
        </View>
    )
}


const ColumnNumber = (props) => {
    const { number, active, name } = props
    const backgroundC = active ? color.success : color.transparent2
    const borderW = active ? 0 : 2
    const borderC = active ? color.transparent2 : color.textWhite
    return (
        <View style={{ flex: 1, alignItems: 'center', minWidth: MIN_CIRCLE_VIEW_WIDTH }}>

            <View style={{
                width: CIRCLE_WIDTH, height: CIRCLE_HEIGHT, borderRadius: CIRCLE_RADIUS,
                backgroundColor: backgroundC, justifyContent: 'center',
                alignItems: "center", borderWidth: borderW, borderColor: borderC
            }}>
                <Text style={{ color: color.textWhite }} preset={'topic'}>{number}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                <Text style={{ alignSelf: 'center', color: active ? color.success : color.textWhite, fontSize: 12 }} tx={name} />
            </View>
        </View>
    )
}
