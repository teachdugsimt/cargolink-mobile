import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Dimensions,
  Image,
  ImageStyle,
  Modal,
  ScrollView,
  Switch,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Button, ModalLoading, Text } from "../../components"
import { translate } from "../../i18n"
import { color, images as imageComponent, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import ImageViewer from 'react-native-image-zoom-viewer';
import { TouchableOpacity } from "react-native-gesture-handler"
import MyVehicleStore from '../../store/my-vehicle-store/my-vehicle-store'
import StatusStore from '../../store/my-vehicle-store/status-vehicle-store'

const deviceWidht = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const CONTAINER: ViewStyle = {
  flex: 1,
}
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
  fontFamily: 'Kanit-Bold',
  fontSize: 16,
  marginBottom: spacing[3],
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
  backgroundColor: color.disable,
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
  borderColor: color.line,
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
  backgroundColor: color.disable,
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

export const VehicleDetailScreen = observer(function VehicleDetailScreen() {
  const navigation = useNavigation()

  const [{ openViewer, indexOfImage }, setState] = useState(initialState)
  const {
    car_type,
    image_car_type,
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

  const transformImage = truckPhotos &&
    Object.keys(truckPhotos).length ?
    Object.entries(truckPhotos).map(img => {
      return { url: img[1] }
    }) : []

  return (
    <View style={CONTAINER}>
      {MyVehicleStore.loading && <ModalLoading size={'large'} color={color.primary} visible={MyVehicleStore.loading} />}
      <ScrollView onScroll={({ nativeEvent }) => { }} style={{}} scrollEventThrottle={400}>
        <View style={COLUMN}>
          <View style={ROW}>
            <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleImage")} />
          </View>
          <View style={ROW}>
            <View style={IMAGES}>
              {!!transformImage &&
                transformImage.map((image, index) => {
                  return (
                    <TouchableOpacity style={TOUCHABLE} key={index} onPress={(attr) => onViewer(index)}>
                      <Image style={IMAGE} source={MyVehicleStore.data.id ? { uri: image.url } : imageComponent[image.url]} key={index} />
                    </TouchableOpacity>
                  )
                })}
              <Modal visible={openViewer} transparent={true}>
                <ImageViewer
                  imageUrls={transformImage}
                  index={indexOfImage}
                  onCancel={onCancel}
                  enableSwipeDown={true}
                  pageAnimateTime={transformImage ? transformImage.length : 0}
                />
              </Modal>
            </View>
          </View>
        </View>

        <View style={COLUMN}>
          <View style={ROW}>
            <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleType")} />
          </View>
          <View style={{ ...ROW, alignItems: "center" }}>
            <View style={OUTER_CIRCLE}>
              <Image source={imageComponent[image_car_type ? image_car_type : "truck17"]} style={LOGO} />
            </View>
            <Text style={TYPE_CAR_NAME} text={car_type} />
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
                backgroundColor: "#f8f8f8",
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
      </ScrollView>
      <View>
        <Button
          testID="edit-vehicle-detail"
          style={BUTTON_EDIT}
          textStyle={TEXT_EDIT}
          text={translate("vehicleDetailScreen.edit")}
          onPress={() => {
            navigation.navigate("uploadVehicle")
            StatusStore.setStatusScreen('edit')
            // MyVehicleStore.setStatusScreen("edit")
          }}
        />
      </View>
    </View>
  )
})
