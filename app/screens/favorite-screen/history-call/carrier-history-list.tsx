import React, { ReactNode, useEffect, useState } from "react"
import { View, TextStyle, ImageProps, RefreshControl, FlatList, ViewStyle, Dimensions, Linking, Platform, Alert, TouchableOpacity } from "react-native"
import { ContactList, EmptyListMessage, SearchItem, Text } from "../../../components"
import { color, spacing } from "../../../theme"
import CarrierHistoryCallStore from "../../../store/carriers-history-call-store/carriers-history-call-store"
import { GetTruckType } from "../../../utils/get-truck-type"
import { translate } from "../../../i18n"
import { useStores } from "../../../models"
import { observer } from "mobx-react-lite"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CallDetectorManager from 'react-native-call-detection'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import i18n from 'i18n-js'
import { convertTime12to24 } from "../../../utils/convert-time-format";
import { API_URL } from '../../../config/'

const CONTAINER_LIST: ViewStyle = {
  marginVertical: spacing[1],
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[4],
  backgroundColor: color.backgroundWhite,
  borderRadius: spacing[1],
  overflow: 'hidden',
}
const RIGHT: ViewStyle = {
  marginLeft: 'auto',
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
}
const CONTENT: ViewStyle = {
  flex: 1,
  paddingTop: spacing[2],
  overflow: 'hidden'
}
const LOCATION: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing[1],
}
const LOCATION_TEXT: TextStyle = {

}
const TEXT: TextStyle = {
  paddingTop: spacing[2]
}
const CAR_DETAIL_ROOT: TextStyle = {
  flexDirection: "row",
  paddingLeft: spacing[1],
}
const CAR_DETAIL: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}

let callDetector = undefined

