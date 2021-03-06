import React, { useEffect, useState } from "react"
import { View, ImageProps, FlatList, RefreshControl, ViewStyle, TouchableOpacity, Dimensions, Linking, Platform, Alert, ImageBackground, ImageStyle } from "react-native"
import { EmptyListMessage, ContactList, Text } from "../../../components"
import { spacing, color, images as imageComponent } from "../../../theme"
import ShippersHistoryStore from "../../../store/shippers-history-call-store/shippers-history-call-store"
import { GetTruckType } from "../../../utils/get-truck-type"
import { translate } from "../../../i18n"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../models"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CallDetectorManager from 'react-native-call-detection'
import { convertTime12to24 } from "../../../utils/convert-time-format";
import { MapTruckImageName } from "../../../utils/map-truck-image-name"
import { API_URL } from '../../../config/'

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
  borderTopWidth: 1,
  borderTopColor: color.disable,
  marginTop: spacing[1],
  paddingTop: spacing[3],
  paddingBottom: spacing[1],
}
const JOB_DETAIL: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing[1],
  paddingHorizontal: spacing[1],
}
const BACKGROUND_CONTAINER: ViewStyle = {
  width: 120,
  height: 80,
  position: 'absolute',
  right: 0,
  bottom: -(spacing[2] + 2),
  overflow: 'hidden',
  marginRight: -(spacing[2] + 2)
}
const BACKGROUND: ImageStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  right: -35,
  opacity: 0.3,
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
    name = '',
    phone = '',
    // email = '',
    truckType,
    loadingWeight,
    // registrationNumber,
    callTime,
    avatar,
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
      <Text text={phone} preset={'fieldLabel'} style={{ color: color.line }} />
    </View>
  )

  const contentRight = () => (
    <TouchableOpacity style={RIGHT} onPress={() => onCall(phone)}>
      <MaterialCommunityIcons name={'phone'} size={20} style={{ textAlign: 'center' }} color={color.textWhite} />
    </TouchableOpacity>
  )
  // imageComponent[truckImage && truckImage !== 'greyMock' ? truckImage : '']
  const footer = () => (
    <View style={FOOTER}>
      <View style={JOB_DETAIL}>
        <MaterialCommunityIcons name={'truck'} color={color.primary} size={24} />
        <Text text={`${translate('jobDetailScreen.truckType')} :`} style={{ paddingLeft: spacing[2] }} />
        <Text text={`${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`} style={{ paddingLeft: spacing[2] }} />
      </View>
      <View style={JOB_DETAIL}>
        <MaterialCommunityIcons name={'weight'} color={color.primary} size={24} />
        <Text text={`${translate('jobDetailScreen.weightTon')} :`} style={{ paddingLeft: spacing[2] }} />
        <Text text={loadingWeight} style={{ paddingLeft: spacing[2] }} />
      </View>
      <View style={BACKGROUND_CONTAINER}>
        <ImageBackground source={imageComponent[MapTruckImageName(+truckType) && MapTruckImageName(+truckType) !== 'greyMock' ? MapTruckImageName(+truckType) : '']} style={BACKGROUND} resizeMode={'contain'} />
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
        containerStyle={CONTAINER_LIST}
        content={contentRender}
        callTime={convertTime12to24(callTime)}
        contentRight={contentRight}
        footer={footer}
        imageSource={imgSource}
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
