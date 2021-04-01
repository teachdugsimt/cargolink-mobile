import React from 'react'
import { View, ViewStyle, Dimensions, TouchableOpacity, SectionList, Image, ImageStyle, Platform, TextStyle } from 'react-native'
import { Modal, ModalContent } from 'react-native-modals';
import { Text, MultiSelector } from '../../../components'
import { SafeAreaView } from "react-native-safe-area-context";
import { color, images } from "../../../theme"
import { translate } from "../../../i18n"
import { useStores } from "../../../models/root-store/root-store-context";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation, useRoute } from "@react-navigation/native"
import { MapTruckImageName } from '../../../utils/map-truck-image-name'
import AdvanceSearchStore from '../../../store/shipper-job-store/advance-search-store'

const { width } = Dimensions.get("window")
const PADDING_TOP: ViewStyle = { marginTop: 10 }
const BACK_CHEVRON: ViewStyle = { position: 'absolute', left: 0 }
const FULL: ViewStyle = { flex: 1 }
const HEIGHT_50: ViewStyle = { height: 50 }
const MARGIN_TOP_EXTRA: ViewStyle = { marginTop: 20 }
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
  backgroundColor: color.line, padding: 10,
  resizeMode: "cover",
  aspectRatio: 2 / 2,
  borderRadius: 30,
  borderColor: color.primary, borderWidth: 1,
}
export const SelectProductTypeScreen = () => {
  const navigation = useNavigation()
  const { versatileStore } = useStores()

  const route = useRoute()
  const { selectedItems, onSubmitProductType }: any = route?.params || {}

  const _renderSectionModal = (item: any, index: any) => {

    return <TouchableOpacity key={"view-list-section-vehicle-type-" + item.name + index} style={ROOT_FLAT_LIST} onPress={() => {
      navigation.goBack()
      onSubmitProductType(item.id)
    }}>
      <View style={BORDER_BOTTOM}>
        <View style={VIEW_LIST_IMAGE}>
          {Platform.OS == "ios" ? <Image source={images['greyMock']} style={IMAGE_LIST} height={40} width={40} resizeMode="stretch" /> :
            <Image source={images['greyMock']} style={IMAGE_LIST} height={40} width={40} />}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
          <Text style={{ flex: 1, paddingLeft: 20 }}>{item.name}</Text>
          <Ionicons name="chevron-forward" size={24} style={{ marginRight: 5 }} color={color.line} />
        </View>
      </View>
    </TouchableOpacity>
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

  return (
    <View style={{ flex: 1, height: '100%', justifyContent: 'flex-start', backgroundColor: color.textWhite }}>
      <View style={{ flex: 1, }}>

        <View style={[PADDING_TOP, { paddingHorizontal: 10 }]}>

          {!!list_product_type_all && list_product_type_all.length > 0 && <MultiSelector
            items={list_product_type_all}
            keyer={"list-item-type-01"}
            selectedItems={selectedItems}
            // selectText={translate("postJobScreen.validateProductType")}
            onSelectedItemsChange={(val: any) => {
              onSubmitProductType(val[0])
              navigation.goBack()
              // setvisible(false)
            }}
          />}

        </View>

        <View>
          {!!list_product_type_all && list_product_type_all.length > 0 && <SectionList
            style={{ paddingLeft: 10 }}
            sections={list_product_type}
            keyExtractor={(item, index) => 'section-list-' + item.name + item.id + index}
            renderItem={({ item, index }) => _renderSectionModal(item, index)}
            renderSectionHeader={({ section: { title } }) => (
              <Text tx={title} style={[MARGIN_TOP_EXTRA]} />
            )}
            stickySectionHeadersEnabled={false}
            renderSectionFooter={() => <View style={{ height: 70 }} />}
          />}
        </View>
      </View>

    </View>
  )
}
