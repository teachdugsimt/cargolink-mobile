import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, ImageStyle, ScrollView, TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native'
import { Button, Icon, ModalLoading, PostingBy, Text } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { color, spacing } from '../../theme'
import { translate } from '../../i18n'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import CarriersJobStore from '../../store/carriers-job-store/carriers-job-store'
import { GetTruckType } from '../../utils/get-truck-type'
import i18n from 'i18n-js'
import { Modalize } from 'react-native-modalize';
import MapView, {
    Polyline,
    Marker,
    Callout,
    PROVIDER_GOOGLE,
} from 'react-native-maps';
import TruckTypeStore from '../../store/truck-type-store/truck-type-store'
import FavoriteJobStore from '../../store/carriers-job-store/favorite-job-store'

const PADDING_TOP = { paddingTop: spacing[1] }
const PADDING_BOTTOM = { paddingBottom: spacing[1] }
const PADDING_LEFT = { paddingLeft: spacing[1] }
const MARGIN_BOTTOM = { marginBottom: spacing[1] }
const BACKGROUND_COLOR = { backgroundColor: color.backgroundWhite }
const BOTTOM_LINE = {
    borderBottomColor: color.line,
    borderBottomWidth: 1,
}

const CONTAINER: ViewStyle = {
    flex: 1,
    backgroundColor: color.backgroundPrimary,
}
const TOP_ROOT: ViewStyle = {
    ...BACKGROUND_COLOR,
    ...MARGIN_BOTTOM,
    padding: spacing[4],
    marginHorizontal: spacing[3],
    borderRadius: spacing[1],
    paddingVertical: spacing[2],
}
const MAP_CONTAINER: ViewStyle = {
    flex: 1,
    position: 'relative',
}
const MAP: ImageStyle = {
    width: Math.floor(Dimensions.get('window').width),
    height: Math.floor(Dimensions.get('window').height),
}
const LOCATION_CONTAINER: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
}
const LOCATION_BOX: ViewStyle = {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: color.line
}
const PRODUCT_ROOT: ViewStyle = {
    flexDirection: 'column',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    ...BACKGROUND_COLOR,
    ...MARGIN_BOTTOM,
    ...BOTTOM_LINE
}
const DISTANCE_BOX: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
}
const ICON_BOX: ViewStyle = {
    paddingTop: spacing[2]
}
const DETAIL_BOX: ViewStyle = {
    paddingHorizontal: spacing[3]
}
const ROW: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}
const PRODUCT_ROW: ViewStyle = {
    flexDirection: "row",
}
const ONWER_ROOT: ViewStyle = {
    ...BACKGROUND_COLOR,
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
    paddingLeft: spacing[4] + spacing[2],
    paddingRight: spacing[4] + spacing[2],
    marginBottom: spacing[6],
}
const LOCATION: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    ...PADDING_TOP,
    ...PADDING_BOTTOM
}
const PIN_ICON: ImageStyle = {
    width: 22,
    height: 22,
}
const LOCATION_TEXT: TextStyle = {
    paddingVertical: spacing[1],
    ...PADDING_LEFT
}
const TEXT_SMALL: TextStyle = {
    fontSize: 11
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
const TEXT: TextStyle = {
    paddingVertical: spacing[2]
}
const SCROLL_VIEW: ViewStyle = {
    marginTop: spacing[5],
}

const DATA = { // [Mocking]
    id: 9,
    fromText: 'กรุงเทพมหานคร',
    toText: 'นครศรีธรรมราช',
    count: '2',
    packaging: 'อื่นๆ',
    truckType: 'รถ 6 ล้อตู้คอก',
    viewDetail: true,
    postBy: 'Cargolink',
    isVerified: true,
    isLike: true,
    rating: '4.9',
    ratingCount: '122',
    isCrown: true,
    isRecommened: true,
    weigh: 20,
    productType: 'สินค้าเกษตร',
    productName: 'ข้าวโพด',
    distance: '435.35',
    period: '3 ชั่วโมง 45 นาที',
    logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
}

const PickUpPoint = ({ to, from, containerStyle = {} }) => (
    <View style={{ ...LOCATION_CONTAINER, ...containerStyle }}>
        <View style={LOCATION_BOX}>
            <View style={LOCATION}>
                <Icon icon="pinDropYellow" style={PIN_ICON} />
                <Text
                    text={`${translate('common.from')}  :`}
                    style={{ ...LOCATION_TEXT, width: 45 }}
                />
                <Text
                    text={from && from.name}
                    style={LOCATION_TEXT}
                />
            </View>
            {to?.length && to.map((attr, index) => (
                <View key={index} style={LOCATION}>
                    <Icon icon="pinDropGreen" style={PIN_ICON} />
                    <Text
                        text={`${translate('common.to')}  :`}
                        style={{ ...LOCATION_TEXT, width: 45 }}
                    />
                    <Text
                        text={attr.name}
                        style={LOCATION_TEXT}
                    />
                </View>
            ))}
        </View>
        <View style={DISTANCE_BOX}>
            <Text style={{ paddingVertical: spacing[1] }} >{`${DATA.distance} `}<Text text={'KM'} style={TEXT_SMALL} /></Text>
            <Text text={`${DATA.period}`} style={{ ...TEXT_SMALL, paddingVertical: spacing[1], }} />
        </View>
    </View>
)

export const JobDetailScreen = observer(function JobDetailScreen() {

    const navigation = useNavigation()

    const modalizeRef = useRef<Modalize>(null);
    const [coordinates, setCoordinates] = useState([])
    const [liked, setLiked] = useState<boolean>(false)

    const {
        id,
        from,
        to,
        productName,
        productTypeId,
        requiredTruckAmount,
        truckType,
        isLiked,
        weight
    } = JSON.parse(JSON.stringify(CarriersJobStore.data))

    useEffect(() => {
        if (!TruckTypeStore.list?.length) {
            TruckTypeStore.find()
        }
        return () => {
            CarriersJobStore.setDefaultOfData()
        }
    }, [])

    useLayoutEffect(() => {
        console.log('isLiked', isLiked)
        navigation.setOptions({
            headerRight: () => (<TouchableOpacity onPress={() => onSelectedHeart(id)}>
                <MaterialCommunityIcons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? color.red : color.line} />
            </TouchableOpacity>),
        })
        return () => { }
    }, [liked, id, navigation]);

    useEffect(() => {
        setLiked(isLiked)
    }, [isLiked])

    useEffect(() => {
        if (CarriersJobStore.data && CarriersJobStore.data.id) {
            // console.log('CarriersJobStore.data', JSON.parse(JSON.stringify(CarriersJobStore.data)))
            // console.log('CarriersJobStore.directions', JSON.parse(JSON.stringify(CarriersJobStore.directions)))
            const coordinates = [CarriersJobStore.data.from, ...CarriersJobStore.data.to]
            setCoordinates(coordinates)
            CarriersJobStore.getDirections(coordinates)
        }
    }, [CarriersJobStore.loading, CarriersJobStore.data])

    const onSelectedHeart = (id: string) => {
        FavoriteJobStore.keepLiked(id, !liked)
        FavoriteJobStore.add(id)
        setLiked(!liked)
    }

    const onPress = () => {
        modalizeRef.current?.close();
        navigation.navigate('shipperProfile')
    }

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const txtTruckType = GetTruckType(+truckType)
    // console.log('coordinates.length', coordinates.length)
    // console.log('JSON.stringify(CarriersJobStore.directions)', JSON.stringify(CarriersJobStore.directions))
    // console.log('CarriersJobStore.mapLoading', CarriersJobStore.mapLoading)

    return (
        <View style={CONTAINER}>
            <ModalLoading size={'large'} color={color.primary} visible={CarriersJobStore.mapLoading} />
            <View style={MAP_CONTAINER}>
                {from && !!from.lat && !!from.lng && !!CarriersJobStore.directions.length &&
                    <MapView
                        style={{ height: Dimensions.get('window').height }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: +from.lat - 0.03,
                            longitude: +from.lng,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        }}
                        region={{
                            latitude: +from.lat - 0.03,
                            longitude: +from.lng,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        }}
                    >
                        {!!coordinates.length && coordinates.map((attr, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: +attr.lat, longitude: +attr.lng }}
                                pinColor="green"
                            >
                                <Callout>
                                    <Text>{attr.contactName}</Text>
                                </Callout>
                            </Marker>
                        ))}
                        {JSON.parse(JSON.stringify(CarriersJobStore.directions)).map((attr, index) => {
                            return (<Polyline key={index} coordinates={attr} strokeWidth={4} strokeColor={'red'} />)
                        })}
                    </MapView>
                }
            </View>

            <TouchableOpacity activeOpacity={1} onPress={onOpen} style={{ ...TOP_ROOT, height: 105, }}>
                <View>
                    <Text text={translate('jobDetailScreen.pickUpPoint')} style={{ ...TEXT_SMALL, color: color.line, }} />
                </View>
                <PickUpPoint from={from} to={to} />
            </TouchableOpacity>

            <Modalize
                ref={modalizeRef}
                scrollViewProps={{ showsVerticalScrollIndicator: true }}
                snapPoint={300}
                // HeaderComponent={}
                modalStyle={{
                    flex: 1,
                    marginTop: spacing[5],
                }}
                withHandle={true}
            // tapGestureEnabled={true}
            >
                <ScrollView
                    onScroll={({ nativeEvent }) => {
                    }}
                    style={SCROLL_VIEW}
                    scrollEventThrottle={400}
                >

                    <View style={TOP_ROOT}>
                        <View>
                            <Text text={translate('jobDetailScreen.pickUpPoint')} style={{ ...TEXT_SMALL, color: color.line, }} />
                        </View>
                        <PickUpPoint from={from} to={to} containerStyle={{ paddingBottom: spacing[4], ...BOTTOM_LINE }} />
                    </View>

                    <View style={PRODUCT_ROOT}>
                        <View>
                            <Text text={translate('jobDetailScreen.jobDetail')} preset={'topic'} style={{ color: color.primary }} />
                        </View>
                        <View style={PRODUCT_ROW}>
                            <View style={ICON_BOX}>
                                <MaterialCommunityIcons name={'truck-outline'} size={24} color={color.primary} />
                            </View>
                            <View style={DETAIL_BOX}>
                                <Text text={`${translate('common.vehicleTypeField')} : ${txtTruckType && txtTruckType.name ? txtTruckType.name : ''}`} style={TEXT} />
                                <Text text={`${translate('common.count')} : ${requiredTruckAmount} คัน`} style={TEXT} />
                            </View>
                        </View>
                        <View style={PRODUCT_ROW}>
                            <View style={ICON_BOX}>
                                <SimpleLineIcons name={'social-dropbox'} size={24} color={color.primary} />
                            </View>
                            <View style={DETAIL_BOX}>
                                <Text text={`${translate('jobDetailScreen.productType')} : ${productTypeId}`} style={TEXT} />
                                <Text text={`${translate('jobDetailScreen.productName')} : ${productName}`} style={TEXT} />
                                <Text text={`${translate('jobDetailScreen.weightTon')} : ${weight}`} style={TEXT} />
                            </View>
                        </View>
                    </View>

                </ScrollView>

                <View style={ONWER_ROOT}>
                    <View style={ROW}>
                        <Text style={{ color: color.line }}>{translate('jobDetailScreen.postBy')}</Text>
                        <PostingBy {...DATA} onToggle={() => onPress()} />
                    </View>
                </View>

            </Modalize>

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