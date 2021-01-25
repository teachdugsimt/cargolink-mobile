import { TextStyle, ViewStyle } from "react-native";

export interface AdvanceSearchTabProps {

    mainText: string

    count?: string | number

    subButtons: Array<{
        id?: number
        label?: string
        isChecked?: boolean
    }>

    parentStyle?: ViewStyle

    onAdvanceSeach: () => void

    onPress: (id: number) => void

}