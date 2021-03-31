import React, { useEffect, useState } from "react"
import {
  View, ViewStyle, TextStyle, Platform, ImageStyle, SafeAreaView, Dimensions,
  KeyboardAvoidingView, TouchableOpacity, ScrollView
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import { observer } from "mobx-react-lite"
import { Text } from "../../../components"
import {
  AddJobElement, TextInputTheme, RoundedButton, Icon, DatePickerRemake, TimePickerRemake,
  LocationPicker, Screen, TextInputColumn, TextInputNew
} from '../../../components'
import { color, typography } from "../../../theme"
import PostJobStore from "../../../store/post-job-store/post-job-store";
import _ from 'lodash'
import { Modal, ModalContent } from 'react-native-modals';
import { AlertForm, AlertFormDate } from "../../../utils/alert-form";
import StatusStore from '../../../store/post-job-store/job-status-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const JUSTIFY_CENTER: ViewStyle = { justifyContent: 'center' }
const ALIGN_ITEMS: ViewStyle = { alignItems: 'center' }
const PRIMARY_COLOR: ViewStyle = { backgroundColor: color.primary }
const GREY_TEXT: ViewStyle = { backgroundColor: color.line }
const LINE_TEXT: TextStyle = { color: color.line }
const JUSTIFY_BETWEEN: ViewStyle = { justifyContent: 'space-between', alignItems: 'center' }
const BORDER_RADIUS_20: ViewStyle = {
  borderRadius: 20,
}
const VERTICAL_10: TextStyle = { paddingVertical: 10 }
const VIEW_VERTICAL_10: ViewStyle = { paddingVertical: 10 }
const ADD_NEW_POINT: ViewStyle = {
  backgroundColor: color.primary,
  borderWidth: 1,
  borderColor: color.primary,
  ...BORDER_RADIUS_20
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
const CONTENT_TEXT: TextStyle = {
  fontFamily: 'Kanit-Medium',
  color: color.black,
}
const MARGIN_HORIZONTTAL_MEDIUM: ViewStyle = { paddingHorizontal: 10 }
const MARGIN_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
const MARGIN_TOP: ViewStyle = { marginTop: 5 }
const MARGIN_TOP_BIG: ViewStyle = { marginTop: 10 }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
const BORDER_BOTTOM_STYLE: ViewStyle = { borderBottomColor: color.mainGrey, borderBottomWidth: 1 }
const LAYOUT_REGISTRATION_FIELD: TextStyle = {
  textAlign: 'right', paddingRight: 10,
}
const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.textWhite
}
const ROUND_BUTTON_TEXT_BACLK: TextStyle = {
  color: color.textBlack
}
const MARGIN_MEDIUM: ViewStyle = {
  marginVertical: 10
}
const ROW_TEXT: ViewStyle = {
  flexDirection: 'row',
}
const RED_DOT: TextStyle = {
  color: color.red,
  paddingTop: 10, paddingLeft: 7.5
}
const ICON_PIN_YELLOW: ImageStyle = { height: 45, width: 40, }
const PADDING_RIGHT_SMALL: ViewStyle = { paddingRight: 5 }
const PADDING_LEFT_SMALL: ViewStyle = { paddingLeft: 5 }
const BUTTON_MAP: ViewStyle = {
  padding: 10, paddingLeft: 0,
  borderBottomWidth: 1, borderBottomColor: color.mainGrey
}
const initField = [{
  id: 1,
  showDate: false,
  showTime: false,
}]
const MAX_LENGTH: number = 120

export const ReceivePointScreen = observer(function ReceivePointScreen() {
  const navigation = useNavigation()
  const [fieldShipping, setfieldShipping] = useState(initField)

  const [rerender, setrerender] = useState(false)
  const [rerenderTime, setrerenderTime] = useState(false)
  const [initDatePicker] = useState(new Date());

  const [visibleMap, setvisibleMap] = useState(false)

  const [swipe, setswipe] = useState(false)

  const [statusMap, setstatusMap] = useState(null)

  const _mappingObject = (object) => {
    let tmp = object
    Object.keys(object).forEach(key => {
      if (key.includes('-date') || key.includes("-time")) {
        tmp[key] = new Date(object[key])
      }
    })
    return tmp
  }
  const initialData = _mappingObject(PostJobStore.MappingPostjob2) || {}
  const { control, handleSubmit, errors } = useForm({
    defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : initialData
  });

  const _submitLocation = (addr, region, pathControl) => {
    console.log("SUbmit Location Field HERERERER TRIGGER :: =>>>>", pathControl, addr, region)
    if (pathControl.includes('receive')) {
      control.setValue("receive-location", addr)
      control.setValue("receive-region", region)
      setswipe(!swipe)
    } else {
      let splitPath = pathControl.split("-")
      let path = "shipping-region-" + splitPath[splitPath.length - 1]
      control.setValue(pathControl, addr)
      control.setValue(path, region)
      setswipe(!swipe)
    }
  }

  useEffect(() => {
    // _addFieldInputShipping()
    // setswipe(!swipe)
    let status_action = JSON.parse(JSON.stringify(StatusStore.status))
    let data_post2 = JSON.parse(JSON.stringify(PostJobStore.postjob2))
    console.log("Postjob 2 data :: => ", data_post2)
    console.log("Actions status 2 data :: => ", status_action)
    if (status_action && status_action == "edit") {
      if (data_post2 && data_post2 != null && data_post2['shipping-information'] && data_post2['shipping-information'].length > 0) {

        let tmp_field_level = []
        data_post2['shipping-information'].map((e, i) => {
          tmp_field_level.push({
            id: tmp_field_level.length + 1,
            showDate: false,
            showTime: false,
          })
        })
        setfieldShipping(tmp_field_level)
        setTimeout(() => {
          setswipe(!swipe)
        }, 500);
      }
    }

    return () => {
      setfieldShipping(initField)
    }
  }, [])

  const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const onSubmit = (data) => {
    console.log("Raw Data Form Post job : ", data)
    const a = new Date()
    const expiredDate = (addDays(a, 2)).getTime()
    console.log("Expire date :: ", expiredDate)
    const tmpCheckDate = data['receive-date']
    const receiveDateForCheck = tmpCheckDate.setHours(data['receive-time'].getHours(), data['receive-time'].getMinutes(), data['receive-time'].getSeconds());
    console.log("Full receive date/time :: ", receiveDateForCheck)



    let tmpData = JSON.parse(JSON.stringify(data))
    let checkDate = false
    Object.keys(tmpData).forEach(e => {
      if (e.includes("shipping-date-")) {
        let tmpShippingDate = data[e]
        let keyIndex = e.split("-")[e.split("-").length - 1]
        const shippingDateForCheck = tmpShippingDate.setHours(data[`shipping-time-${keyIndex}`].getHours(), data[`shipping-time-${keyIndex}`].getMinutes(), data['receive-time'].getSeconds());
        console.log("Full shipping date/time :: ", shippingDateForCheck)
        if (receiveDateForCheck >= shippingDateForCheck) checkDate = true

      }
    })



    if (checkDate) { AlertFormDate(false); return; }
    if (receiveDateForCheck < expiredDate) { AlertFormDate(); return; }
    if (!data['receive-location']) { AlertForm("postJobScreen.receiveLocation"); return; }
    else if (!data['receive-date']) { AlertForm("postJobScreen.receiveDate"); return; }
    else if (!data['receive-time']) { AlertForm("postJobScreen.receiveTime"); return; }
    else if (!data['receive-name']) { AlertForm("postJobScreen.receiveName"); return; }
    else if (!data['receive-tel-no']) { AlertForm("postJobScreen.receiveTelno"); return; }

    else if (!data['shipping-address-1']) { AlertForm("postJobScreen.shippingLocation"); return; }
    else if (!data['shipping-date-1']) { AlertForm("postJobScreen.shippingDate"); return; }
    else if (!data['shipping-time-1']) { AlertForm("postJobScreen.shippingTime"); return; }

    let tmp_data = JSON.parse(JSON.stringify(data))
    let final = { ...tmp_data }

    let shippingInformation = []
    let pure_object = {}
    Object.keys(tmp_data).forEach((key) => {
      if (key.includes("shipping-")) {
        pure_object[key] = tmp_data[key]
      }
    })
    fieldShipping.forEach((e, i) => {
      shippingInformation.push({
        "shipping-address": pure_object[`shipping-address-${i + 1}`],
        "shipping-date": pure_object[`shipping-date-${i + 1}`],
        "shipping-time": pure_object[`shipping-time-${i + 1}`],
        "shipping-name": pure_object[`shipping-name-${i + 1}`],
        "shipping-tel-no": pure_object[`shipping-tel-no-${i + 1}`],
        "shipping-region": pure_object[`shipping-region-${i + 1}`]
      })
    })
    final['shipping-information'] = shippingInformation
    Object.keys(final).forEach((key) => {
      if (key.includes("shipping-address-") || key.includes("shipping-date-") ||
        key.includes("shipping-time-") || key.includes("shipping-name-") ||
        key.includes("shipping-tel-no-") || key.includes("shipping-region-")) {
        delete final[key]
      }
    })

    PostJobStore.setPostJob(2, final)
    console.log("position final for REACEIVE POINT :: => ,", final)
    let status_action = JSON.parse(JSON.stringify(StatusStore.status))
    if (status_action == "add")
      navigation.navigate("checkInformation")
    else navigation.navigate("MyJob", { screen: "checkInformation" })
  }

  const _addFieldInputShipping = () => {
    let tmp_field_level = fieldShipping
    tmp_field_level.push({
      id: tmp_field_level.length + 1,
      showDate: false,
      showTime: false,
    })
    setfieldShipping(tmp_field_level)
    setswipe(!swipe)
  }
  const _deleteField = (index: number) => {
    let tmp_field_level: any = fieldShipping
    tmp_field_level.pop()
    setfieldShipping(tmp_field_level)
    setswipe(!swipe)
  }
  const _setRenderDateAndTimeField = (val: boolean, index: number, field: string) => {
    let tmp_field_level = fieldShipping
    if (field == "date") tmp_field_level[index].showDate = val
    else tmp_field_level[index].showTime = val
    setfieldShipping(tmp_field_level)
    setswipe(!swipe)
  }

  const list_status = [
    { key: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: false },
    { key: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: true },
    { key: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
    { key: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
  ]
  let formControllerValue = control.getValues()
  let fromNow2Days = addDays(initDatePicker, 2)
  let addOneHours = new Date(fromNow2Days.setHours(fromNow2Days.getHours() + 1))
  console.log("Form Control :: ", formControllerValue)
  // const { longitude, latitude } = position?.coords || {}
  return (
    <Screen unsafe keyboardOffset="little" preset="scroll" bounch={false}>

      <View testID="ReceivePointScreen" style={FULL}>
        <View style={TOP_VIEW}>
          <AddJobElement data={list_status} />
        </View>

        <View style={BOTTOM_VIEW}>
          <View style={FULL}>


            <View style={TOP_VIEW_2}>
              <View style={WRAPPER_TOP}>
                <View style={ROW_TEXT}>
                  <Icon icon={'pinDropYellow'} style={ICON_PIN_YELLOW} />
                  <Text tx={"postJobScreen.acceptPointProduct"} preset={'topic'} style={[MARGIN_TOP_BIG, MARGIN_LEFT_SMALL]} />
                  <Text preset={'topic'} style={RED_DOT} >*</Text>
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
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          // setvisibleMap(true)
                          setstatusMap('receive-location')
                          navigation.navigate("locationPicker", {
                            banner: "postJobScreen.receiveLocation",
                            path: "receive-location",
                            onSubmitMap: (addr, region, path) => _submitLocation(addr, region, path)
                          })
                        }}
                        style={BUTTON_MAP}>
                        {!formControllerValue["receive-location"] && <View style={[ROW_TEXT, JUSTIFY_BETWEEN, VIEW_VERTICAL_10]}>
                          <Text tx={"postJobScreen.fromMap"} style={LINE_TEXT} />
                          <Ionicons name="chevron-forward" size={24} color={color.line} />
                        </View>}
                        {!!formControllerValue["receive-location"] && <Text style={VERTICAL_10}>{formControllerValue["receive-location"]}</Text>}
                      </TouchableOpacity>
                    </>
                  )}
                  key={'text-input-receive-location'}
                  name={"receive-location"}
                  rules={{ required: true }}
                  defaultValue=""
                />
                {(errors['receive-location'] && !formControllerValue["receive-location"]) && <Text style={{ color: color.red }} tx={"postJobScreen.validateReceiveLocation"} />}












                <View style={[ROW_TEXT, JUSTIFY_BETWEEN, BORDER_BOTTOM_STYLE]}>
                  <View style={[FULL, ROW_TEXT, ALIGN_ITEMS]}>
                    {Platform.OS == "ios" && <FontAwesome name="calendar-o" size={22} />}
                    <Text tx={"postJobScreen.dateReceive"} style={{ ...CONTENT_TEXT, paddingLeft: Platform.OS == "ios" ? 10 : 0 }} />
                  </View>
                  <View style={FULL}></View>
                  <View style={{}}>
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
                      defaultValue={fromNow2Days}
                    />
                  </View>
                </View>
                <View style={[ROW_TEXT, JUSTIFY_BETWEEN, BORDER_BOTTOM_STYLE]}>
                  <View style={[FULL, ROW_TEXT, ALIGN_ITEMS]}>
                    {Platform.OS == "ios" && <FontAwesome name="clock-o" size={22} />}
                    <Text tx={"postJobScreen.timeReceive"} style={{ ...CONTENT_TEXT, paddingLeft: Platform.OS == "ios" ? 10 : 0 }} />
                  </View>
                  <View style={FULL}></View>
                  <View style={{}}>
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
                      defaultValue={addOneHours}
                    />
                  </View>
                </View>









                <Text tx={"postJobScreen.receiverInfo"} style={{ ...MARGIN_TOP_EXTRA }} preset="topic" />
                <View style={MARGIN_TOP_BIG} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputColumn
                      testID={"item-name"}
                      topic={"postJobScreen.contactName"}
                      actualPlaceholder="postJobScreen.inputName"
                      underline={true}
                      length={value ? value.length : 0} maxLength={MAX_LENGTH}
                      inputStyle={{ ...MARGIN_MEDIUM, ...CONTENT_TEXT }}
                      value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-receive-name'}
                  rules={{ required: true }}
                  name={"receive-name"}
                  defaultValue=""
                />
                {errors['receive-name'] && <Text style={{ color: color.red }} tx={"postJobScreen.validateReceiveName"} />}

                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputNew
                      key="text-input-item-weight"
                      keyboardType="numeric"
                      prefix="postJobScreen.phoneNumber"
                      actualPlaceholder={Platform.OS == "ios" ? "postJobScreen.mockPhoneNumber" : "postJobScreen.mockPhoneAndroid"}
                      underline={false}
                      prefixIcon="call"
                      prefixIconColor={color.textBlack}
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }}
                      value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-receive-tel-no'}
                  name={"receive-tel-no"}
                  rules={{ pattern: /^\(?([0]{1})\)?([0-9]{9})$/ }}
                  defaultValue=""
                />
                {errors['receive-tel-no'] && <Text style={{ color: color.red }} tx={"postJobScreen.validateReceiveTel"} />}

              </View>
            </View>






















            {fieldShipping && fieldShipping.length > 0 && fieldShipping.map((e, i) => {
              return <View style={[TOP_VIEW_2, MARGIN_TOP]} key={`view-shippping-${i + 1}`}>
                <View key={`view-shippping-wrapper-top-${i + 1}`} style={WRAPPER_TOP}>
                  <View style={[ROW_TEXT, JUSTIFY_BETWEEN]}>

                    <View style={ROW_TEXT}>
                      <Icon icon={'pinDropGreen'} style={ICON_PIN_YELLOW} />
                      <Text tx={"postJobScreen.shipingPoint"} preset={'topic'} style={MARGIN_TOP_BIG} />
                      <Text preset={'topic'} style={MARGIN_TOP_BIG}>{" "}{i + 1}</Text>
                      <Text preset={'topic'} style={RED_DOT} >*</Text>
                    </View>

                    {i == 0 && <TouchableOpacity style={[ROW_TEXT, { alignItems: 'center' }]} onPress={() => _addFieldInputShipping()}>
                      <Ionicons name="add-circle-outline" size={20} color={color.primary} />
                      <Text tx={"postJobScreen.addDelivery"} style={{ color: color.primary }} preset={'topic'} />
                    </TouchableOpacity>}
                    {i != 0 && i == fieldShipping.length - 1 && <TouchableOpacity style={[ROW_TEXT, { alignItems: 'center' }]} onPress={() => _deleteField(i)}>
                      <Ionicons name="close" size={20} color={color.line} />
                      <Text tx={"common.delete"} style={{ color: color.line }} preset={'topic'} />
                    </TouchableOpacity>}
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
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            // setvisibleMap(true)
                            setstatusMap("shipping-address-" + e.id)
                            navigation.navigate("locationPicker", {
                              banner: "postJobScreen.shipingPoint",
                              path: "shipping-address-" + e.id,
                              onSubmitMap: (addr, region, path) => _submitLocation(addr, region, path)
                            })
                          }}
                          style={BUTTON_MAP}>
                          {!formControllerValue["shipping-address-" + e.id] && <View style={[ROW_TEXT, JUSTIFY_BETWEEN, VIEW_VERTICAL_10]}>
                            <Text tx={"postJobScreen.fromMap"} style={{ color: color.line }} />
                            <Ionicons name="chevron-forward" size={24} color={color.line} />
                          </View>}
                          {!!formControllerValue["shipping-address-" + e.id] && <Text style={VERTICAL_10}>{formControllerValue["shipping-address-" + e.id]}</Text>}
                        </TouchableOpacity>
                      </>
                    )}
                    key={'text-input-shipping-address-' + e.id}
                    name={"shipping-address-" + e.id}
                    rules={{ required: true }}
                    defaultValue=""
                  />
                  {errors["shipping-address-" + e.id] && !formControllerValue["shipping-address-" + e.id] && <Text style={{ color: color.red }} tx={"postJobScreen.validateShippingLocation"} />}






                  <View style={[ROW_TEXT, JUSTIFY_BETWEEN, BORDER_BOTTOM_STYLE]}>
                    <View style={[FULL, ROW_TEXT, ALIGN_ITEMS]}>
                      {Platform.OS == "ios" && <FontAwesome name="calendar-o" size={22} />}
                      <Text tx={"postJobScreen.dateShipping"} style={{ ...CONTENT_TEXT, paddingLeft: Platform.OS == "ios" ? 10 : 0 }} />
                    </View>
                    <View style={FULL}></View>
                    <View style={{}}>
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
                        defaultValue={addDays(initDatePicker, 3)}
                      />

                    </View>
                  </View>

                  <View style={[ROW_TEXT, JUSTIFY_BETWEEN, BORDER_BOTTOM_STYLE]}>
                    <View style={[FULL, ROW_TEXT, ALIGN_ITEMS]}>
                      {Platform.OS == "ios" && <FontAwesome name="clock-o" size={22} />}
                      <Text tx={"postJobScreen.timeShipping"} style={{ ...CONTENT_TEXT, paddingLeft: Platform.OS == "ios" ? 10 : 0 }} />
                    </View>
                    <View style={FULL}></View>
                    <View style={{}}>
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
                        defaultValue={addDays(initDatePicker, 3)}
                      />
                    </View>
                  </View>







                  <Text tx={"postJobScreen.shipperInfo"} style={{ ...MARGIN_TOP_EXTRA }} preset="topic" />
                  {/* <Text tx={"postJobScreen.shipperName"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} /> */}
                  <View style={MARGIN_TOP_BIG} />
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TextInputColumn
                        testID={"shipping-name-" + e.id}
                        topic={"postJobScreen.contactName"}
                        actualPlaceholder="postJobScreen.inputName"
                        underline={true}
                        length={value ? value.length : 0} maxLength={MAX_LENGTH}
                        inputStyle={{ ...MARGIN_MEDIUM, ...CONTENT_TEXT }}
                        value={value} onChangeText={(text) => onChange(text)} />
                    )}
                    key={'text-input-shipping-name-' + e.id}
                    rules={{ required: true }}
                    name={"shipping-name-" + e.id}
                    defaultValue=""
                  />
                  {errors["shipping-name-" + e.id] && <Text style={{ color: color.red }} tx={"postJobScreen.validateShippingName"} />}

                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TextInputNew
                        key={"shipping-tel-no-" + e.id}
                        testID={"shipping-tel-no-" + e.id}
                        keyboardType="numeric"
                        prefix="postJobScreen.phoneNumber"
                        actualPlaceholder={Platform.OS == "ios" ? "postJobScreen.mockPhoneNumber" : "postJobScreen.mockPhoneAndroid"}
                        underline={false}
                        prefixIcon="call"
                        prefixIconColor={color.textBlack}
                        inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }}
                        value={value} onChangeText={(text) => onChange(text)} />
                    )}
                    key={'text-input-shipping-tel-no-' + e.id}
                    name={"shipping-tel-no-" + e.id}
                    rules={{ pattern: /^\(?([0]{1})\)?([0-9]{9})$/ }}
                    defaultValue=""
                  />
                  {errors["shipping-tel-no-" + e.id] && <Text style={{ color: color.red }} tx={"postJobScreen.validateReceiveTel"} />}

                </View>
              </View>
            })}











            {/* <View style={[MARGIN_TOP_EXTRA, MARGIN_HORIZONTTAL_MEDIUM]}>
              <RoundedButton
                style={ADD_NEW_POINT}
                onPress={() => _addFieldInputShipping()} text={"postJobScreen.addShippingPoint"}
                textStyle={{ color: color.textBlack }}
                leftIconName="add-circle-outline"
                leftIconColor={color.textBlack}
              />
            </View> */}



            <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
              <View style={ROW_TEXT}>
                <View style={[WRAPPER_TOP, FULL]}>
                  <RoundedButton style={[FULL, BORDER_RADIUS_20, GREY_TEXT]} onPress={() => navigation.goBack()} text={"common.back"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                </View>
                <View style={[WRAPPER_TOP, FULL]}>
                  <RoundedButton style={[FULL, BORDER_RADIUS_20, PRIMARY_COLOR]} onPress={handleSubmit(onSubmit)} text={"common.next"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT_BACLK} />
                </View>
              </View>
            </View>


          </View>
        </View>
      </View>
    </Screen>
  )
})
