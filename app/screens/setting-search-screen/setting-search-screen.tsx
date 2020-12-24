import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { TextStyle, View, ViewStyle } from 'react-native'
import { Button, Checkbox, Header, Text } from '../../components'
import { color, spacing } from '../../theme'
import { useNavigation } from '@react-navigation/native'

const TEXT: TextStyle = { color: color.textBlack }
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = { backgroundColor: color.primary }
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite
}
const SEARCH_ITEM_ROOT: ViewStyle = {
  flex: 5,
  // backgroundColor: "lightblue",
  borderWidth: 1,
  borderColor: color.disable,
  padding: spacing[3]
}
const ITEM: ViewStyle = {

}
const TOPIC: TextStyle = {
  fontSize: 12,
}
const CONTENT: TextStyle = {
  color: color.dim,
}
const ROW: ViewStyle = {
  alignItems: "center",
  flexDirection: 'row'
}
const BUTTON_ROOT: ViewStyle = {
  flex: 1,
  // backgroundColor: 'lightgreen',
  justifyContent: "center",
  alignItems: 'center'
}
const BUTTON_CONFIRM: ViewStyle = {
  backgroundColor: color.primary,
  width: '90%',
  borderRadius: 8,
}
const BUTTON_CONFIRM_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
  paddingTop: 5,
  paddingBottom: 5
}

export const SettingSearchScreen = observer(function SettingSearchScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  const [searchByCategoryCar, setSearchByCategoryCar] = useState(false)
  const [searchByPrice, setSearchByPrice] = useState(false)

  return (
    <View style={CONTAINER}>
      <Header
        headerTx="searchJobScreen.searchJob"
        style={HEADER}
        titleStyle={HEADER_TITLE}
        headerText={"ตั้งค่าการค้นหา"}
        leftIconReal={true}
        leftIconName={"chevron-back"}
        rightIconText={'ล้าง'}
        onLeftPress={goBack}
      />
      <View style={SEARCH_ITEM_ROOT}>
        <View style={ITEM}>
          <Text
            text={'ค้นหาจากประเภทของรถ'}
            style={TOPIC}
          />
          <View style={ROW}>
            <Checkbox value={searchByCategoryCar} onToggle={() => setSearchByCategoryCar(!searchByCategoryCar)} />
            <Text text={'กรุณาเลือกประเภทรถขนส่ง'} style={CONTENT} />
          </View>
        </View>
        <View style={ITEM}>
          <Text
            text={'ช่วงราคา'}
            style={TOPIC}
          />
          <View style={ROW}>
            <Checkbox value={searchByPrice} onToggle={() => setSearchByPrice(!searchByPrice)} />
            <Text text={'ช่วงราคา'} style={CONTENT} />
            <Text text={'ช่วงราคา'} style={CONTENT} />
          </View>
        </View>
      </View>
      <View style={BUTTON_ROOT}>
        <Button
          testID="setting-search-confirm"
          style={BUTTON_CONFIRM}
          textStyle={BUTTON_CONFIRM_TEXT}
          text={'ยืนยัน'}
          onPress={() => navigation.navigate("signin")}
        />
      </View>
    </View>
  )
})