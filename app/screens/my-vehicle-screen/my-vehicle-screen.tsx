import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle, FlatList, RefreshControl, Platform, Alert } from "react-native"
import { Button, VehicleItem, Text } from "../../components/"
import { color, spacing } from "../../theme"
import { translate } from "../../i18n"
import { useNavigation } from "@react-navigation/native"
import MyVehicleStore from '../../store/my-vehicle-store/my-vehicle-store'
import StatusStore from '../../store/my-vehicle-store/status-vehicle-store'
import { AlertMessage } from '../../utils/alert-form'
import { useStores } from "../../models/root-store/root-store-context";
import date from 'date-and-time';
import Feather from 'react-native-vector-icons/Feather'
import i18n from 'i18n-js'
import ProfileStore from "../../store/profile-store/profile-store"
import AddressStore from "../../store/my-vehicle-store/address-store"

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
  borderRadius: 25,
  borderColor: color.primary,
  borderWidth: 1,
  height: 40,
  marginLeft: spacing[3],
  marginRight: spacing[3],
  marginTop: spacing[2],
  marginBottom: spacing[2],
}
const TEXT_ADD: TextStyle = {
  color: color.textBlack,
  fontSize: 14,
}
const EMPTY_CONTAINER_STYLE: ViewStyle = {
  flex: Platform.OS == "ios" ? 1 : 1.5,
  top: spacing[2], paddingVertical: 20,
  justifyContent: 'center',
  alignItems: 'center',
}
const EMPTY_TEXT_STYLE: TextStyle = {
  color: color.line,
}
let initCount = 1
let count = 1

export const MyVehicle = observer(function MyVehicle() {
  const navigation = useNavigation()
  const { tokenStore, versatileStore } = useStores()
  const onPress = (id: string) => {
    MyVehicleStore.findOneRequest(id)
    navigation.navigate("vehicleDetail", { id })
  }
  const [swipe, setswipe] = useState(false)
  const [list_state, setlist_state] = useState(null)

  useEffect(() => {
    let token = tokenStore?.token?.accessToken || null
    if (!token) navigation.navigate("signin")
    else MyVehicleStore.findRequest({ page: count })
    return () => {
      count = initCount
      MyVehicleStore.clearListData()
    }
  }, [])

  const onScrollList = () => {
    let tmp_list = JSON.parse(JSON.stringify(MyVehicleStore.list))
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

  const _gotoEditScreen = async (id) => {
    await MyVehicleStore.findOneRequest(id)
    StatusStore.setStatusScreen('edit')
    navigation.navigate("uploadVehicle")
  }

  const renderItem = ({ item }) => {
    const statusText = item.approveStatus === 'Approve' ? translate('myVehicleScreen.verified') : translate('myVehicleScreen.pending')
    const statusColor = item.approveStatus === 'Approve' ? color.success : color.primary
    // const registrationNumber = item.registrationNumber.map((n: string) => `ทะเบียน ${n}`)
    const registrationNumber = item.registrationNumber.join(', ')
    let list_all_truck = JSON.parse(JSON.stringify(versatileStore.list))
    let name = list_all_truck.find(e => item.truckType == e.id)
    const txtTruckType = `${translate("myVehicleScreen.type")}  ${name?.name || translate('common.notSpecified')}`
    const txtDateTime = `${translate("myVehicleScreen.informationAt")} ${date.format(new Date(item.updatedAt), 'DD/MM/YY')}`

    return (
      <VehicleItem
        key={item.id}
        topic={`${translate('common.licensePlate')} ${registrationNumber}`}
        subTopic={txtTruckType}
        updatedDate={txtDateTime}
        image={item.truckType}
        status={statusText}
        quotationNumber={item.quotationNumber}
        imageStyle={{ marginBottom: spacing[1] }}
        statusStyle={{ color: statusColor }}
        onPress={() => onPress(item.id)}
        onEdit={() => _gotoEditScreen(item.id)}
      />
    )
  }

  const EmptyText = (text) => {
    return <View style={[EMPTY_CONTAINER_STYLE]}>
      <Text tx={"common.notFound"} style={EMPTY_TEXT_STYLE} preset={"topicExtra"} />
      <Feather name={"inbox"} size={50} color={color.line} />
    </View>
  }

  const my_vehicle_list = JSON.parse(JSON.stringify(MyVehicleStore.list))

  return (
    <View style={CONTAINER}>

      <FlatList
        style={SCROLL}
        data={my_vehicle_list}
        renderItem={i18n.locale == "th" ? renderItem : renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => onScrollList()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={MyVehicleStore.loading}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={<EmptyText />}
      />

      <View>
        <Button
          testID="add-new-vahicle"
          style={[BUTTON_ADD, {
            backgroundColor: !tokenStore.token || !tokenStore.token.accessToken || !ProfileStore.data ? color.disable : color.primary,
            borderColor: !tokenStore.token || !tokenStore.token.accessToken || !ProfileStore.data ? color.disable : color.primary
          }]}
          textStyle={TEXT_ADD}
          text={translate("myVehicleScreen.addNewCar")} // เพิ่มรถของฉัน
          disabled={!tokenStore.token || !tokenStore.token.accessToken || !ProfileStore.data}
          onPress={() => {
            navigation.navigate("uploadVehicle")
            StatusStore.setStatusScreen('add')
          }}
        />
      </View>
    </View>
  )
})
