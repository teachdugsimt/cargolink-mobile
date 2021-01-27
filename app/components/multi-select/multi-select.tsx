import React from 'react'
import { Dimensions } from 'react-native'
// import MultiSelect from 'react-native-multiple-select';
import MultiSelect from '../multi-select-dropdown/react-native-multi-select'
import { translate } from "../../i18n"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color } from "../../theme"

const { width, height } = Dimensions.get("window")
let multiSelect
export const MultiSelector = (props) => {
  const { onSelectedItemsChange, items, searchIcon, selectText, selectedItems,
    searchInputPlaceholderText, uniqueKey, ...rest } = props

  return (
    <MultiSelect
      {...rest}
      // ref={(component) => multiSelect = component}
      // key={keyer}
      hideTags
      items={items}
      uniqueKey={uniqueKey ? uniqueKey : 'id'}
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItems}
      selectText={selectText ? selectText : translate("postJobScreen.pleaseSelectVehicleType")}
      searchIcon={searchIcon ? searchIcon : <Ionicons name="search-outline" size={20} color={color.primary} style={{ paddingRight: 7.5 }} />}
      hideSubmitButton={true}
      single={true}
      searchInputPlaceholderText={searchInputPlaceholderText ? searchInputPlaceholderText : translate("common.search")}
      onChangeInput={(text) => console.log(text)}

      styleListContainer={{ maxHeight: height - width / 2 }}

      styleTextDropdown={{ fontFamily: 'Kanit-Medium' }}
      styleTextDropdownSelected={{ fontFamily: 'Kanit-Medium', color: color.black }}
      altFontFamily="Kanit-Medium"
      fontFamily="Kanit-Medium"
      selectedItemFontFamily="Kanit-Medium"
      itemFontFamily="Kanit-Medium"

      textColor="black"
      tagRemoveIconColor="#CCC"       // don't this
      tagBorderColor="#CCC"
      tagTextColor="#CCC"
      selectedItemTextColor="#CCC"
      selectedItemIconColor="#CCC"    // don't this
      itemTextColor="#000"
      displayKey="name"
      searchInputStyle={{ color: '#CCC' }}
    />
  )
}
