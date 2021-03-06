import React from 'react'
import { TextStyle, View, ViewStyle, Dimensions } from 'react-native'
import { color, typography } from '../../theme'
import { Text } from '../text/text'

const CIRCLE_WIDTH = 45
const CIRCLE_HEIGHT = 45
const CIRCLE_RADIUS = CIRCLE_WIDTH / 2
const MIN_CIRCLE_VIEW_WIDTH = CIRCLE_WIDTH + 5

const BINDING = -5
const LINE_HEIGHT = 0.5
const LINE_WIDTH = CIRCLE_WIDTH - 10
const LINE_POSITION_FROM_CIRCLE = CIRCLE_WIDTH - ((CIRCLE_WIDTH * 2) - (CIRCLE_RADIUS - BINDING))

const FULL: ViewStyle = { flex: 1 }
const ROW: ViewStyle = { flexDirection: 'row' }
const MARGIN_HOR_10: ViewStyle = { marginHorizontal: 10 }
const BACKGROUND_MAIN_ELEMENT: ViewStyle = {
  borderBottomColor: color.mainGrey,
  borderBottomWidth: 1, paddingBottom: 10
}

const MAIN_WRAP_LINE: ViewStyle = {
  ...ROW, height: LINE_HEIGHT, width: LINE_WIDTH,
  position: 'absolute', right: LINE_POSITION_FROM_CIRCLE, top: CIRCLE_RADIUS
}
const LINE_VIEW: ViewStyle = { ...FULL, backgroundColor: color.line, }

export const AddJobElement = (props: any) => {
  const { tx, data } = props
  return (
    <View style={[FULL, MARGIN_HOR_10, BACKGROUND_MAIN_ELEMENT]}>
      <View style={ROW}>
        {data.map((e, i) => {
          return <View style={[FULL, ROW]} key={'main-view-column-' + i.toString()}>
            <ColumnNumber number={e.no} active={e.active} name={e.name} />
            {i != data.length - 1 && <View style={MAIN_WRAP_LINE}>
              <View style={LINE_VIEW}></View>
            </View>}
          </View>
        })}
      </View>
    </View>
  )
}

const ALL_CENTER: ViewStyle = { alignItems: 'center', justifyContent: 'center' }
const MAIN_COLUMN: ViewStyle = { ...FULL, alignItems: 'center', minWidth: MIN_CIRCLE_VIEW_WIDTH }
const SUB_COLUMN: ViewStyle = { ...ALL_CENTER, width: CIRCLE_WIDTH, height: CIRCLE_HEIGHT, borderRadius: CIRCLE_RADIUS }
const TEXT_WHITE: TextStyle = { color: color.line }
const TEXT_STATUS_VIEW: ViewStyle = { ...ALL_CENTER, paddingTop: 5 }
const TEXT_STATUS: TextStyle = { alignSelf: 'center', textAlign: 'center', fontSize: 12 }
const ColumnNumber = (props) => {
  const { number, active, name } = props
  const backgroundC = active ? color.primary : color.transparent2
  const borderW = active ? 0 : 0.5
  const borderC = active ? color.transparent2 : color.line
  const NUMBER_COLORRR: TextStyle = active ? { color: color.textWhite } : { color: color.line }
  return (
    <View style={MAIN_COLUMN}>

      <View style={[SUB_COLUMN, { backgroundColor: backgroundC, borderWidth: borderW, borderColor: borderC }]}>
        <Text style={NUMBER_COLORRR} preset={'topic'}>{number}</Text>
      </View>
      <View style={TEXT_STATUS_VIEW}>
        <Text style={[TEXT_STATUS, { color: active ? color.primary : color.line }]} tx={name} />
      </View>
    </View>
  )
}
