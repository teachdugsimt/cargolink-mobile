import React from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { Icon, Text } from '../../components'
import { translate } from '../../i18n'
import { spacing, images as imageComponent, color } from '../../theme'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabBarNavigation } from './tab-bar-navigation'

const deviceWidht = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const SPACE_BOTTOM: ViewStyle = {
    marginBottom: spacing[1]
}
const CONTAINER: ViewStyle = {
    flex: 1,
}
const PROFILE: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[5]
}
const PROFILE_IMAGE: ImageStyle = {
    width: 70,
    height: 70,
    borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
}
const SMALL_ICON: ImageStyle = {
    width: 13,
    height: 13,
}
const ROW: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.backgroundWhite,
}
const TEXT: TextStyle = {
    paddingVertical: spacing[1],
}
const TRUCK_IMAGE: ImageStyle = {
    width: 55,
    height: 55,
    borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
    backgroundColor: color.line,
}
const OUTER_CIRCLE: ViewStyle = {
    borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
    width: 58,
    height: 58,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
}
const RATING_CONTAINER: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[1]
}
const START_CONTAINER: ViewStyle = {
    flex: 2,
    flexDirection: 'row'
}
const RATING_BAR_CONTAINER: ViewStyle = {
    flex: 4,
    backgroundColor: color.line,
    height: 8,
    borderRadius: 3
}
const COUNT_CONTAINER: ViewStyle = {
    flex: 1,
    alignItems: 'center'
}
const TOPIC: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing[2]
}
const SECTION: ViewStyle = {
    padding: spacing[4],
    backgroundColor: color.backgroundWhite,
    ...SPACE_BOTTOM
}

const PROFILE_DATA = {
    name: 'Cargolink',
    isVerified: true,
    vehicles: [
        {
            id: 1,
            vehicleType: 'รถบรรทุกของเหลว 6 ล้อ',
            imageType: 'truck13',
            vehicleCount: 4,
        },
        {
            id: 2,
            vehicleType: 'รถกระบะ 4 ล้อคอกสูง',
            imageType: 'truck2',
            vehicleCount: 9,
        },
        {
            id: 3,
            vehicleType: 'รถกระบะห้องเย็น 4 ล้อตู้ทึบ',
            imageType: 'truck3',
            vehicleCount: 18,
        },
        {
            id: 4,
            vehicleType: 'รถพ่วงคอก 40 ฟุต',
            imageType: 'truck33',
            vehicleCount: 2,
        },
    ]
}

const STAR = [
    {
        show: 5,
        count: 34
    },
    {
        show: 4,
        count: 7
    },
    {
        show: 3,
        count: 2
    },
    {
        show: 2,
        count: 1
    },
    {
        show: 1,
        count: 0
    },
]

const DATA_JOB = [
    {
        id: 1,
        fromText: 'ภาคกลาง',
        toText: 'ภาคกลาง',
        count: '2',
        packaging: 'อื่นๆ',
        detail: 'รถ 6 ล้อตู้คอก',
        viewDetail: true,
        postBy: 'Cargolink',
        isVerified: true,
        isLike: true,
        rating: '4.9',
        ratingCount: '122',
        isCrown: true,
        isRecommened: true,
        logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
    },
    {
        id: 2,
        fromText: 'ภาคกลาง',
        toText: 'ภาคกลาง',
        count: '2',
        packaging: 'อื่นๆ',
        detail: 'รถ 6 ล้อตู้คอก',
        viewDetail: true,
        postBy: 'Cargolink',
        isVerified: false,
        isLike: false,
        rating: '1.9',
        ratingCount: '3',
        isCrown: false,
        logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
    },
    {
        id: 3,
        fromText: 'ภาคกลาง',
        toText: 'ภาคกลาง',
        count: '2',
        packaging: 'อื่นๆ',
        detail: 'รถ 6 ล้อตู้คอก',
        viewDetail: true,
        postBy: 'Cargolink',
        isVerified: true,
        isLike: true,
        rating: '4.9',
        ratingCount: '122',
        isCrown: true,
        isRecommened: true,
        logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
    },
    {
        id: 4,
        fromText: 'ภาคกลาง',
        toText: 'ภาคกลาง',
        count: '2',
        packaging: 'อื่นๆ',
        detail: 'รถ 6 ล้อตู้คอก',
        viewDetail: true,
        postBy: 'Cargolink',
        isVerified: true,
        isLike: true,
        rating: '4.5',
        ratingCount: '69',
        isCrown: false,
        logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
    },
    {
        id: 5,
        fromText: 'ภาคกลาง',
        toText: 'ภาคกลาง',
        count: '2',
        packaging: 'อื่นๆ',
        detail: 'รถ 6 ล้อตู้คอก',
        viewDetail: true,
        postBy: 'Cargolink',
        isVerified: true,
        isLike: true,
        rating: '4.9',
        ratingCount: '122',
        isCrown: true,
        isRecommened: true,
        logo: 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg',
    },
]

