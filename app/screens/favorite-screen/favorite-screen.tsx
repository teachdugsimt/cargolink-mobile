import React, { useCallback, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, FlatList, RefreshControl } from "react-native"
import { observer } from "mobx-react-lite"
import { ModalLoading, SearchItem, SearchItemTruck, Text } from "../../components"
import { color, spacing, images as imageComponent } from "../../theme"
import FavoriteTruckStore from "../../store/shipper-truck-store/favorite-truck-store"
import ShipperTruckStore from "../../store/shipper-truck-store/shipper-truck-store"
import FavoriteJobStore from "../../store/carriers-job-store/favorite-job-store"
import CarriersJobStore from "../../store/carriers-job-store/carriers-job-store"
import TruckTypeStore from "../../store/truck-type-store/truck-type-store"
import Feather from 'react-native-vector-icons/Feather'
import { GetTruckType } from "../../utils/get-truck-type"
import { translate } from "../../i18n"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { GetRegion } from "../../utils/get-region"
import i18n from "i18n-js"
import { MapTruckImageName } from "../../utils/map-truck-image-name"

// interface STATE {
//     isHeaderSwitch: boolean

// }

const FULL: ViewStyle = { flex: 1 }
const HEADER: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: color.primary,
}
const HEADER_ACTIVE: ViewStyle = {
    borderBottomWidth: 2,
    borderBottomColor: color.textBlack,
}
const BORDER_RADIUS_LEFT: ViewStyle = {
    borderTopLeftRadius: spacing[1],
    borderBottomLeftRadius: spacing[1],
}
const BORDER_RADIUS_RIGHT: ViewStyle = {
    borderTopRightRadius: spacing[1],
    borderBottomRightRadius: spacing[1],
}
const TOUCHABLE_VIEW: ViewStyle = {
    flex: 1,
    alignItems: 'center',
}
const TEXT: TextStyle = {
    color: color.textBlack,
}
const ACTIVITY: ViewStyle = {
    flexDirection: 'row',
    marginVertical: spacing[4],
    marginHorizontal: spacing[3],
    borderRadius: spacing[2],
}
const ACTIVITY_TEXT_VIEW: TextStyle = {
    ...TEXT,
    paddingVertical: spacing[2],
}
const RESULT_CONTAINER: ViewStyle = {
    flex: 1,
}
const CONTEXT_NOT_FOUND: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -spacing[5],
}
const NOT_FOUND_TEXT: TextStyle = {
    color: color.line,
}

// const initialState = {
//     isHeaderSwitch: false
// }

const JobItem = (data) => {
    const {
        id,
        productTypeId,
        productName,
        truckType,
        requiredTruckAmount,
        from,
        to,
        owner,
        isLiked,
        list,
        setUnFollow
    } = data

    const navigation = useNavigation()

    const onPress = () => {
        CarriersJobStore.findOne(id)
        navigation.navigate('favoriteJobDetail')
    }

    const onToggleHeart = (data) => {
        const newData = [...JSON.parse(JSON.stringify(list))].filter(({ id }) => id !== data.id)
        if (newData.length) {
            setUnFollow(newData)
        }
        FavoriteJobStore.add(data.id)
    }

    const typeOfTruck = GetTruckType(+truckType)?.name || translate('common.notSpecified')

    return (
        <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
            <SearchItem
                {
                ...{
                    id,
                    fromText: from?.name || translate('common.notSpecified'),
                    toText: to?.map(location => location.name).join(', ') || translate('common.notSpecified'),
                    count: requiredTruckAmount || 0,
                    productName: productName,
                    truckType: typeOfTruck,
                    // packaging: productName,
                    // detail,
                    viewDetail: true,
                    postBy: owner?.companyName || 'CargoLink', // [Mocking]
                    isVerified: true,
                    isLike: isLiked,
                    rating: '4.8', // [Mocking]
                    ratingCount: '81', // [Mocking]
                    isCrown: true, // [Mocking]
                    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg', // [Mocking]
                    isRecommened: true,
                    containerStyle: {
                        paddingTop: spacing[2],
                        borderRadius: 6
                    },
                    onPress,
                    onToggleHeart
                }
                }
            />
        </View>
    )
}

const TruckItem = (data) => {
    const {
        id,
        truckType,
        workingZones,
        isLiked,
        list,
        setUnFollow
    } = data

    const navigation = useNavigation()

    const onPress = () => {
        ShipperTruckStore.findOne(id)
        // FavoriteTruckStore.keepPreviousActivityFunc(true)
        navigation.navigate('favoriteTruckDetail')
    }

    const onToggleHeart = (data) => { // id, isLike
        const newData = [...JSON.parse(JSON.stringify(list))].filter(({ id }) => id !== data.id)
        if (newData.length) {
            setUnFollow(newData)
        }
        FavoriteTruckStore.add(data.id)
        // ShipperTruckStore.updateFavoriteInList(data.id, data.isLike)
    }

    const workingZoneStr = workingZones?.length ? workingZones.map(zone => {
        let reg = GetRegion(zone.region, i18n.locale)
        return reg.label
    }).join(', ') : translate('common.notSpecified')

    return (
        <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
            <SearchItemTruck
                {
                ...{
                    id,
                    fromText: workingZoneStr,
                    count: 2,
                    truckType: `${translate('common.vehicleTypeField')} : ${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`,
                    // viewDetail,
                    postBy: 'CargoLink', // [Mocking]
                    isVerified: true,
                    isLike: isLiked,
                    backgroundImage: imageComponent[MapTruckImageName(+truckType) || 'truck'],
                    rating: '4.8', // [Mocking]
                    ratingCount: '81', // [Mocking]
                    isCrown: true,
                    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg', // [Mocking]
                    // isRecommened,
                    containerStyle: {
                        paddingTop: spacing[2],
                        borderRadius: 6
                    },
                    onPress,
                    onToggleHeart
                }
                }
            />
        </View>
    )
}

