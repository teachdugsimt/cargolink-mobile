import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "../../components"
import { color, spacing } from "../../theme"
import CarrierHistoryStore from "../../store/carriers-history-call-store/carriers-history-call-store";
import ShipperHistoryStore from "../../store/shippers-history-call-store/shippers-history-call-store";
import { ShipperHistoryList } from "./history-call/shipper-history-list";
import { CarrierHistoryList } from "./history-call/carrier-history-list";

const FULL: ViewStyle = { flex: 1 }
const BORDER_RADIUS_LEFT: ViewStyle = {
  borderTopLeftRadius: spacing[1],
  borderBottomLeftRadius: spacing[1],
}
const BORDER_RADIUS_RIGHT: ViewStyle = {
  borderTopRightRadius: spacing[1],
  borderBottomRightRadius: spacing[1],
}
const TOUCHABLE_VIEW: ViewStyle = {
  flex: 1,
  alignItems: 'center',
}
const TEXT: TextStyle = {
  color: color.textBlack,
}
const ACTIVITY: ViewStyle = {
  flexDirection: 'row',
  marginVertical: spacing[4],
  marginHorizontal: spacing[3],
  borderRadius: spacing[2],
}
const ACTIVITY_TEXT_VIEW: TextStyle = {
  ...TEXT,
  paddingVertical: spacing[2],
}

export const HistoryCall = observer(function HistoryCall() {

  const [isActivitySwitch, setIsActivitySwitch] = useState<boolean>(false)

  useEffect(() => {
    if (!isActivitySwitch) {
      ShipperHistoryStore.find()
    } else {
      CarrierHistoryStore.find()
    }
  }, [isActivitySwitch])

  return (<View testID="FavoriteScreen" style={FULL}>

    <View style={ACTIVITY}>
      <TouchableOpacity activeOpacity={1} style={{ ...TOUCHABLE_VIEW, ...BORDER_RADIUS_LEFT, backgroundColor: !isActivitySwitch ? color.primary : color.disable }} onPress={() => setIsActivitySwitch(!isActivitySwitch)}>
        <Text tx={'favoriteScreen.carrier'} style={ACTIVITY_TEXT_VIEW} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} style={{ ...TOUCHABLE_VIEW, ...BORDER_RADIUS_RIGHT, backgroundColor: isActivitySwitch ? color.primary : color.disable }} onPress={() => setIsActivitySwitch(!isActivitySwitch)}>
        <Text tx={'favoriteScreen.productOwner'} style={ACTIVITY_TEXT_VIEW} />
      </TouchableOpacity>
    </View>

    {isActivitySwitch ? <CarrierHistoryList /> : <ShipperHistoryList />}

  </View>)
})
