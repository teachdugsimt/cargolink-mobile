import React, { useState, useEffect, FunctionComponent as Component } from "react"
import { Text, View, TouchableOpacity } from 'react-native'
import { color, spacing, typography } from "../../theme"
import { translate } from "../../i18n"
import { useStores } from "../../models"
import { Observer, observer } from "mobx-react-lite"

interface PropsMockHeader {
  text?: string
  tx?: string
}

export const RenderHeader = observer((props: PropsMockHeader) => {

  const { text } = props
  const { versatileStore } = useStores()
  useEffect(() => {
  }, [versatileStore.language])
  return (
    <View>
      <Observer>{() =>
        <Text style={{
          color: color.textBlack,
          fontFamily: 'Kanit-Medium', fontSize: 16
        }}>{translate(text, { locale: versatileStore.language })}
        </Text>}
      </Observer>
    </View>
  )
})
