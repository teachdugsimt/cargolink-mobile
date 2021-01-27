import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from '../../config/env'
import Icon from 'react-native-vector-icons/Ionicons'
import { Text } from '../../components/'
import { color, images } from "../../theme";
import i18n from 'i18n-js'
import styles from './styles'
import Geolocation from '@react-native-community/geolocation';

const { height } = Dimensions.get('window')

const latitudeDelta = 0.005;
const longitudeDelta = 0.005;

const initialData = {
  latitudeDelta,
  longitudeDelta,
  latitude: 13.736717,
  longitude: 100.523186,
  // longitude: -122.08400000000002,
  // latitude: 37.421998333333335
}
let mapView: MapView
let searchText
let initialState = {
  listViewDisplayed: true,
  address: "",
  showAddress: false,
  search: "",
  currentLat: 0,
  currentLng: 0,
  forceRefresh: 0,
}

export const LocationPicker = (props) => {
  const [region, setregion] = useState(initialData)
  const [tmpCurrentRegion, settmpCurrentRegion] = useState(null)
  const [{ address, listViewDisplayed,
    showAddress, search, currentLat, currentLng, forceRefresh }, setState] = useState(initialState)

  const getAddress = () => {
    //function to get address using current lat and lng
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + region.latitude + "," + region.longitude + "&key=" + GOOGLE_API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("ADDRESS GEOCODE is BACK!! => " + JSON.stringify(responseJson));
        setState(prevState => ({
          ...prevState,
          address: responseJson?.results[0] ? JSON.stringify(responseJson.results[0].formatted_address).replace(/"/g, "") : ""
        }))
      });
  }
  useEffect(() => {
    Geolocation.getCurrentPosition(info => _currentRegion(info), error => __DEV__ && console.tron.log(error))
    getAddress()
    return () => {
      Geolocation.stopObserving()
      setState(initialState)
      setregion(initialData)
    }
  }, [])


  const { onSubmitMap, banner } = props

  const goToInitialLocation = (region) => {
    let initialRegion = Object.assign({}, region);
    initialRegion["latitudeDelta"] = 0.0005;     // zoom in
    initialRegion["longitudeDelta"] = 0.0005;      // zoom out
    __DEV__ && console.tron.log("Region in goToInitialLocation :: ", initialRegion)
    // mapView.animateToRegion(initialRegion, 2000);
    // mapView.animateCamera(initialRegion);
  };
  const onRegionChange = (regionParam) => {
    __DEV__ && console.tron.log("________ ON Region Change _________ :: ", regionParam)
    // อนุเสา  ธรรมศาสตร์
    mapView.animateToRegion(regionParam, 2000);
    setregion(regionParam)
    setState(prev => ({ ...prev, forceRefresh: Math.floor(Math.random() * 100) }))
    getAddress();
  };

  const _currentRegion = (info) => {
    settmpCurrentRegion(info)
    __DEV__ && console.tron.log("______ INFO CURRENT LOCATION :: ", info)
    let tmp = Object.assign({}, region);
    tmp.latitude = info.coords.latitude
    tmp.longitude = info.coords.longitude
    __DEV__ && console.tron.log("After set Current Location :: ", tmp)
    setregion(tmp)
  }

  console.log("MapView :", mapView)
  console.log("Autocomplete Google :: ", searchText)
  return (
    <View style={styles.map}>
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
        listViewDisplayed ? styles.panelFill : styles.panel,]}>
          <GooglePlacesAutocomplete
            currentLocation={false}
            enableHighAccuracyLocation={true}
            ref={(c) => (searchText = c)}
            placeholder="Search for a location"
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
              __DEV__ && console.tron.log("Data google place autocomplete :: ", data)
              __DEV__ && console.tron.log("Detail google place autocomplete :: ", details)
              setState(prevState => ({
                ...prevState,
                listViewDisplayed: false,
                address: data.description,
                currentLat: details.geometry.location.lat,
                currentLng: details.geometry.location.lng,
              }))
              setregion({
                latitudeDelta,
                longitudeDelta,
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              })
              searchText.setAddressText("");
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
            styles={{
              description: {
                fontFamily: "Kanit-Medium",
                color: "black",
                fontSize: 12,
              },
              predefinedPlacesDescription: {
                color: "black",
              },
              listView: {
                position: "absolute",
                marginTop: 44,
                backgroundColor: "white",
                borderBottomEndRadius: 15,
                elevation: 2,
              },
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
          source={images.pinbox} />
      </View>



      <View style={{ justifyContent: 'flex-end', minHeight: Platform.OS == "ios" ? height / 7 : height / 6 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
            <View>
              <View style={{ flexDirection: "row", marginHorizontal: 10, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="home" size={24} color={color.primary} style={{ padding: 10 }} />
                  <Text style={styles.addressText} tx={banner} />
                </View>
                <TouchableOpacity
                  onPress={() => onSubmitMap(address, region)}
                  style={styles.buttonSubmit}>
                  <Text style={{ paddingVertical: 2.5 }} tx={"common.confirm"} />
                </TouchableOpacity>
              </View>

              <TextInput
                multiline={true}
                clearButtonMode="while-editing"
                style={styles.inputAddressFinal}
                onChangeText={(text) => setState(prev => ({ ...prev, address: text }))}
                value={address}
              />

            </View>
          </TouchableWithoutFeedback>

        </KeyboardAvoidingView>
      </View>


    </View>
  )
}
