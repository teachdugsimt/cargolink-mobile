import React from "react"
import {
  View, Image, ImageStyle, Dimensions, ViewStyle, TouchableOpacity,
  Platform, Linking, Alert
} from "react-native"
import { images } from "../../theme"
import { Text } from '../text/text'
import { useStores } from "../../models/root-store/root-store-context";
import { LocalNotification } from "../../services/push/LocalPushController";
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get('window')

interface PropsPremium {
  onPress: () => void;
}

/**
 * A component which has a label and an input together.
 */
const MARGIN_HORIZONTAL_10: ViewStyle = { marginHorizontal: 20 }
const PADDING_TOP_10: ViewStyle = { paddingTop: 10 }
const IMAGE_NEWS: ImageStyle = {
  width: '100%',
  height: width / 3,
  borderRadius: 10,
}
export function SponserHome(props: PropsPremium) {
  const navigation = useNavigation()

  const onCall = (phone: string) => {
    let phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
    __DEV__ && console.tron.log('phoneNumber', phoneNumber)
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          __DEV__ && console.tron.log('Phone number is not available');
          Alert.alert('Phone number is not available')
          return false;
        }
      })
      .then(() => {
        return Linking.openURL(phoneNumber);
      })
      .catch(err => __DEV__ && console.tron.log('err', err));
  };
  return (
    <View style={MARGIN_HORIZONTAL_10}>
      <View>
        <Text tx="homeScreen.newPromotion" preset="topic" />
      </View>
      <TouchableOpacity style={[PADDING_TOP_10, { overflow: "hidden", borderRadius: 10 }]}
        onPress={props.onPress}>
        <Image source={images.sponser} style={IMAGE_NEWS} resizeMode="stretch" />
      </TouchableOpacity>
    </View>
  )
}
