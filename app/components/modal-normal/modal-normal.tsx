import React from 'react'
import {
  View, ViewStyle, Dimensions, TouchableOpacity, SectionList,
  Image, ImageStyle, Platform, TextStyle
} from 'react-native'
import { Modal, ModalContent } from 'react-native-modals';
import { Text } from '../text/text'
import { SafeAreaView } from "react-native-safe-area-context";
import { color, images } from "../../theme"
import { RoundedButton } from '../rounded-button/rounded-button'
import { ModalNormalProps } from './modal-normal.props'
import Ionicons from 'react-native-vector-icons/Ionicons'

const { width, height } = Dimensions.get("window")

const FULL: ViewStyle = { flex: 1 }
const MARGIN_TOP_20: ViewStyle = { marginTop: 20 }
const ROOT_MODAL_VIEW: ViewStyle = { width: (width / 1.2), height: Platform.OS == "android" ? height / 2.5 : height / 3 }

const ALIGN_CENTER: ViewStyle = { alignItems: 'center' }
const ALL_CENTER: ViewStyle = { justifyContent: 'center', ...ALIGN_CENTER }
const AROUND_CENTER: ViewStyle = { justifyContent: 'space-around', ...ALIGN_CENTER }
const ROW_BUTTON: ViewStyle = { flexDirection: 'row', justifyContent: 'center' }
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.textWhite
}
const ROUND_BUTTON_TEXT2: TextStyle = {
  color: color.line
}
const CANCEL_CONTAINER: ViewStyle = {
  width: '40%',
  marginRight: 10
}
const CONFIRM_CONTAINER: ViewStyle = {
  backgroundColor: color.primary,
  width: '40%',
  borderColor: color.primary
}
const EXPAND_LAYOUT: ViewStyle = { marginTop: Platform.OS == "android" ? -30 : -40, marginBottom: Platform.OS == "android" ? -10 : -20 }
export const ModalNormal = (props: ModalNormalProps) => {

  const { visible, onTouchOutside, onSwipeOut,
    onPressRight, onPressLeft, imageTopic,
    title, subTitle } = props




  return (<Modal
    id="modal-normal-type"
    visible={visible}
    onTouchOutside={onTouchOutside}
    onSwipeOut={onSwipeOut}
    swipeDirection={['up', 'down']} // can be string or an array
    swipeThreshold={200} // default 100
  >
    <ModalContent >
      <View style={[ROOT_MODAL_VIEW]}>
        <SafeAreaView style={[FULL]}>

          <View style={[FULL, AROUND_CENTER, EXPAND_LAYOUT]}>
            {<View style={ALIGN_CENTER}>
              {imageTopic && imageTopic != "successTask" ? <Image
                source={imageTopic && imageTopic == 'truckYellowIcon' ? images.truckYellowIcon : images.workYellowIcon}
                resizeMode={"stretch"} /> :
                <Ionicons name={'checkmark-circle'} size={100} color={color.success} />}
            </View>}

            {<View style={[ALL_CENTER]}>
              {!!title && <Text tx={title} preset={'topicExtra'} />}
              {!!subTitle && <Text tx={subTitle} preset={'topic'} />}
            </View>}

            {<View style={[ROW_BUTTON, MARGIN_TOP_20]}>
              {onPressLeft && <RoundedButton onPress={onPressLeft} text={"common.cancel"} containerStyle={CANCEL_CONTAINER} textStyle={ROUND_BUTTON_TEXT2} />}
              {onPressRight && <RoundedButton onPress={onPressRight} text={"common.confirm"} containerStyle={CONFIRM_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />}
            </View>}

          </View>

        </SafeAreaView>

      </View>
    </ModalContent>
  </Modal >)
}
