import React, { useEffect, useState, useCallback } from "react"
import { View, ViewStyle, TextStyle, Dimensions, Platform, ImageStyle, Image, SectionList, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import { observer } from "mobx-react-lite"
import { translate } from "../../../i18n"
import {
  Text, AddJobElement, TextInputNew,
  TextInputColumn, RadioButton,
  RoundedButton, MultiSelector, ModalTruckType, Screen, TimePickerRemake, Button, ModalAlert
} from '../../../components'
import PostJobStore from '../../../store/post-job-store/post-job-store'
import AdvanceSearchStore from '../../../store/shipper-job-store/advance-search-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color, typography, images, spacing } from "../../../theme"
import { Modal, ModalContent } from 'react-native-modals';
import { MapTruckImageName } from '../../../utils/map-truck-image-name'
import { AlertForm } from '../../../utils/alert-form'
import { useStores } from "../../../models/root-store/root-store-context";
import StatusStore from '../../../store/post-job-store/job-status-store'
import { SafeAreaView } from "react-native-safe-area-context";
import ShipperJobStore from "../../../store/shipper-job-store/shipper-job-store";

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }
const BACK_CHEVRON: ViewStyle = { position: 'absolute', left: 0 }
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

const BORDER_GREY: ViewStyle = {
  // borderColor: color.mainGrey, 
  borderBottomColor: color.mainGrey,
  borderLeftColor: color.transparent2,
  borderRightColor: color.transparent2,
  borderTopColor: color.transparent2,
  borderWidth: 1
}

const PADDING_TOP_20: ViewStyle = { paddingTop: 20 }

const WRAP_DROPDOWN_VALUE: ViewStyle = {
  flex: 1, padding: Platform.OS == "ios" ? 7.5 : 0, paddingLeft: 0, paddingRight: 0,
  borderRadius: 2.5
}
const WRAP_DROPDOWN: ViewStyle = {
  ...BORDER_GREY,
  ...WRAP_DROPDOWN_VALUE
}

const CONTENT_TEXT: TextStyle = {
  fontFamily: 'Kanit-Medium',
  color: color.black,
}
const MARGIN_TOP: ViewStyle = { marginTop: 5 }

const MARGIN_TOP_BIG: ViewStyle = { marginTop: 10 }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
const LAYOUT_REGISTRATION_FIELD: TextStyle = {
  textAlign: 'right', paddingRight: 10,
}
const ROUND_BUTTON_CONTAINER: ViewStyle = {
  height: 40,
  backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
  // color: color.textWhite
}
const MARGIN_MEDIUM: ViewStyle = {
  marginVertical: 10
}
const BUTTON_CONTAINER: ViewStyle = {
  ...ROUND_BUTTON_CONTAINER,
  flex: 1,
  borderRadius: width / 2
}
const ROW_TEXT: ViewStyle = {
  flexDirection: 'row',
}
const JUSTIFY_BETWEEN: ViewStyle = {
  justifyContent: 'space-between'
}
const RED_DOT: TextStyle = {
  color: color.red,
  paddingTop: 10, paddingLeft: 7.5
}
const PADDING_CHEVRON: TextStyle = { paddingTop: Platform.OS == "ios" ? 2.5 : 7.5, paddingRight: 5, color: color.line }
const PADDING_TOP: ViewStyle = { marginTop: 10 }

const ROOT_FLAT_LIST: ViewStyle = {
  width: '100%',
  height: 60,
  flexDirection: 'row',
  justifyContent: 'center', alignItems: 'center'
}

const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }

const BORDER_BOTTOM: ViewStyle = {
  ...ROOT_FLAT_LIST,
  width: '100%',
  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  borderBottomWidth: 1, borderBottomColor: color.mainGrey, marginHorizontal: 10,
}
const IMAGE_LIST: ImageStyle = {
  // width: 50, height: 50,
  // backgroundColor: color.mainGrey,
  // padding: 10,
  // resizeMode: "cover",
  // aspectRatio: 2 / 2,
  // borderRadius: 30,
  // borderColor: color.primary, borderWidth: 1,
}

