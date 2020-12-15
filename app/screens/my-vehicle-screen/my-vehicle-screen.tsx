import React from 'react'
import { observer } from "mobx-react-lite"
import { ScrollView, View } from 'react-native'
import { VehicleItem } from '../../components/'

const DATA = [
  {
    topic: 'ทะเบียน กข - 11245',
    subTopic: 'รถบรรทุกคอก',
    updatedDate: '19/11/63',
    status: 'รอตรวจสอบ',
    image: 'truck17',
  },
]

export const MyVehicle = observer(function MyVehicle() {

  return (
    <View>

      <ScrollView
        onScroll={({ nativeEvent }) => {
          console.log('nativeEvent', nativeEvent)
        }}
        style={{}}
        scrollEventThrottle={400}
      >

        {DATA && DATA.map((item, index) => {
          return <VehicleItem {...item} />
        })}

      </ScrollView>
    </View>
  )
})