import React, { useState } from 'react'
import { Dimensions, View } from 'react-native'
import { translate } from '../../i18n'
import { color, spacing } from '../../theme'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SearchItem } from '../../components/search-item/search-item';
import { Text } from '../../components';

const Jobs = (data) => {
    const {
        fromText,
        toText,
        count,
        packaging,
        detail,
        viewDetail,
        postBy,
        isVerified,
        isLike,
        rating,
        ratingCount,
        isCrown,
        isRecommened,
        logo
    } = data

    const onPress = () => console.log('Click')

    return (
        <View style={{ paddingLeft: spacing[2], paddingRight: spacing[2] }}>
            <SearchItem
                {
                ...{
                    fromText,
                    toText,
                    count,
                    packaging,
                    detail,
                    viewDetail,
                    postBy,
                    isVerified,
                    isLike,
                    rating,
                    ratingCount,
                    isCrown,
                    logo,
                    isRecommened,
                    containerStyle: {
                        paddingTop: spacing[2],
                        borderRadius: 6
                    },
                    onPress
                }
                }
            />
        </View>
    )
}

const WorkInProgressRoute = (data = []) => (
    <View style={{ flex: 1 }}>
        {data.map((val, index) => <Jobs key={index} {...val} />)}
    </View>
)

const PastWorkRoute = (data) => (
    <View style={{ flex: 1 }} >
        {data.map((val, index) => <Jobs key={index} {...val} />)}
    </View>
);

const renderTabBar = props => (
    <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: color.dim }}
        style={{ backgroundColor: color.backgroundWhite }}
        renderLabel={({ route, focused, color: colorText }) => (
            <Text style={{ color: color.textBlack }} text={route.title} />
        )}
    />
);

export function TabBarNavigation(props) {

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'workInProgress', title: translate('shipperProfileScreen.workInProgress') },
        { key: 'pastWork', title: translate('shipperProfileScreen.pastWork') },
    ]);

    const renderScene = SceneMap({
        workInProgress: () => WorkInProgressRoute(props.data.filter((_, i) => i <= 3)),
        pastWork: () => PastWorkRoute(props.data.filter((_, i) => i > 3)),
    });

    return (
        <View style={{}}>
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                // style={{ backgroundColor: 'pink' }}
                sceneContainerStyle={{ marginVertical: spacing[3] }}
            />
        </View>
    )
}