import React from 'react'
import { Dimensions } from 'react-native'
import MultiSelect from 'react-native-multiple-select';
import { translate } from "../../i18n"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { color } from "../../theme"

const { width, height } = Dimensions.get("window")
export const MultiSelector = (props) => {
    const { onSelectedItemsChange, items, searchIcon, selectText, selectedItems,
        searchInputPlaceholderText, uniqueKey, keyer, ...rest } = props

    return (
        <MultiSelect
            {...rest}
            key={keyer}
            hideTags
            items={items}
            uniqueKey={uniqueKey ? uniqueKey : 'id'}
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText={selectText ? selectText : translate("postJobScreen.pleaseSelectVehicleType")}
            searchIcon={searchIcon ? searchIcon : <Ionicons name="search-outline" size={20} color={color.primary} />}
            hideSubmitButton={true}
            single={true}
            searchInputPlaceholderText={searchInputPlaceholderText ? searchInputPlaceholderText : translate("common.search")}
            onChangeInput={(text) => console.log(text)}

            styleListContainer={{ maxHeight: height - width / 2 }}

            styleTextDropdown={{ fontFamily: 'Kanit-Medium' }}
            styleTextDropdownSelected={{ fontFamily: 'Kanit-Medium' }}
            altFontFamily="Kanit-Medium"
            fontFamily="Kanit-Medium"
            selectedItemFontFamily="Kanit-Medium"
            itemFontFamily="Kanit-Medium"

            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
        />
    )
}








// *** VEHICLE TYPE
{/* <MultiSelect
   key={"list-vehicle-01"}
   hideTags
   items={list_vehicle}
   uniqueKey="id"
   ref={(component) => { multi_select = component }}
   onSelectedItemsChange={(val) => {
       onChange(val[0])
       setvisible0(false)
   }}
   selectedItems={[value]}
   selectText={translate("postJobScreen.pleaseSelectVehicleType")}
   searchIcon={<Ionicons name="search-outline" size={20} color={color.primary} />}
   hideSubmitButton={true}
   single={true}
   searchInputPlaceholderText={translate("common.search")}
   onChangeInput={(text) => console.log(text)}
   styleListContainer={{ maxHeight: height - width / 2 }}
   styleTextDropdown={{ fontFamily: 'Kanit-Medium' }}
   styleTextDropdownSelected={{ fontFamily: 'Kanit-Medium' }}
   altFontFamily="Kanit-Medium"
   fontFamily="Kanit-Medium"
   selectedItemFontFamily="Kanit-Medium"
   itemFontFamily="Kanit-Medium"
   tagRemoveIconColor="#CCC"
   tagBorderColor="#CCC"
   tagTextColor="#CCC"
   selectedItemTextColor="#CCC"
   selectedItemIconColor="#CCC"
   itemTextColor="#000"
   displayKey="name"
   searchInputStyle={{ color: '#CCC' }}
    // submitButtonColor="#CCC"
    // submitButtonText="Submit"
    /> */}



// *** ITEM TYPE 
{/* <MultiSelect
key={"list-vehicle-01"}
hideTags
items={list_product_type[0].data}
uniqueKey="id"
ref={(component) => { multi_select2 = component }}
onSelectedItemsChange={(val) => {
    onChange(val[0])
    setvisible(false)
}}
selectedItems={[value]}
selectText={translate("postJobScreen.pleaseSelectVehicleType")}
searchIcon={<Ionicons name="search-outline" size={20} color={color.primary} />}
hideSubmitButton={true}
single={true}
searchInputPlaceholderText={translate("common.search")}
onChangeInput={(text) => console.log(text)}

styleListContainer={{ maxHeight: height - width / 2 }}

styleTextDropdown={{ fontFamily: 'Kanit-Medium' }}
styleTextDropdownSelected={{ fontFamily: 'Kanit-Medium' }}
altFontFamily="Kanit-Medium"
fontFamily="Kanit-Medium"
selectedItemFontFamily="Kanit-Medium"
itemFontFamily="Kanit-Medium"

tagRemoveIconColor="#CCC"
tagBorderColor="#CCC"
tagTextColor="#CCC"
selectedItemTextColor="#CCC"
selectedItemIconColor="#CCC"
itemTextColor="#000"
displayKey="name"
searchInputStyle={{ color: '#CCC' }}
/> */}