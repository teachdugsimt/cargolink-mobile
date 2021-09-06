import React, { useEffect, useState } from "react"
import {
  View, ViewStyle, TextStyle,
  Platform, ImageStyle,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Text } from "../../../components"
import { translate } from "../../../i18n"
import { AddJobElement, Screen, RoundedButton, Icon, } from '../../../components'
import { AlertMessage } from "../../../utils/alert-form";
import * as moment from 'moment'
// import 'moment/locale/th';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color } from "../../../theme"
import date from 'date-and-time';
import PostJobStore from "../../../store/post-job-store/post-job-store";
import _ from 'lodash'
import AdvanceSearchStore from "../../../store/shipper-job-store/advance-search-store";
import StatusStore from '../../../store/post-job-store/job-status-store'
import { useStores } from "../../../models/root-store/root-store-context";
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const FULL: ViewStyle = { flex: 1 }
const GREY_TEXT: ViewStyle = { backgroundColor: color.line }
const BORDER_RADIUS_20: ViewStyle = {
  borderRadius: 20,
}


const TOP_VIEW: ViewStyle = {
  paddingTop: Platform.OS == "ios" ? 10 : 10,
  flex: Platform.OS == "ios" ? 0.65 : 0.85,
  backgroundColor: color.textWhite,
  justifyContent: 'center',
}
const BOTTOM_VIEW: ViewStyle = {
  flex: 5,
}

const TOP_VIEW_2: ViewStyle = {
  flex: 1,
  backgroundColor: color.textWhite,
}
const WRAPPER_TOP: ViewStyle = {
  flex: 1,
  padding: 10
}
const PADDING_TOP_20: ViewStyle = { paddingTop: 20 }

const MARGIN_HORIZONTTAL_MEDIUM: ViewStyle = { paddingHorizontal: 10 }

const MARGIN_TOP_BIG: ViewStyle = { marginTop: 10 }

const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_CONTAINER_CONFIRM: ViewStyle = {
  backgroundColor: color.success, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.textWhite
}
const ROW_TEXT: ViewStyle = {
  flexDirection: 'row',
}
const ICON_PIN_YELLOW: ImageStyle = {
  height: 25, width: 25,
}
const JUSTIFY_BETWEEN: ViewStyle = {
  justifyContent: 'space-between'
}
const PADDING_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
const BLUE_ANSWER: TextStyle = { color: color.blue }
const BORDER_BOTTOM_NEW: ViewStyle = {
  borderBottomColor: color.mainGrey, borderBottomWidth: 1
}
const PADDING_VERTICAL_10: ViewStyle = { paddingVertical: 10 }
const PADDING_TOP_10: ViewStyle = { paddingTop: 10 }
const PADDING_VERTICAL_20: ViewStyle = { paddingVertical: 20 }
const PADDING_BOTTOM_20: ViewStyle = { paddingBottom: 20 }
const PADDING_LEFT_10: ViewStyle = { paddingLeft: 10 }
const PADDING_RIGHT_10: ViewStyle = { paddingRight: 10 }
const PADDING_TOP_SMALL: ViewStyle = { marginTop: 5 }
const shipping_type = {
  1: "PER_TRIP",
  2: "PER_TON"
}

const dump_field = {
  1: true,
  2: false
}

