import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Keyboard, View, ViewStyle, TouchableWithoutFeedback, TextInput, TextStyle, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import { Button, Text, RatingStart } from '../../components'
import { translate } from '../../i18n'
import { color, spacing } from '../../theme'
import { useNavigation } from '@react-navigation/native'

const CONTAINER: ViewStyle = {
    flex: 1,
}
const CONTENT: ViewStyle = {
    flex: 1,
    backgroundColor: color.backgroundWhite,
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    justifyContent: 'center',
}
const ROW: ViewStyle = {
    paddingVertical: spacing[4],
}
const TEXT_INPUT: TextStyle = {
    padding: spacing[3],
    borderColor: color.disable,
    borderWidth: 1,
    borderRadius: spacing[1],
}
const TEXT_AREA: TextStyle = {
    height: 120,
    borderWidth: 1,
    borderColor: color.disable,
    borderRadius: spacing[1],
    padding: spacing[3],
    textAlignVertical: 'top'
}
const BUTTON: ViewStyle = {
    borderRadius: Dimensions.get('window').height / 2,
    width: 120,
    marginHorizontal: spacing[2],
    paddingVertical: spacing[1] + 2,
    backgroundColor: color.disable,
    borderWidth: 1,
    borderColor: color.dim,
}
const BUTTON_TEXT: TextStyle = {
    color: color.textBlack,
}
const BOTTOM_CONTAINER: ViewStyle = {
    backgroundColor: color.backgroundWhite,
    padding: spacing[5],
    width: Dimensions.get('window').width,
    marginTop: spacing[1],

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

const BUTTON_SLECTE = [
    {
        id: -1,
        label: translate('feedbackScreen.rightFromApp'),
    }, {
        id: 1,
        label: translate('feedbackScreen.notFromApp'),
    }
]

const initialState = {
    value: '',
    isSelectedChoice: false,
    btnSelect: BUTTON_SLECTE,
    selectedChoice: {},
}

export const FeedbackScreen = observer(function FeedbackScreen() {

    const [{ value, btnSelect, isSelectedChoice, selectedChoice }, setState] = useState(initialState)

    const navigation = useNavigation()

    const onChangeText = (text) => setState(prev => ({
        ...prev,
        value: text
    }))

    const onPressButton = (index: number) => {
        setState(prev => ({
            ...prev,
            selectedChoice: {
                [index]: !selectedChoice[index],
                [index *= -1]: selectedChoice[index *= -1]
            }
        }))
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={CONTAINER}>
                    <View style={CONTENT}>
                        <View style={ROW}>
                            <Text text={translate('feedbackScreen.canYouAgreeJob')} />
                        </View>

                        <View style={{ ...ROW, flexDirection: 'row' }}>
                            {btnSelect.length && btnSelect.map((button, index) => (
                                <Button
                                    key={index}
                                    activeOpacity={1}
                                    testID={`btn-select-${index + 1}`}
                                    text={button.label}
                                    style={{ ...BUTTON, backgroundColor: Object.keys(selectedChoice).length && selectedChoice[button.id] ? color.primary : color.disable }}
                                    textStyle={BUTTON_TEXT}
                                    onPress={() => onPressButton(button.id)} />)
                            )}
                        </View>

                        <View style={ROW}>
                            <Text text={translate('feedbackScreen.canYouHowMuch')} />
                        </View>

                        <View style={{ ...ROW, marginLeft: 'auto', width: '100%' }}>
                            <TextInput textAlign={'right'} placeholder={translate('feedbackScreen.price')} keyboardType={'numeric'} style={TEXT_INPUT} />
                        </View>

                        <View style={ROW}>
                            <Text text={translate('feedbackScreen.countRating')} />
                        </View>

                        <View style={ROW}>
                            <RatingStart
                                size={38}
                                colorActive={color.primary}
                                colorInActive={color.disable}
                                countIcon={5}
                                isHorizontal={true}
                                space={spacing[1]}
                                onToggle={(count) => console.log(count)}
                            />
                        </View>

                        <View style={ROW}>
                            <Text text={translate('feedbackScreen.moreAdvice')} />
                        </View>

                        <View style={{ ...ROW, width: '100%' }} >
                            <TextInput
                                style={TEXT_AREA}
                                autoFocus={false}
                                editable
                                multiline
                                numberOfLines={4}
                                onChangeText={text => onChangeText(text)}
                                value={value}
                            />
                        </View>
                    </View>

                    <View style={BOTTOM_CONTAINER}>
                        <Button
                            testID="call-with-owner"
                            style={CALL_BUTTON}
                            textStyle={CALL_TEXT}
                            text={translate('common.confirm')}
                            onPress={() => navigation.navigate('jobDetaili')}
                        />
                    </View>

                </View>

            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
})