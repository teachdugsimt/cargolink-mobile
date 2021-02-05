import React, { useEffect, useState } from 'react'
import { observer } from "mobx-react-lite"
import { Dimensions, FlatList, Image, RefreshControl, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { color, images, spacing } from "../../../theme";
import ShipperJobStore from '../../../store/shipper-job-store/shipper-job-store'
import { useNavigation } from "@react-navigation/native"
import { GetTruckType } from "../../../utils/get-truck-type";
import { MapTruckImageName } from "../../../utils/map-truck-image-name";
import { Button, EmptyListMessage, ModalAlert, SearchItem, Text } from "../../../components";
import { translate } from '../../../i18n';
import AdvanceSearchStore from '../../../store/shipper-job-store/advance-search-store'
import TruckTypeStore from '../../../store/truck-type-store/truck-type-store'
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const FULL: ViewStyle = { flex: 1 }
const HEADER: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: spacing[5],
  paddingBottom: spacing[1],
}
const BOTTOM_ROOT: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing[3],
}
const BTN_COLUMN: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: spacing[2]
}
const LIST: ViewStyle = {
  flex: 1,
  paddingTop: spacing[2],
}
const BTN_STYLE: ViewStyle = {
  flex: 1,
  borderRadius: Dimensions.get('window').width / 2,
  marginHorizontal: spacing[3]
}
const CALL_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 18,
}
const BTN_BOTTOM: ViewStyle = {
  flex: 1,
  borderRadius: Dimensions.get('window').width / 2,
  marginHorizontal: spacing[3],
  backgroundColor: color.transparent,
  borderWidth: 1,
  borderColor: color.primary,
}
const BTN_BOTTOM_TXT: TextStyle = {
  color: color.primary,
  fontSize: 18,
  paddingVertical: spacing[1]
}

const CheckMark = (data) => (<LottieView
  source={require('../../../AnimationJson/check-mark.json')}
  style={{ height: 100, width: 100, }}
  autoPlay={data.autoPlay}
  loop={false}
  speed={0.7}
  onAnimationFinish={data.onAnimationFinish()}
/>)

const RenderImageAlert = () => (<Image source={images['truckYellowIcon']} width={75} height={75} />)

const RenderButtonAlert = (props) => {

  const btnCancleStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.line, backgroundColor: color.transparent }
  const btnConfirmStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.primary, backgroundColor: color.primary }
  return (
    <View style={{ ...BOTTOM_ROOT, paddingVertical: spacing[2] }}>
      <Button
        testID="btn-cancel"
        style={btnCancleStyle}
        textStyle={{ ...CALL_TEXT, color: color.line }}
        text={translate("common.cancel")}
        onPress={() => props.onCloseModal()}
      />
      <Button
        testID="btn-ok"
        style={btnConfirmStyle}
        textStyle={{ ...CALL_TEXT, color: color.textWhite }}
        text={translate("common.confirm")}
        onPress={() => props.onConfirmJob()}
      />
    </View>
  )
}

const Item = (data) => {
  const {
    id,
    productName,
    truckType,
    requiredTruckAmount,
    from,
    to,
    owner,
    onEdit,
    onVisibleModal
  } = data

  const onToggleHeart = (data) => { }

  const RenderBottom = () => (
    <View style={BOTTOM_ROOT}>
      <TouchableOpacity activeOpacity={1} style={BTN_COLUMN} onPress={() => onEdit(id)}>
        <Text tx={'myJobScreen.editJob'} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} style={[BTN_COLUMN, { borderLeftWidth: 1, borderLeftColor: color.disable }]} onPress={() => onVisibleModal(id)}>
        <Text tx={'myJobScreen.bookerWaiting'} />
      </TouchableOpacity>
    </View>
  )

  const typeOfTruck = GetTruckType(+truckType)?.name || `${translate('jobDetailScreen.truckType')} : ${translate('common.notSpecified')}`

  return (
    <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
      <SearchItem
        {
        ...{
          id,
          fromText: from.name,
          toText: to.map(location => location.name).join(', '),
          count: requiredTruckAmount,
          productName: productName,
          truckType: typeOfTruck,
          // packaging: productName,
          // detail,
          viewDetail: true,
          postBy: owner.companyName,
          isVerified: false,
          // isLike: isLiked,
          showFavoriteIcon: false,
          backgroundImage: images[MapTruckImageName(+truckType) || 'truck'],
          // rating,
          // ratingCount,
          // isCrown,
          logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
          isRecommened: false,
          containerStyle: {
            paddingTop: spacing[2],
            borderRadius: 6
          },
          onPress: () => onVisibleModal(id),
          onToggleHeart,
          bottomComponent: () => <RenderBottom />
        }
        }
      />
    </View>
  )
}

