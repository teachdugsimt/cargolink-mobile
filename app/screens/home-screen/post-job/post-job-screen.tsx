import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Dimensions, Platform, ImageStyle, Image, SectionList, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form";
import { observer } from "mobx-react-lite"
import { translate } from "../../../i18n"
import { Text, AddJobElement, TextInputTheme, RoundedButton, MultiSelector, ModalTruckType } from '../../../components'
import PostJobStore from '../../../store/post-job-store/post-job-store'
import AdvanceSearchStore from '../../../store/shipper-job-store/advance-search-store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color, typography, images } from "../../../theme"
import { Modal, ModalContent } from 'react-native-modals';
import { MapTruckImageName } from '../../../utils/map-truck-image-name'
import { AlertForm } from '../../../utils/alert-form'
import { useStores } from "../../../models/root-store/root-store-context";
import StatusStore from '../../../store/post-job-store/job-status-store'
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window")
const FULL: ViewStyle = { flex: 1 }

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

const BORDER_GREY: ViewStyle = {
  borderColor: color.line, borderWidth: 1
}

const WRAP_DROPDOWN_VALUE: ViewStyle = {
  flex: 1, padding: Platform.OS == "ios" ? 7.5 : 0,
  borderRadius: 2.5
}
const WRAP_DROPDOWN: ViewStyle = {
  ...BORDER_GREY,
  ...WRAP_DROPDOWN_VALUE
}

const CONTENT_TEXT: TextStyle = {
  fontFamily: 'Kanit-Medium',
  color: color.black,
  fontSize: typography.title
}
const MARGIN_TOP: ViewStyle = { marginTop: 5 }

const MARGIN_TOP_BIG: ViewStyle = { marginTop: 10 }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
const LAYOUT_REGISTRATION_FIELD: TextStyle = {
  textAlign: 'right', paddingRight: 10,
}
const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.primary, borderColor: color.transparent
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.textWhite
}
const MARGIN_MEDIUM: ViewStyle = {
  marginVertical: 10
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
const PADDING_CHEVRON: ViewStyle = { paddingTop: Platform.OS == "ios" ? 2.5 : 7.5, paddingRight: 5 }
const PADDING_TOP: ViewStyle = { marginTop: 10 }

const ROOT_FLAT_LIST: ViewStyle = {
  width: '98%',
  height: 100,
  flexDirection: 'row',
  justifyContent: 'center', alignItems: 'center'
}

const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }

const BORDER_BOTTOM: ViewStyle = {
  ...ROOT_FLAT_LIST,
  width: '100%',
  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  borderBottomWidth: 1, borderBottomColor: color.line, marginHorizontal: 10,
}
const IMAGE_LIST: ImageStyle = {
  // width: 50, height: 50,
  backgroundColor: color.line, padding: 10,
  resizeMode: "cover",
  aspectRatio: 2 / 2,
  borderRadius: 30,
  borderColor: color.primary, borderWidth: 2,
}

