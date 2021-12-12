import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Dimensions,
  Image,
  ImageStyle,
  RefreshControl,
  Switch,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
} from "react-native"
import { ModalLoading, Text, BookerItem } from "../../components"
import Feather from 'react-native-vector-icons/Feather'
import { translate } from "../../i18n"
import { color, images as imageComponent, spacing } from "../../theme"
import { useNavigation, useRoute } from "@react-navigation/native"
import ImageView from 'react-native-image-view';
import { TouchableOpacity } from "react-native-gesture-handler"
import MyVehicleStore from '../../store/my-vehicle-store/my-vehicle-store'
import { GetTruckType } from "../../utils/get-truck-type";
import { useStores } from "../../models/root-store/root-store-context";
import { MapTruckImageName } from '../../utils/map-truck-image-name'
import CarriersJobStore from "../../store/carriers-job-store/carriers-job-store"
import myVehicle from "../../services/api/mock-data/my-vehicle"
import { API_URL } from '../../config/'

const deviceWidht = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const CONTAINER: ViewStyle = {
  flex: 1,
}
const PADDING_HOR_20: ViewStyle = { paddingHorizontal: 20 }
const COLUMN: ViewStyle = {
  flex: 1,
  backgroundColor: color.backgroundWhite,
  marginBottom: spacing[1],
  paddingHorizontal: spacing[4],
  paddingVertical: spacing[4],
}
const ROW: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}
const TOPIC: TextStyle = {
  marginBottom: spacing[3],
  color: color.primary
}
const IMAGES: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
}
const IMAGE: ImageStyle = {
  height: "100%",
  width: deviceWidht / 2 - spacing[5],
  resizeMode: "cover",
  aspectRatio: 4 / 2,
  margin: spacing[1],
  borderRadius: 4,
  backgroundColor: color.line,
}
const BUTTON_EDIT: ViewStyle = {
  backgroundColor: color.primary,
  borderRadius: 20,
  marginHorizontal: spacing[3],
  marginVertical: spacing[2],
}
const TEXT_EDIT: TextStyle = {
  fontSize: 16,
  fontFamily: 'Kanit-Medium',
}
const SUB_TOPIC: TextStyle = {
  fontFamily: 'Kanit-Bold',
  paddingBottom: spacing[2],
}
const TEXT_OF_VALUE: TextStyle = {
  textAlign: "right",
  borderWidth: 1,
  borderRadius: 4,
  borderColor: color.mainGrey,
  padding: spacing[3],
}
const SUB_TOPIC_ROOT: ViewStyle = {
  ...COLUMN,
  paddingLeft: 0,
  paddingRight: 0,
}
const OUTER_CIRCLE: ViewStyle = {
  borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
  width: 58,
  height: 58,
  backgroundColor: color.primary,
  justifyContent: "center",
  alignItems: "center",
}
const LOGO: ImageStyle = {
  width: 55,
  height: 55,
  borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
  backgroundColor: color.line,
}
const TYPE_CAR_NAME: TextStyle = {
  paddingLeft: spacing[4],
}
const TOUCHABLE: ViewStyle = {
  flex: 1,
  flexDirection: 'row'
}

const initialState = {
  openViewer: false,
  indexOfImage: 0,
}