export const CheckInformationScreen = observer(function CheckInformationScreen(props) {
  const navigation = useNavigation()
  const { versatileStore } = useStores()

  const [fieldShippingCheck, setfieldShippingCheck] = useState([])

  const [errorPostJob, seterrorPostJob] = useState(null)

  const [swipe, setswipe] = useState(false)
  const [swipe2, setswipe2] = useState(false)

  const _mappingObject = (object) => {
    let tmp = object
    Object.keys(object).forEach(key => {
      if (key.includes('-date') || key.includes("-time")) {
        tmp[key] = new Date(object[key])
      }
    })
    return tmp
  }
  const initialData = _mappingObject(PostJobStore.MappingInitValue) || {}

  console.log("Initial Value Check Information :: ", initialData)


  useEffect(() => {
    let tmp_field = fieldShippingCheck
    let postjob2_data = JSON.parse(JSON.stringify(PostJobStore.postjob2)) || null

    if (postjob2_data) {
      postjob2_data['shipping-information'].forEach((e, i) => {
        tmp_field.push({
          id: i + 1,
          showDate: false,
          showTime: false,
        })
      })
      setfieldShippingCheck(tmp_field)
      setswipe2(true)
      setTimeout(() => {
        setswipe(!swipe)
      }, 2000);
    } else { navigation.navigate("home") }
    return () => {
      setswipe2(false)
      seterrorPostJob(null)
    }
  }, [])

  const compareDateTime = (d1, t1) => {
    return d1.slice(0, 10) + " " + t1.slice(11, t1.length)
  }

  const onSubmit = (data) => {
    let status_action = JSON.parse(JSON.stringify(StatusStore.status))
    console.log("Raw data post job 3 :: ", data)

    const expirationDate = compareDateTime(moment(date.addDays(data['receive-date'], -1).toISOString()).format("DD-MM-YYYY HH:mm:ss"),
      moment(data['receive-time'].toISOString()).format("DD-MM-YYYY HH:mm:ss"))

    let tmp_data = JSON.parse(JSON.stringify(data))
    let final = { ...tmp_data }
    Object.keys(tmp_data).forEach((key) => {
      let arr = key.split("-")
      let indexing = arr[arr.length - 1]

      if (key.includes("shipping-date-")) {
        final[key] = moment(data['shipping-date-' + indexing].toISOString()).format("DD-MM-YYYY HH:mm:ss")
      }
      if (key.includes("shipping-time-")) {
        final[key] = moment(data['shipping-time-' + indexing].toISOString()).format("DD-MM-YYYY HH:mm:ss")
      }
      if (key.includes("receive-date")) {
        final[key] = moment(data['receive-date'].toISOString()).format("DD-MM-YYYY HH:mm:ss")
      }
      if (key.includes("receive-time")) {
        final[key] = moment(data['receive-time'].toISOString()).format("DD-MM-YYYY HH:mm:ss")
      }
    })
    console.log("Position 1 :: ", final)


    let shippingLocation = []
    let tmp_field = fieldShippingCheck
    console.log("position 1.5 :: ", tmp_field)
    tmp_field.forEach((e, i) => {
      let shippingName = final[`shipping-name-${i + 1}`]
      let shippingTime = compareDateTime(final[`shipping-date-${i + 1}`], final[`shipping-time-${i + 1}`])
      let shippingTelNo = final[`shipping-tel-no-${i + 1}`]
      let shippingAddress = final[`shipping-address-${i + 1}`]
      let shippingRegion = final[`shipping-region-${i + 1}`]

      shippingLocation.push({
        "name": shippingAddress,
        "dateTime": shippingTime, // Format: DD-MM-YYYY hh:ss
        "contactName": shippingName,
        "contactMobileNo": shippingTelNo,
        "lat": shippingRegion['latitude'],
        "lng": shippingRegion['longitude']
      })
    })
    console.log("Position 2 :: ", shippingLocation)

    let request_data = {
      "truckType": final['vehicle-type'],
      "truckAmount": final['car-num'] || null,
      "productTypeId": final['item-type'],
      "productName": final["item-name"],
      "weight": final['item-weight'] || null,
      "price": final['shipping-rate'], // No need now 
      "tipper": dump_field[final['dump-field']],
      "priceType": shipping_type[final['shipping-type']],
      "expiredTime": expirationDate, // No need now
      "from": {
        "name": final['receive-location'],
        "dateTime": compareDateTime(final['receive-date'], final['receive-time']),
        "contactName": final['receive-name'],
        "contactMobileNo": final['receive-tel-no'],
        "lat": final['receive-region'].latitude,
        "lng": final['receive-region'].longitude
      },
      "to": shippingLocation
    }
    console.log("Position 3 :: ", request_data)
    if (status_action == "add") {
      PostJobStore.createPostJobRequest(request_data)
    }
    else PostJobStore.updateJob(request_data)
  }

  const _processErrorText = (error: any) => {
    let messageContent: string = ''
    if (error && typeof error == 'string' && error.includes(":") && error.includes('"')) {
      let parseString = error
      const rawMessage = parseString.replace(/[|&;$%@"{}()<>]/g, "").replace(":", " => ")
      const splitMessage = rawMessage.split("[")
      messageContent = splitMessage && splitMessage[1] ? splitMessage[1].slice(0, splitMessage[1].length - 1) :
        rawMessage
      console.log("Message content :: ", messageContent)
    }
    else {
      messageContent = translate('common.pleaseCheckYourData')
    }
    return messageContent
  }

  useEffect(() => {
    let data_postjob = JSON.parse(JSON.stringify(PostJobStore.data_postjob))
    let error = JSON.parse(JSON.stringify(PostJobStore.error))
    if (error && error != errorPostJob) {
      let message_error = _processErrorText(error)
      seterrorPostJob(error)
      AlertMessage(translate('common.somethingWrong'), message_error)
      seterrorPostJob(null)
      PostJobStore.setError()
    } else {
      if (data_postjob) {
        let status_action = JSON.parse(JSON.stringify(StatusStore.status))
        if (status_action == "add")
          navigation.navigate("Home", { screen: "postSuccess" })
        else navigation.navigate("MyJob", { screen: "postSuccess" })
      }
    }

  }, [PostJobStore.data_postjob, PostJobStore.error])


  const _renderTopic = (topic: string) => (<View>
    <Text tx={topic} />
  </View>)

  const _renderNormalText = (prefix: string, data: string, suffix = null, paddingTop = true, finalText = null) => {
    return (
      <View style={[ROW_TEXT, JUSTIFY_BETWEEN, paddingTop ? PADDING_TOP_10 : {}]}>
        <Text tx={prefix} />
        <View style={ROW_TEXT}>
          <Text style={BLUE_ANSWER}>{data + (suffix ? " " : "")}</Text>
          {suffix && <Text tx={suffix} />}
          <Text tx={finalText} style={[PADDING_LEFT_SMALL, BLUE_ANSWER]} />
        </View>
      </View>
    )
  }

  const _renderPickupPoint = (status: string, address: string, date: any, time: any, name: string, phoneNumber: string) => {
    let tmpDate
    if (versatileStore.language && versatileStore.language == "en")
      tmpDate = date ? moment(date).locale("en").format("LL") : " "
    else
      tmpDate = date ? moment(date).locale("th").add(543, 'year').format("LL") : " "
    let tmpTime = time ? moment(time).locale(versatileStore.language ? versatileStore.language : "th").format("HH:mm") : " "
    const compare = tmpDate + " " + tmpTime

    return <View style={PADDING_TOP_20}>
      <Text tx={status == "pickup" ? "postJobScreen.acceptPointProduct" : "postJobScreen.shipingPointNew"} preset="topic" />
      <View style={[ROW_TEXT, PADDING_TOP_10]}>
        <Icon icon={status == "pickup" ? 'pinDropYellow' : 'pinDropGreen'} style={ICON_PIN_YELLOW} />
        <Text style={[PADDING_LEFT_SMALL, BLUE_ANSWER, PADDING_RIGHT_10, FULL]}>{address}</Text>
      </View>
      <View style={[ROW_TEXT, PADDING_TOP_10]}>
        <FontAwesome name="calendar-o" size={18} />
        <Text style={[PADDING_LEFT_10, BLUE_ANSWER]}>{compare}</Text>
      </View>
      <View style={[ROW_TEXT, PADDING_TOP_10, PADDING_BOTTOM_20]}>
        <Ionicons name="call" size={18} />
        <Text style={[PADDING_LEFT_10, BLUE_ANSWER]}>{name + " " + phoneNumber}</Text>
      </View>
    </View>
  }






  const list_status = [
    { key: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: false },
    { key: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
    { key: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: true },
    { key: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
  ]

  const list_product_type_all = JSON.parse(JSON.stringify(AdvanceSearchStore.productTypes))
  let list_product_type = [
    {
      title: 'postJobScreen.allProductType',
      data: []
    }
  ]
  if (list_product_type_all && list_product_type_all.length > 0) {
    list_product_type[0].data = list_product_type_all
  }

  let vehicleObject
  if (versatileStore.list && versatileStore.list.length > 0 && initialData['vehicle-type'])
    vehicleObject = JSON.parse(JSON.stringify(versatileStore.list)).find(e => e.id == initialData['vehicle-type'])
  let productObject
  if (versatileStore.listProductType && versatileStore.listProductType.length > 0 && initialData['item-type'])
    productObject = JSON.parse(JSON.stringify(versatileStore.listProductType)).find(e => e.id == initialData['item-type'])

  const shippingObject = !!initialData['shipping-information'] && initialData['shipping-information']
    && initialData['shipping-information'].length && initialData['shipping-information'].length > 0
    ? JSON.parse(JSON.stringify(initialData['shipping-information'])) : []

  return (
    <Screen unsafe keyboardOffset="little" preset="scroll" bounch={false}>
      <View testID="CheckInformationScreen" style={FULL}>
        <View style={TOP_VIEW}>
          <AddJobElement data={list_status} />
        </View>


        <View style={BOTTOM_VIEW}>
          <View style={FULL}>






            <View style={TOP_VIEW_2}>

              <View key="TRUCK_INFORMATION" style={MARGIN_HORIZONTTAL_MEDIUM}>
                <View style={PADDING_TOP_20}>
                  {_renderTopic('postJobScreen.typeYouWant')}
                  <View style={[ROW_TEXT, JUSTIFY_BETWEEN, PADDING_VERTICAL_10, BORDER_BOTTOM_NEW]}>
                    <View style={[ROW_TEXT]}>
                      <Text>{!!vehicleObject && !!vehicleObject.name ? vehicleObject.name : ""}</Text>
                      <Text style={BLUE_ANSWER}> ( </Text>
                      <Text style={BLUE_ANSWER} tx={!!initialData['dump-field'] && initialData['dump-field'] == 1 ? "common.dump" : "common.notDump"} />
                      <Text style={BLUE_ANSWER}> ) </Text>
                    </View>
                    <View style={[ROW_TEXT]}>
                      <Text style={BLUE_ANSWER}>{(initialData['car-num'] ? initialData['car-num'] : "") + " "}</Text>
                      <Text tx={"profileScreen.unit"} />
                    </View>
                  </View>
                </View>


                <View style={[PADDING_VERTICAL_10, BORDER_BOTTOM_NEW]}>
                  {_renderNormalText("postJobScreen.productInformation", (productObject && productObject.name ? productObject.name : " "), null, true)}
                  {_renderNormalText("postJobScreen.productName", (initialData['item-name'] ? initialData['item-name'] : " "), null, true)}
                  {_renderNormalText("postJobScreen.productWeight", (initialData['item-weight'] ? initialData['item-weight'] : " "), "searchJobScreen.ton", true)}
                </View>

                <View style={[PADDING_VERTICAL_20]}>
                  {_renderNormalText("postJobScreen.rateShipping", (initialData['shipping-rate'] ? initialData['shipping-rate'] : " "), 'common.bath', false,
                    (initialData['shipping-type'] && initialData['shipping-type'] == 1 ? 'common.perBill' :
                      (initialData['shipping-type'] && initialData['shipping-type'] == 2 ? 'common.perTon' : "common.notHave")
                    ))}
                </View>

              </View>
            </View>





            <View style={[TOP_VIEW_2, PADDING_TOP_SMALL]}>
              <View key="PICKUP_POINT" style={MARGIN_HORIZONTTAL_MEDIUM}>
                {_renderPickupPoint("pickup", initialData['receive-location'] ? initialData['receive-location'] : " "
                  , initialData['receive-date'] ? initialData['receive-date'] : null
                  , initialData['receive-time'] ? initialData['receive-time'] : null
                  , initialData['receive-name'] ? initialData['receive-name'] : " "
                  , initialData['receive-tel-no'] ? initialData['receive-tel-no'] : " ")}
              </View>
            </View>


            {!!shippingObject && shippingObject.length > 0 && shippingObject.map((e, i) => {
              return <View key={"shipping-information-" + i} style={[TOP_VIEW_2, PADDING_TOP_SMALL]}>
                <View key="PICKUP_POINT" style={MARGIN_HORIZONTTAL_MEDIUM}>
                  {_renderPickupPoint("shipping", e['shipping-address'] ? e['shipping-address'] : " "
                    , e['shipping-date'] ? e['shipping-date'] : null
                    , e['shipping-time'] ? e['shipping-time'] : null
                    , e['shipping-name'] ? e['shipping-name'] : " "
                    , e['shipping-tel-no'] ? e['shipping-tel-no'] : " ")}
                </View>
              </View>
            })}




            <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_BIG }}>
              <View style={ROW_TEXT}>
                <View style={[WRAPPER_TOP, FULL]}>
                  <RoundedButton style={[FULL, BORDER_RADIUS_20, GREY_TEXT]} onPress={() => navigation.goBack()} text={"common.back"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                </View>
                <View style={[WRAPPER_TOP, FULL]}>
                  <RoundedButton style={[FULL, BORDER_RADIUS_20, ROUND_BUTTON_CONTAINER_CONFIRM]} onPress={() => onSubmit(initialData)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER_CONFIRM} textStyle={ROUND_BUTTON_TEXT} />
                </View>
              </View>
            </View>


          </View>
        </View>
      </View>
    </Screen>
  )
})
