import React from "react"
import { View, TextStyle, ViewStyle, Image, ImageStyle, TouchableOpacity, Dimensions } from "react-native"
import { color, spacing, typography, images } from "../../theme"
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import { Text } from '../text/text'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Item } from "../../screens/favorite-screen/history-call/shipper-history-list";
const { width, height } = Dimensions.get('window')

const POST_CARD: ViewStyle = {
  width: width - 40,
  height: 110,
  marginLeft: 10,
  flex: 1,
  flexDirection: 'column',
  backgroundColor: color.snow,
  borderRadius: 17.5,
}

const BOTTOM_LINE: ViewStyle = { marginTop: 2.5, height: 2.5, width: 25, borderColor: color.mainGrey, borderWidth: 1.5, borderRadius: 2 }

const VIEW_CARD: ViewStyle = {
  height: 110, flex: 1,
  marginRight: 10,
  flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
  backgroundColor: color.snow,
  borderRadius: 17.5,
}

const SUB_VIEW: ViewStyle = {
  width: '100%',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 7.5,
  // paddingBottom: 20

  // backgroundColor: 'red'
}

const TEXT_STYLE: TextStyle = {
  color: color.black,
  alignSelf: 'flex-start',
  fontSize: typography.menu,
  // fontWeight: 'bold',
  fontFamily: "Kanit-Medium"
}

const IMAGE_ICON: ImageStyle = {
  width: 60,
  height: 60
}

const VIEW_TEXT_MENU: ViewStyle = {
  paddingTop: 35,
  alignSelf: 'center',
  flex: 1
}

const VIEW_IMG_MENU: ViewStyle = {
  flex: 1,
  alignSelf: 'center'
}

const SUB_VIEW_POST_CARD: ViewStyle = { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
const VIEW_BUTTON_POSTJOB: ViewStyle = { paddingLeft: 20, justifyContent: 'space-between', height: '70%' }
const BUTTON_POST_JOB: ViewStyle = { backgroundColor: color.primary, borderRadius: 17.5, paddingHorizontal: 5, paddingVertical: 5.5, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }
const PADDING_TOP25: ViewStyle = { paddingTop: 2.5 }
const PADDING_RIGHT20: ViewStyle = { paddingRight: 20 }
/**
 * A component which has a label and an input together.
 */
export function GridNew(props: any) {

  const _renderNormalBox = (item, index) => (
    <View key={`grid-normal-box-${index}`} style={{ flex: 1, marginRight: index % 2 == 0 ? 10 : 20 }}>
      <TouchableOpacity testID={'touch-home-grid'} onPress={() => item.onPressButton()} style={[VIEW_CARD, { marginLeft: index % 2 == 0 ? 10 : 0 }]}>
        <View style={SUB_VIEW}>
          <View style={VIEW_IMG_MENU}>
            <Image style={IMAGE_ICON}
              resizeMode='stretch' source={item.img} />
          </View>
          <View style={[VIEW_TEXT_MENU]}>
            <Text tx={item.name} style={TEXT_STYLE}></Text>
          </View>
          <View style={BOTTOM_LINE}></View>
        </View>
      </TouchableOpacity>
    </View>
  )

  const _renderLargeBox = (item, index) => (
    <View key={`grid-large-box-${index}`} testID={'touch-home-grid'} style={[POST_CARD]}>
      <View style={SUB_VIEW_POST_CARD}>
        <View style={VIEW_BUTTON_POSTJOB}>
          <Text tx={"homeScreen.wannaFindCar"} preset="topic"></Text>
          <TouchableOpacity style={BUTTON_POST_JOB} onPress={() => item.onPressButton()}>
            <Text tx={"homeScreen.postJobNow"} preset="topic" />
            <Ionicons name="chevron-forward" size={18} style={PADDING_TOP25} />
          </TouchableOpacity>
        </View>
        <View style={PADDING_RIGHT20}>
          <Image style={IMAGE_ICON}
            resizeMode='stretch' source={item.img} />
        </View>
      </View>
    </View>
  )

  return (
    <View style={{ flex: 1 }}>
      {props.data.map((e, i) => {
        if (i == 0)
          return <View key={'main-view-normal-menu-' + i} style={{ flex: 1, flexDirection: 'row', width: '100%', margin: 10 }}>
            {e.data.map((item, index) => _renderNormalBox(item, index))}
          </View>
        else return <View key={'main-view-large-menu-' + i} style={{ flex: 1, width: '100%', margin: 10 }}>
          {e.data.map((item, index) => _renderLargeBox(item, index))}
        </View>
      })}
    </View>


    // <SectionGrid
    //   scrollEnabled={false}
    //   renderScrollComponent={() => <></>}
    //   nestedScrollEnabled={false}
    //   showsVerticalScrollIndicator={false}
    //   showsHorizontalScrollIndicator={false}
    //   disableScrollViewPanResponder={true}
    //   itemDimension={(width / 2) - 60}
    //   sections={props.data}
    //   renderItem={({ item, index }) => {
    //     if (item.id != 3)
    //       return <TouchableOpacity testID={'touch-home-grid'} onPress={() => item.onPressButton()} style={[VIEW_CARD, { marginLeft: index % 2 == 0 ? 10 : 0 }]}>
    //         <View style={SUB_VIEW}>
    //           <View style={VIEW_IMG_MENU}>
    //             <Image style={IMAGE_ICON}
    //               resizeMode='stretch' source={item.img} />
    //           </View>
    //           <View style={[VIEW_TEXT_MENU]}>
    //             <Text tx={item.name} style={TEXT_STYLE}></Text>
    //           </View>
    //           <View style={BOTTOM_LINE}></View>
    //         </View>
    //       </TouchableOpacity>
    //     else return <View testID={'touch-home-grid'} style={[POST_CARD]}>
    //       <View style={SUB_VIEW_POST_CARD}>
    //         <View style={VIEW_BUTTON_POSTJOB}>
    //           <Text tx={"homeScreen.wannaFindCar"} preset="topic"></Text>
    //           <TouchableOpacity style={BUTTON_POST_JOB} onPress={() => item.onPressButton()}>
    //             <Text tx={"homeScreen.postJobNow"} preset="topic" />
    //             <Ionicons name="chevron-forward" size={18} style={PADDING_TOP25} />
    //           </TouchableOpacity>
    //         </View>
    //         <View style={PADDING_RIGHT20}>
    //           <Image style={IMAGE_ICON}
    //             resizeMode='stretch' source={item.img} />
    //         </View>
    //       </View>
    //     </View>
    //   }}
    // />

  )
}
