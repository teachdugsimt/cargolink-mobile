import React, { useEffect, useState } from "react"
import { View, ImageProps, FlatList, RefreshControl, ViewStyle, TouchableOpacity, Dimensions, Linking, Platform, Alert } from "react-native"
import { EmptyListMessage, ContactList, Text } from "../../../components"
import { spacing, color } from "../../../theme"
import ShippersHistoryStore from "../../../store/shippers-history-call-store/shippers-history-call-store"
import { GetTruckType } from "../../../utils/get-truck-type"
import { translate } from "../../../i18n"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../models"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CallDetectorManager from 'react-native-call-detection'

const CONTAINER_LIST: ViewStyle = {
  marginVertical: spacing[1],
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[4],
  backgroundColor: color.backgroundWhite,
  borderRadius: spacing[1],
}
const RIGHT: ViewStyle = {
  justifyContent: 'center',
  alignContent: 'center',
  width: 40,
  height: 40,
  borderRadius: Dimensions.get('window').height / 2,
  backgroundColor: color.success,
}
const FOOTER: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  borderTopWidth: 1,
  borderTopColor: color.disable,
  marginTop: spacing[1],
  paddingTop: spacing[2],
  paddingBottom: spacing[1],
}

let callDetector = undefined

const startListenerTapped = (jobId?: string) => {
  __DEV__ && console.tron.log('startListenerTapped')
  callDetector = new CallDetectorManager((event, phoneNumber) => {
    __DEV__ && console.tron.log('phoneNumber', phoneNumber)
    if (event === 'Disconnected') {
      __DEV__ && console.tron.log('Disconnected')
      stopListenerTapped()
    } else if (event === 'Connected') { //  for iOS
      __DEV__ && console.tron.log('Connected')
    } else if (event === 'Incoming') {
      __DEV__ && console.tron.log('Incoming')
    } else if (event === 'Dialing') { //  for iOS
      __DEV__ && console.tron.log('Dialing')
    } else if (event === 'Offhook') { // for Android
      __DEV__ && console.tron.log('Offhook')
      // CarriersHistoryCallStore.add({ jobId })
    } else if (event === 'Missed') { // for Android
      __DEV__ && console.tron.log('Missed')
    }
  },
    false,
    () => { },
    {
      title: 'Phone State Permission',
      message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
    }
  )
}

const stopListenerTapped = () => {
  __DEV__ && console.tron.log('stopListenerTapped')
  callDetector && callDetector.dispose();
}

export const Item = (data) => {
  const {
    shipperName = '',
    shipperPhone = '',
    shipperEmail,
    truckType,
    loadingWeight,
    registrationNumber,
    callTime,
  } = data

  // const navigation = useNavigation()

  const onCall = (phone: string) => { // jobId: string, 
    const phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
    __DEV__ && console.tron.log('phoneNumber', phoneNumber)
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          __DEV__ && console.tron.log('Phone number is not available');
          Alert.alert('Phone number is not available')
          return false;
        } else {
          return startListenerTapped()
        }
      })
      .then(() => {
        return Linking.openURL(phoneNumber);
      })
      .catch(err => __DEV__ && console.tron.log('err', err));
  };

  const contentRender = () => (
    <View>
      <Text text={shipperPhone} preset={'fieldLabel'} style={{ color: color.line }} />
      <Text
        text={`${GetTruckType(+truckType)?.name || translate('common.vehicleTypeField') + " : " + translate('common.notSpecified')}`}
        style={{ paddingTop: spacing[2], paddingLeft: spacing[1] }}
      />
    </View>
  )

  const contentRight = () => (
    <TouchableOpacity style={RIGHT} onPress={() => onCall(shipperPhone)}>
      <MaterialCommunityIcons name={'phone'} size={20} style={{ textAlign: 'center' }} color={color.textWhite} />
    </TouchableOpacity>
  )

  const footer = () => (
    <View style={FOOTER}>
      <View style={{ flex: 1 }}>
        <Text text={callTime} style={{ textAlign: 'right', color: color.line }} preset={'fieldLabel'} />
      </View>
    </View>
  )

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <ContactList
        header={shipperName}
        containerStyle={CONTAINER_LIST}
        content={contentRender}
        contentRight={contentRight}
        footer={footer}
      />
    </View>
  )
}


export const ShipperHistoryList = observer(function ShipperHistoryList() {
  const navigation = useNavigation()

  const { versatileStore } = useStores()
  const [lang, setlang] = useState(null)

  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
    }
  }, [versatileStore.language])

  useEffect(() => {
    if (!ShippersHistoryStore.loading) {
      ShippersHistoryStore.setList(ShippersHistoryStore.list)
    }
  }, [ShippersHistoryStore.loading])

  useEffect(() => {
    // re-render when on press heart
  }, [ShippersHistoryStore.list.length])

  const renderItem = ({ item }) => (
    <Item {...item} onToggleHeart={onToggleHeart} />
  )

  const onToggleHeart = (res) => {
    const newData = [...JSON.parse(JSON.stringify(ShippersHistoryStore.list))].filter(({ id }) => id !== res.id)
    ShippersHistoryStore.setList(newData)
    ShippersHistoryStore.add(res.id)
  }

  const onScrollList = () => {
    console.log('scroll end')
  }

  const onRefresh = () => {
    ShippersHistoryStore.find();
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={ShippersHistoryStore.list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => onScrollList()}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={<EmptyListMessage />}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={ShippersHistoryStore.loading}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  )
})
