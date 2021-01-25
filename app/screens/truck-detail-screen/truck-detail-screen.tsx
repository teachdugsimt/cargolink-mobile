import React, { useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
    Dimensions,
    Image,
    ImageBackground,
    ImageStyle,
    Modal,
    ScrollView,
    TextStyle,
    View,
    ViewStyle,
} from "react-native"
import { Button, ModalLoading, PostingBy, Text } from "../../components"
import { translate } from "../../i18n"
import { color, images as imageComponent, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import ImageViewer from 'react-native-image-zoom-viewer';
import { TouchableOpacity } from "react-native-gesture-handler"
import ShipperTruckStore from '../../store/shipper-truck-store/shipper-truck-store'
import TruckTypeStore from '../../store/truck-type-store/truck-type-store'
import { useStores } from "../../models/root-store/root-store-context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FavoriteTruckStore from "../../store/shipper-truck-store/favorite-truck-store"
import { GetTruckType } from "../../utils/get-truck-type"
import { MapTruckImageName } from "../../utils/map-truck-image-name"

const deviceWidht = Dimensions.get("window").width

const CONTAINER: ViewStyle = {
    flex: 1,
}
const COLUMN: ViewStyle = {
    flex: 1,
    backgroundColor: color.backgroundWhite,
    marginBottom: spacing[1],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    position: 'relative',
}
const ROW: ViewStyle = {
    flex: 1,
    flexDirection: "row",
}
const TOPIC: TextStyle = {
    marginBottom: spacing[3],
}
const IMAGES: ViewStyle = {
    flexDirection: "row",
    flexWrap: "wrap",
}
const IMAGE: ImageStyle = {
    height: "100%",
    width: deviceWidht / 2 - spacing[5],
    resizeMode: "cover",
    aspectRatio: 4 / 2,
    margin: spacing[1],
    borderRadius: 4,
    backgroundColor: color.line,
}
const TOUCHABLE: ViewStyle = {
    flex: 1,
    flexDirection: 'row'
}
const BOTTOM_ROOT: ViewStyle = {
    backgroundColor: color.backgroundWhite,
    alignItems: 'center',
    padding: spacing[5]
}
const CALL_BUTTON: ViewStyle = {
    width: '100%',
    borderRadius: Dimensions.get('window').width / 2,
    backgroundColor: color.success,
}
const CALL_TEXT: TextStyle = {
    color: color.textWhite,
    fontSize: 18,
}
const ICON_BOX: ViewStyle = {
    paddingTop: spacing[2]
}
const DETAIL_BOX: ViewStyle = {
    paddingHorizontal: spacing[3]
}
const TEXT: TextStyle = {
    paddingVertical: spacing[2]
}
const BACKGROUND_CONTAINER: ViewStyle = {
    width: 230,
    height: 200,
    position: 'absolute',
    overflow: 'hidden',
    right: 0,
    bottom: 0,
}
const BACKGROUND: ImageStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: -100,
    opacity: 0.3
}

const initialState = {
    openViewer: false,
    indexOfImage: 0,
    liked: false,
}

