import React from 'react'
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
  backgroundColor: "lightblue",
  borderWidth: 1,
  borderColor: color.disable,
  padding: spacing[3]
}
const ITEM: ViewStyle = {

}
const TOPIC: ViewStyle = {

}
const CONTENT: ViewStyle = {

}
const ROW: ViewStyle = {
  justifyContent: "center"
}
const BUTTON_ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: 'lightgreen',
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
  fontWeight: 'bold',
  paddingTop: 5,
  paddingBottom: 5
}

export const SettingSearchScreen = observer(function SettingSearchScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  const toggle = () => {
    console.log('Click Me')
  }

  return (
    <View style={CONTAINER}>
      <Header
        headerTx="searchJobScreen.searchJob"
        style={HEADER}
        titleStyle={HEADER_TITLE}
        headerText={"ตั้งค่าการค้นหา"}
        leftIconReal={true}
        leftIconName={"back"}
        onLeftPress={goBack}
      />
      <View style={SEARCH_ITEM_ROOT}>
        <View style={ITEM}>
          <Text
            text={'ค้นหาจากประเภทของรถ'}
            style={{}}
          />
          <View style={ROW}>
            <Checkbox value={false} onToggle={toggle} />
            <Text text={'กรุณาเลือกประเภทรถขนส่ง'} />
          </View>
        </View>
        <View style={ITEM}>
          <Text
            text={'ช่วงราคา'}
            style={{}}
          />
          <View style={ROW}>
            <Checkbox value={false} onToggle={toggle} />
            <Text text={'ช่วงราคา'} />
            <Text text={'ช่วงราคา'} />
          </View>
        </View>
      </View>
      <View style={BUTTON_ROOT}>
        <Button
          testID="continue-with-signin"
          style={BUTTON_CONFIRM}
          textStyle={BUTTON_CONFIRM_TEXT}
          text={'ยืนยัน'}
          onPress={() => navigation.navigate("signin")}
        />
      </View>
    </View>
  )
})