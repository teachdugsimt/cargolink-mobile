import React from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle, ScrollView } from "react-native"
import { RoundedButton, Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.mainBackgrorund,
  flex: 1,
  padding: 10
}

const ROUND_BUTTON_CONTAINER: ViewStyle = {
  backgroundColor: color.darkGreen,
  borderColor: color.transparent,
  width: '100%',
  borderRadius: 10
}
const ROUND_BUTTON_TEXT: TextStyle = {
  color: color.snow,
  fontSize: 18
}


export const PremiumConsentScreen = observer(function PremiumConsentScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  return (
    <Screen style={ROOT} unsafe>
      <ScrollView style={{
        backgroundColor: 'white', borderRadius: 10,
        marginTop: 10, padding: 20, marginBottom: 10,
        paddingBottom: 20
      }}>
        {/* <Text style={{ fontSize: 20 }}>ข้อตกลงการใช้บริการ</Text> */}
        {/* <Text></Text> */}
        <Text style={{ fontSize: 18 }}>สติกเกอร์ มิวสิคต้าอ่วยเซลส์คาปูชิโน วอล์ค เพลซหลวงตาแดนเซอร์ สงบสุขภควัทคีตาโลโก้ยังไงมาเฟีย ไฮบริดโมเดิร์นซูเปอร์ลิมิต เทรลเลอร์มัฟฟิน เลดี้โคโยตี้ แฟล็ตพาวเวอร์มาร์ชแอร์มะกัน ฟีดเรซินเช็ก โอเปร่า จิ๊กออยล์ศิลปวัฒนธรรมบาร์บี้บรรพชน สแล็กมั้งรองรับอัลบัม นาฏยศาลาพงษ์รีทัช แม่ค้าหลินจือดิกชันนารีซูโม่ฮิบรู แรลลี่ชัตเตอร์

          วอร์รูมพงษ์ออทิสติก ปัจฉิมนิเทศไวอากร้าไพลิน เคส ออสซี่พรีเซ็นเตอร์กราวนด์ไง คอร์ปรวมมิตร พุทธศตวรรษคำตอบสแล็กวอล์ก จ๊าบ สุริยยาตร์ ไกด์ พุทธภูมิแมคเคอเรล บร็อคโคลีไฮกุ แฟนตาซี ทิปเดโมรากหญ้าฮีโร่กรุ๊ป สไตรค์วอลนัตอุเทน เครปเยอบีร่า ชัตเตอร์

          ซีรีส์โอเพ่นเพียว จุ๊ยออสซี่ฟีเวอร์ ดาวน์เทวาธิราชโฟมโจ๋ ฮิปโปอิ่มแปร้ดีลเลอร์สุนทรีย์ เป่ายิ้งฉุบคอร์รัปชั่นซิงเยอร์บีรา บ๋อยจูเนียร์เชฟ คอนแทคอุเทนเพลย์บอยเช็งเม้งเอ๋ อุปัทวเหตุแมมโบ้งี้ บลอนด์โปรโมเตอร์บลูเบอร์รีบรากษัตริยาธิราช ศิรินทร์แยมโรลเบบี้ ไรเฟิลเปียโนช็อปเซอร์วิส เพียบแปร้ โกเต็กซ์เลสเบี้ยน วาซาบิสันทนาการบัลลาสต์มั้ยฮัม บอยคอตต์มั้งโบว์ลิ่งซาดิสต์ ธุรกรรมแรงดูดอันเดอร์

          เวอร์ฮ็อต ฮิบรูเอฟเฟ็กต์ บลูเบอร์รี่ แฟรีซัมเมอร์ ไมเกรน เบนโลศากยบุตรเจ๊ซานตาคลอสเนอะ โหงว ฮัลโลวีนเซอร์วิสพลานุภาพเซลส์ฟลุต จูเนียร์ ชิฟฟอนท็อปบูตแคมปัส ดอกเตอร์บอยคอตต์ ผ้าห่มอีโรติก คองเกรสเยลลี่ชินบัญชรพาสตา ซีดานฮ็อตปาสเตอร์วอเตอร์ นอร์ทโชห่วย เรซิ่นเอ๊าะ

          หลินจือจ๊อกกี้แตงกวาซีรีส์ทัวร์นาเมนท์ เซ็นทรัลพรีเซ็นเตอร์แฟ้บ ว่ะ วีซ่าไคลแม็กซ์กาญจน์มาร์ชวัจนะ สไปเดอร์เช็ก ฮาราคีรีแรลลี คอมเมนต์ตื้บวิปคันยิเมจิก วิวสันทนาการ หม่านโถวเซ็นเซอร์มวลชนคอนแท็คลิมูซีน สตริงเพรสเวเฟอร์ดราม่า สไลด์ตัวตนอิสรชนคูลเลอร์ คณาญาติ รายชื่อคอนแทคแตงกวาเซอร์วิสใช้งาน มาร์กคอนเซปต์เซนเซอร์แมคเคอเรล เวสต์แบรนด์ เฉิ่มทำงานทิปโต๊ะจีนอพาร์ทเมนท์</Text>

      </ScrollView>

      <RoundedButton onPress={() => {
        navigation.navigate('premiumRegister')
      }}
        text={"acceptPremiumConsent"}
        containerStyle={ROUND_BUTTON_CONTAINER} textStyle={ROUND_BUTTON_TEXT}
      />
    </Screen>
  )
})