export const TruckDetailScreen = observer(function TruckDetailScreen() {
    const navigation = useNavigation()

    const { tokenStore } = useStores()

    const [{ openViewer, indexOfImage, liked }, setState] = useState(initialState)
    const {
        id,
        truckType,
        stallHeight,
        tipper,
        isLiked,
        truckPhotos,
    } = ShipperTruckStore.data

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<TouchableOpacity onPress={() => onSelectedHeart(id)}>
                <MaterialCommunityIcons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? color.red : color.line} />
            </TouchableOpacity>),
        })
        return () => { }
    }, [liked, id, navigation]);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            liked: isLiked,
        }))
    }, [isLiked])

    const onViewer = (index: number) => {
        setState(prevState => ({
            ...prevState,
            openViewer: true,
            indexOfImage: index,
        }))
    }

    const onCancel = () => {
        setState(prevState => ({
            ...prevState,
            openViewer: false
        }))
    }

    const onSelectedHeart = (id: string) => {
        FavoriteTruckStore.keepLiked(id, !liked)
        FavoriteTruckStore.add(id)
        setState(prevState => ({
            ...prevState,
            liked: !prevState.liked,
        }))
    }

    useEffect(() => {
        if (!TruckTypeStore.list?.length) {
            TruckTypeStore.find()
        }
        return () => {
            ShipperTruckStore.setDefaultOfData()
        }
    }, [])

    // useEffect(() => {
    //     if (ShipperTruckStore.data) {
    //         console.log('ShipperTruckStore.data :>> ', JSON.parse(JSON.stringify(ShipperTruckStore.data)));
    //     }
    // }, [ShipperTruckStore.data])

    const transformImage = truckPhotos &&
        Object.keys(truckPhotos).length ?
        Object.entries(truckPhotos).map(img => {
            let imgObj = {
                url: img[1] || '',
                props: {
                    source: !img[1] ? imageComponent['noImageAvailable'] : undefined
                }
            }
            return JSON.parse(JSON.stringify(imgObj))
        }) : []

    return (
        <View style={CONTAINER}>
            {ShipperTruckStore.loading && <ModalLoading size={'large'} color={color.primary} visible={ShipperTruckStore.loading} />}
            <ScrollView onScroll={({ nativeEvent }) => { }} style={{}} scrollEventThrottle={400}>
                <View style={COLUMN}>
                    <View style={ROW}>
                        <Text style={TOPIC} text={translate("vehicleDetailScreen.vehicleImage")} preset={'topic'} />
                    </View>
                    <View style={ROW}>
                        <View style={IMAGES}>
                            {!!transformImage &&
                                transformImage.map((image, index) => {
                                    return (
                                        <TouchableOpacity style={TOUCHABLE} key={index} onPress={(attr) => onViewer(index)}>
                                            <Image style={IMAGE} source={ShipperTruckStore.data.id && image.url ? {
                                                uri: image.url,
                                                method: 'GET',
                                                headers: {
                                                    Authorization: `Bearer ${tokenStore.token.accessToken}`
                                                },
                                            } : imageComponent['noImageAvailable']} key={index} />
                                        </TouchableOpacity>
                                    )
                                })}
                            <Modal visible={openViewer} transparent={true}>
                                <ImageViewer
                                    imageUrls={transformImage}
                                    index={indexOfImage}
                                    onCancel={onCancel}
                                    enableSwipeDown={true}
                                    pageAnimateTime={transformImage ? transformImage.length : 0}
                                />
                            </Modal>
                        </View>
                    </View>
                </View>

                <View style={COLUMN}>
                    <View style={ROW}>
                        <Text style={[TOPIC, { color: color.primary }]} text={translate("truckDetailScreen.truckDetail")} preset={'topic'} />
                    </View>

                    <View style={ROW}>
                        <View style={ICON_BOX}>
                            <MaterialCommunityIcons name={'truck-outline'} size={24} color={color.primary} />
                        </View>
                        <View style={DETAIL_BOX}>
                            <Text text={`${translate('common.vehicleTypeField')} : ${GetTruckType(+truckType)?.name || translate('common.notSpecified')}`} style={TEXT} />
                            <Text text={`${translate('common.count')} : ${2} คัน`} style={TEXT} />
                            <Text text={`${translate('vehicleDetailScreen.carHaveDum')} : ${tipper ? translate('common.have') : translate('common.notHave')}`} style={TEXT} />
                            <Text text={`${translate('truckDetailScreen.heighttOfTheCarStall')} : ${stallHeight || '-'} ${translate('common.M')}`} style={TEXT} />
                        </View>
                    </View>

                    <View style={BACKGROUND_CONTAINER}>
                        <ImageBackground source={imageComponent[MapTruckImageName(+truckType) || '']} style={BACKGROUND} resizeMode={'contain'} />
                    </View>

                </View>

                <View style={COLUMN}>
                    <View style={[ROW, { justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Text style={{ color: color.line }}>{translate('jobDetailScreen.postBy')}</Text>
                        <PostingBy {...{
                            postBy: 'CargoLink',
                            isVerified: true,
                            isLike: true,
                            rating: '4.9',
                            ratingCount: '122',
                            isCrown: true,
                            isRecommened: true,
                            logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
                        }} onToggle={() => navigation.navigate('shipperProfile')} />
                    </View>
                </View>

            </ScrollView>
            <View style={BOTTOM_ROOT}>
                <Button
                    testID="call-with-owner"
                    style={CALL_BUTTON}
                    children={
                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name={'phone'} size={24} color={color.textWhite} style={{ paddingRight: spacing[2] }} />
                            <Text style={CALL_TEXT} text={translate('jobDetailScreen.call')} />
                        </View>
                    }
                    onPress={() => navigation.navigate('feedback')}
                />
            </View>
        </View>
    )
})

