import React, { useEffect, useState, } from 'react'
import { View, ViewStyle, Dimensions, TouchableOpacity, SectionList, Image, ImageStyle, Platform, TextStyle } from 'react-native'
import { Modal, ModalContent } from 'react-native-modals';
import { Text } from '../text/text'
import { SafeAreaView } from "react-native-safe-area-context";
import { color, images } from "../../theme"
import { translate } from "../../i18n"
import { useStores } from "../../models/root-store/root-store-context";
import { MultiSelector } from '../multi-select/multi-select'
import { FlatGrid } from 'react-native-super-grid';
import { MapTruckImageName } from '../../utils/map-truck-image-name'
import { ModalTruckProps } from './modal-truck.props'
import Icon from 'react-native-vector-icons/Ionicons'

const { width } = Dimensions.get("window")
const COLOR_PRIMARY: TextStyle = { color: color.primary }
const PADDING_TOP: ViewStyle = { marginTop: 10 }
const FULL: ViewStyle = { flex: 1 }
const HEIGHT_50: ViewStyle = { height: 50 }
const ROOT_MODAL_VIEW: ViewStyle = { width: (width / 1.1), height: '100%', justifyContent: 'flex-start' }
const ROOT_FLAT_LIST: ViewStyle = {
  width: '98%',
  height: 100,
  flexDirection: 'row',
  justifyContent: 'center', alignItems: 'center'
}
const BACK_CHEVRON: ViewStyle = { position: 'absolute', left: 0 }
const BORDER_BOTTOM: ViewStyle = {
  ...ROOT_FLAT_LIST,
  width: '100%',
  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  borderBottomWidth: 1, borderBottomColor: color.line, marginHorizontal: 10,
}
const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }
const VIEW_TITLE_MODAL: ViewStyle = { height: 60, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }
const IMAGE_LIST: ImageStyle = {
  // width: 50, height: 50,
  backgroundColor: color.line, padding: 10,
  resizeMode: "cover",
  aspectRatio: 2 / 2,
  borderRadius: 30,
  borderColor: color.primary, borderWidth: 2,
}

export const ModalTruckType = (props: ModalTruckProps) => {
  const { versatileStore } = useStores()
  const { visible, onTouchOutside, selectedItems, onChange } = props

  let defaultVehicleType = JSON.parse(JSON.stringify(versatileStore.list))
  const listGroup = JSON.parse(JSON.stringify(versatileStore.listGroup))

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
    onTouchOutside()
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
  const _renderSectionModal = (item: any, index: any, onChange: any, section: any) => {
    return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
      onTouchOutside()
      onChange(item.id)
    }}>
      <View style={BORDER_BOTTOM}>
        <View style={VIEW_LIST_IMAGE}>
          {Platform.OS == "ios" ? <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} resizeMode={"contain"} /> :
            <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={60} width={60} />}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
          <Text style={{ paddingLeft: 40, maxWidth: '70%' }}>{item.name}</Text>
          <Icon name="chevron-forward" size={28} style={{ marginRight: 5 }} color={color.line}/>
        </View>
      </View>
    </TouchableOpacity>
  }


  return (<Modal
    id="modal-truck-type"
    visible={visible}
    onTouchOutside={() => _closeTruckType()}
    onSwipeOut={() => _closeTruckType()}
  // swipeDirection={['up', 'down']} // can be string or an array
  // swipeThreshold={200} // default 100
  >
    <ModalContent >
      <View style={ROOT_MODAL_VIEW}>
        <SafeAreaView style={FULL}>
          <View style={VIEW_TITLE_MODAL}>
            <TouchableOpacity style={BACK_CHEVRON} onPress={_closeTruckType}>
              <Icon name="chevron-back" size={28} color={color.primary} />
            </TouchableOpacity>
            <Text style={COLOR_PRIMARY} preset={"topic"} tx={"postJobScreen.selectVehicleType"} />
          </View>


          <View style={PADDING_TOP}>
            {!!defaultVehicleType && defaultVehicleType.length > 0 && <MultiSelector
              items={vehicleType && vehicleType.length > 0 ? vehicleType : defaultVehicleType}
              selectedItems={selectedItems}
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

          <View style={FULL}>

            <SectionList
              style={{ zIndex: 5 }}
              sections={sectionTruckType}
              stickySectionHeadersEnabled={false}
              keyExtractor={(item, index) => 'section-list-' + (item.name || item.title) + index}
              renderItem={({ item, index }) => _renderSectionModal(item, index, onChange, 1)}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={PADDING_TOP} >{title}</Text>
              )}
              ListFooterComponent={
                <View style={HEIGHT_50}></View>
              }
            />

          </View>

        </SafeAreaView>

      </View>
    </ModalContent>
  </Modal>)
}
