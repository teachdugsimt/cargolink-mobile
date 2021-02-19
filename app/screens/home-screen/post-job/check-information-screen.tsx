import React, { useEffect, useState } from "react"
import {
  View, ViewStyle, Dimensions, TextStyle,
  Platform, ImageStyle, Image, TouchableOpacity,
  SectionList, ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import { observer } from "mobx-react-lite"
import { Text } from "../../../components"
import { translate } from "../../../i18n"
import {
  AddJobElement, MultiSelector, Screen,
  TextInputTheme, RoundedButton, ModalLoading,
  Icon, DatePickerRemake, TimePickerRemake, LocationPicker
} from '../../../components'
import { AlertMessage } from "../../../utils/alert-form";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from 'moment-timezone'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color, typography, images } from "../../../theme"
import date from 'date-and-time';
import { Modal, ModalContent } from 'react-native-modals';
import PostJobStore from "../../../store/post-job-store/post-job-store";
import _ from 'lodash'
import { MapTruckImageName } from '../../../utils/map-truck-image-name'
import AdvanceSearchStore from "../../../store/shipper-job-store/advance-search-store";
import StatusStore from '../../../store/post-job-store/job-status-store'
import { useStores } from "../../../models/root-store/root-store-context";
import { FlatGrid } from 'react-native-super-grid';

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const GREY_TEXT: ViewStyle = { backgroundColor: color.line }
const BORDER_RADIUS_20: ViewStyle = {
  borderRadius: 20,
}


const TOP_VIEW: ViewStyle = {
  paddingTop: Platform.OS == "ios" ? 10 : 0,
  flex: Platform.OS == "ios" ? 0.65 : 0.85,
  backgroundColor: color.mainTheme,
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
const WRAP_DROPDOWN_VALUE: ViewStyle = {
  flex: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
  borderRadius: 2.5
}
const WRAP_DROPDOWN: ViewStyle = {
  flex: 1, borderColor: color.line, borderWidth: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
  borderRadius: 2.5
}
const PADDING_TOP_20: ViewStyle = { paddingTop: 20 }
const IMAGE_LIST: ImageStyle = {
  // width: 50, height: 50,
  backgroundColor: color.line, padding: 10,
  resizeMode: "cover",
  aspectRatio: 2 / 2,
  borderRadius: 30,
  borderColor: color.primary, borderWidth: 2,
}
const CONTENT_TEXT: TextStyle = {
  fontFamily: 'Kanit-Medium',
  color: color.black,
  fontSize: typography.title
}
const MARGIN_HORIZONTTAL_MEDIUM: ViewStyle = { paddingHorizontal: 10 }
const MARGIN_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
const MARGIN_TOP: ViewStyle = { marginTop: 5 }
const DROPDOWN_ICON_CONTAINER: ViewStyle = {
  paddingTop: 12.5, paddingRight: 5
}
const MARGIN_TOP_BIG: ViewStyle = { marginTop: 10 }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
const LAYOUT_REGISTRATION_FIELD: TextStyle = {
  textAlign: 'right', paddingRight: 10,
}
const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_CONTAINER_CONFIRM: ViewStyle = {
  backgroundColor: color.success, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.textWhite
}
const MARGIN_MEDIUM: ViewStyle = {
  marginVertical: 10
}

const ROOT_FLAT_LIST: ViewStyle = {
  width: '98%',
  height: 100,
  flexDirection: 'row',
  alignItems: 'center',
  zIndex: 5,
}
const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }
const BORDER_BOTTOM: ViewStyle = { ...ROOT_FLAT_LIST, borderBottomWidth: 1, borderBottomColor: color.line, marginHorizontal: 10, }
const ROW_TEXT: ViewStyle = {
  flexDirection: 'row',
}
const RED_DOT: TextStyle = {
  color: color.red,
  paddingTop: 10, paddingLeft: 7.5
}
const ICON_PIN_YELLOW: ImageStyle = {
  height: 20, width: 20,
  marginTop: 10
}
const JUSTIFY_BETWEEN: ViewStyle = {
  justifyContent: 'space-between'
}
const PADDING_RIGHT_SMALL: ViewStyle = { paddingRight: 5 }
const PADDING_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
const PADDING_CHEVRON: ViewStyle = { paddingTop: 7.5, paddingRight: 5 }
const PADDING_TOP: ViewStyle = { marginTop: 10 }
const BUTTON_MAP: ViewStyle = { padding: 10, borderWidth: 1, borderRadius: 2.5, borderColor: color.line }

