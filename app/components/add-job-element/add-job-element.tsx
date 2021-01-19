import React from 'react'
import { BackHandler, TextStyle, View, ViewStyle, Dimensions } from 'react-native'
import { color, typography } from '../../theme'
import { Text } from '../text/text'

const { width, height } = Dimensions.get('window')
const ROOT_TEXT_STYLE: TextStyle = {
    paddingTop: 5,
    // fontSize: 10,
    // overflow: 'hidden'
    // flexWrap: 'wrap'
}

const ROOT_VIEW: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
}

const SLOT_STYLE: ViewStyle = { flexDirection: 'row', height: 51 }
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
    // width: (width / 4) - 40,
    width: 60

    // position: 'absolute',
}
const LINE_STYLE: ViewStyle = {
    // width: (width / 4) - 60,
    width: 40,
    height: 2,
    borderTopColor: color.lightWeightGrey,
    backgroundColor: color.lightWeightGrey,
    borderTopWidth: 2,
    marginHorizontal: 10,
    marginTop: 0
}

const VIEW_TEXT_STATUS: ViewStyle = {
    width: width / 4
}

// export const AddJobElement = (props: any) => {

//     const { tx, data } = props

//     return (
//         <View style={ROOT_VIEW}>
//             {data.map((e, i) => {
//                 return (
//                     <View style={{ paddingTop: 10 }}>
//                         <View style={SLOT_STYLE}>
//                             <View style={DETAIL_VIEW}>
//                                 <View style={e.active ? CIRCLE_GREEN_STYLE : CIRCLE_STYLE}>
//                                     <Text style={SEQUENCE_TEXT}>{e.no}</Text>
//                                 </View>
//                                 {/* <Text tx={e.name} style={[ROOT_TEXT_STYLE, { color: e.active ? color.success : color.textWhite }]} /> */}

//                             </View>

//                             {i != data.length - 1 && <View style={WRAP_LINE}><View style={LINE_STYLE}></View>
//                             </View>}
//                         </View>

//                         <Text style={[ROOT_TEXT_STYLE, { color: e.active ? color.success : color.textWhite }]} tx={e.name} />
//                     </View>
//                 )
//             })}
//         </View>
//     )
// }











export const AddJobElement = (props: any) => {

    const { tx, data } = props
    const _renderCircle = (no, active) => {
        return <View key={`${no}-text-sequence-${no}`} style={active ? CIRCLE_GREEN_STYLE : CIRCLE_STYLE}>
            <Text key={`${no}-text-sequence-2-${no}`} style={SEQUENCE_TEXT}>{no}</Text>
        </View>
    }

    return (
        <View key="Root-view-column" style={{ flex: 1, marginHorizontal: 10 }}>
            <View key="root-view-column-2" style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                {data.map((e, i) => {
                    return (
                            <View key={'view-column-' + i} style={{ marginTop: 10 }}>
                                <View style={{
                                    flexDirection: 'row', justifyContent: 'center',
                                }} key={'view-column-circle-' + i}>
                                    <View key={'view-circle-' + i} style={{ height: 51, width: 51, }}>
                                        {_renderCircle(e.no, e.active)}
                                    </View>
                                    {i != data.length - 1 && <View key={'view-line-' + i} style={WRAP_LINE}>
                                        <View key={'view-line-2-' + i} style={LINE_STYLE}></View>
                                    </View>}
                                </View>

                                <View key={'view-text-status-' + i} style={{ overflow: 'visible' }}>
                                    <Text key={'view-text-status-2-' + i} tx={e.name} style={[ROOT_TEXT_STYLE, {
                                        color: e.active ? color.success : color.textWhite,
                                    }]} />
                                </View>
                            </View>
                    )
                })}
            </View>
        </View>
    )
}















// const WRAP_LINE2: ViewStyle = {
//     justifyContent: 'center',
//     // width: (width / 4) - 40,
//     width: 60,

//     // position: 'absolute',
// }
// const LINE_STYLE2: ViewStyle = {
//     // width: (width / 4) - 60,
//     width: 40,
//     height: 2,
//     borderTopColor: color.lightWeightGrey,
//     backgroundColor: color.lightWeightGrey,
//     borderTopWidth: 2,
//     marginHorizontal: 5,
//     marginTop: 0
// }
// export const AddJobElement = (props: any) => {

//     const { tx, data } = props
//     const _renderCircle = (no, active) => {
//         return <View style={active ? CIRCLE_GREEN_STYLE : CIRCLE_STYLE}>
//             <Text style={SEQUENCE_TEXT}>{no}</Text>
//         </View>
//     }

//     return (
//         <View style={{ flex: 1, marginHorizontal: 10 }}>
//             <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
//                 {data.map((e, i) => {
//                     return (
//                         <View style={{ flex: 1, backgroundColor: 'grey', width: '100%', alignItems: 'center' }}>

//                             {/* ** Circle - Line */}
//                             <View style={{
//                                 // width: i != data.length - 1 ? (width / 4) - 5 : (width / 4) - 50
//                                 width: (width / 4) - 5 
//                                 , backgroundColor: 'green',
//                                 // height: 51,
//                                 flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
//                             }}>

//                                 {/* ** Box of Circle */}
//                                 <View style={{ width: 51, height: 51, backgroundColor: 'pink', marginLeft: 5 }}>
//                                     {_renderCircle(e.no, e.active)}
//                                 </View>

//                                 {i != data.length - 1 && <View style={WRAP_LINE2}><View style={LINE_STYLE2}></View>
//                                 </View>}

//                             </View>


//                             {/* ** Text Only */}
//                             <View>
//                                 <Text tx={e.name} style={[ROOT_TEXT_STYLE, {
//                                     color: e.active ? color.success : color.textWhite,
//                                     flexWrap: 'wrap', width: (width / 4)
//                                 }]}
//                                 />
//                             </View>

//                         </View>
//                     )
//                 })}
//             </View>
//         </View>
//     )
// }













