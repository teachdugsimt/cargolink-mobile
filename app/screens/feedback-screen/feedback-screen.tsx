import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Keyboard, View, ViewStyle, TouchableWithoutFeedback, TextInput, TextStyle, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import { Button, Text, RatingStart, Screen } from '../../components'
import { translate } from '../../i18n'
import { color, spacing } from '../../theme'
import { useNavigation } from '@react-navigation/native'
import ShipperJobStore from '../../store/shipper-job-store/shipper-job-store'

const CONTAINER: ViewStyle = {
  // flex: 1,
}
const CONTENT: ViewStyle = {
  // flex: 1,
  // alignItems: 'center',
  justifyContent: 'center',
}
const ROW: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  marginVertical: spacing[1] - 2,
  backgroundColor: color.backgroundWhite,
}
const TEXT_INPUT: TextStyle = {
  padding: spacing[3],
  borderColor: color.transparent,
  borderWidth: 1,
  borderRadius: spacing[1],
}
const TEXT_AREA: TextStyle = {
  height: 120,
  borderWidth: 1,
  borderColor: color.mainGrey,
  borderRadius: spacing[1],
  padding: spacing[3],
  textAlignVertical: 'top',
  fontFamily: 'Kanit-Medium'
}
const BUTTON: ViewStyle = {
  flex: 1,
  borderRadius: Dimensions.get('window').height / 2,
  // width: 120,
  marginHorizontal: spacing[2],
  paddingVertical: spacing[1] + 2,
  borderWidth: 1,
  borderColor: color.dim,
}
const BUTTON_TEXT: TextStyle = {
  color: color.textBlack,
  fontSize: 12,
}
const BOTTOM_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundWhite,
  padding: spacing[4],
  width: Dimensions.get('window').width,
  marginTop: spacing[1] - 2,
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
const ROW_CONTENT: ViewStyle = {
  paddingTop: spacing[4],
  paddingBottom: spacing[2],
}

const BUTTON_SLECTE = [
  {
    id: 0,
    value: 'CARGOLINK',
    label: translate('feedbackScreen.rightFromApp'),
  }, {
    id: 1,
    value: 'OTHER',
    label: translate('feedbackScreen.notFromApp'),
  }, {
    id: 2,
    value: 'CANCELJOB',
    label: translate('feedbackScreen.cancel')
  }
]

export const FeedbackScreen = observer(function FeedbackScreen() {

  const [countStar, setCountStar] = useState<number>(0)
  const [dealingPrice, setDealingPrice] = useState<string>(null)
  const [doneFrom, setDoneFrom] = useState<"CARGOLINK" | "OTHER" | "CANCELJOB">(null)
  const [opinion, setOpinion] = useState<string>(null)

  const navigation = useNavigation()

  useEffect(() => {
    return () => {
      // setSelectedChoice({})
      ShipperJobStore.setJobId(null)
    }
  }, [])

  const onPressButton = (value: "CARGOLINK" | "OTHER" | "CANCELJOB") => {
    setDoneFrom(value)
  }

  const onSubmit = () => {
    console.log('ShipperJobStore.jobId :>> ', ShipperJobStore.jobId);
    console.log('countStar :>> ', countStar);
    console.log('dealingPrice :>> ', dealingPrice);
    console.log('doneFrom :>> ', doneFrom);
    console.log('opinion :>> ', opinion);
    ShipperJobStore.rating({
      jobId: ShipperJobStore.jobId,
      rating: countStar,
      dealingPrice: +dealingPrice,
      doneFrom: doneFrom,
      opinion: opinion
    })
    navigation.goBack()
  }

  return (
    <Screen preset={'scroll'} unsafe>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
      <View style={CONTAINER}>
        <View style={CONTENT}>
          <View style={ROW}>
            <Text text={translate('feedbackScreen.canYouAgreeJob')} />
            <View style={[ROW_CONTENT, { flexDirection: 'row' }]}>
              {BUTTON_SLECTE.length && BUTTON_SLECTE.map((button: any, index: number) => (
                <Button
                  key={index}
                  activeOpacity={1}
                  testID={`btn-select-${index + 1}`}
                  text={button.label}
                  style={{
                    ...BUTTON,
                    backgroundColor: button.value === doneFrom ? color.primary : color.transparent,
                    borderColor: button.value === doneFrom ? color.primary : color.disable,
                  }}
                  textStyle={BUTTON_TEXT}
                  onPress={() => onPressButton(button.value)} />)
              )}
            </View>
          </View>

          <View style={ROW}>
            <Text text={translate('feedbackScreen.canYouHowMuch')} />
            <View style={[ROW_CONTENT, { flexDirection: 'row', alignItems: 'center' }]}>
              <Text tx={'feedbackScreen.price'} style={{ flexBasis: '10%' }} />
              <TextInput
                value={dealingPrice}
                textAlign={'right'}
                placeholder={translate('common.count')}
                keyboardType={'numeric'}
                style={[TEXT_INPUT, { flexBasis: '80%' }]}
                onChangeText={setDealingPrice}
              />
              <Text tx={'common.bath'} style={{ flexBasis: '10%', textAlign: 'right' }} />
            </View>
          </View>


          <View style={ROW}>
            <Text text={translate('feedbackScreen.countRating')} />
            <View style={[ROW_CONTENT, { alignItems: 'center' }]}>
              <RatingStart
                size={38}
                colorActive={color.primary}
                colorInActive={color.disable}
                countIcon={5}
                isHorizontal={true}
                space={spacing[1]}
                onToggle={(count) => setCountStar(count)}
              />
            </View>
          </View>


          <View style={ROW}>
            <Text text={translate('feedbackScreen.moreAdvice')} />
            <View style={{ ...ROW_CONTENT, width: '100%' }} >
              <TextInput
                style={TEXT_AREA}
                autoFocus={false}
                editable
                multiline
                numberOfLines={4}
                placeholder={translate('feedbackScreen.moreAdviceNotMandatory')}
                onChangeText={setOpinion}
                value={opinion}
              />
            </View>
          </View>

        </View>

        <View style={BOTTOM_CONTAINER}>
          <Button
            disabled={!doneFrom}
            testID="call-with-owner"
            style={[CALL_BUTTON, { backgroundColor: !doneFrom ? color.line : color.success }]}
            textStyle={CALL_TEXT}
            text={translate('common.confirm')}
            onPress={() => onSubmit()}
          />
        </View>

      </View>

      {/* </TouchableWithoutFeedback> */}
    </Screen>
  )
})
