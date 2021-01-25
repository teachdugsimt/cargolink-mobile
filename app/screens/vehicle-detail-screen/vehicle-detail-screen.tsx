// import React, { useEffect, useState } from "react"
// import { observer } from "mobx-react-lite"
// import {
//   Dimensions,
//   Image,
//   ImageStyle,
//   Modal,
//   ScrollView,
//   Switch,
//   TextStyle,
//   View,
//   ViewStyle,
// } from "react-native"
// import { Button, ModalLoading, Text } from "../../components"
// import { translate } from "../../i18n"
// import { color, images as imageComponent, spacing } from "../../theme"
// import { useNavigation } from "@react-navigation/native"
// import ImageViewer from 'react-native-image-zoom-viewer';
// import { TouchableOpacity } from "react-native-gesture-handler"
// import MyVehicleStore from '../../store/my-vehicle-store/my-vehicle-store'
// import StatusStore from '../../store/my-vehicle-store/status-vehicle-store'
// import { GetTruckType } from "../../utils/get-truck-type";
// import i18n from 'i18n-js';
// import { useStores } from "../../models/root-store/root-store-context";

// const deviceWidht = Dimensions.get("window").width
// const deviceHeight = Dimensions.get("window").height

// const CONTAINER: ViewStyle = {
//   flex: 1,
// }
// const COLUMN: ViewStyle = {
//   flex: 1,
//   backgroundColor: color.backgroundWhite,
//   marginBottom: spacing[1],
//   paddingHorizontal: spacing[4],
//   paddingVertical: spacing[4],
// }
// const ROW: ViewStyle = {
//   flex: 1,
//   flexDirection: "row",
// }
// const TOPIC: TextStyle = {
//   fontFamily: 'Kanit-Bold',
//   fontSize: 16,
//   marginBottom: spacing[3],
// }
// const IMAGES: ViewStyle = {
//   flexDirection: "row",
//   flexWrap: "wrap",
// }
// const IMAGE: ImageStyle = {
//   height: "100%",
//   width: deviceWidht / 2 - spacing[5],
//   resizeMode: "cover",
//   aspectRatio: 4 / 2,
//   margin: spacing[1],
//   borderRadius: 4,
//   backgroundColor: color.line,
// }
// const BUTTON_EDIT: ViewStyle = {
//   backgroundColor: color.primary,
//   borderRadius: 20,
//   marginHorizontal: spacing[3],
//   marginVertical: spacing[2],
// }
// const TEXT_EDIT: TextStyle = {
//   fontSize: 16,
//   fontFamily: 'Kanit-Medium',
// }
// const SUB_TOPIC: TextStyle = {
//   fontFamily: 'Kanit-Bold',
//   paddingBottom: spacing[2],
// }
// const TEXT_OF_VALUE: TextStyle = {
//   textAlign: "right",
//   borderWidth: 1,
//   borderRadius: 4,
//   borderColor: color.line,
//   padding: spacing[3],
// }
// const SUB_TOPIC_ROOT: ViewStyle = {
//   ...COLUMN,
//   paddingLeft: 0,
//   paddingRight: 0,
// }
// const OUTER_CIRCLE: ViewStyle = {
//   borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
//   width: 58,
//   height: 58,
//   backgroundColor: color.primary,
//   justifyContent: "center",
//   alignItems: "center",
// }
// const LOGO: ImageStyle = {
//   width: 55,
//   height: 55,
//   borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
//   backgroundColor: color.line,
// }
// const TYPE_CAR_NAME: TextStyle = {
//   paddingLeft: spacing[4],
// }
// const TOUCHABLE: ViewStyle = {
//   flex: 1,
//   flexDirection: 'row'
// }

// const initialState = {
//   openViewer: false,
//   indexOfImage: 0,
// }

// export const VehicleDetailScreen = observer(function VehicleDetailScreen() {
//   const navigation = useNavigation()

//   const { tokenStore } = useStores()

//   const [{ openViewer, indexOfImage }, setState] = useState(initialState)
//   const {
//     truckType,
//     stallHeight,
//     tipper,
//     // imageTransform,
//     truckPhotos,
//   } = MyVehicleStore.data

