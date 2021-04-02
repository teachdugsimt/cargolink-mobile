import React, { useEffect, useState, } from 'react'
import { View, ViewStyle, TouchableOpacity, SectionList, Image, ImageStyle, Platform } from 'react-native'
import { Text, MultiSelector } from '../../../components'
import { color, images } from "../../../theme"
import { translate } from "../../../i18n"
import { useStores } from "../../../models/root-store/root-store-context";
import { FlatGrid } from 'react-native-super-grid';
import { MapTruckImageName } from '../../../utils/map-truck-image-name'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation, useRoute } from "@react-navigation/native"

const PADDING_TOP: ViewStyle = { marginTop: 10 }
const FULL: ViewStyle = { flex: 1 }
const HEIGHT_50: ViewStyle = { height: 50 }
const ROOT_FLAT_LIST: ViewStyle = {
  width: '100%',
  height: 60,
  flexDirection: 'row',
  justifyContent: 'center', alignItems: 'center'
}
const BORDER_BOTTOM: ViewStyle = {
  ...ROOT_FLAT_LIST,
  width: '100%',
  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  borderBottomWidth: 1, borderBottomColor: color.mainGrey, marginHorizontal: 10,
}
const VIEW_LIST_IMAGE: ViewStyle = { alignSelf: 'flex-start', justifyContent: 'center', height: '100%' }
const IMAGE_LIST: ImageStyle = {
  // backgroundColor: color.mainGrey, padding: 10,
  // resizeMode: "cover",
  // aspectRatio: 2 / 2,
  // borderRadius: 30,
  // borderColor: color.primary, borderWidth: 1,
}

interface ModalTruckProps {
  reRender?: () => void
  selectedItems: Array<string>
  onChange?: () => void
  submitVehicleType?: (param: number) => void
}

export const SelectTruckTypeScreen = (props: ModalTruckProps) => {
  const { versatileStore } = useStores()
  const navigation = useNavigation()
  const route = useRoute()

  const { selectedItems, onSubmitVehicle }: any = route?.params || {}

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

  const onTouchOutside = () => {
    navigation.goBack()
    // reRender()
  }

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
      itemDimension={72}
      data={list}
      spacing={8}
      // fixed={true}
      renderItem={({ item }) => (<TouchableOpacity
        style={{ flex: 1, borderColor: color.primary, borderRadius: 16, borderWidth: 1 }}
        onPress={() => _filterGroupTruck(item)}>
        <View style={{ flex: 1, width: '100%', height: 30, justifyContent: 'center' }}>
          <Text style={{ alignSelf: 'center' }}>{item.name == 'รถเทรลเลอร์' ? 'เทรลเลอร์' : item.name}</Text>
        </View>
      </TouchableOpacity>)}
    />
  }

  const _renderSectionModal = (item: any, index: any, section: any) => {
    return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
      onTouchOutside()
      onSubmitVehicle(item.id)
    }}>
      <View style={BORDER_BOTTOM}>
        <View style={VIEW_LIST_IMAGE}>
          {/* {Platform.OS == "ios" ?  */}
          <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={40} width={80} resizeMode={"contain"} />
          {/* : <Image source={section == 1 ? images[MapTruckImageName(item.id)] : images[item.image]} style={IMAGE_LIST} height={40} width={40} /> */}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
          <Text style={{ paddingLeft: 20, maxWidth: '70%' }}>{item.name}</Text>
          <Icon name="chevron-forward" size={28} style={{ marginRight: 5 }} color={color.line} />
        </View>
      </View>
    </TouchableOpacity>
  }


  return (<View style={[FULL, { backgroundColor: color.textWhite }]}>
    <View style={[{ height: 160 }, { paddingHorizontal: 10 }]}>

      <View style={PADDING_TOP}>
        {!!defaultVehicleType && defaultVehicleType.length > 0 && <MultiSelector
          items={vehicleType && vehicleType.length > 0 ? vehicleType : defaultVehicleType}
          selectedItems={selectedItems}
          // selectText={translate("postJobScreen.pleaseSelectVehicleType")}
          onSelectedItemsChange={(val: any) => {
            onSubmitVehicle(val[0])
            _closeTruckType()
          }}
        />}
      </View>

      {listGroup && listGroup.length > 1 && <View>
        {_renderGroupTruck(listGroup)}
      </View>}
    </View>

    <View style={[FULL]}>
      <SectionList
        style={{ zIndex: 5, paddingLeft: 10 }}
        sections={sectionTruckType}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => 'section-list-' + (item.name || item.title) + index}
        renderItem={({ item, index }) => _renderSectionModal(item, index, 1)}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={PADDING_TOP} >{title}</Text>
        )}
        ListFooterComponent={
          <View style={HEIGHT_50}></View>
        }
      />
    </View>
  </View>)
}
