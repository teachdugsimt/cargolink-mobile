import React from 'react'
import { observer } from 'mobx-react-lite'
import { Dimensions, Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from 'react-native'
import { Icon, Text } from '../../components'
import { translate } from '../../i18n'
import { spacing, images as imageComponent, color } from '../../theme'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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
    backgroundColor: color.disable,
}
const OUTER_CIRCLE: ViewStyle = {
    borderRadius: Math.round(deviceWidht + deviceHeight) / 2,
    width: 58,
    height: 58,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
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

    const Truck = ({ id, vehicleType, vehicleCount, imageType }) => {

        return (
            <View style={{ ...ROW, paddingVertical: spacing[3], borderBottomWidth: 1, borderBottomColor: color.line }}>
                <View style={{ flex: 2 }}>
                    <View style={OUTER_CIRCLE}>
                        <Image source={imageComponent[imageType ? imageType : "truck17"]} style={TRUCK_IMAGE} />
                    </View>
                </View>
                <View style={{ flex: 5 }}>
                    <Text text={vehicleType} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text text={vehicleCount} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text text={'คัน'} />
                </View>
            </View>
        )
    }

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
                <View style={[{ padding: spacing[4], backgroundColor: color.backgroundWhite, ...SPACE_BOTTOM }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text text={translate('profileScreen.allVehicle')} />
                        <Text text={`${vehicleCount.toString()}  คัน`} />
                    </View>
                    {PROFILE_DATA.vehicles.map((vehicle, index) => {
                        return <Truck key={index} {...vehicle} />
                    })}
                </View>

                <View style={[{ padding: spacing[4], backgroundColor: color.backgroundWhite, ...SPACE_BOTTOM }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text text={'คะแนนความพึงพอใจ'} />
                    </View>
                    <MaterialCommunityIcons name={'star'} size={14} color={color.primary} />
                </View>
            </ScrollView>
        </View>
    )
})