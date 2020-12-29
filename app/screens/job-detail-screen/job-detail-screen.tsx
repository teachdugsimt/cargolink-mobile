import React from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Icon, PostingBy, Text } from '../../components'
import { useNavigation } from '@react-navigation/native'
import { color, spacing } from '../../theme'
import { translate } from '../../i18n'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

const FONT_SIZE_SMALL = 15

const PADDING_TOP = { paddingTop: spacing[1] }
const PADDING_BOTTOM = { paddingBottom: spacing[1] }
const PADDING_LEFT = { paddingLeft: spacing[1] }
const MARGIN_BOTTOM = { marginBottom: spacing[1] }
const BACKGROUND_COLOR = { backgroundColor: color.backgroundWhite }

const CONTAINER: ViewStyle = {
    flex: 1,
    backgroundColor: color.backgroundPrimary,
}
const TOP_ROOT: ViewStyle = {
    padding: spacing[4],
    ...BACKGROUND_COLOR,
    ...MARGIN_BOTTOM,
    position: 'absolute',
    width: 'auto',
    bottom: 5,
    right: 0,
    left: 0,
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
    height: Math.floor(Dimensions.get('window').height / 2),
}
const LOCATION_CONTAINER: ViewStyle = {
    flex: 1,
    flexDirection: 'row'
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

const DATA = {
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

export const JobDetailScreen = observer(function JobDetailScreen() {
    const navigation = useNavigation()
    // const goBack = () => navigation.goBack()

    const {
        fromText,
        toText,
        truckType,
        // packaging,
        count,
        postBy,
        isVerified,
        isCrown,
        rating,
        ratingCount,
        logo,
        weigh,
        productType,
        productName,
        distance,
        period,
    } = DATA

    const onPress = () => {
        navigation.navigate('shipperProfile')
    }

    return (
        <View style={CONTAINER}>
            <View style={MAP_CONTAINER}>
                <Image source={{ uri: 'https://f.ptcdn.info/799/063/000/pqyi1shocoZJuUFhvZ0-o.png' }} resizeMode={'cover'} style={MAP} />

                <View style={TOP_ROOT}>
                    <View>
                        <Text text={translate('jobDetailScreen.pickUpPoint')} style={{ ...TEXT_SMALL, color: color.disable, }} />
                    </View>
                    <View style={LOCATION_CONTAINER}>
                        <View style={LOCATION_BOX}>
                            <View style={LOCATION}>
                                <Icon icon="pinDropYellow" style={PIN_ICON} />
                                <Text
                                    text={`${translate('common.from')}  :`}
                                    style={{ ...LOCATION_TEXT, width: 45 }}
                                />
                                <Text
                                    text={fromText}
                                    style={LOCATION_TEXT}
                                />
                            </View>
                            <View style={LOCATION}>
                                <Icon icon="pinDropGreen" style={PIN_ICON} />
                                <Text
                                    text={`${translate('common.to')}  :`}
                                    style={{ ...LOCATION_TEXT, width: 45 }}
                                />
                                <Text
                                    text={toText}
                                    style={LOCATION_TEXT}
                                />
                            </View>
                        </View>
                        <View style={DISTANCE_BOX}>
                            <Text style={{ paddingVertical: spacing[1] }} >{`${distance} `}<Text text={'KM'} style={TEXT_SMALL} /></Text>
                            <Text text={`${period}`} style={{ ...TEXT_SMALL, paddingVertical: spacing[1], }} />
                        </View>
                    </View>
                </View>

            </View>

            <View style={{
                flex: 1,
            }}>
                <ScrollView
                    onScroll={({ nativeEvent }) => {
                    }}
                    style={{}}
                    scrollEventThrottle={400}
                >

                    <View style={{
                        ...PRODUCT_ROOT
                    }}>
                        <View>
                            <Text text={translate('jobDetailScreen.jobDetail')} preset={'topic'} style={{ color: color.primary }} />
                        </View>
                        <View style={PRODUCT_ROW}>
                            <View style={ICON_BOX}>
                                <MaterialCommunityIcons name={'truck-outline'} size={24} color={color.primary} />
                            </View>
                            <View style={DETAIL_BOX}>
                                <Text text={`${translate('common.vehicleTypeField')} : ${truckType}`} style={TEXT} />
                                <Text text={`${translate('common.count')} : ${count} คัน`} style={TEXT} />
                            </View>
                        </View>
                        <View style={PRODUCT_ROW}>
                            <View style={ICON_BOX}>
                                <SimpleLineIcons name={'social-dropbox'} size={24} color={color.primary} />
                            </View>
                            <View style={DETAIL_BOX}>
                                <Text text={`${translate('jobDetailScreen.productType')} : ${productType}`} style={TEXT} />
                                <Text text={`${translate('jobDetailScreen.productName')} : ${productName}`} style={TEXT} />
                                <Text text={`${translate('jobDetailScreen.weightTon')} : ${weigh}`} style={TEXT} />
                            </View>
                        </View>
                    </View>

                    <View style={ONWER_ROOT}>
                        <View style={ROW}>
                            <Text style={{ color: color.disable }}>{translate('jobDetailScreen.postBy')}</Text>
                            <PostingBy {...DATA} onToggle={() => onPress()} />
                        </View>
                    </View>
                </ScrollView>
            </View>

            <View style={BOTTOM_ROOT}>
                <Button
                    testID="call-with-owner"
                    style={CALL_BUTTON}
                    textStyle={CALL_TEXT}
                    text={translate('jobDetailScreen.call')}
                    onPress={() => console.log('Call')}
                />
            </View>
        </View>
    )
})