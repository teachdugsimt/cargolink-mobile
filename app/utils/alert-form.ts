import { Alert } from 'react-native'
import { translate } from "../i18n"
import i18n from 'i18n-js'
export const AlertForm = (field) => {
    Alert.alert(
        translate('common.pleaseInputCorrect'),
        i18n.locale == "en" ? `Field ${translate(field)} was null` : `กรุณาใส่ ${translate(field)} ให้ถูกต้อง`,
        [
            {
                text: translate('common.ok'), onPress: () => { }
            }
        ]
        , { cancelable: false }
    )
    return;
}

export const AlertFormDate = () => {
    Alert.alert(
        translate('common.pleaseInputCorrect'),
        translate("postJobScreen.receiveDateMoreThan"),
        [
            {
                text: translate('common.ok'), onPress: () => { }
            }
        ]
        , { cancelable: false }
    )
    return;
}