export const CheckInformationScreen = observer(function CheckInformationScreen(props) {
  const navigation = useNavigation()
  const { versatileStore } = useStores()
  const [fieldShippingCheck, setfieldShippingCheck] = useState([])

  const [visibleMap, setvisibleMap] = useState(false)
  const [statusMap, setstatusMap] = useState(null)

  const [rerender, setrerender] = useState(false)
  const [rerenderTime, setrerenderTime] = useState(false)
  const [initDatePicker, setinitDatePicker] = useState(new Date());
  const [listProductState, setlistProductState] = useState(null)
  const [errorPostJob, seterrorPostJob] = useState(null)

  const [swipe, setswipe] = useState(false)
  const [swipe2, setswipe2] = useState(false)
  const [visible, setvisible] = useState(false)
  const [visible0, setvisible0] = useState(false)

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
  const { control, handleSubmit, errors } = useForm({
    defaultValues: initialData
  });

  const _renderSelectedList = (item, section) => {
    return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name} style={ROOT_FLAT_LIST} onPress={() => {
      if (section == 1) setvisible0(true)
      else if (section == 2) setvisible(true)
    }}>
      <View style={{ ...BORDER_BOTTOM }}>
        <View style={VIEW_LIST_IMAGE}>
          {Platform.OS == "ios" ? <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images.greyMock} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
            <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images.greyMock} style={IMAGE_LIST} height={60} width={60} />}
        </View>
        <View style={{ flexDirection: 'row', flex: 1, width: '100%', justifyContent: 'space-between' }}>
          <View style={{ width: '80%', alignItems: 'center' }}>
            <Text style={{ marginLeft: 20 }}>{item.name}</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} style={{}} />
        </View>
      </View>
    </TouchableOpacity>
  }

  const _renderSectionModal = (item: any, index: any, onChange: any, section: any) => {
    return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
      if (section == 1) setvisible0(false)
      else if (section == 2) setvisible(false)
      onChange(item.id)
    }}>
      <View style={BORDER_BOTTOM}>
        <View style={VIEW_LIST_IMAGE}>
          {/* {Platform.OS == "ios" ? <Image source={images[item.image]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
            <Image source={images[item.image]} style={IMAGE_LIST} height={60} width={60} />} */}
          {Platform.OS == "ios" ? <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
            <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} />}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <Text style={{ width: '50%', paddingLeft: 20 }}>{item.name}</Text>
          <Ionicons name="chevron-forward" size={24} style={{ marginRight: 5 }} />
        </View>
      </View>
    </TouchableOpacity>
  }

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

  const _submitLocation = (addr, region) => {
    if (statusMap.includes('receive')) {
      control.setValue("receive-location", addr)
      control.setValue("receive-region", region)
      setvisibleMap(false)
    } else {
      let splitPath = statusMap.split("-")
      let path = "shipping-region-" + splitPath[splitPath.length - 1]
      control.setValue(statusMap, addr)
      control.setValue(path, region)
      setvisibleMap(false)
    }
  }

  const onSubmit = (data) => {
    let status_action = JSON.parse(JSON.stringify(StatusStore.status))
    console.log("Raw data post job 3 :: ", data)
    const expirationDate = compareDateTime(date.format(date.addDays(data['receive-date'], -1), "DD-MM-YYYY hh:mm:ss")
      , date.format(data['receive-time'], "DD-MM-YYYY hh:mm:ss"))
    let tmp_data = JSON.parse(JSON.stringify(data))
    let final = { ...tmp_data }
    Object.keys(tmp_data).forEach((key) => {
      let arr = key.split("-")
      let indexing = arr[arr.length - 1]

      if (key.includes("shipping-date-")) {
        final[key] = moment(data['shipping-date-' + indexing].toString().slice(0, 25)).format("DD-MM-YYYY HH:mm:ss")
      }
      if (key.includes("shipping-time-")) {
        final[key] = moment(data['shipping-time-' + indexing].toString().slice(0, 25)).format("DD-MM-YYYY HH:mm:ss")
      }
      if (key.includes("receive-date")) {
        final[key] = moment(data['receive-date'].toString().slice(0, 25)).format("DD-MM-YYYY HH:mm:ss")
      }
      if (key.includes("receive-time")) {
        final[key] = moment(data['receive-time'].toString().slice(0, 25)).format("DD-MM-YYYY HH:mm:ss")
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
      "truckAmount": final['car-num'],
      "productTypeId": final['item-type'],
      // "productName": "string",
      "productName": final["item-name"],
      "weight": final['item-weight'],
      "price": 0, // No need now 
      "expiredTime": expirationDate, // No need now
      "note": 'note text',
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


  useEffect(() => {
    let data_postjob = JSON.parse(JSON.stringify(PostJobStore.data_postjob))
    let error = JSON.parse(JSON.stringify(PostJobStore.error))
    if (error && error != errorPostJob) {
      const dateErrorMessage: string = "Date of delivery should not be a date before the date of loading"
      let messageTitle = error && error == dateErrorMessage ?
        "postJobScreen.checkShippingDate" : "common.somethingWrong"
      let messageContent = error && error == dateErrorMessage ?
        "postJobScreen.shippingDateMoreThan" : "common.pleaseCheckYourData"
      seterrorPostJob(error)
      AlertMessage(translate(messageTitle), translate(messageContent))
      seterrorPostJob(null)
      PostJobStore.setError()
    } else {
      if (data_postjob) {
        let status_action = JSON.parse(JSON.stringify(StatusStore.status))
        if (status_action == "add")
          navigation.navigate("postSuccess")
        else navigation.navigate("MyJob", { screen: "postSuccess" })
      }
    }

  }, [PostJobStore.data_postjob, PostJobStore.error])

  const _setRenderDateAndTimeField = (val: boolean, index: number, field: string) => {
    let tmp_field_level = fieldShippingCheck
    if (field == "date") tmp_field_level[index].showDate = val
    else tmp_field_level[index].showTime = val
    setfieldShippingCheck(tmp_field_level)
    setswipe(!swipe)
  }



  const [vehicleType, setvehicleType] = useState([])
  const [sectionTruckType, setsectionTruckType] = useState([])
  const [initSection, setinitSection] = useState([])
  useEffect(() => {
    let grouping = JSON.parse(JSON.stringify(versatileStore.listGroup))
    let truckTyping = JSON.parse(JSON.stringify(versatileStore.list))
    if (grouping && truckTyping && grouping.length > 0 && truckTyping.length > 0) {
      let tmp_section = []
      grouping.map((gr, igr) => {
        tmp_section.push({
          title: gr.name,
          id: gr.id,
          image: gr.image,
          data: truckTyping.filter(e => e.groupId == gr.id)
        })
      })
      setsectionTruckType(tmp_section)
      setinitSection(tmp_section)
    }

  }, [versatileStore.list, versatileStore.listGroup])
  const _closeTruckType = () => {
    setvisible0(false)
    const list_all_real = JSON.parse(JSON.stringify(versatileStore.list))
    setsectionTruckType(initSection)
    setvehicleType(list_all_real)
  }
  const _filterGroupTruck = (item) => {
    const list_all_real = JSON.parse(JSON.stringify(versatileStore.list))

    let tmp_list, tmp_section_list
    tmp_list = list_all_real.filter(e => e.groupId == item.id)
    tmp_section_list = initSection.filter(e => e.id == item.id)

    setsectionTruckType(tmp_section_list)
    setvehicleType(tmp_list)
  }
  useEffect(() => {
    let tmpProductList = JSON.parse(JSON.stringify(versatileStore.list))
    if (tmpProductList && tmpProductList.length > 0) {
      setvehicleType(tmpProductList)
    }
  }, [versatileStore.list])
  const _renderGroupTruck = (list) => {
    return <FlatGrid
      itemDimension={100}
      data={list}
      // fixed={true}
      renderItem={({ item }) => (<TouchableOpacity
        style={{ flex: 1, borderColor: color.primary, borderRadius: 15, borderWidth: 1 }}
        onPress={() => _filterGroupTruck(item)}>
        <View style={{ flex: 1, width: '100%', height: 30, justifyContent: 'center' }}>
          <Text style={{ alignSelf: 'center' }}>{item.name}</Text>
        </View>
      </TouchableOpacity>)}
    />
  }







  const list_status = [
    { key: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: false },
    { key: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
    { key: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: true },
    { key: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
  ]
  const list_vehicle_popular = [
    {
      title: 'postJobScreen.popular',
      data: [{ id: 13, name: 'รถบรรทุกของเหลว 6 ล้อ', image: 'truck2' },
      { id: 17, name: 'รถกระบะ 4 ล้อตู้ทึบ', image: 'truck3' },
      { id: 21, name: 'รถ 6 ล้อ ตู้ทึบ', image: 'truck4' }]
    },
    {
      title: 'postJobScreen.4maxType',
      data: [
        { id: 24, name: 'รถ 6 ล้อ กระบะ', image: 'truck5' },
      ]
    }
  ]
  const list_product_type = [
    {
      title: 'postJobScreen.popular',
      data: [{ id: 1, name: 'วัสดุก่อสร้าง', image: 'greyMock' },
      { id: 2, name: 'สินค้าเกษตร', image: 'greyMock' },
      { id: 3, name: 'อาหาร และสินค้าบริโภค', image: 'greyMock' }]
    }
  ]
  let list_vehicle = JSON.parse(JSON.stringify(versatileStore.list))
  const list_product_type_all = JSON.parse(JSON.stringify(AdvanceSearchStore.productTypes))
  let formControllerValue = control.getValues()
  let dropdown_item_type, dropdown_vehicle_type
  if (formControllerValue['item-type']) {
    dropdown_item_type = formControllerValue['item-type']
  }
  if (formControllerValue['vehicle-type']) {
    dropdown_vehicle_type = formControllerValue['vehicle-type']
  }
  const defaultVehicleType = JSON.parse(JSON.stringify(versatileStore.list))
  const listGroup = JSON.parse(JSON.stringify(versatileStore.listGroup))

  return (
    <Screen unsafe>
      <View testID="CheckInformationScreen" style={FULL}>
        <View style={TOP_VIEW}>
          <AddJobElement data={list_status} />
        </View>

        <View style={BOTTOM_VIEW}>
          <ScrollView style={FULL}>



            <ModalLoading
              containerStyle={{ zIndex: 2 }}
              size={'large'} color={color.primary} visible={PostJobStore.loading} />


            <Modal
              visible={visibleMap}
              onTouchOutside={() => setvisibleMap(false)}
              onSwipeOut={() => setvisibleMap(false)}>
              <ModalContent >
                <View style={{ width: (width / 1), height: '100%', justifyContent: 'flex-start' }}>
                  <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, position: 'relative' }}>

                      {statusMap && <LocationPicker banner={statusMap.includes('receive') ? "postJobScreen.receiveLocation" : "postJobScreen.shippingLocation"} onSubmitMap={(addr, region) => _submitLocation(addr, region)} />}

                    </View>

                  </SafeAreaView>

                </View>
              </ModalContent>
            </Modal>

            <View style={TOP_VIEW_2}>
              <View style={WRAPPER_TOP}>

                <View style={ROW_TEXT}>
                  <Text tx={"postJobScreen.selectVehicleType"} preset={'topic'} style={MARGIN_TOP_BIG} />
                  <Text preset={'topic'} style={RED_DOT} >*</Text>
                </View>

                <View style={[PADDING_TOP, !dropdown_vehicle_type ? { ...WRAP_DROPDOWN } : { ...WRAP_DROPDOWN_VALUE }]}>

                  <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible0(true)}>
                    {!dropdown_vehicle_type && <><Text style={{ padding: 10 }} tx={"postJobScreen.pleaseSelectVehicleType"} />
                      <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} /></>}
                    {dropdown_vehicle_type && versatileStore.list && versatileStore.list.length && _renderSelectedList(JSON.parse(JSON.stringify(versatileStore.list)).find(e => e.id == dropdown_vehicle_type), 1)}

                  </TouchableOpacity>

                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <Modal
                        visible={visible0}
                        onTouchOutside={() => setvisible0(false)}
                        onSwipeOut={() => setvisible0(false)}
                        swipeDirection={['up', 'down']} // can be string or an array
                        swipeThreshold={200} // default 100
                      >
                        <ModalContent >
                          <View style={{ width: (width / 1.1), height: '100%', justifyContent: 'flex-start' }}>
                            <SafeAreaView style={{ flex: 1 }}>
                              <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: color.primary }} preset={"topic"} tx={"postJobScreen.selectVehicleType"} />
                              </View>


                              <View style={PADDING_TOP}>
                                {!!defaultVehicleType && defaultVehicleType.length > 0 && <MultiSelector
                                  items={vehicleType && vehicleType.length > 0 ? vehicleType : defaultVehicleType}
                                  selectedItems={[value]}
                                  selectText={translate("postJobScreen.pleaseSelectVehicleType")}
                                  onSelectedItemsChange={(val: any) => {
                                    onChange(val[0])
                                    _closeTruckType()
                                  }}
                                />}
                              </View>

                              {listGroup && listGroup.length > 1 && <View>
                                {_renderGroupTruck(listGroup)}
                              </View>}

                              <View style={{ flex: 1 }}>

                                <SectionList
                                  sections={sectionTruckType}
                                  keyExtractor={(item, index) => 'section-list-' + (item.name || item.title) + index}
                                  renderItem={({ item, index }) => _renderSectionModal(item, index, onChange, 1)}
                                  renderSectionHeader={({ section: { title } }) => (
                                    <Text style={PADDING_TOP} >{title}</Text>
                                  )}
                                  ListFooterComponent={
                                    <View style={{ height: 50 }}></View>
                                  }
                                />

                              </View>

                            </SafeAreaView>

                          </View>
                        </ModalContent>
                      </Modal>


                    )}
                    key={'controller-dropdown-vehicle-type'}
                    name={"vehicle-type"}
                    defaultValue=""
                  />

                </View>

                <Text tx={"postJobScreen.vehicleNum"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"car-num"}
                      placeholder={'คัน'}
                      keyboardType="numeric"
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-car-num'}
                  name={"car-num"}
                  defaultValue=""
                />

              </View>
            </View>

            <View style={[TOP_VIEW_2, MARGIN_TOP]}>
              <View style={WRAPPER_TOP}>
                <View style={ROW_TEXT}>
                  <Text tx={"postJobScreen.itemDetail"} preset={'topic'} style={MARGIN_TOP_BIG} />
                  <Text preset={'topic'} style={RED_DOT} >*</Text>
                </View>

                <View style={[PADDING_TOP, !dropdown_vehicle_type ? { ...WRAP_DROPDOWN } : { ...WRAP_DROPDOWN_VALUE }]}>

                  <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible(true)}>
                    {!dropdown_item_type && <><Text style={{ padding: 10 }} tx={"postJobScreen.selectItemType"} />
                      <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} />
                    </>}
                    {dropdown_item_type && list_product_type_all && _renderSelectedList(list_product_type_all.find(e => e.id == dropdown_item_type), 2)}

                  </TouchableOpacity>

                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <Modal
                        visible={visible}
                        onTouchOutside={() => setvisible(false)}
                        onSwipeOut={() => setvisible(false)}
                        swipeDirection={['up', 'down']} // can be string or an array
                        swipeThreshold={200} // default 100
                      >
                        <ModalContent >
                          <View style={{ width: (width / 1.1), height: '100%', justifyContent: 'flex-start' }}>
                            <SafeAreaView style={{ flex: 1 }}>
                              <View style={{ height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: color.primary }} preset={"topic"} tx={"postJobScreen.selectVehicleType"} />
                              </View>

                              <View style={[PADDING_TOP]}>

                                {!!list_product_type_all && list_product_type_all.length > 0 && <MultiSelector
                                  items={list_product_type_all}
                                  keyer={"list-item-type-01"}
                                  selectedItems={[value]}
                                  selectText={translate("postJobScreen.pleaseSelectVehicleType")}
                                  onSelectedItemsChange={(val: any) => {
                                    onChange(val[0])
                                    setvisible(false)
                                  }}
                                />}
                              </View>

                              <View>
                                <SectionList
                                  sections={list_product_type}
                                  keyExtractor={(item, index) => 'section-list-' + item.name + index}
                                  renderItem={({ item, index }) => _renderSectionModal(item, index, onChange, 2)}
                                  renderSectionHeader={({ section: { title } }) => (
                                    <Text tx={title} style={PADDING_TOP} />
                                  )}
                                />
                              </View>
                            </SafeAreaView>

                          </View>
                        </ModalContent>
                      </Modal>


                    )}
                    key={'controller-dropdown-item-type'}
                    name={"item-type"}
                    defaultValue=""
                  />

                </View>





                <View style={ROW_TEXT}>
                  <Text tx={"postJobScreen.inputYourItem"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                  <Text preset={'topic'} style={[RED_DOT, PADDING_TOP_20]}>*</Text>
                </View>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"item-name"}
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-item-name'}
                  name={"item-name"}
                  rules={{ required: true }}
                  defaultValue=""
                />
                {errors['item-name'] && <Text style={{ color: color.red }} tx={"common.productName"} />}

                <Text tx={"postJobScreen.weightNumber"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"item-weight"}
                      keyboardType="numeric"
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-item-weight'}
                  name={"item-weight"}
                  defaultValue=""
                />
              </View>
            </View>










            <View style={[TOP_VIEW_2, MARGIN_TOP]}>
              <View style={WRAPPER_TOP}>
                <View style={ROW_TEXT}>
                  <Icon icon={'pinDropYellow'} style={ICON_PIN_YELLOW} />
                  <Text tx={"postJobScreen.acceptPointProduct"} preset={'topic'} style={[MARGIN_TOP_BIG, MARGIN_LEFT_SMALL]} />
                  <Text preset={'topic'} style={RED_DOT} >*</Text>
                </View>
                <View style={ROW_TEXT}>
                  <Text tx={"postJobScreen.inputLocationReceive"} preset={'topic'} style={[MARGIN_TOP_BIG, MARGIN_LEFT_SMALL]} />
                </View>


                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <>
                    </>
                  )}
                  key={'text-input-receive-region'}
                  name={"receive-region"}
                  defaultValue=""
                />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setvisibleMap(true)
                        setstatusMap('receive-location')
                      }}
                      style={BUTTON_MAP}>
                      {!formControllerValue["receive-location"] && <Text tx={"postJobScreen.receiveLocation"} />}
                      {!!formControllerValue["receive-location"] && <Text>{formControllerValue["receive-location"]}</Text>}
                    </TouchableOpacity>
                  )}
                  key={'text-input-receive-location'}
                  name={"receive-location"}
                  defaultValue=""
                />



                <View style={ROW_TEXT}>
                  <><View style={[FULL, PADDING_RIGHT_SMALL]}>
                    <Text tx={"postJobScreen.dateReceive"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                    <Controller
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <DatePickerRemake
                          keyer={"receive-date1"}
                          testID={"testID-receive-date"}
                          value={value}
                          onChange={onChange}
                          label={formControllerValue['receive-date']}
                          iconName={"calendar-sharp"}
                          mode={"date"}
                          rerender={rerender}
                          rerenderFunction={() => setrerender(!rerender)}
                        />
                      )}
                      key={'text-input-receive-date'}
                      name={"receive-date"}
                      defaultValue={initDatePicker}
                    />
                  </View>
                    <View style={[FULL, PADDING_LEFT_SMALL]}>
                      <Text tx={"postJobScreen.timeReceive"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                      <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                          <TimePickerRemake
                            keyer={"receive-time1"}
                            testID={"testID-receive-date2"}
                            value={value}
                            onChange={onChange}
                            label={formControllerValue['receive-time']}
                            mode={"time"}
                            iconName={"time-outline"}
                            rerender={rerenderTime}
                            rerenderFunction={() => setrerenderTime(!rerenderTime)}
                          />
                        )}
                        key={'text-input-receive-time'}
                        name={"receive-time"}
                        defaultValue={initDatePicker}
                      />
                    </View></>
                </View>



                <Text tx={"postJobScreen.receiverInfo"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                <Text tx={"postJobScreen.receiverName"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"receive-name"}
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-receive-name'}
                  name={"receive-name"}
                  defaultValue=""
                />

                <Text tx={"postJobScreen.receiverTel"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"receive-tel-no"}
                      keyboardType="numeric"
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-receive-tel-no'}
                  name={"receive-tel-no"}
                  defaultValue=""
                />

              </View>
            </View>











            {fieldShippingCheck && fieldShippingCheck.length > 0 ? fieldShippingCheck.map((e, i) => {
              return <View style={[TOP_VIEW_2, MARGIN_TOP]} key={`view-shipping-${i + 1}`}>
                <View style={WRAPPER_TOP}>
                  <View style={ROW_TEXT}>
                    <Icon icon={'pinDropGreen'} style={ICON_PIN_YELLOW} />
                    <Text tx={"postJobScreen.shipingPoint"} preset={'topic'} style={MARGIN_TOP_BIG} />
                    <Text preset={'topic'} style={MARGIN_TOP_BIG}>{i + 1}</Text>
                    <Text preset={'topic'} style={RED_DOT} >*</Text>
                  </View>

                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <>
                      </>
                    )}
                    key={'text-input-receive-region'}
                    name={"shipping-region-" + e.id}
                    defaultValue=""
                  />

                  <Text tx={"postJobScreen.shippingAddr"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setvisibleMap(true)
                          setstatusMap("shipping-address-" + e.id)
                        }}
                        style={BUTTON_MAP}>
                        {!formControllerValue["shipping-address-" + e.id] && <Text tx={"postJobScreen.shippingLocation"} />}
                        {!!formControllerValue["shipping-address-" + e.id] && <Text>{formControllerValue["shipping-address-" + e.id]}</Text>}
                      </TouchableOpacity>
                    )}
                    key={'text-input-shipping-address-' + e.id}
                    name={"shipping-address-" + e.id}
                    defaultValue=""
                  />

                  <View style={ROW_TEXT}>
                    <View style={[FULL, PADDING_RIGHT_SMALL]}>
                      <Text tx={"postJobScreen.dateShipping"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                      <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                          <DatePickerRemake
                            key={"shipping-date-" + e.id}
                            testID={"testID-shipping-date-" + e.id}
                            value={value}
                            onChange={onChange}
                            label={formControllerValue["shipping-date-" + e.id]}
                            iconName={"calendar-sharp"}
                            mode={"date"}
                            rerender={e.showDate}
                            rerenderFunction={() => _setRenderDateAndTimeField(!e.showDate, i, 'date')}
                          />
                        )}
                        key={'text-input-shipping-date-' + e.id}
                        name={"shipping-date-" + e.id}
                        defaultValue=""
                      />
                    </View>
                    <View style={[FULL, PADDING_LEFT_SMALL]}>
                      <Text tx={"postJobScreen.timeShipping"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                      <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                          <TimePickerRemake
                            key={"shipping-time-" + e.id}
                            testID={"testID-shipping-time-" + e.id}
                            value={value}
                            onChange={onChange}
                            label={formControllerValue["shipping-time-" + e.id]}
                            rerender={e.showTime}
                            mode={"time"}
                            iconName={"time-outline"}
                            rerenderFunction={() => _setRenderDateAndTimeField(!e.showTime, i, 'time')}
                          />
                        )}
                        key={'text-input-shipping-time-' + e.id}
                        name={"shipping-time-" + e.id}
                        defaultValue=""
                      />
                    </View>
                  </View>

                  <Text tx={"postJobScreen.shipperInfo"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                  <Text tx={"postJobScreen.shipperName"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TextInputTheme
                        testID={"shipping-name-" + e.id}
                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                    )}
                    key={'text-input-shipping-name-' + e.id}
                    name={"shipping-name-" + e.id}
                    defaultValue=""
                  />

                  <Text tx={"postJobScreen.shipperTel"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TextInputTheme
                        testID={"shipping-tel-no-" + e.id}
                        keyboardType="numeric"
                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                    )}
                    key={'text-input-shipping-tel-no-' + e.id}
                    name={"shipping-tel-no-" + e.id}
                    defaultValue=""
                  />

                </View>
              </View>
            }) : <></>}









            <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
              <View style={ROW_TEXT}>
                <View style={[WRAPPER_TOP, FULL]}>
                  <RoundedButton style={[FULL, BORDER_RADIUS_20, GREY_TEXT]} onPress={() => navigation.goBack()} text={"common.back"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                </View>
                <View style={[WRAPPER_TOP, FULL]}>
                  <RoundedButton style={[FULL, BORDER_RADIUS_20, ROUND_BUTTON_CONTAINER_CONFIRM]} onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER_CONFIRM} textStyle={ROUND_BUTTON_TEXT} />
                </View>
              </View>
            </View>


          </ScrollView>
        </View>
      </View>
    </Screen>
  )
})