const BOTTOM_ROOT: ViewStyle = {
  flexDirection: 'row',
  paddingVertical: spacing[1]
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

export const PostJobScreen = observer(function PostJobScreen() {
  const MAX_LENGTH: number = 120
  const truckIsDump: Array<number> = [15, 23, 24]
  const dump = [{ id: 1, label: 'common.dump', active: true },
  { id: 2, label: 'common.notDump', active: false }]

  const unitRate = [{ id: 1, label: 'common.perBill', active: true },
  { id: 2, label: 'common.perTon', active: false }]
  const { versatileStore, tokenStore } = useStores()
  const navigation = useNavigation()

  const [arrDump, setArrDump] = useState(dump)
  const [arrUnit, setArrUnit] = useState(unitRate)

  console.log("Put Post job value to Form Control :: ", JSON.parse(JSON.stringify(PostJobStore.postjob1)))
  const { control, handleSubmit, errors } = useForm({
    defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : (PostJobStore.postjob1 || {})
  });

  const _setRadioDefault = (item) => {
    let tmp = arrUnit
    tmp.forEach((e, i) => {
      if (e.id == item) e.active = true
      else e.active = false
    })
    setArrUnit(tmp)
  }
  const _setRadioDump = (item: number) => {
    let tmp = arrDump
    tmp.forEach((e, i) => {
      if (e.id == item) e.active = true
      else e.active = false
    })
    setArrDump(tmp)
  }

  const [swipe, setswipe] = useState<boolean>(false)
  useEffect(() => {
    AdvanceSearchStore.getProductTypes()
    let token = tokenStore?.token?.accessToken || null
    if (!token) navigation.navigate("signin")
  }, [])

  useEffect(() => {
    let status_action = JSON.parse(JSON.stringify(StatusStore.status))
    let data_init = JSON.parse(JSON.stringify(PostJobStore.postjob1))
    if (status_action != "add" && data_init && Object.keys(data_init).length != 0) {
      console.log("Data  init On  Edit  Post job : ", data_init)
      _setRadioDefault(data_init["shipping-type"])
      if (data_init['dump-field']) _setRadioDump(data_init['dump-field'])
      control.setValue("dump-field", data_init['dump-field'])
      setTimeout(() => {
        control.setValue("vehicle-type", data_init['vehicle-type'])
        setswipe(!swipe)
      }, 500);
    }
  }, [PostJobStore.postjob1])

  const onSubmit = (data) => {
    __DEV__ && console.tron.log("Data Form Post job 1 : ", data)

    if (!data['vehicle-type']) { AlertForm("postJobScreen.truckType"); return; }
    else if (!data['item-type']) { AlertForm("postJobScreen.productType"); return; }
    PostJobStore.setPostJob(1, data)
    let status_action = JSON.parse(JSON.stringify(StatusStore.status))
    if (status_action == "add")
      navigation.navigate("Home", { screen: "receivePoint" })
    else navigation.navigate("MyJob", { screen: "receivePoint" })
  }

  const _renderSelectedList = (item, section) => {
    return <TouchableOpacity key={"view-list-section-vehicle-type-" + (item?.name || "")} style={ROOT_FLAT_LIST} onPress={() => {
      if (section == 1) navigation.navigate("selectTruckType", {
        selectedItem: [item?.id.toString()], onSubmitVehicle: (val) => _onSubmitVehicle(val)
      })
      else if (section == 2) navigation.navigate("selectProductType", { selectedItem: [item?.id.toString()], onSubmitProductType: (val) => _onSubmitProductType(val) })
    }}>
      <View style={{ ...BORDER_BOTTOM }}>
        <View style={[VIEW_LIST_IMAGE]}>
          {/* {Platform.OS == "ios" ? */}
          <Image source={section == 1 ? images[MapTruckImageName(item?.id)] : images[`${item?.image}`]}
            style={[IMAGE_LIST, { borderRadius: 0, backgroundColor: '#ffff', borderWidth: 0 }]} height={40} width={section == 1 ? 40 : 40}
            resizeMode={section == 1 ? "contain" : "stretch"} />
          {/* : <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[`${item.id}${item.image}`]}
            style={IMAGE_LIST} height={40} width={40} /> */}
        </View>
        <View style={{
          flexDirection: 'row', flex: 1, width: '100%',
          justifyContent: 'space-between'
        }}>
          <View style={{ width: '80%', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 15, marginLeft: 20 }}>{item?.name || ""}</Text>
          </View>

          <Ionicons name="chevron-forward" size={24} style={{}} />
        </View>
      </View>
    </TouchableOpacity>
  }


  const RenderButtonAlert = ({ onConfirmJob, onCloseModal }) => {
    const btnCancleStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.mainGrey, backgroundColor: color.transparent }
    const btnConfirmStyle = { ...BTN_STYLE, borderWidth: 2, borderColor: color.primary, backgroundColor: color.primary }
    return (
      <View style={{ ...BOTTOM_ROOT, paddingVertical: spacing[2] }}>
        <Button
          testID="btn-cancel"
          style={btnCancleStyle}
          textStyle={{ ...CALL_TEXT, color: color.line }}
          text={translate("common.cancel")}
          onPress={() => onCloseModal()}
        />
        <Button
          testID="btn-ok"
          style={btnConfirmStyle}
          textStyle={{ ...CALL_TEXT, color: color.textWhite }}
          text={translate("common.confirm")}
          onPress={() => onConfirmJob()}
        />
      </View>
    )
  }

  const _showDumpField = (truckType: number) => {
    let showDump = false
    if (truckIsDump.find(e => e == truckType)) showDump = true
    return showDump
  }



  const [visible, setvisible] = useState(false)
  const [visible0, setvisible0] = useState(false)
  const _onSubmitVehicle = (params: number) => {
    control.setValue("vehicle-type", params)
    setvisible0(!visible0)
  }
  useEffect(() => {
    _onSubmitVehicle(JSON.parse(JSON.stringify(PostJobStore.vehicle_type)))
  }, [PostJobStore.vehicle_type])

  const _onSubmitProductType = (params: any) => {
    control.setValue("item-type", params)
    setvisible(!visible)
  }

  const list_status = [
    { key: 1, ID: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: true },
    { key: 2, ID: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
    { key: 3, ID: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
    { key: 4, ID: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
  ]

  let multi_select: object, multi_select2: object
  console.log("Multi select Item :: ", multi_select, multi_select2)
  let formControllerValue = control.getValues()

  let dropdown_item_type
  let dropdown_vehicle_type
  if (formControllerValue['item-type']) {
    dropdown_item_type = formControllerValue['item-type']
  }
  if (formControllerValue['vehicle-type']) {
    dropdown_vehicle_type = formControllerValue['vehicle-type']
  }

  let list_product_type_all = JSON.parse(JSON.stringify(AdvanceSearchStore.productTypes))
  let list_product_type = [
    {
      title: 'postJobScreen.allProductType',
      data: []
    }
  ]
  if (list_product_type_all && list_product_type_all.length > 0) {
    list_product_type[0].data = list_product_type_all
  }

  const [visibleModal, setVisibleModal] = useState<boolean>(false)

  const onConfirm = (id: string) => {
    ShipperJobStore.delete(id)
    // navigation.navigate('myJob')
    navigation.goBack()
  }

  const onConfirmJob = (id: string) => {
    onConfirm(id)
    setVisibleModal(false)
  }

  const onCloseModal = () => {
    console.log('onCloseModal')
    setVisibleModal(false)
  }

  const modalProps = {
    containerStyle: {
      paddingTop: spacing[5],
      paddingBottom: spacing[2]
    },
    // imageComponent: onAnimationFinish: () => onAnimationFinish }),
    header: translate('postJobScreen.confirmRemoveJob'),
    headerStyle: {
      paddingTop: spacing[3],
      color: color.primary
    },
    content: translate('postJobScreen.confirmRemoveJob'),
    contentStyle: {
      paddingTop: spacing[1],
      paddingBottom: spacing[5],
      paddingHorizontal: spacing[7],
      color: color.line
    },
    buttonContainerStyle: { width: '90%' },
    buttonComponent: () => <RenderButtonAlert onConfirmJob={() => onConfirmJob(PostJobStore.job_id)} onCloseModal={() => onCloseModal()} />,
    visible: visibleModal,
  }

  console.log("From control :: ", formControllerValue)
  console.log("Error From control :: ", errors)
  console.log("Versatile List : ", JSON.parse(JSON.stringify(versatileStore.list)))

  return (
    <Screen unsafe keyboardOffset="little" preset="scroll" bounch={false}>
      <View testID="PostJobScreen" style={FULL}>
        <View style={TOP_VIEW}>
          <AddJobElement data={list_status} />
        </View>

        <View style={BOTTOM_VIEW}>

          <View style={FULL}>

            <View style={TOP_VIEW_2}>
              <View style={WRAPPER_TOP}>
                <View style={ROW_TEXT}>
                  <Text tx={"postJobScreen.selectVehicleType"} preset={'topic'} style={MARGIN_TOP_BIG} />
                  <Text preset={'topic'} style={RED_DOT}>*</Text>
                </View>

                <View style={[!dropdown_vehicle_type ? { ...WRAP_DROPDOWN, ...PADDING_TOP } : { ...WRAP_DROPDOWN_VALUE }]}>
                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => {
                        navigation.navigate("selectTruckType", {
                          selectedItem: [value], onSubmitVehicle: (val) => _onSubmitVehicle(val)
                        })
                      }}>
                        {!dropdown_vehicle_type && <><Text style={{ padding: Platform.OS == "ios" ? 5 : 10, paddingLeft: 0, color: color.line }} tx={"postJobScreen.pleaseSelectVehicleType"} />
                          <Ionicons name="chevron-forward" size={24} style={PADDING_CHEVRON} /></>}
                        {dropdown_vehicle_type && !!versatileStore.list && _renderSelectedList(JSON.parse(JSON.stringify(versatileStore.list)).find(e => e.id == dropdown_vehicle_type), 1)}
                      </TouchableOpacity>
                    )}
                    key={'controller-dropdown-vehicle-type'}
                    name={"vehicle-type"}
                    rules={{ required: true, pattern: /^\d+$/ }}
                    defaultValue=""
                  />
                </View>
                {errors['vehicle-type'] && (!dropdown_vehicle_type || typeof dropdown_vehicle_type == 'string') && <Text style={{ color: color.red }} tx={"postJobScreen.validateTruckType"} />}

                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputNew
                      key="text-input-car-num"
                      keyboardType="numeric"
                      prefix="postJobScreen.vehicleNum"
                      suffix="profileScreen.unit"
                      // icon="ios-information-circle-outline"
                      underline={_showDumpField(formControllerValue['vehicle-type']) == true ? true : false}
                      inputStyle={{
                        ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD,
                        ...CONTENT_TEXT,
                      }}
                      value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-car-num'}
                  name={"car-num"}
                  rules={{ pattern: /^[0-9]+$/ }}
                  defaultValue=""
                />
                {errors['car-num'] && <Text style={{ color: color.red }} tx={"common.noSignAndCharacter"} />}

                {!!formControllerValue['vehicle-type'] &&
                  _showDumpField(formControllerValue['vehicle-type']) == true && <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <View style={[ROW_TEXT, JUSTIFY_BETWEEN, { marginTop: 20, marginBottom: 10 }]}>
                        <View style={[FULL, { justifyContent: 'center' }]}>
                          <Text tx="postJobScreen.wantTruck" />
                        </View>
                        <View style={FULL}>
                          <RadioButton onPress={(item, index) => {
                            onChange(item.id)
                            let tmp = arrDump
                            tmp.forEach((e, i) => {
                              if (e.id == item.id) e.active = true
                              else e.active = false
                            })
                            setArrDump(tmp)
                          }} data={arrDump}
                            buttonStyle={{ height: 30, padding: 0 }}
                            textStyle={{ lineHeight: 19 }}
                          />
                        </View>
                      </View>
                    )}
                    key={'text-input-dump-field'}
                    name={"dump-field"}
                    defaultValue={1}
                  />}
              </View>
            </View>


            <View style={[TOP_VIEW_2, MARGIN_TOP]}>
              <View style={WRAPPER_TOP}>
                <View style={ROW_TEXT}>
                  <Text tx={"postJobScreen.itemDetail"} preset={'topic'} style={MARGIN_TOP_BIG} />
                  <Text preset={'topic'} style={RED_DOT} >*</Text>
                </View>

                <View style={[PADDING_TOP, !dropdown_item_type ? { ...WRAP_DROPDOWN } : { ...WRAP_DROPDOWN_VALUE }]}>

                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <TouchableOpacity
                        style={[ROW_TEXT, JUSTIFY_BETWEEN]}
                        onPress={() => navigation.navigate("selectProductType", { selectedItem: [value], onSubmitProductType: (val) => _onSubmitProductType(val) })}>
                        {!dropdown_item_type && <>
                          <Text style={{ padding: Platform.OS == "ios" ? 5 : 10, paddingLeft: 0, color: color.line }} tx={"postJobScreen.selectItemType"} />
                          <Ionicons name="chevron-forward" size={24} style={PADDING_CHEVRON} />
                        </>}
                        {dropdown_item_type && !!list_product_type_all && _renderSelectedList(list_product_type_all.find(e => e.id == dropdown_item_type), 2)}

                      </TouchableOpacity>
                    )}
                    key={'controller-dropdown-item-type'}
                    name={"item-type"}
                    rules={{ required: true, pattern: /^[a-zA-Z0-9 .!?"-]+$/ }}
                    defaultValue=""
                  />

                </View>
                {errors['item-type'] && !formControllerValue['item-type'] && <Text style={{ color: color.red }} tx={"postJobScreen.validateProductType"} />}




                <View style={MARGIN_TOP_EXTRA} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputColumn
                      testID={"item-name"}
                      topic={"postJobScreen.productName"}
                      actualPlaceholder="postJobScreen.pleaseInputProductName"
                      underline={true}
                      length={value ? value.length : 0} maxLength={MAX_LENGTH}
                      inputStyle={{
                        ...MARGIN_MEDIUM, ...CONTENT_TEXT,
                        marginBottom: 0, width: '100%', padding: 0,
                      }}
                      value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-item-name'}
                  name={"item-name"}
                  rules={{ required: true }}
                  defaultValue=""
                />
                {errors['item-name'] && !formControllerValue['item-name'] && <Text style={{ color: color.red }} tx={"common.productName"} />}

                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputNew
                      key="text-input-item-weight"
                      keyboardType="numeric"
                      prefix="postJobScreen.weightProduct"
                      suffix="searchJobScreen.ton"
                      // icon="ios-information-circle-outline"
                      underline={false}
                      inputStyle={{
                        ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD,
                        ...CONTENT_TEXT
                      }}
                      value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-item-weight'}
                  name={"item-weight"}
                  keyboardType="numeric"
                  rules={{ pattern: /^[+-]?\d+(\.\d+)?$/ }}
                  defaultValue=""
                />
                {errors['item-weight'] && <Text style={{ color: color.red }} tx={"common.noSignAndCharacter"} />}
              </View>
            </View>


            <View style={[TOP_VIEW_2, MARGIN_TOP]}>
              <View style={WRAPPER_TOP}>

                <View style={[ROW_TEXT]}>
                  <Text tx={"postJobScreen.rateShipping"} preset={'topic'} style={MARGIN_TOP_BIG} />
                  <Text preset={'topic'} style={RED_DOT} >*</Text>
                  {/* <TouchableOpacity onPress={() => { }} style={{ justifyContent: 'center', paddingTop: 7.5 }}>
                    <Ionicons name={"ios-information-circle-outline"} size={18} color={color.primary} />
                  </TouchableOpacity> */}
                </View>
                <View style={ROW_TEXT}>
                  <View style={[FULL, { justifyContent: 'center' }]}>
                    <Controller
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <TextInputNew
                          keyboardType="numeric"
                          prefix="common.price"
                          suffix="common.bath"
                          actualPlaceholder="common.price"
                          underline={false}
                          inputStyle={{
                            ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD,
                            ...CONTENT_TEXT
                          }}
                          value={value} onChangeText={(text) => onChange(text)} />
                      )}
                      key={'text-input-shipping-rate'}
                      name={"shipping-rate"}
                      rules={{ required: true }}
                      defaultValue=""
                    />
                  </View>

                  <View style={[FULL, { justifyContent: 'center' }]}>
                    <Controller
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <RadioButton onPress={(item, index) => {
                          onChange(item.id)
                          let tmp = arrUnit
                          tmp.forEach((e, i) => {
                            if (e.id == item.id) e.active = true
                            else e.active = false
                          })
                          // console.log("TEMP", tmp)
                          setArrUnit(tmp)
                        }}
                          data={arrUnit}
                          buttonStyle={{ height: 30, padding: 0 }}
                          textStyle={{ lineHeight: 19 }}
                        />
                      )}
                      key={'text-input-shipping-type'}
                      name={"shipping-type"}
                      defaultValue={1}
                    />
                  </View>
                </View>
                {errors['shipping-rate'] && !formControllerValue['shipping-rate'] && <Text style={{ color: color.red }} tx={"postJobScreen.inputRateShipping"} />}

              </View>
            </View>



            <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_BIG }}>
              {JSON.parse(JSON.stringify(StatusStore.status)) === 'edit' ? (
                <View style={[WRAPPER_TOP, { flexDirection: 'row' }]}>
                  <Button
                    testID="confirm"
                    style={[BUTTON_CONTAINER, { marginRight: spacing[1], backgroundColor: color.error }]}
                    children={
                      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={[ROUND_BUTTON_TEXT, { color: color.textWhite }]} tx={'common.delete'} />
                      </View>
                    }
                    onPress={() => setVisibleModal(true)}
                  />
                  <Button
                    testID="confirm"
                    style={[BUTTON_CONTAINER, { marginLeft: spacing[1] }]}
                    children={
                      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={ROUND_BUTTON_TEXT} tx={'common.confirm'} />
                      </View>
                    }
                    onPress={handleSubmit(onSubmit)}
                  />
                </View>
              ) : (
                <View style={WRAPPER_TOP}>
                  <RoundedButton onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
                </View>
              )}
            </View>

            <ModalAlert {...modalProps} />

          </View>
        </View>
      </View>
    </Screen>
  )
})