//   const onViewer = (index: number) => {
//     setState(prevState => ({
//       ...prevState,
//       openViewer: true,
//       indexOfImage: index,
//     }))
//   }

//   const onCancel = () => {
//     setState(prevState => ({
//       ...prevState,
//       openViewer: false
//     }))
//   }

//   useEffect(() => {
//     return () => {
//       MyVehicleStore.setDefaultOfData()
//     }
//   }, [])

//   useEffect(() => {
//     if (MyVehicleStore.data) {
//       console.log('MyVehicleStore.data :>> ', JSON.parse(JSON.stringify(MyVehicleStore.data)));
//     }
//   }, [MyVehicleStore.data])

//   const swap = (input, index_A, index_B) => {
//     let data = input
//     if (input[index_A] && input[index_A].url && input[index_B] && input[index_B].url) {
//       let temp = data[index_A];
//       data[index_A] = data[index_B];
//       data[index_B] = temp;
//     }
//     const res = data.filter(e => e.url)
//     return res && res.length > 0 ? res : null
//   }

//   // __DEV__ && console.tron.log("Truck Photos :: ", truckPhotos)

//   const raw_image = truckPhotos &&
//     Object.keys(truckPhotos).length ?
//     Object.entries(truckPhotos).map(img => {
//       return {
//         url: img[1],
//       }
//     }) : []
//   __DEV__ && console.tron.log("RAW Image Photos :: ", raw_image)
//   const transformImage = swap(raw_image, 0, 1)
//   __DEV__ && console.tron.log("Transform Image Photos :: ", transformImage)
//   const txtTruckType = GetTruckType(truckType, i18n.locale)

//   __DEV__ && console.tron.log("MyVehicleStore data id ::  ", JSON.parse(JSON.stringify(MyVehicleStore.data)))

//   return (
//     <View style={CONTAINER}>

//       {MyVehicleStore.loading && <ModalLoading size={'large'} color={color.primary} visible={MyVehicleStore.loading} />}
//       <ScrollView onScroll={({ nativeEvent }) => { }} style={{}} scrollEventThrottle={400}>
//         {!!transformImage && <View style={COLUMN}>
//           <View style={ROW}>
//             <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleImage")} />
//           </View>
//           <View style={ROW}>
//             <View style={IMAGES}>
//               {!!transformImage &&
//                 transformImage.map((image, index) => {
//                   __DEV__ && console.tron.log("Each Image render ::  ", image) // undefined || {url: "xxxxx"}
//                   return (
//                     <TouchableOpacity style={TOUCHABLE} key={index} onPress={(attr) => onViewer(index)}>
//                       {image && !!image.url && <Image style={IMAGE} source={MyVehicleStore.data.id ? {
//                         uri: image.url,
//                         method: 'GET',
//                         headers: {
//                           Authorization: `Bearer ${tokenStore.token.accessToken}`
//                         },
//                       } : imageComponent[image.url]} key={index} />}
//                       {!image && <Image style={IMAGE} source={imageComponent.pinbox} key={index} />}
//                     </TouchableOpacity>
//                   )
//                 })}
//               <Modal visible={openViewer} transparent={true}>
//                 <ImageViewer
//                   imageUrls={transformImage}
//                   index={indexOfImage}
//                   onCancel={onCancel}
//                   enableSwipeDown={true}
//                   pageAnimateTime={transformImage ? transformImage.length : 0}
//                 />
//               </Modal>
//             </View>
//           </View>
//         </View>}

//         <View style={COLUMN}>
//           <View style={ROW}>
//             <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleType")} />
//           </View>
//           <View style={{ ...ROW, alignItems: "center" }}>
//             <View style={OUTER_CIRCLE}>
//               <Image source={imageComponent[truckType ? `truck${truckType}` : "truck17"]} style={LOGO} />
//             </View>
//             <Text style={TYPE_CAR_NAME} text={txtTruckType && txtTruckType.name ? txtTruckType.name : ''} />
//           </View>
//           <View style={ROW}>
//             <View style={SUB_TOPIC_ROOT}>
//               <Text style={SUB_TOPIC} text={translate("vehicleDetailScreen.heighttOfTheCarStall")} />
//               <Text style={TEXT_OF_VALUE} text={stallHeight ? stallHeight.toString() : '0'} />
//             </View>
//           </View>
//           <View style={{ ...ROW, justifyContent: "space-between" }}>
//             <Text text={translate("vehicleDetailScreen.carHaveDum")} />
//             <Switch value={tipper || false} disabled={true} />
//           </View>
//         </View>