const startListenerTapped = (jobId?: string) => {
  callDetector = new CallDetectorManager((event, phoneNumber) => {
    if (event === 'Disconnected') {
      stopListenerTapped()
    } else if (event === 'Connected') { //  for iOS
    } else if (event === 'Incoming') {
    } else if (event === 'Dialing') { //  for iOS
    } else if (event === 'Offhook') { // for Android
      // CarriersHistoryCallStore.add({ jobId })
    } else if (event === 'Missed') { // for Android
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
  callDetector && callDetector.dispose();
}

const Item = (data) => {
  const {
    callTime,
    // email = '',
    name = '',
    phone = '',
    from,
    productName,
    // productTypeId,
    requiredTruckAmount,
    to,
    truckType,
    // weight,
    avatar,
  } = data

  // const navigation = useNavigation()

  const onCall = (phone: string) => { // jobId: string, 
    const phoneNumber = Platform.OS !== 'android' ? `telprompt:${phone}` : `tel:${phone}`
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available')
          return false;
        } else {
          return startListenerTapped()
        }
      })
      .then(() => {
        return Linking.openURL(phoneNumber);
      })
      .catch(err => __DEV__ && console.log('err', err));
  };

  const toLocal = to?.map(attr => attr.name).join(', ') || ''

  const contentRender = () => (
    <View>
      <Text text={phone} preset={'fieldLabel'} style={{ color: color.line }} />
      {/* <Text text={`${GetTruckType(+truckType)?.name || translate('common.vehicleTypeField') + " : " + translate('common.notSpecified')}`} /> */}

    </View>
  )

  const contentRight = () => (
    <View>
      <TouchableOpacity style={RIGHT} onPress={() => onCall(phone)}>
        <MaterialCommunityIcons name={'phone'} size={20} style={{ textAlign: 'center' }} color={color.textWhite} />
      </TouchableOpacity>
      {/* <Text text={callTime}
        style={{
          textAlign: 'right', color: color.line, bottom: -spacing[1]
        }}
        preset={'fieldLabel'} /> */}
    </View>
  )

  const footer = () => (
    <View style={FOOTER}>
      {/* <View style={{ flex: 1 }}>
        <Text text={callTime} style={{ textAlign: 'right', color: color.line }} preset={'fieldLabel'} />
      </View> */}
      <View style={CONTENT}>
        <View style={[LOCATION, { paddingTop: 0 }]}>
          <MaterialIcons name={'pin-drop'} color={color.primary} size={22} style={{ paddingRight: spacing[2] }} />
          <Text text={`${translate('common.from')}`} style={[LOCATION_TEXT, { width: i18n.locale === 'th' ? 30 : 50 }]} />
          <Text style={{ paddingRight: spacing[2] }} text={':'} />
          <Text text={from?.name || ''} style={[LOCATION_TEXT, { flexShrink: 1 }]} numberOfLines={1} />
        </View>
        <View style={LOCATION}>
          <MaterialIcons name={'pin-drop'} color={color.success} size={22} style={{ paddingRight: spacing[2] }} />
          <Text text={`${translate('common.to')}`} style={[LOCATION_TEXT, { width: i18n.locale === 'th' ? 30 : 50 }]} numberOfLines={1} />
          <Text style={{ paddingRight: spacing[2] }} text={':'} />
          <Text text={toLocal} style={[LOCATION_TEXT]} numberOfLines={1} />
        </View>
        <View style={CAR_DETAIL_ROOT}>
          <View style={CAR_DETAIL}>
            <Text style={TEXT} text={`${translate('jobDetailScreen.product')} : `} />
            <Text style={TEXT} text={productName} />
          </View>
        </View>
        <View style={[CAR_DETAIL_ROOT, { paddingBottom: spacing[2] }]}>
          <View style={CAR_DETAIL}>
            <Text style={TEXT} text={`${GetTruckType(+truckType)?.name || translate('common.vehicleTypeField') + " : " + translate('common.notSpecified')}`} />
          </View>
          <View style={CAR_DETAIL}>
            <Text style={TEXT} text={`${translate('common.amount')} : `} />
            <Text style={TEXT} text={requiredTruckAmount ? `${requiredTruckAmount.toString()} ${translate('jobDetailScreen.unit')}` : '-'} />
          </View>
        </View>
      </View>
    </View>
  )

  const imgSource: ImageProps = avatar ? {
    source: {
      uri: `${API_URL}/api/v1/media/file-stream?attachCode=` + avatar?.object,
      method: 'GET',
      headers: {
        Accept: 'image/*'
        // Authorization: `Bearer ${avatar?.token || ''}`,
        // adminAuth: avatar?.token || ''
      },
    },
    resizeMode: 'cover'
  } : null

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <ContactList
        header={name}
        callTime={convertTime12to24(callTime)}
        containerStyle={CONTAINER_LIST}
        content={contentRender}
        contentRight={contentRight}
        footer={footer}
        imageSource={imgSource}
      />
    </View>
  )
}

export const CarrierHistoryList = observer(function CarrierHistoryList() {

  const { versatileStore } = useStores()
  const [lang, setlang] = useState(null)

  useEffect(() => {
    if (lang != versatileStore.language) {
      setlang(versatileStore.language)
    }
  }, [versatileStore.language])

  useEffect(() => {
    if (!CarrierHistoryCallStore.loading) {
      CarrierHistoryCallStore.setList(CarrierHistoryCallStore.list)
    }
  }, [CarrierHistoryCallStore.loading])

  useEffect(() => {
    // re-render when on press heart
  }, [CarrierHistoryCallStore.list.length])

  const renderItem = ({ item }) => (
    <Item {...item} onToggleHeart={onToggleHeart} />
  )

  const onToggleHeart = (res) => {
    const newData = [...JSON.parse(JSON.stringify(CarrierHistoryCallStore.list))].filter(({ id }) => id !== res.id)
    CarrierHistoryCallStore.setList(newData)
    CarrierHistoryCallStore.add(res.id)
  }

  const onScrollList = () => {
    console.log('scroll end')
  }

  const onRefresh = () => {
    CarrierHistoryCallStore.find();
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={CarrierHistoryCallStore.list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => onScrollList()}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={<EmptyListMessage />}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={CarrierHistoryCallStore.loading}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  )
})