const HeaderComponent = observer(function HeaderComponent() {
  const navigation = useNavigation()
  const { tokenStore } = useStores()

  const [{ openViewer, indexOfImage }, setState] = useState(initialState)
  const {
    truckType,
    stallHeight,
    tipper,
    // imageTransform,
    truckPhotos,
  } = MyVehicleStore.data

  const onViewer = (index: number) => {
    setState(prevState => ({
      ...prevState,
      openViewer: true,
      indexOfImage: index,
    }))
  }

  const onCancel = () => {
    setState(prevState => ({
      ...prevState,
      openViewer: false
    }))
  }

  useEffect(() => {
    return () => {
      MyVehicleStore.setDefaultOfData()
    }
  }, [])

  useEffect(() => {
    if (MyVehicleStore.data) {
      console.log('MyVehicleStore.data :>> ', JSON.parse(JSON.stringify(MyVehicleStore.data)));
    }
  }, [MyVehicleStore.data])

  const swap = (input, index_A, index_B) => {
    let data = input
    let temp = data[index_A];
    data[index_A] = data[index_B];
    data[index_B] = temp;
    return data
  }

  const _pushEmptyImage = (arr) => {
   console.log("Arr Tranform already :: ", arr)
    let tmp = arr.map((e, i) => {
      if (!e || !e.url) {
        return {
          source: imageComponent['noImageAvailable'],
          width: 1024,
          height: 720,
          title: 'no-' + i
        }
      } else return {
        source: {
          uri: e.url,
          method: 'GET',
          headers: {
            Accept: 'image/*'
          }
        },
        width: 1024,
        height: 720,
        title: 'img-' + i
      }

    })
   console.log("Arr after parse for IMAGE VIEWER :: ", tmp)
    return tmp
  }

  const raw_image = truckPhotos &&
    Object.keys(truckPhotos).length ?
    Object.entries(truckPhotos).map(img => {
      console.log("Image [1] : ", `${API_URL}/api/v1/media/file-stream?attachCode=` + img[1])
      return {
        url: img[1] ? `${API_URL}/api/v1/media/file-stream?attachCode=` + img[1] : null,
      }
    }) : []
  const transformImage = swap(raw_image, 0, 1)
  console.log("Transform Image :: ", transformImage)
  const viewListImage = _pushEmptyImage(transformImage)
  const txtTruckType = GetTruckType(+truckType)

 console.log("MyVehicleStore data id ::  ", JSON.parse(JSON.stringify(MyVehicleStore.data)))
 console.log({ name: 'truck type', value: truckType })

  return (
    <View style={CONTAINER}>

      {/* {MyVehicleStore.loading && <ModalLoading size={'large'} color={color.primary} visible={MyVehicleStore.loading} />} */}
      <View style={COLUMN}>
        <View style={ROW}>
          <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleImage")} />
        </View>
        <View style={ROW}>
          <View style={IMAGES}>
            {!!transformImage &&
              transformImage.map((image, index) => {
               console.log("Each Image render ::  ", image) // undefined || {url: "xxxxx"}
                return (
                  <TouchableOpacity style={TOUCHABLE} key={index} onPress={() => {
                    if (MyVehicleStore.data.id && image && !!image.url) onViewer(index)
                  }}>
                    <Image style={IMAGE} source={MyVehicleStore.data.id && image && !!image.url ? {
                      uri: image.url,
                      method: 'GET',
                      headers: {
                        Accept: 'image/*'
                      },
                    } : imageComponent["noImageAvailable"]} key={index} />
                  </TouchableOpacity>
                )
              })}

            <ImageView
              images={viewListImage}
              imageIndex={indexOfImage}
              isVisible={openViewer}
              onClose={onCancel}
            />
          </View>
        </View>
      </View>

      <View style={COLUMN}>
        <View style={ROW}>
          <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleType")} />
        </View>
        <View style={{ ...ROW, alignItems: "center" }}>
          <View style={OUTER_CIRCLE}>
            <Image source={imageComponent[truckType ? MapTruckImageName(Number(truckType)) : "truck17"]} style={LOGO} />
          </View>
          <Text style={TYPE_CAR_NAME} text={txtTruckType && txtTruckType.name ? txtTruckType.name : ''} />
        </View>
        <View style={ROW}>
          <View style={SUB_TOPIC_ROOT}>
            <Text style={SUB_TOPIC} text={translate("vehicleDetailScreen.heighttOfTheCarStall")} />
            <Text style={TEXT_OF_VALUE} text={stallHeight ? stallHeight.toString() : '0'} />
          </View>
        </View>
        <View style={{ ...ROW, justifyContent: "space-between" }}>
          <Text text={translate("vehicleDetailScreen.carHaveDum")} />
          <Switch value={tipper || false} disabled={true} />
        </View>
      </View>

      <View style={COLUMN}>
        <View style={ROW}>
          <Text style={TOPIC} text={translate("vehicleDetailScreen.myVehicleDetail")} />
        </View>
        <View style={ROW}>
          <View
            style={{
              ...SUB_TOPIC_ROOT,
              backgroundColor: color.registration,
              paddingLeft: spacing[3],
              paddingRight: spacing[3],
              borderRadius: 4,
            }}
          >
            <Text
              style={SUB_TOPIC}
              text={translate("vehicleDetailScreen.vehicleRegistrationNumber")}
            />
            {MyVehicleStore.data &&
              MyVehicleStore.data.registrationNumber &&
              MyVehicleStore.data.registrationNumber.length &&
              MyVehicleStore.data.registrationNumber.map((regNo, index) => <Text key={index} style={TEXT_OF_VALUE} text={regNo} />)
            }
          </View>
        </View>
      </View>










    </View>
  )
})


