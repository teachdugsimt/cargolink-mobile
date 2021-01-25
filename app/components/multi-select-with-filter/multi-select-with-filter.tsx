import React, { useState } from 'react'
import { View, ViewStyle, TouchableOpacity } from "react-native"
import { MultiSelector } from '../multi-select/multi-select'
import { FlatGrid } from 'react-native-super-grid';
import { color } from '../../theme'
import { Text } from "../text/text"

const PADDING_TOP: ViewStyle = { marginTop: 10 }

export const MultiSelectWithFilter = (props) => {

    const { reference, listGroup, items, selectedItems, selectText, onSelectedItemsChange, ...rest } = props

    const [filterList, setfilterList] = useState(items)

    const _filterGroupTruck = (item) => {
        __DEV__ && console.tron.log("On Press filter button : ", item)
        if (!filterList || filterList.length < 1) return;
        let tmp_list = filterList.filter(e => e.groupId == item.id)
        setfilterList(tmp_list)
    }

    const _renderGroupTruck = (list) => {
        return <FlatGrid
            itemDimension={100}
            data={list}
            renderItem={({ item }) => (<TouchableOpacity
                style={{ flex: 1, borderColor: color.primary, borderRadius: 15, borderWidth: 1 }}
                onPress={() => _filterGroupTruck(item)}>
                <View style={{ flex: 1, width: '100%', height: 30, justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'center' }}>{item.name}</Text>
                </View>
            </TouchableOpacity>)}
        />
    }

    return (
        <View>
            {listGroup && listGroup.length > 1 && <View>
                {_renderGroupTruck(listGroup)}
            </View>}

            <View style={PADDING_TOP}>

                <MultiSelector
                    {...rest}
                    reference={reference}
                    items={filterList}
                    keyer={"list-vehicle-type-01"}
                    selectedItems={selectedItems}
                    selectText={selectText}
                    onSelectedItemsChange={onSelectedItemsChange}
                />
            </View>
        </View>
    )
}