export const FavoriteScreen = observer(function FavoriteScreen() {
    const navigation = useNavigation()
    // const [state, setState] = useState<STATE>(initialState)
    const [isFirstHeaderSelected, setIsFirstHeaderSelected] = useState<boolean>(true)
    const [isActivitySwitch, setIsActivitySwitch] = useState<boolean>(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState<boolean>(true)

    // useFocusEffect(
    //     useCallback(() => {
    //         if (!TruckTypeStore.list.length) {
    //             TruckTypeStore.find()
    //         }
    //         if (FavoriteTruckStore.keepPreviousActivity) {
    //             !FavoriteTruckStore.list.length && FavoriteTruckStore.find()
    //         } else {
    //             !FavoriteJobStore.list.length && FavoriteJobStore.find()
    //         }
    //         return () => {
    //             setIsFirstHeaderSelected(true)
    //             setIsActivitySwitch(FavoriteTruckStore.keepPreviousActivity ? true : false)
    //             setData([])
    //         }
    //     }, [])
    // );

    useEffect(() => {
        if (!TruckTypeStore.list.length) {
            TruckTypeStore.find()
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        if (!FavoriteJobStore.loading) {
            setData(FavoriteJobStore.list)
            setLoading(false)
        }
    }, [FavoriteJobStore.loading])

    useEffect(() => {
        setLoading(true)
        if (!FavoriteTruckStore.loading) {
            setData(FavoriteTruckStore.list)
            setLoading(false)
        }
    }, [FavoriteTruckStore.loading])

    useEffect(() => {
        console.log('isActivitySwitch', isActivitySwitch)
        if (isActivitySwitch) { // truck
            FavoriteTruckStore.find()
        } else {
            FavoriteJobStore.find()
        }
    }, [isActivitySwitch])

    const renderItem = ({ item }) => {
        if (!isActivitySwitch) { // job
            return <JobItem {...item} list={data} setUnFollow={setData} />
        }
        return <TruckItem {...item} list={data} setUnFollow={setData} />
    }

    const onScrollList = () => {
        console.log('scroll end')
    }

    const onRefresh = () => {
        setLoading(true)
        if (!isActivitySwitch) { // job
            FavoriteJobStore.find();
        } else {
            FavoriteTruckStore.find()
        }
    }

    const touchableHeaderStyle: ViewStyle = {
        ...TOUCHABLE_VIEW,
        paddingTop: spacing[2],
        paddingBottom: spacing[4],
    }
    const favoriteHeaderStyle: ViewStyle = { ...touchableHeaderStyle, ...(isFirstHeaderSelected && HEADER_ACTIVE) }
    const lastestContactHeaderStyle: ViewStyle = { ...touchableHeaderStyle, ...(!isFirstHeaderSelected && HEADER_ACTIVE) }

    return (
        <View testID="FavoriteScreen" style={FULL}>

            <ModalLoading size={'large'} color={color.primary} visible={loading} />

            <View style={HEADER}>
                <TouchableOpacity activeOpacity={1} style={favoriteHeaderStyle} onPress={() => setIsFirstHeaderSelected(!isFirstHeaderSelected)} >
                    <Text tx={'favoriteScreen.favoriteList'} style={{ ...TEXT, color: isFirstHeaderSelected ? color.textBlack : color.textWhite }} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={lastestContactHeaderStyle} onPress={() => setIsFirstHeaderSelected(!isFirstHeaderSelected)} >
                    <Text tx={'favoriteScreen.lastestContact'} style={{ ...TEXT, color: !isFirstHeaderSelected ? color.textBlack : color.textWhite }} />
                </TouchableOpacity>
            </View>

            <View style={ACTIVITY}>
                <TouchableOpacity activeOpacity={1} style={{ ...TOUCHABLE_VIEW, ...BORDER_RADIUS_LEFT, backgroundColor: !isActivitySwitch ? color.primary : color.disable }} onPress={() => setIsActivitySwitch(!isActivitySwitch)}>
                    <Text tx={'favoriteScreen.job'} style={ACTIVITY_TEXT_VIEW} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ ...TOUCHABLE_VIEW, ...BORDER_RADIUS_RIGHT, backgroundColor: isActivitySwitch ? color.primary : color.disable }} onPress={() => setIsActivitySwitch(!isActivitySwitch)}>
                    <Text tx={'favoriteScreen.vehicle'} style={ACTIVITY_TEXT_VIEW} />
                </TouchableOpacity>
            </View>

            <View style={RESULT_CONTAINER}>
                {
                    data && !!data.length && !loading ? <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        onEndReached={() => onScrollList()}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={onRefresh}
                            />
                        }
                    /> : (!loading && <View style={CONTEXT_NOT_FOUND}>
                        <Feather name={'inbox'} size={50} color={color.line} />
                        <Text tx={'common.notFound'} style={NOT_FOUND_TEXT} preset={'topicExtra'} />
                    </View>)
                }
            </View>

        </View>
    )
})
