import { LayoutAnimationConfig, ViewStyle } from "react-native";

export interface CollpasibleListProps {

    animationConfig?: LayoutAnimationConfig;

    buttonContent?: React.ReactNode;

    buttonPosition?: 'top' | 'bottom';

    numberOfVisibleItems?: number;

    onToggle?: (collapsed: boolean) => void;

    wrapperStyle?: ViewStyle;

    children?: any
}