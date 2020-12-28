import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle, FlatList, RefreshControl } from "react-native"
import { Button, VehicleItem } from "../../components/"
import { color, spacing } from "../../theme"
import { translate } from "../../i18n"
import { useNavigation } from "@react-navigation/native"
import MyVehicleStore from '../../store/my-vehicle-store/my-vehicle-store'
import StatusStore from '../../store/my-vehicle-store/status-vehicle-store'

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
}

export const MyVehicle = observer(function MyVehicle() {
  const navigation = useNavigation()

  const onPress = (id: number) => {
    MyVehicleStore.findOneRequest(id)
    navigation.navigate("vehicleDetail")
  }

  useEffect(() => {
    if (MyVehicleStore.list && MyVehicleStore.list.length) {
      console.log('MyVehicleStore.list :>> ', JSON.parse(JSON.stringify(MyVehicleStore.list)));
    }
  }, [MyVehicleStore.list])

  const onScrollList = () => {
    // console.log('scroll down')
  }

  const onRefresh = () => {
    console.log('On refresh')
    MyVehicleStore.findRequest()
  }

  const renderItem = ({ item }) => {
    const statusText = item.approveStatus === 'APPROVE' ? translate('myVehicleScreen.verified') : translate('myVehicleScreen.pending')
    const statusColor = item.approveStatus === 'APPROVE' ? color.success : color.primary
    return (
      <VehicleItem
        key={item.id}
        topic={item.registrationNumber}
        subTopic={item.car_type}
        updatedDate={item.updatedAt}
        image={item.image_car_type}
        status={statusText}
        imageStyle={{ marginBottom: spacing[1] }}
        statusStyle={{ color: statusColor }}
        onPress={() => onPress(parseInt(item.id))}
      />
    )
  }

  /**
   * registrationNumber: topic
   * car_type: subTopic
   * to: updatedDate
   * status: status
   * image_name: image
   */

  return (
    <View style={CONTAINER}>

      <FlatList
        style={SCROLL}
        data={MyVehicleStore.list ? JSON.parse(JSON.stringify(MyVehicleStore.list)) : []}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => onScrollList()}
        onEndReachedThreshold={0.5}
        // onRefresh={onRefresh}
        // refreshing={state.isRequest}
        refreshControl={
          <RefreshControl
            refreshing={MyVehicleStore.loading}
            onRefresh={onRefresh}
          />
        }
      />

      <View>
        <Button
          testID="add-new-vahicle"
          style={BUTTON_ADD}
          textStyle={TEXT_ADD}
          text={translate("myVehicleScreen.addNewCar")} // เพิ่มรถของฉัน
          // disabled={disabled}
          onPress={() => {
            navigation.navigate("uploadVehicle")
            StatusStore.setStatusScreen('add')
            // MyVehicleStore.setStatusScreen('add')
          }}
        />
      </View>
    </View>
  )
})