export const ShipperProfileScreen = observer(function ShipperProfileScreen() {

    const profileImage = 'https://pbs.twimg.com/profile_images/1246060692748161024/nstphRkx_400x400.jpg'

    const Verified = ({ isVerified }) => {
        const label = isVerified ? translate('shipperProfileScreen.verified') : translate('shipperProfileScreen.notVerified')
        const iconName = isVerified ? "checkActive" : "checkInactive"
        return (
            <View style={ROW}>
                <Text text={label} style={TEXT} />
                <Icon icon={iconName} style={SMALL_ICON} containerStyle={{ paddingLeft: spacing[1] }} />
            </View>
        )
    }

    const Truck = ({ id, vehicleType, vehicleCount, imageType }) => (
        <View style={{ ...ROW, paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: color.line }}>
            <View style={{ flex: 2 }}>
                <View style={OUTER_CIRCLE}>
                    <Image source={imageComponent[imageType ? imageType : "truck17"]} style={TRUCK_IMAGE} />
                </View>
            </View>
            <View style={{ flex: 5 }}>
                <Text text={vehicleType} />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text text={vehicleCount} />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text text={'คัน'} />
            </View>
        </View>
    )

    const Star = ({ show, count }) => (
        <View style={RATING_CONTAINER}>
            <View style={START_CONTAINER}>
                {Array(5).fill(show).map((_, index) => <MaterialCommunityIcons key={index} name={'star'} size={16} color={index < show ? color.primary : color.line} style={{ paddingHorizontal: 2 }} />)}
            </View>
            <View style={RATING_BAR_CONTAINER}>
                <View style={{ flex: 1, width: '50%', backgroundColor: color.primary, borderRadius: 3 }} />
            </View>
            <View style={COUNT_CONTAINER}>
                <Text text={`(${count})`} style={{ color: count ? color.textBlack : color.line }} />
            </View>
        </View>
    )

    const vehicleCount = PROFILE_DATA.vehicles.reduce((prev, curr) => { return prev + curr.vehicleCount }, 0)

    return (
        <View style={CONTAINER}>
            <View style={[ROW, { padding: spacing[5], ...SPACE_BOTTOM }]}>
                <View style={{ flex: 1 }} >
                    <Image source={{ uri: profileImage }} style={PROFILE_IMAGE} resizeMode={'contain'} />
                </View>
                <View style={{ flex: 3 }}>
                    <Text text={PROFILE_DATA.name} style={TEXT} />
                    <Verified isVerified={PROFILE_DATA.isVerified} />
                </View>
            </View>
            <ScrollView
                onScroll={({ nativeEvent }) => {
                }}
                style={{}}
                scrollEventThrottle={400}
            >
                <View style={SECTION}>
                    <View style={TOPIC}>
                        <Text text={translate('profileScreen.allVehicle')} />
                        <Text text={`${vehicleCount.toString()}  คัน`} />
                    </View>
                    {PROFILE_DATA.vehicles.map((vehicle, index) => {
                        return <Truck key={index} {...vehicle} />
                    })}
                </View>

                <View style={SECTION}>
                    <View style={TOPIC}>
                        <Text text={'คะแนนความพึงพอใจ'} />
                    </View>
                    <View>
                        {STAR.map(val => <Star key={val.show} {...val} />)}
                    </View>
                </View>

                <View style={{}}>
                    <TabBarNavigation data={DATA_JOB} />
                </View>
            </ScrollView>
        </View>
    )
})