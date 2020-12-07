import React from "react"
import { View, TextStyle, ViewStyle, Image, ImageStyle, TouchableOpacity, Dimensions } from "react-native"
import { color, spacing, typography, images } from "../../theme"
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import { Text } from '../text/text'
const { width, height } = Dimensions.get('window')

// const FULL: ViewStyle = { flex: 1 }

// const VIEW_STYLE: ViewStyle = {
//     ...FULL,
//     backgroundColor: color.snow,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     borderRadius: 5,
// }

const VIEW_CARD: ViewStyle = {
    height: 100, flex: 1,
    marginRight: 10,
    flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end',
    backgroundColor: color.snow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
}

const SUB_VIEW: ViewStyle = {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 7.5,
    paddingBottom: 20
    // backgroundColor: 'red'
}

const TEXT_STYLE: TextStyle = {
    color: color.black,
    alignSelf: 'flex-start',
    fontSize: typography.menu,
    fontWeight: 'bold'
}

const IMAGE_ICON: ImageStyle = {
    width: 60,
}

const VIEW_TEXT_MENU: ViewStyle = {
    alignSelf: 'flex-start',
    flex: 1
}

const VIEW_IMG_MENU: ViewStyle = {
    flex: 1,
    alignSelf: 'flex-end'
}

const TITLE_STYLE: TextStyle = {
    fontSize: typography.title, color: color.black,
    fontWeight: 'bold'
}

const VIEW_TITLE_TEXT: ViewStyle = {
    paddingLeft: 20
}

/**
 * A component which has a label and an input together.
 */
export function GridView(props: any) {

    return (
        <SectionGrid
            itemDimension={(width / 2) - 60}
            // numColumns={2}
            // data={dataTest}
            sections={props.data}
            renderItem={({ item, index }) => {
                return <TouchableOpacity onPress={() => item.onPressButton()} style={[VIEW_CARD, { marginLeft: index % 2 == 0 ? 10 : 0 }]}>
                    <View style={SUB_VIEW}>
                        <View style={VIEW_TEXT_MENU}>
                            <Text style={TEXT_STYLE}>{item.name}</Text>
                        </View>
                        <View style={VIEW_IMG_MENU}>
                            <Image style={IMAGE_ICON} height={50}
                                resizeMode='stretch' source={item.img} />
                        </View>
                    </View>
                </TouchableOpacity>
            }}
            renderSectionHeader={({ section }) => (
                <View style={VIEW_TITLE_TEXT}>
                    <Text style={TITLE_STYLE}>{section.title}</Text>
                </View>
            )}
        />

    )
}
