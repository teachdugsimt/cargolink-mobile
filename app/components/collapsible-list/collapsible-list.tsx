import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Platform,
    UIManager,
    LayoutAnimation,
} from 'react-native';
import { CollpasibleListProps } from './collapsible-list.props';

export function CollapsibleList(props: CollpasibleListProps) {

    const [state, setState] = useState({
        minHeight: 0,
        currentHeight: null,
        collapsed: false,
        initialized: false,
    })

    useEffect(() => {
        if (
            Platform.OS === 'android' &&
            UIManager.setLayoutAnimationEnabledExperimental
        ) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        props = {
            ...props,
            animationConfig: {
                duration: 700,
                update: {
                    type: 'spring',
                    springDamping: 0.7,
                    property: 'scaleXY',
                },
            }
        };
    }, [])

    const setMinHeight = (event) => {
        const { height: minHeight } = event.nativeEvent.layout;

        setState(prevState => ({
            ...prevState,
            initialized: true,
            currentHeight: minHeight
        }))

    }

    const toggle = () => {
        const { minHeight, collapsed } = state;
        const { onToggle, animationConfig } = props;
        let nextHeight;

        if (collapsed) {
            nextHeight = minHeight;
        } else {
            nextHeight = null;
        }

        LayoutAnimation.configureNext({
            ...props.animationConfig,
            ...animationConfig,
        });

        setState(prevState => ({
            ...prevState,
            currentHeight: nextHeight,
            collapsed: !collapsed
        }))

        if (onToggle) {
            onToggle(state.collapsed)
        }
    }

    const renderButton = () => {
        const {
            numberOfVisibleItems,
            buttonContent,
            children
        } = props

        if (numberOfVisibleItems > React.Children.count(children)) return null

        return (
            <View>
                <TouchableOpacity onPress={toggle} activeOpacity={0.8}>
                    {buttonContent}
                </TouchableOpacity>
            </View>
        )
    }

    const { initialized, currentHeight } = state;
    const {
        numberOfVisibleItems,
        buttonPosition = 'bottom',
        wrapperStyle,
        children,
    } = props;

    return (
        <View style={wrapperStyle}>
            {buttonPosition === 'top' && renderButton()}
            <View style={{ overflow: 'hidden', height: currentHeight }}>
                <View style={{ flex: 1 }} onLayout={setMinHeight}>
                    {React.Children.toArray(children).slice(0, numberOfVisibleItems)}
                </View>
                {initialized && (
                    <View>
                        {React.Children.toArray(children)
                            .slice(numberOfVisibleItems)
                            .map((item, index) => (
                                <View key={index}>{item}</View>
                            ))}
                    </View>
                )}
            </View>
            {buttonPosition === 'bottom' && renderButton()}
        </View>
    );
}
