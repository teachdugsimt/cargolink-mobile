import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, TextInput, SafeAreaView, Platform, Keyboard, TouchableWithoutFeedback, Dimensions, ViewStyle } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from '../../../config/env'
import { observer } from "mobx-react-lite"
import { Text, Screen } from '../../../components'
import { color, images } from "../../../theme";
import i18n from 'i18n-js'
import { translate } from "../../../i18n"
import styles from './styles'
import Geolocation from '@react-native-community/geolocation';
import { SearchMapProps } from './search-map.props'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation, useRoute } from "@react-navigation/native"
import { onChange } from "react-native-reanimated";
// import { Modalize } from 'react-native-modalize';

const FULL: ViewStyle = { flex: 1 }
const { height } = Dimensions.get('window')
const PADDING_VERTICAL: ViewStyle = { paddingVertical: 2.5 }
const ROW: ViewStyle = { flexDirection: "row" }
const SPACE_BETWEEN: ViewStyle = { justifyContent: 'space-between' }
const MAIN_VIEW_BOTTOM: ViewStyle = { ...ROW, marginHorizontal: 10, paddingTop: 7.5, justifyContent: 'space-between' }
const ROW_1: ViewStyle = { ...ROW, ...FULL }
const FLEX_END: ViewStyle = { justifyContent: 'flex-end' }
const ROOT_BOTTOM: ViewStyle = { ...FLEX_END, backgroundColor: color.textWhite }
const BUTTON_VIEW: ViewStyle = { ...ROW, ...FULL, ...FLEX_END }
const VIEW_TEXT_ADDRESS: ViewStyle = { flex: 1, marginTop: 10 }

const latitudeDelta = 0.005;
const longitudeDelta = 0.005;

let mapView: MapView
let searchText: GooglePlacesAutocompleteRef

