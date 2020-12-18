import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, Text, VehicleItem } from "../../components/"
import { color, spacing } from "../../theme"
import { translate } from "../../i18n"
import { useNavigation } from "@react-navigation/native"
import MyVehicleStore from '../../store/my-vehicle-store/my-vehicle-store'

const CONTAINER: ViewStyle = {
  flex: 1,
}
const SCROLL: ViewStyle = {
  paddingTop: spacing[4],
  paddingLeft: spacing[3],
  paddingRight: spacing[3],
}
const BUTTON_ADD: ViewStyle = {
  backgroundColor: color.primary,
  borderRadius: 20,
  borderColor: color.primary,
  borderWidth: 1,
  marginLeft: spacing[3],
  marginRight: spacing[3],
  marginTop: spacing[2],
  marginBottom: spacing[2],
}
const TEXT_ADD: TextStyle = {
  color: color.textWhite,
  fontSize: 16,
  fontFamily: "Kanit-Medium",
}

export const MyVehicle = observer(function MyVehicle() {
  const navigation = useNavigation()

  const onPress = (id: number) => {
    MyVehicleStore.findOneRequest(id)
    navigation.navigate("vehicleDetail")
  }

  useEffect(() => {
    if (MyVehicleStore.list) {
      console.log('MyVehicleStore.list :>> ', JSON.parse(JSON.stringify(MyVehicleStore.list)));
    }
  }, [MyVehicleStore.list])

  /**
   * vehicle_no: topic
   * car_type: subTopic
   * to: updatedDate
   * status: status
   * image_name: image
   */

  return (
    <View style={CONTAINER}>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          // console.log('nativeEvent', nativeEvent)
        }}
        style={SCROLL}
        scrollEventThrottle={400}
      >
        {MyVehicleStore.list &&
          MyVehicleStore.list.map((item, index) => {
            const statusText = item.status === 'APPROVE' ? translate('myVehicleScreen.verified') : translate('myVehicleScreen.pending')
            const statusColor = item.status === 'APPROVE' ? color.success : color.primary
            return <VehicleItem
              key={index}
              topic={item.vehicle_no}
              subTopic={item.car_type}
              updatedDate={item.to}
              image={item.image_car_type}
              status={statusText}
              imageStyle={{ marginBottom: spacing[1] }}
              statusStyle={{ color: statusColor }}
              onPress={() => onPress(parseInt(item.id))}
            />
          })}
      </ScrollView>

      <View>
        <Button
          testID="add-new-vahicle"
          style={BUTTON_ADD}
          textStyle={TEXT_ADD}
          text={translate("myVehicleScreen.addNewCar")} // เพิ่มรถของฉัน
          // disabled={disabled}
          onPress={() => navigation.navigate("uploadVehicle")}
        />
      </View>
    </View>
  )
})
