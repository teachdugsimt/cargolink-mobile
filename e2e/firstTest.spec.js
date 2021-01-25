const sleep = duration =>
  new Promise(resolve => setTimeout(() => resolve(), duration)); // function for pausing the execution of the test. Mainly used for waiting for a specific UI component to appear on the screen
describe("CargoLinkMobile", () => {

  beforeAll(async () => {
    // await device.reloadReactNative()
  })

  describe("Aithentication flow ", () => {
    it("navigate ไปหน้า verify otp เมื่อยืนยันเบอร์โทรศัพท์สำเร็จ", async () => {
      await expect(element(by.id("SigninScreen"))).toBeVisible()
      await element(by.id('phone-number-signin')).typeText('929818252');
      await element(by.id('continue-with-signin')).tap();
    })

    it("navigate ไปหน้า accept policy เมื่อยืนยัน otp สำเร็จ", async () => {

      let slot_text_field = {
        slot1: element(by.id('textInput')).atIndex(0),
        slot2: element(by.id('textInput')).atIndex(1),
        slot3: element(by.id('textInput')).atIndex(2),
        slot4: element(by.id('textInput')).atIndex(3),
      }
      await slot_text_field.slot1.typeText('1');
      await slot_text_field.slot2.typeText('2');
      await slot_text_field.slot3.typeText('3');
      await slot_text_field.slot4.typeText('5');

      // await element(by.id('textInput')).tapReturnKey()
      // await element(by.id('continue-with-otp')).tap();
      // await sleep(2000)
    })

      it("navigate ไปหน้า home เมื่อกดยอมรับ policy", async () => {
        const accept_button = element(by.id('accept-policy'))
        await accept_button.tap();
        await waitFor(element(by.id('spinner-modal')).atIndex(0)).toBeVisible()
        await sleep(2000)
      })
    })

    describe("Create & Update vehicle flow", () => {
      it("navigate ไปหน้า รถของฉัน เมื่อกดเมนูจัดการรถ", async () => {
        await waitFor(element(by.id('touch-home-grid')).atIndex(0)).toBeVisible().withTimeout(3000)
        await element(by.id('touch-home-grid')).atIndex(0).tap()
      })

      it("navigate ไปหน้า เพิ่มรถ เมื่อกดเมนู จัดการรถ", async () => {
        await element(by.id('add-new-vahicle')).tap()
      })








      it("navigate ไปหน้าแสดงสถานะการเพิ่มรถ เมื่อกรอกข้อมูลถูกต้อง และกดปุ่ม เพิ่มรถของฉัน ", async () => {
        await waitFor(element(by.id('registration-vehicle-input'))).toBeVisible().withTimeout(2000) // PASS

        await waitFor(element(by.id('android_touchable_wrapper'))).toBeVisible()
        await element(by.id('android_picker_headless').withAncestor(by.id('android_touchable_wrapper'))).atIndex(0).tap()
        await element(by.text('รถ 6 ล้อตู้คอก')).tap()

        await element(by.id('registration-vehicle-input')).atIndex(0).typeText('1234-FS');  // PASS
        await element(by.id('upload-vehicle-height')).typeText('2.5');  // PASS
        await element(by.id('upload-vehicle-height')).tapReturnKey();  // PASS

        // await element(by.id('scrollViewUpload')).scroll(100, 'down');
        // await waitFor(element(by.id('select-image')).atIndex(0)).toBeVisible()
        // await element(by.id('select-image')).atIndex(0).tap()  // open choose file


        await element(by.id('scrollViewUpload')).scrollTo('bottom');


        await element(by.id('android_picker_headless').withAncestor(by.id('android_touchable_wrapper'))).atIndex(1).tap()
        await element(by.text('ภาคเหนือ')).tap()

        await element(by.id('android_picker_headless').withAncestor(by.id('android_touchable_wrapper'))).atIndex(2).tap()
        await element(by.text('เชียงใหม่')).tap()


        await expect(element(by.id("submit-vehicle"))).toBeVisible()
        await element(by.id('submit-vehicle')).tap()
      })

      it("navigate ไปหน้า home เมื่อกดปุ่ม ตกลง ", async () => {
        await element(by.id('success-vehicle-detail')).tap()
      })






      it("navigate ไปหน้าแสดงข้อมูล รถของฉัน เมื่อกด list รายการรถในหน้า รถของฉัน ", async () => {

        await waitFor(element(by.id('touch-home-grid')).atIndex(0)).toBeVisible()
        await element(by.id('touch-home-grid')).atIndex(0).tap()


        await element(by.id('list-vehicle')).atIndex(0).tap()
        await element(by.id('edit-vehicle-detail')).atIndex(0).tap()
      })

      it("navigate ไปหน้าแก้ไขข้อมูลรถ เมื่อกดปุ่ม แก้ไข ", async () => {

        await waitFor(element(by.id('android_touchable_wrapper'))).toBeVisible()
        await element(by.id('android_picker_headless').withAncestor(by.id('android_touchable_wrapper'))).atIndex(0).tap()
        await element(by.text('รถ 6 ล้อตู้คอก')).tap()

        await waitFor(element(by.id('registration-vehicle-input'))).toBeVisible() // PASS
        await element(by.id('registration-vehicle-input')).atIndex(0).clearText();
        await element(by.id('registration-vehicle-input')).atIndex(0).typeText('1234-FS');  // PASS

        await element(by.id('upload-vehicle-height')).clearText();
        await element(by.id('upload-vehicle-height')).typeText('2.5');  // PASS
        await element(by.id('upload-vehicle-height')).tapReturnKey();  // PASS


        await element(by.id('scrollViewUpload')).scrollTo('bottom');

        await expect(element(by.id("submit-vehicle"))).toBeVisible()
        await element(by.id('submit-vehicle')).tap()
      })

      it("navigate ไปหน้าแสดงสถานะการแก้ไข เมื่อกรอกข้อมูลถูกต้อง และกดปุ่ม แก้ไข ", async () => {
        await element(by.id('success-vehicle-detail')).tap()
      })

  })

})