interface VehicleProps {
  id?: string
}
export const VehicleDetailScreen = observer(function VehicleDetailScreen() {
  const navigation = useNavigation()
  const { quotations: user_book } = MyVehicleStore.data
  const route = useRoute()
  const {
    id = ''
  }: VehicleProps = route?.params || {}

  const _renderListBooking = (booker, index) => {
    console.log("booker object :: ", JSON.parse(JSON.stringify(booker)))
    return (<>
      {index == 0 && <View style={{ paddingTop: 20, width: '100%', marginTop: 1, backgroundColor: color.textWhite }}>
        <Text style={[TOPIC, PADDING_HOR_20]} preset="topic" text={translate("myVehicleScreen.userRequestQueue")} />
      </View>}
      <View style={{ ...PADDING_HOR_20, backgroundColor: color.textWhite }}>
        <BookerItem
          key={index}
          imageUrl={booker?.avatar?.object || ''}
          tokenUrl={booker?.avatar?.token || ''}
          topic={booker.fullName}
          detail={booker.bookingDatetime}
          btnTxt={translate('myJobScreen.accept')}
          containerStyle={{ paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: color.mainGrey, backgroundColor: color.textWhite }}
          topicStyle={{ fontSize: 14, paddingBottom: spacing[1] }}
          detailStyle={{ color: color.line }}
          btnStyle={{ paddingVertical: 2, paddingHorizontal: spacing[2] }}
          btnTextStyle={{ fontSize: 12, paddingLeft: spacing[1] }}
          onToggle={() => {
            console.log("When navigate to job detail quotation ID :: ", booker.id) // quotation id
            CarriersJobStore.getJobDetail(booker.id)
            navigation.navigate('truckShowJobDetailScreen', {
              showOwnerAccount: false,
              fromManageCar: true,
              quotationsID: booker.id
            })
          }}
        />
      </View>
      {index == user_book.length - 1 && <View style={{ height: 10, backgroundColor: color.textWhite }}></View>}
    </>
    )
  }
  return <FlatList
    ListHeaderComponent={<HeaderComponent />}
    ListEmptyComponent={<EmptyListBooking />}
    refreshControl={
      <RefreshControl
        refreshing={MyVehicleStore.loading}
        onRefresh={() => MyVehicleStore.findOneRequest(id)}
      />}
    renderItem={({ item, index }) => _renderListBooking(item, index)}
    data={user_book}
    keyExtractor={item => item.id.toString()}
  />

})


const MAIN_VIEW_EMPTY: ViewStyle = { backgroundColor: color.textWhite, paddingTop: 20 }
const TEXT_EMPTY: TextStyle = { justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }
const COLOR_LINE: TextStyle = { color: color.line }
const EmptyListBooking = () => {
  return (
    <View style={MAIN_VIEW_EMPTY}>
      <Text style={[TOPIC, PADDING_HOR_20]} preset="topic" text={translate("myVehicleScreen.userRequestQueue")} />
      <View style={TEXT_EMPTY}>
        <Text tx={'common.notFound'} preset={'topicExtra'} style={COLOR_LINE} />
        <Feather name={'inbox'} size={50} color={color.line} />
      </View>
    </View>
  )
}