export const LocationPickerScreen = observer(function LocationPickerScreen(props: SearchMapProps) {
  const initialData = {
    latitudeDelta,
    longitudeDelta,
    latitude: 13.736717,
    longitude: 100.523186,
  }

  let initialState = {
    listViewDisplayed: true,
    address: "",
    showAddress: false,
    search: "",
    currentLat: 0,
    currentLng: 0,
    forceRefresh: 0,
  }
  const navigation = useNavigation()
  const [region, setregion] = useState(initialData)
  const [tmpCurrentRegion, settmpCurrentRegion] = useState(null)
  const [{ address, listViewDisplayed,
    showAddress, search, currentLat, currentLng, forceRefresh }, setState] = useState(initialState)

  const getAddress = () => {
    //function to get address using current lat and lng
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + region.latitude + "," + region.longitude + "&region=th" + "&key=" + GOOGLE_API_KEY + "&language=" + i18n.locale)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("ADDRESS GEOCODE is BACK!! => ", responseJson);
        setState(prevState => ({
          ...prevState,
          address: responseJson?.results[0] ? JSON.stringify(responseJson.results[0].formatted_address).replace(/"/g, "") : ""
        }))
      });
  }
  useEffect(() => {
    console.log("___________ Commponent Did mount Search map ___________")
    // Geolocation.getCurrentPosition(info => _currentRegion(info), error => __DEV__ && console.tron.log(error))
    Geolocation.getCurrentPosition(info => _currentRegion(info))
    getAddress()
    return () => {
      Geolocation.stopObserving()
      setState(initialState)
      setregion(initialData)
    }
  }, [])

  const route = useRoute()

  const { banner, onSubmitMap, path }: SearchMapProps = route?.params || {}

  const goToInitialLocation = (region) => {
    let initialRegion = Object.assign({}, region);
    initialRegion["latitudeDelta"] = 0.0005;     // zoom in
    initialRegion["longitudeDelta"] = 0.0005;      // zoom out
  };
  const onRegionChange = (regionParam) => {
    console.log("__________ On Region Change __________")
    mapView.animateToRegion(regionParam, 2000);
    setregion(regionParam)
    setState(prev => ({ ...prev, forceRefresh: Math.floor(Math.random() * 100) }))
    getAddress();
  };

  const _currentRegion = (info) => {
    settmpCurrentRegion(info)
    let tmp = Object.assign({}, region);
    tmp.latitude = info.coords.latitude
    tmp.longitude = info.coords.longitude
    setregion(tmp)
  }

  // console.log("MapView :", mapView)
  // console.log("Autocomplete Google :: ", searchText)
  console.log("Region in render Function :: ", region)
  console.log("Banner :: ", path)
  return (
    <SafeAreaView style={[FULL, { backgroundColor: color.textWhite }]}>
      <View style={styles.map}>
        <Screen unsafe preset="fixed">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
            <View style={FULL}>
              <MapView
                ref={(ref) => mapView = ref}
                onMapReady={() => goToInitialLocation(region)}
                style={[styles.map]}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                region={region}
                onRegionChangeComplete={onRegionChange}
              />


              <View style={styles.panel}>

                <View style={[styles.panelHeader,
                listViewDisplayed ? styles.panelFill : styles.panel]}>






                  <View style={styles.rowCenter}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonBack}>
                      <Ionicons name={'chevron-back'} size={20} color={color.mainGrey} />
                    </TouchableOpacity>
                    <View style={{ ...styles.paddingTop10, flexDirection: 'row' }}>
                      <Text tx={"common.add"} preset="topic" />
                      <Text tx={banner} preset="topic" />
                    </View>
                  </View>




                  <GooglePlacesAutocomplete
                    // renderRightButton={() => <View style={{ backgroundColor: 'white', height: 44 }}><Icon name="home" size={20} /></View>}
                    currentLocation={false}
                    enableHighAccuracyLocation={true}
                    ref={(c) => (searchText = c)}
                    placeholder={translate("common.searchLocation")}
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    returnKeyType={"search"}
                    // listViewDisplayed={listViewDisplayed}
                    listViewDisplayed={"auto"}
                    fetchDetails={true}
                    renderDescription={(row) => row.description}
                    enablePoweredByContainer={false}
                    listUnderlayColor="lightgrey"
                    onPress={(data, details) => {
                      setState(prevState => ({
                        ...prevState,
                        listViewDisplayed: false,
                        // address: data.description,
                        currentLat: details.geometry.location.lat,
                        currentLng: details.geometry.location.lng,
                      }))
                      setregion({
                        latitudeDelta,
                        longitudeDelta,
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                      })
                      searchText?.setAddressText("")
                      goToInitialLocation(region);
                    }}
                    textInputProps={{
                      onChangeText: (text) => {
                        console.log(text);
                        setState(prev => ({ ...prev, listViewDisplayed: true }));
                      },
                    }}
                    getDefaultValue={() => {
                      return ""; // text input default value
                    }}
                    query={{
                      key: GOOGLE_API_KEY,
                      language: i18n.locale, // language of the results
                      components: i18n.locale == "th" ? "country:tha" : "country:tha",
                    }}
                    // renderRightButton={() => <TouchableOpacity style={{
                    //   position: 'absolute', right: 5, top: 5
                    // }}><Text>Button</Text></TouchableOpacity>}
                    styles={{
                      container: {
                        paddingTop: 10,
                        paddingHorizontal: 10
                      },
                      textInput: { borderRadius: 20 },
                      description: {
                        fontFamily: "Kanit-Medium",
                        color: "black",
                        fontSize: 12,
                      },
                      predefinedPlacesDescription: {
                        color: "black",
                      },
                      // row: {}  // each row of result list
                    }}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    GooglePlacesSearchQuery={{
                      rankby: "distance",
                      types: "building",
                    }}
                    filterReverseGeocodingByTypes={[
                      "locality", "administrative_area_level_3",]}
                    debounce={200} />
                </View>
              </View>










              <View style={styles.markerFixed}>
                <Image
                  style={styles.marker}
                  source={images.pinMap}
                  resizeMode="stretch" />
              </View>



              <View style={[ROOT_BOTTOM, { minHeight: Platform.OS == "ios" ? height / 5 : height / 3.8 }]}>


                <View style={[MAIN_VIEW_BOTTOM]}>
                  <View style={ROW_1}>
                    <Text style={styles.addressText} tx={banner} />
                    <Text style={styles.star} text={" *"} />
                  </View>
                  <View style={BUTTON_VIEW}>
                    <TouchableOpacity
                      onPress={() => {
                        onSubmitMap(address, region, path)
                        navigation.goBack()
                      }}
                      style={styles.buttonSubmit}>
                      <Text style={PADDING_VERTICAL} tx={"common.confirm"} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ paddingLeft: 17.5, paddingRight: 17.5, paddingTop: 10 }}>
                  <View style={[ROW, SPACE_BETWEEN]}>
                    <View style={ROW}>
                      <MaterialIcons name={'pin-drop'} color={color.primary} size={22} />
                      <Text tx="postJobScreen.currentPin" />
                    </View>

                    {/* <TouchableOpacity onPress={() => navigation.navigate("addAddress")}> */}
                    <TouchableOpacity onPress={() => { }}>
                      <Feather name={'edit'} color={color.disable} size={22} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={VIEW_TEXT_ADDRESS}>
                  <TextInput
                    multiline={true}
                    clearButtonMode="while-editing"
                    style={styles.inputAddressFinal}
                    onChangeText={(text) => setState(prev => ({ ...prev, address: text }))}
                    value={address}
                  />
                </View>
              </View>









            </View>
          </TouchableWithoutFeedback>
        </Screen>


      </View>
    </SafeAreaView>
  )
})