let PAGE = 0

export const SelectJobScreen = observer(function MyJobScreen() {
  const navigation = useNavigation()

  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [isBokking, setIsBooking] = useState<boolean>(false)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true)
  // const [listLength, setListLength] = useState<number>(0)

  useEffect(() => {
    if (!TruckTypeStore.list.length) {
      TruckTypeStore.find()
    }
    ShipperJobStore.find()
    return () => {
      ShipperJobStore.setDefaultOfList()
    }
  }, [])

  const renderItem = ({ item }) => <Item {...item} onVisibleModal={onVisibleModal} onEdit={onEdit} />

  const onScrollList = () => {
    console.log('onScrollList')
    if (!onEndReachedCalledDuringMomentum && !ShipperJobStore.loading) {
      PAGE += 10
      const advSearch = { ...JSON.parse(JSON.stringify(AdvanceSearchStore.filter)), page: PAGE }
      ShipperJobStore.find(advSearch)
      setOnEndReachedCalledDuringMomentum(true)
    }
  }

  const onRefresh = () => {

  }

  const onCloseModal = () => {
    setVisibleModal(false)
  }

  const onVisibleModal = (id: string) => {
    console.log('id', id)
    setVisibleModal(true)
  }

  const onEdit = (id: string) => {
    console.log('onEdit')
  }

  const onConfirmJob = () => {
    setIsBooking(true)
    // onCloseModal()
  }

  const onAnimationFinish = () => {
    setIsBooking(false)
    onCloseModal()
  }

  const modalProps = {
    containerStyle: {
      paddingTop: spacing[6],
      paddingBottom: spacing[2]
    },
    imageComponent: !isBokking ? RenderImageAlert : () => CheckMark({ autoPlay: isBokking, onAnimationFinish: () => onAnimationFinish }),
    header: !isBokking ? translate('jobDetailScreen.confirmJob') : translate('jobDetailScreen.bookedSuccess'),
    headerStyle: {
      paddingTop: spacing[3],
      color: color.primary
    },
    content: translate('jobDetailScreen.callbackForOwner'),
    contentStyle: {
      paddingTop: spacing[1],
      paddingBottom: spacing[5],
      paddingHorizontal: spacing[7],
      color: color.line
    },
    buttonContainerStyle: !isBokking ? { width: '90%' } : {},
    buttonComponent: () => !isBokking ? <RenderButtonAlert onCloseModal={onCloseModal} onConfirmJob={onConfirmJob} /> : null,
    visible: visibleModal,
  }

  return (
    <View style={FULL}>
      <View style={HEADER}>
        <Text text={`* ${translate('selectJobScreen.selectBooking')}`} />
      </View>
      <View style={LIST}>
        <FlatList
          data={ShipperJobStore.list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={() => onScrollList()}
          onEndReachedThreshold={0.1}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={<EmptyListMessage />}
          onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          refreshControl={
            <RefreshControl
              refreshing={ShipperJobStore.loading}
              onRefresh={onRefresh}
            />
          }
        />
      </View>

      <View style={BOTTOM_ROOT}>
        <Button
          testID="call-with-owner"
          style={BTN_BOTTOM}
          children={
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <Ionicons name={'add-circle-outline'} size={24} color={color.primary} style={{ paddingRight: spacing[2] }} />
              <Text style={BTN_BOTTOM_TXT} tx={'selectJobScreen.addNewJob'} />
            </View>
          }
          onPress={() => navigation.navigate('postjob')}
        />
      </View>

      <ModalAlert {...modalProps} />

    </View>
  )
})