//         <View style={COLUMN}>
//           <View style={ROW}>
//             <Text style={TOPIC} text={translate("vehicleDetailScreen.myVehicleDetail")} />
//           </View>
//           <View style={ROW}>
//             <View
//               style={{
//                 ...SUB_TOPIC_ROOT,
//                 backgroundColor: "#f8f8f8",
//                 paddingLeft: spacing[3],
//                 paddingRight: spacing[3],
//                 borderRadius: 4,
//               }}
//             >
//               <Text
//                 style={SUB_TOPIC}
//                 text={translate("vehicleDetailScreen.vehicleRegistrationNumber")}
//               />
//               {MyVehicleStore.data &&
//                 MyVehicleStore.data.registrationNumber &&
//                 MyVehicleStore.data.registrationNumber.length &&
//                 MyVehicleStore.data.registrationNumber.map((regNo, index) => <Text key={index} style={TEXT_OF_VALUE} text={regNo} />)
//               }
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//       <View>
//         <Button
//           testID="edit-vehicle-detail"
//           style={BUTTON_EDIT}
//           textStyle={TEXT_EDIT}
//           text={translate("vehicleDetailScreen.edit")}
//           onPress={() => {
//             navigation.navigate("uploadVehicle")
//             StatusStore.setStatusScreen('edit')
//             // MyVehicleStore.setStatusScreen("edit")
//           }}
//         />
//       </View>
//     </View>
//   )
// })























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
import { GetTruckType } from "../../utils/get-truck-type";
import i18n from 'i18n-js';
import { useStores } from "../../models/root-store/root-store-context";

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

export const VehicleDetailScreen = observer(function VehicleDetailScreen() {
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
    __DEV__ && console.tron.log("Arr Tranform already :: ", arr)
    let tmp = arr.map((e, i) => {
      if (!e || !e.url) {
        return {
          url: '',
          props: { source: imageComponent["noImageAvailable"] }
        }
      } else return e
    })
    return tmp
  }

  // __DEV__ && console.tron.log("Truck Photos :: ", truckPhotos)

  const raw_image = truckPhotos &&
    Object.keys(truckPhotos).length ?
    Object.entries(truckPhotos).map(img => {
      return {
        url: img[1],
      }
    }) : []
  __DEV__ && console.tron.log("RAW Image Photos :: ", raw_image)
  const transformImage = swap(raw_image, 0, 1)
  const viewListImage = _pushEmptyImage(transformImage)
  __DEV__ && console.tron.log("Transform Image Photos :: ", transformImage)
  const txtTruckType = GetTruckType(truckType, i18n.locale)

  __DEV__ && console.tron.log("MyVehicleStore data id ::  ", JSON.parse(JSON.stringify(MyVehicleStore.data)))

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
                  __DEV__ && console.tron.log("Each Image render ::  ", image) // undefined || {url: "xxxxx"}
                  return (
                    <TouchableOpacity style={TOUCHABLE} key={index} onPress={(attr) => onViewer(index)}>
                      <Image style={IMAGE} source={MyVehicleStore.data.id && image && !!image.url ? {
                        uri: image.url,
                        method: 'GET',
                        headers: {
                          Authorization: `Bearer ${tokenStore.token.accessToken}`
                        },
                      } : imageComponent["noImageAvailable"]} key={index} />
                    </TouchableOpacity>
                  )
                })}
              <Modal visible={openViewer} transparent={true}>
                <ImageViewer
                  // imageUrls={transformImage}
                  imageUrls={viewListImage}
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
              <Image source={imageComponent[truckType ? `truck${truckType}` : "truck17"]} style={LOGO} />
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

