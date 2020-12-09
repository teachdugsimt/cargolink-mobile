import React, { useState } from 'react';
import { observer } from "mobx-react-lite"
import { Dimensions, ScrollView, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Button } from '../../components';
import { color } from "../../theme"
import { useNavigation } from '@react-navigation/native';

const ROOT: ViewStyle = {
  flex: 1,
  height: Dimensions.get("window").height,
  flexWrap: "nowrap",
  padding: 10,
  backgroundColor: color.backgroundWhite
}
const TITLE: TextStyle = {
  // flex: 1,
  fontSize: 16,
  fontWeight: "bold",
  textAlign: "center",
  paddingTop: 30,
  paddingBottom: 20,
  color: color.dim
}
const SCROLL_VIEW: ViewStyle = {
  // flex: 2,
  marginLeft: 10,
  marginRight: 10,
  backgroundColor: color.disable,
  borderRadius: 6
}
const CONTENT: TextStyle = {
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 10,
  paddingRight: 10,
  fontSize: 15
}
const BUTTON_ROOT: ViewStyle = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 20,
}
const CONTINUE_BUTTON: ViewStyle = {
  backgroundColor: color.disable,
  width: '100%',
  borderRadius: 20,
  marginBottom: 15
}
const CONTINUE_TEXT: TextStyle = {
  color: color.textWhite,
  fontSize: 14,
  paddingTop: 5,
  paddingBottom: 5
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export const AcceptPolicyScreen = observer(function AcceptPolicyScreen() {
  const navigation = useNavigation()
  // const [buttonColor, setButtonColor] = useState(color.disable)
  // const [disabled, setDisabled] = useState(true)

  return (
    <View style={ROOT}>
      <Text style={TITLE}>Term and condition</Text>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            console.log('End')
            // setButtonColor(color.primary)
            // setDisabled(false)
          }
        }}
        style={SCROLL_VIEW}
        scrollEventThrottle={400}
      >
        <Text style={CONTENT}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque libero, repudiandae ullam tempora nemo voluptates ipsum, voluptas laborum non in perferendis voluptate reiciendis vitae qui, molestias quam odit corrupti explicabo. lor
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum architecto quasi delectus maiores, laudantium, quos dolorem voluptates maxime ex, ea praesentium! Quibusdam sit possimus doloribus error odit quae deserunt blanditiis.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint alias atque soluta laboriosam debitis fugiat illum expedita non ratione labore magnam quod tempora ducimus, vero necessitatibus, odit nihil, quos earum!
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo dolor facere eos suscipit laudantium recusandae dignissimos tempora asperiores quis quaerat eligendi, voluptatem placeat eum vero sed inventore, similique necessitatibus iusto.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt fuga id debitis cumque modi officiis minima eaque similique adipisci aliquam. Corporis minus accusamus mollitia architecto natus eum ducimus? Totam, aspernatur!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto dolor beatae repellat blanditiis, maxime doloribus at suscipit sequi aspernatur ut enim dolores laborum sapiente consectetur nobis deserunt sed aliquam similique?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum architecto quasi delectus maiores, laudantium, quos dolorem voluptates maxime ex, ea praesentium! Quibusdam sit possimus doloribus error odit quae deserunt blanditiis.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint alias atque soluta laboriosam debitis fugiat illum expedita non ratione labore magnam quod tempora ducimus, vero necessitatibus, odit nihil, quos earum!
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo dolor facere eos suscipit laudantium recusandae dignissimos tempora asperiores quis quaerat eligendi, voluptatem placeat eum vero sed inventore, similique necessitatibus iusto.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt fuga id debitis cumque modi officiis minima eaque similique adipisci aliquam. Corporis minus accusamus mollitia architecto natus eum ducimus? Totam, aspernatur!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto dolor beatae repellat blanditiis, maxime doloribus at suscipit sequi aspernatur ut enim dolores laborum sapiente consectetur nobis deserunt sed aliquam similique?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum architecto quasi delectus maiores, laudantium, quos dolorem voluptates maxime ex, ea praesentium! Quibusdam sit possimus doloribus error odit quae deserunt blanditiis.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint alias atque soluta laboriosam debitis fugiat illum expedita non ratione labore magnam quod tempora ducimus, vero necessitatibus, odit nihil, quos earum!
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo dolor facere eos suscipit laudantium recusandae dignissimos tempora asperiores quis quaerat eligendi, voluptatem placeat eum vero sed inventore, similique necessitatibus iusto.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt fuga id debitis cumque modi officiis minima eaque similique adipisci aliquam. Corporis minus accusamus mollitia architecto natus eum ducimus? Totam, aspernatur!
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto dolor beatae repellat blanditiis, maxime doloribus at suscipit sequi aspernatur ut enim dolores laborum sapiente consectetur nobis deserunt sed aliquam similique?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum architecto quasi delectus maiores, laudantium, quos dolorem voluptates maxime ex, ea praesentium! Quibusdam sit possimus doloribus error odit quae deserunt blanditiis.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint alias atque soluta laboriosam debitis fugiat illum expedita non ratione labore magnam quod tempora ducimus, vero necessitatibus, odit nihil, quos earum!
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo dolor facere eos suscipit laudantium recusandae dignissimos tempora asperiores quis quaerat eligendi, voluptatem placeat eum vero sed inventore, similique necessitatibus iusto.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt fuga id debitis cumque modi officiis minima eaque similique adipisci aliquam. Corporis minus accusamus mollitia architecto natus eum ducimus? Totam, aspernatur!
      </Text>
      </ScrollView>
      <View style={BUTTON_ROOT}>
        <Button
          testID="continue-with-signin"
          style={{
            ...CONTINUE_BUTTON,
            backgroundColor: color.primary
          }}
          textStyle={CONTINUE_TEXT}
          text={'ยอมรับเงื่อนไข'}
          // disabled={disabled}
          onPress={() => navigation.navigate("home")}
        />
        <Button
          testID="continue-with-signin"
          style={CONTINUE_BUTTON}
          textStyle={CONTINUE_TEXT}
          text={'ไม่ยอมรับเงื่อนไข'}
          onPress={() => navigation.navigate("signin")}
        />
      </View>
    </View>
  )
});