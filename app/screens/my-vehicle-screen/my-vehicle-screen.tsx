import React from 'react'
import { observer } from "mobx-react-lite"
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Text, VehicleItem } from '../../components/'
import { color, spacing } from '../../theme'
import { translate } from '../../i18n'
import { useNavigation } from '@react-navigation/native'

const CONTAINER: ViewStyle = {
  flex: 1,
}
const SCROLL: ViewStyle = {
  paddingTop: spacing[4],
  paddingLeft: spacing[3],
  paddingRight: spacing[3],
}
const BUTTON_ADD: ViewStyle = {
  backgroundColor: color.transparent,
  borderRadius: 20,
  borderColor: color.primary,
  borderWidth: 1,
  marginLeft: spacing[3],
  marginRight: spacing[3],
  marginTop: spacing[2],
  marginBottom: spacing[2],
}
const TEXT_ADD: TextStyle = {
  color: color.primary,
  fontSize: 16,
}

const DATA = [
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'รอตรวจสอบ',
    image: 'truck17',
  },
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'ตรวจสอบแล้ว',
    image: 'truck17',
    isChecked: true,
  },
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'รอตรวจสอบ',
    image: 'truck17',
  },
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'ตรวจสอบแล้ว',
    image: 'truck17',
    isChecked: true,
  },
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'รอตรวจสอบ',
    image: 'truck17',
  },
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'ตรวจสอบแล้ว',
    image: 'truck17',
    isChecked: true,
  },
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'รอตรวจสอบ',
    image: 'truck17',
  },
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'ตรวจสอบแล้ว',
    image: 'truck17',
    isChecked: true,
  },
]

export const MyVehicle = observer(function MyVehicle() {
  const navigation = useNavigation()

  return (
    <View style={CONTAINER}>

      <ScrollView
        onScroll={({ nativeEvent }) => {
          // console.log('nativeEvent', nativeEvent)
        }}
        style={SCROLL}
        scrollEventThrottle={400}
      >
        {DATA && DATA.map((item, index) => {
          return <VehicleItem key={index} {...item} onPress={() => console.log('Click me!!')} />
        })}

      </ScrollView>

      <Button
        testID="add-new-vahicle"
        style={BUTTON_ADD}
        textStyle={TEXT_ADD}
        text={translate('myVehicleScreen.addNewCar')} // เพิ่มรถของฉัน
        // disabled={disabled}
        onPress={() => navigation.navigate("home")}
      />
    </View>
  )
})