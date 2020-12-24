// For more info on how to write Detox tests, see the official docs:
// https://github.com/wix/Detox/blob/master/docs/README.md
// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sleep = duration =>
  new Promise(resolve => setTimeout(() => resolve(), duration)); // function for pausing the execution of the test. Mainly used for waiting for a specific UI component to appear on the screen
describe("CargoLinkMobile", () => {

  beforeAll(async () => {
    // await device.reloadReactNative()
  })

  describe("Aithentication flow ", () => {
    it("navigation ไปหน้า verify otp เมื่อยืนยันเบอร์โทรศัพท์สำเร็จ", async () => {
      await expect(element(by.id("SigninScreen"))).toBeVisible()
      await element(by.id('phone-number-signin')).typeText('929818252');
      await element(by.id('continue-with-signin')).tap();
    })

    it("navigation ไปหน้า accept policy เมื่อยืนยัน otp สำเร็จ", async () => {
      await element(by.id('countdown-otp')).typeText('1231');
      await element(by.id('continue-with-otp')).tap();
      await waitFor(element(by.id('spinner-modal')).atIndex(0)).toBeVisible()
      await sleep(3000)
    })

    it("navigation ไปหน้า home เมื่อกดยอมรับ policy", async () => {
      const accept_button = element(by.id('accept-policy'))
      await accept_button.tap();
      await waitFor(element(by.id('spinner-modal')).atIndex(0)).toBeVisible()
      await sleep(2000)
    })
  })

  describe("Create & Update vehicle flow", () => {
    it("navigation ไปหน้า รถของฉัน เมื่อกดเมนูจัดการรถ", async () => {
      await waitFor(element(by.id('touch-home-grid')).atIndex(0)).toBeVisible().withTimeout(3000)
      await element(by.id('touch-home-grid')).atIndex(0).tap()
    })

    it("navigation ไปหน้า เพิ่มรถ เมื่อกดเมนู จัดการรถ", async () => {
      await element(by.id('add-new-vahicle')).tap()
    })

    it("navigation ไปหน้าแสดงสถานะการเพิ่มรถ เมื่อกรอกข้อมูลถูกต้อง และกดปุ่ม เพิ่มรถของฉัน ", async () => {
      await waitFor(element(by.id('registration-vehicle-input'))).toBeVisible().withTimeout(2000) // PASS
      await element(by.id('registration-vehicle-input')).atIndex(0).typeText('1234-FS');  // PASS
      await element(by.id('upload-vehicle-height')).typeText('2.5');  // PASS
      await element(by.id('upload-vehicle-height')).tapReturnKey();  // PASS

      await element(by.id('scrollView')).scrollTo('bottom');

      // await element(by.id('android_touchable_wrapper')).tap()
      // await element(by.id('android_picker_headless')).tap()
      // await element(by.id('android_picker')).tap()
      // await element(by.id('input_accessory_view')).toBeVisible()
      // await element(by.id('android_picker')).toBeVisible()
      // await element(by.label('ภูมิภาค')).tap()
      // .withDescendant(by.id('android_picker'))).tap();

      await expect(element(by.id("submit-vehicle"))).toBeVisible()
      await element(by.id('submit-vehicle')).tap()
    })

    it("navigation ไปหน้า home เมื่อกดปุ่ม ตกลง ", async () => {
      await element(by.id('success-vehicle-detail')).tap()
    })

    it("navigation ไปหน้าแสดงข้อมูล รถของฉัน เมื่อกด list รายการรถในหน้า รถของฉัน ", async () => {

      await waitFor(element(by.id('touch-home-grid')).atIndex(0)).toBeVisible()
      await element(by.id('touch-home-grid')).atIndex(0).tap()


      await element(by.id('list-vehicle')).atIndex(0).tap()
      await element(by.id('edit-vehicle-detail')).atIndex(0).tap()
    })

    it("navigation ไปหน้าแก้ไขข้อมูลรถ เมื่อกดปุ่ม แก้ไข ", async () => {
      await waitFor(element(by.id('registration-vehicle-input'))).toBeVisible().withTimeout(2000) // PASS
      await element(by.id('registration-vehicle-input')).clearText();
      await element(by.id('registration-vehicle-input')).atIndex(0).typeText('1234-FS');  // PASS

      await element(by.id('upload-vehicle-height')).clearText();
      await element(by.id('upload-vehicle-height')).typeText('2.5');  // PASS
      await element(by.id('upload-vehicle-height')).tapReturnKey();  // PASS


      // await element(by.id('scrollView')).scrollTo('bottom');
      await element(by.id('scrollView')).scrollTo('bottom');

      await expect(element(by.id("submit-vehicle"))).toBeVisible()
      await element(by.id('submit-vehicle')).tap()
      // await element(by.id('success-vehicle-detail')).tap()
    })

    it("navigation ไปหน้าแสดงสถานะการแก้ไข เมื่อกรอกข้อมูลถูกต้อง และกดปุ่ม แก้ไข ", async () => {
      await element(by.id('success-vehicle-detail')).tap()
    })
  })

})
