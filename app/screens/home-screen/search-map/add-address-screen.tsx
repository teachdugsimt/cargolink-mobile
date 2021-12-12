import React, { useState, useEffect } from 'react'
import { View, Dimensions, ViewStyle } from "react-native";
// import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from "react-native-google-places-autocomplete";
// import { GOOGLE_API_KEY } from '../../../config/env'
// import { GOOGLE_API_KEY } from '../../../config'
import { observer } from "mobx-react-lite"
import { Text, Screen } from '../../../components'
// import { color, images } from "../../../theme";
import { SwipeListView } from 'react-native-swipe-list-view';
// import { array } from 'mobx-state-tree/dist/internal';

const FULL: ViewStyle = { flex: 1 }
// const { height } = Dimensions.get('window')
interface AddressProps {
  id?: number
  houseNo?: string
  villageNo?: string
  road?: string
  subDistrict?: string
  district?: string
  province?: string
  zipCode?: string
}

export const AddAddressScreen = observer(function AddAddressScreen(props: any) {

  const initialAddress: any = [
    { id: 1, houseNo: '115/11', villageNo: "8", road: 'ไผ่ลิ้นช้าง', subDistrict: "บ่อพลับ", district: 'เมือง', province: 'นครปฐม', zipCode: '73000' },
    { id: 2, houseNo: '118/5', villageNo: "9", road: 'ถวิลราษฏรษ์บูรณะ', subDistrict: "บ่อพลับ", district: 'เมือง', province: 'นครปฐม', zipCode: '73000' },
    { id: 3, houseNo: '91/1', villageNo: "-", road: 'จันทราคามพิทักษ์', subDistrict: "สนามจันทร์", district: 'เมือง', province: 'นครปฐม', zipCode: '73000' },
  ]
  const [address, setAddress] = useState<AddressProps[]>(initialAddress)

  return (<Screen unsafe>
    <View style={FULL}>
      <SwipeListView
        data={address}
        renderItem={({ item, index }) => {
          console.log("ITEM ::", item)
          return (
            <View style={{ height: 80, width: '100%', backgroundColor: 'white', borderBottomWidth: 1 }}>
              <Text>I am {item?.houseNo && item.houseNo}</Text>
            </View>)
        }}
        renderHiddenItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', height: 80, flex: 1, justifyContent: 'flex-end', backgroundColor: 'green' }}>
            <Text style={{ backgroundColor: 'green', width: 50, height: 80, textAlign: 'center', textAlignVertical: 'center' }}>Left</Text>
            <Text style={{ backgroundColor: 'red', width: 50, height: 80, textAlign: 'center', textAlignVertical: 'center' }}>Right</Text>
          </View>
        )}
        closeOnRowOpen={true}
        closeOnRowBeginSwipe={true}
        disableRightSwipe={true}
        // leftOpenValue={75}
        rightOpenValue={-100}
      />
    </View>
  </Screen>)


})
