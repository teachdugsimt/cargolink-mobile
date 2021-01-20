import React, { useState, ReactElement, useLayoutEffect, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Checkbox, HeaderCenter, Text, CollapsibleList, ModalLoading, HeaderLeft } from '../../components'
import { color, spacing } from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import AdvanceSearchJobStore from "../../store/shipper-truck-store/advance-search-store"
import { translate } from '../../i18n'

const deviceWidht = Dimensions.get('window').width / 2
const marginPercent = 1

const CONTAINER: ViewStyle = {
    flex: 1,
    backgroundColor: color.backgroundWhite
}
const SEARCH_ITEM_ROOT: ViewStyle = {
    flex: 5,
    // backgroundColor: "lightblue",
    borderWidth: 1,
    borderColor: color.line,
}
const ITEM: ViewStyle = {
    borderBottomColor: color.line,
    borderBottomWidth: 1,
    paddingTop: spacing[2],
}
const SUB_MENU: ViewStyle = {
    flexDirection: 'row',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: spacing[3]
}
const ITEM_SUB_MENU: ViewStyle = {
    backgroundColor: color.transparent,
    borderWidth: 1,
    borderRadius: deviceWidht,
    marginVertical: spacing[1],
    marginHorizontal: `${marginPercent}%`,
}
const TOPIC: TextStyle = {
    fontSize: 12,
}
const CONTENT: TextStyle = {
    color: color.dim,
}
const ROW: ViewStyle = {
    alignItems: "center",
    flexDirection: 'row',
}
const BUTTON_ROOT: ViewStyle = {
    flex: 1,
    // backgroundColor: 'lightgreen',
    justifyContent: "center",
    alignItems: 'center'
}
const BUTTON_CONFIRM: ViewStyle = {
    backgroundColor: color.primary,
    width: '90%',
    borderRadius: deviceWidht,
}
const BUTTON_CONFIRM_TEXT: TextStyle = {
    color: color.textWhite,
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5
}

const initialState = {
    // settings: MENUS,
    truckTypes: [],
    truckAmount: 0,
    productType: [],
    truckWeight: 0,
}