export const PostJobScreen = observer(function PostJobScreen() {
  const { versatileStore, tokenStore } = useStores()
  const navigation = useNavigation()

  const { control, handleSubmit, errors } = useForm({
    defaultValues: StatusStore.status && JSON.parse(JSON.stringify(StatusStore.status)) == "add" ? {} : {}
  });

  useEffect(() => {
    let token = tokenStore?.token?.accessToken || null
    if (!token) navigation.navigate("signin")
    else AdvanceSearchStore.getProductTypes()
  }, [])

  const onSubmit = (data) => {
    __DEV__ && console.tron.log("Data Form Post job 1 : ", data)

    if (!data['vehicle-type']) { AlertForm("postJobScreen.truckType"); return; }
    else if (!data['item-type']) { AlertForm("postJobScreen.productType"); return; }
    PostJobStore.setPostJob(1, data)
    navigation.navigate("receivePoint")
  }

  const _renderSectionModal = (item: any, index: any, onChange: any, section: any) => {
    return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
      if (section == 1) setvisible0(false)
      else if (section == 2) setvisible(false)
      onChange(item.id)
    }}>
      <View style={BORDER_BOTTOM}>
        <View style={VIEW_LIST_IMAGE}>
          {Platform.OS == "ios" ? <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
            <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} />}
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text style={{ paddingLeft: 40 }}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  }

  const _renderSelectedList = (item, section) => {
    __DEV__ && console.tron.log('Item :: ', item)
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



  const [visible, setvisible] = useState(false)
  const [visible0, setvisible0] = useState(false)
  const list_status = [
    { key: 1, ID: 1, no: 1, id: 1, name: 'postJobScreen.vehicleDetailAndProduct', active: true },
    { key: 2, ID: 2, no: 2, id: 2, name: 'postJobScreen.getProductLocation', active: false },
    { key: 3, ID: 3, no: 3, id: 3, name: 'postJobScreen.checkInformation', active: false },
    { key: 4, ID: 4, no: 4, id: 4, name: 'postJobScreen.success', active: false },
  ]

  const list_product_type = [
    {
      title: 'postJobScreen.popular',
      data: [{ id: 1, name: 'วัสดุก่อสร้าง', image: 'greyMock' },
      { id: 2, name: 'สินค้าเกษตร', image: 'greyMock' },
      { id: 3, name: 'อาหาร และสินค้าบริโภค', image: 'greyMock' }]
    }
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
  __DEV__ && console.tron.log("Form Value :: ", formControllerValue)





  return (
    <View testID="PostJobScreen" style={FULL}>
      <View style={TOP_VIEW}>
        <AddJobElement data={list_status} />
      </View>

      <View style={BOTTOM_VIEW}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? 'padding' : 'padding'} keyboardVerticalOffset={Platform.OS == "ios" ? 100 : 0} style={{ flex: 1 }}>
          <ScrollView style={FULL}>

            <View style={TOP_VIEW_2}>
              <View style={WRAPPER_TOP}>
                <View style={ROW_TEXT}>
                  <Text tx={"postJobScreen.selectVehicleType"} preset={'topic'} style={MARGIN_TOP_BIG} />
                  <Text preset={'topic'} style={RED_DOT}>*</Text>
                </View>

                <View style={[PADDING_TOP, !dropdown_vehicle_type ? { ...WRAP_DROPDOWN } : { ...WRAP_DROPDOWN_VALUE }]}>



                  <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible0(true)}>
                    {!dropdown_vehicle_type && <><Text style={{ padding: Platform.OS == "ios" ? 5 : 10 }} tx={"postJobScreen.pleaseSelectVehicleType"} />
                      <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} /></>}
                    {dropdown_vehicle_type && !!versatileStore.list && _renderSelectedList(JSON.parse(JSON.stringify(versatileStore.list)).find(e => e.id == dropdown_vehicle_type), 1)}

                  </TouchableOpacity>

                  <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <ModalTruckType
                        visible={visible0}
                        onTouchOutside={() => setvisible0(false)}
                        selectedItems={[value]}
                        onChange={onChange}
                      />
                    )}
                    key={'controller-dropdown-vehicle-type'}
                    name={"vehicle-type"}
                    rules={{ required: true, pattern: /^[a-zA-Z0-9 .!?"-]+$/ }}
                    defaultValue=""
                  />
                </View>
                {errors['vehicle-type'] && <Text style={{ color: color.red }} tx={"postJobScreen.validateTruckType"} />}


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
                  rules={{ pattern: /^[0-9]+$/ }}
                  defaultValue=""
                />
                {errors['car-num'] && <Text style={{ color: color.red }} tx={"common.noSignAndCharacter"} />}
              </View>
            </View>








            <View style={[TOP_VIEW_2, MARGIN_TOP]}>
              <View style={WRAPPER_TOP}>
                <View style={ROW_TEXT}>
                  <Text tx={"postJobScreen.itemDetail"} preset={'topic'} style={MARGIN_TOP_BIG} />
                  <Text preset={'topic'} style={RED_DOT} >*</Text>
                </View>







                <View style={[PADDING_TOP, !dropdown_item_type ? { ...WRAP_DROPDOWN } : { ...WRAP_DROPDOWN_VALUE }]}>

                  <TouchableOpacity style={[ROW_TEXT, JUSTIFY_BETWEEN]} onPress={() => setvisible(true)}>
                    {!dropdown_item_type && <><Text style={{ padding: Platform.OS == "ios" ? 5 : 10 }} tx={"postJobScreen.selectItemType"} />
                      <Ionicons name="chevron-down" size={24} style={PADDING_CHEVRON} />
                    </>}
                    {dropdown_item_type && !!list_product_type_all && _renderSelectedList(list_product_type_all.find(e => e.id == dropdown_item_type), 2)}

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
                                <Text style={{ color: color.primary }} preset={"topic"} tx={"postJobScreen.selectItemType"} />
                              </View>

                              <View style={[PADDING_TOP]}>

                                {!!list_product_type_all && list_product_type_all.length > 0 && <MultiSelector
                                  items={list_product_type_all}
                                  keyer={"list-item-type-01"}
                                  selectedItems={[value]}
                                  selectText={translate("postJobScreen.validateProductType")}
                                  onSelectedItemsChange={(val: any) => {
                                    onChange(val[0])
                                    setvisible(false)
                                  }}
                                />}

                              </View>

                              <View>
                                {!!list_product_type_all && list_product_type_all.length > 0 && <SectionList
                                  sections={list_product_type}
                                  keyExtractor={(item, index) => 'section-list-' + item.name + item.id + index}
                                  renderItem={({ item, index }) => _renderSectionModal(item, index, onChange, 2)}
                                  renderSectionHeader={({ section: { title } }) => (
                                    <Text tx={title} style={PADDING_TOP} />
                                  )}
                                />}
                              </View>
                            </SafeAreaView>

                          </View>
                        </ModalContent>
                      </Modal>


                    )}
                    key={'controller-dropdown-item-type'}
                    name={"item-type"}
                    rules={{ required: true, pattern: /^[a-zA-Z0-9 .!?"-]+$/ }}
                    defaultValue=""
                  />

                </View>
                {errors['item-type'] && <Text style={{ color: color.red }} tx={"postJobScreen.validateProductType"} />}





                <Text tx={"postJobScreen.inputYourItem"} style={{ ...CONTENT_TEXT, ...MARGIN_TOP_EXTRA }} />
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInputTheme
                      testID={"item-name"}
                      inputStyle={{ ...MARGIN_MEDIUM, ...LAYOUT_REGISTRATION_FIELD, ...CONTENT_TEXT }} value={value} onChangeText={(text) => onChange(text)} />
                  )}
                  key={'text-input-item-name'}
                  name={"item-name"}
                  defaultValue=""
                />

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
                  keyboardType="numeric"
                  rules={{ pattern: /^[+-]?\d+(\.\d+)?$/ }}
                  defaultValue=""
                />
                {errors['item-weight'] && <Text style={{ color: color.red }} tx={"common.noSignAndCharacter"} />}
              </View>
            </View>



            <View style={{ ...TOP_VIEW_2, ...MARGIN_TOP_EXTRA }}>
              <View style={WRAPPER_TOP}>
                <RoundedButton onPress={handleSubmit(onSubmit)} text={"common.confirm"} containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT} />
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View >
  )
})


