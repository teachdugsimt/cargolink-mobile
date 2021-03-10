import React, { useState, useEffect, FunctionComponent as Component } from "react"
import { Text, View, Alert, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { color, spacing, typography } from "../../theme"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { Observer, observer } from "mobx-react-lite"
import ProfileStore from '../../store/profile-store/profile-store'
import { useNavigation } from "@react-navigation/native"

interface PropsMockHeader {
  text?: string
  tx?: string
}
const DOT: ViewStyle = {
  position: 'absolute',
  right: 0,
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: color.red,
}
const FLOAT_DOT: ViewStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
}
const TEXT_COMMON: TextStyle = {
  color: color.textBlack,
  fontFamily: 'Kanit-Medium', fontSize: 16
}
export const RenderHeaderProfile = observer((props: PropsMockHeader) => {
  const { versatileStore, tokenStore } = useStores()
  const navigation = useNavigation()

  const _pressEditProfiel = () => {
    let token = tokenStore?.token?.accessToken || null
    if (!token || !ProfileStore.data) Alert.alert(translate("common.pleaseLogin"))
    else navigation.navigate("updateProfile")
  }

  let showRedDot = null
  if (!ProfileStore.data || !ProfileStore.data.fullName && !tokenStore.token || !tokenStore.token.accessToken) {
    showRedDot = false
  } else if (!ProfileStore.data || !ProfileStore.data.fullName) {
    showRedDot = true
  } else {
    showRedDot = false
  }
  const { text } = props
  useEffect(() => {
  }, [versatileStore.language])
  return (
    <View>
      <Observer>{() =>
        <TouchableOpacity onPress={_pressEditProfiel}>
          <Text style={TEXT_COMMON}>{translate(text, { locale: versatileStore.language })}
          </Text>
          {showRedDot && <View style={FLOAT_DOT}>
            <View style={DOT} />
          </View>}
        </TouchableOpacity>}
      </Observer>
    </View>
  )
})