export const AdvanceSearchTruckScreen = observer(function AdvanceSearchTruckScreen() {
    const navigation = useNavigation()

    const [state, setState] = useState(initialState)

    useEffect(() => {
        // AdvanceSearchJobStore.mapMenu()
        if (!AdvanceSearchJobStore.menu || !AdvanceSearchJobStore.menu.length) {
            AdvanceSearchJobStore.mapMenu()
        }
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <HeaderLeft onLeftPress={() => onConfirm()} />,
            headerRight: () => <TouchableOpacity onPress={() => AdvanceSearchJobStore.clearMenu()}><Text tx={"searchJobScreen.clear"} /></TouchableOpacity>,
        })
    }, [navigation]);

    const onClick = (id: number, isChecked: boolean) => {
        const newMenu = AdvanceSearchJobStore.menu.map(menu => {
            if (menu.id !== id || !menu.isMultiSelect) return menu
            const subMenu = menu.subMenu && menu.subMenu.length ? menu.subMenu.map(item => {
                if (item?.subMenu?.length) {
                    const childOfSubMenu = item.subMenu.map(attr => {
                        return { ...attr, isChecked: !isChecked }
                    })
                    return { ...item, subMenu: childOfSubMenu }
                } else {
                    return { ...item, isChecked: !isChecked }
                }
            }) : []
            return { ...menu, isChecked: !isChecked, subMenu }
        })
        AdvanceSearchJobStore.mapMenu(newMenu)
    }

    const onConfirm = () => {
        const arrChildOfSubMenu = []
        const resultMapFilter = AdvanceSearchJobStore.menu.map(menu => {
            const filterSelected = menu.subMenu.filter(subMenu => {
                if (subMenu?.subMenu?.length) {
                    const res = subMenu.subMenu.filter(sub => sub.isChecked)
                    arrChildOfSubMenu.push(...res)
                    return false;
                }
                return subMenu.isChecked
            })
            const result = [...filterSelected, ...arrChildOfSubMenu].map(val => val.value)
            if (menu.type === 'truckAmount' && menu.isChecked) {
                const numbs = JSON.parse(JSON.stringify(result[0]))
                return {
                    [`${menu.type}Min`]: Math.min(...numbs),
                    [`${menu.type}Max`]: Math.max(...numbs),
                }
            }
            return {
                [menu.type]: menu.isMultiSelect ? result : result[0]
            }
        })
        let attrFilterToObject = {}
        for (const attr of resultMapFilter) {
            attrFilterToObject = { ...attrFilterToObject, ...attr }
        }
        AdvanceSearchJobStore.setFilter({ ...AdvanceSearchJobStore.filter, ...attrFilterToObject })
        navigation.navigate("searchTruck")
    }

    const onSelect = (subId: number, mainId: number, isChecked: boolean, isMultiSelect: boolean) => {
        let newMenu = null
        let settings = JSON.parse(JSON.stringify(AdvanceSearchJobStore.menu))
        // let settings = AdvanceSearchJobStore.menu
        if (!isMultiSelect) {
            const indexMainId = mainId - 1
            const newSubMenu = settings[indexMainId].subMenu.map(menu => ({ ...menu, isChecked: menu.id === subId ? !isChecked : false }))

            delete settings[indexMainId].subMenu
            settings[indexMainId].isChecked = !isChecked
            settings[indexMainId].subMenu = newSubMenu

            newMenu = [...settings]
        } else {
            newMenu = settings.map(menu => {
                if (menu.id !== mainId) return menu
                const subMenu = menu.subMenu && menu.subMenu.length ? menu.subMenu.map(item => {
                    if (item?.subMenu?.length) {
                        const childOfSubMenu = item.subMenu.map(attr => {
                            if (attr.id !== subId) return attr
                            return { ...attr, isChecked: !isChecked }
                        })
                        return { ...item, subMenu: childOfSubMenu }
                    }
                    if (item.id !== subId) return item
                    return { ...item, isChecked: !isChecked }
                }) : []
                const unCheckedAll = subMenu.filter(({ isChecked, subMenu: childOfSubMenu }) => {
                    if (childOfSubMenu?.length) {
                        const childUnCheckAll = childOfSubMenu.filter(({ isChecked: subChecked }) => subChecked)
                        return !!childUnCheckAll.length
                    }
                    return isChecked
                })
                return { ...menu, isChecked: !!unCheckedAll.length, subMenu }
            })
        }

        AdvanceSearchJobStore.mapMenu(newMenu)
    }

    const SubMenu = ({ id, label, isChecked, mainIndex, percentWidth, isMultiSelect }): ReactElement => {

        return (<Button
            key={id}
            text={label}
            style={{
                ...ITEM_SUB_MENU,
                borderColor: isChecked === true ? color.primary : color.line,
                flexBasis: `${percentWidth}%`,
            }}
            textStyle={{
                color: color.textBlack,
                fontSize: 12
            }}
            onPress={() => onSelect(id, mainIndex, isChecked, isMultiSelect)}
        />)
    }

    return (
        <View style={CONTAINER}>
            {AdvanceSearchJobStore.loading && <ModalLoading size={'large'} color={color.primary} visible={AdvanceSearchJobStore.loading} />}
            <View style={SEARCH_ITEM_ROOT}>
                <ScrollView style={{ padding: spacing[3] }}>

                    {
                        AdvanceSearchJobStore.menu && !!AdvanceSearchJobStore.menu.length && AdvanceSearchJobStore.menu.map((menu, index) => {
                            return (
                                <View style={ITEM} key={index} >
                                    <View style={ROW}>
                                        <Checkbox value={menu.isChecked} onToggle={() => onClick(menu.id, menu.isChecked)} />
                                        <Text text={menu.topic} style={CONTENT} onPress={() => onClick(menu.id, menu.isChecked)} />
                                    </View>
                                    <View style={SUB_MENU}>
                                        {
                                            menu.subMenu && menu.subMenu.map((subMenu, i) => {
                                                const percentWidth = (100 - (menu.showSubColumn * (marginPercent * 2))) / menu.showSubColumn
                                                if (subMenu?.subMenu?.length) {
                                                    return (
                                                        <View key={i}>
                                                            <Text text={subMenu.name} style={{ color: color.line }} />
                                                            <View style={[SUB_MENU, { paddingVertical: spacing[1] }]}>
                                                                {subMenu.subMenu.map(childOfSubMenu => {
                                                                    const { id, name, isChecked } = childOfSubMenu
                                                                    return (
                                                                        <SubMenu key={id} id={id} label={name} isChecked={isChecked} mainIndex={menu.id} percentWidth={percentWidth} isMultiSelect={menu.isMultiSelect} />
                                                                    )
                                                                })}
                                                            </View>
                                                        </View>
                                                    )
                                                } else {
                                                    const { id, name, isChecked } = subMenu
                                                    return (
                                                        <SubMenu key={id} id={id} label={name} isChecked={isChecked} mainIndex={menu.id} percentWidth={percentWidth} isMultiSelect={menu.isMultiSelect} />
                                                    )
                                                }

                                            })
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }

                </ScrollView>
            </View>

            <View style={BUTTON_ROOT}>
                <Button
                    testID="setting-search-confirm"
                    style={BUTTON_CONFIRM}
                    textStyle={BUTTON_CONFIRM_TEXT}
                    text={'ยืนยัน'}
                    onPress={onConfirm}
                />
            </View>
        </View>
    )
})
