import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle, FlatList, RefreshControl } from "react-native"
import { Button, VehicleItem } from "../../components/"
import { color, spacing } from "../../theme"
import { translate } from "../../i18n"
import { useNavigation } from "@react-navigation/native"
import MyVehicleStore from '../../store/my-vehicle-store/my-vehicle-store'
import StatusStore from '../../store/my-vehicle-store/status-vehicle-store'
import { GetTruckType } from "../../utils/get-truck-type";
import date from 'date-and-time';

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
let initCount = 0
let count = 0

export const MyVehicle = observer(function MyVehicle() {
  const navigation = useNavigation()
  const onPress = (id: string) => {
    MyVehicleStore.findOneRequest(id)
    navigation.navigate("vehicleDetail")
  }
  const [swipe, setswipe] = useState(false)
  const [list_state, setlist_state] = useState(null)

  useEffect(() => {
    MyVehicleStore.findRequest({ page: count })
    return () => {
      count = initCount
      MyVehicleStore.clearListData()
    }
  }, [])

  const onScrollList = () => {
    let tmp_list = JSON.parse(JSON.stringify(MyVehicleStore.list))
    __DEV__ && console.tron.log("Tmmp list On scroll END :: >> ", tmp_list)
    if (MyVehicleStore.loading == false && tmp_list.length % 10 == 0) {
      count++
      MyVehicleStore.findRequest({ page: count })
    }
  }

  const onRefresh = () => {
    count = initCount
    MyVehicleStore.findRequest({ page: count })
  }

  useEffect(() => {
    let tmp = JSON.parse(JSON.stringify(MyVehicleStore.list))
    if (tmp && tmp != list_state) {
      setlist_state(tmp)
      setswipe(!swipe)
    }
  }, [MyVehicleStore.list])

  const renderItem = ({ item }) => {
    const statusText = item.approveStatus === 'Approve' ? translate('myVehicleScreen.verified') : translate('myVehicleScreen.pending')
    const statusColor = item.approveStatus === 'Approve' ? color.success : color.primary
    // const registrationNumber = item.registrationNumber.map((n: string) => `ทะเบียน ${n}`)
    const registrationNumber = item.registrationNumber.join(', ')
    const txtTruckType = `${translate("myVehicleScreen.type")}  ${GetTruckType(+item.truckType)?.name || translate('common.notSpecified')}`
    const txtDateTime = `${translate("myVehicleScreen.informationAt")} ${date.format(new Date(item.updatedAt), 'DD/MM/YY')}`

    return (
      <VehicleItem
        key={item.id}
        topic={`${translate('common.licensePlate')} ${registrationNumber}`}
        subTopic={txtTruckType}
        updatedDate={txtDateTime}
        image={item.truckType}
        status={statusText}
        imageStyle={{ marginBottom: spacing[1] }}
        statusStyle={{ color: statusColor }}
        onPress={() => onPress(item.id)}
      />
    )
  }

  const my_vehicle_list = JSON.parse(JSON.stringify(MyVehicleStore.list))

  return (
    <View style={CONTAINER}>

      <FlatList
        style={SCROLL}
        data={my_vehicle_list}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => onScrollList()}
        onEndReachedThreshold={0.5}
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
