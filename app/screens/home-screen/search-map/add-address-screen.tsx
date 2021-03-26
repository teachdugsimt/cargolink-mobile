import React from 'react'
import { View, Image, TouchableOpacity, TextInput, SafeAreaView, Platform, Keyboard, TouchableWithoutFeedback, Dimensions, ViewStyle } from "react-native";
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from '../../../config/env'
import { observer } from "mobx-react-lite"
import { Text, Screen } from '../../../components'
import { color, images } from "../../../theme";

const FULL: ViewStyle = { flex: 1 }
const { height } = Dimensions.get('window')

export const AddAddressScreen = observer(function AddAddressScreen(props: any) {

  return (<Screen unsafe>
    <View style={FULL}>
      <Text>Add Address Screen</Text>
      <Text>Add Address Screen</Text>
      <Text>Add Address Screen</Text>
    </View>
  </Screen>)


})
