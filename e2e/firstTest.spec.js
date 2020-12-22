// For more info on how to write Detox tests, see the official docs:
// https://github.com/wix/Detox/blob/master/docs/README.md

describe("Example", () => {
  // beforeEach(async () => {
  //   await device.reloadReactNative()
  // })

  // it("should have Home screen", async () => {
  //   let button = [1, 2, 3, 4]
  //   await expect(element(by.id("touch-home-" + button[0].toString()))).toBeVisible()
  // })
  beforeAll(async () => {
    // await device.reloadReactNative()
  })
  it("should have Home screen", async () => {
    // let button = [1, 2, 3, 4]
    console.log("Come to first test case :: => ")
    console.log("Come to first test case :: => ")
    console.log("Come to first test case :: => ")
    console.log("Come to first test case :: => ")
    await expect(element(by.id("SigninScreen"))).toBeVisible()

    // await expect(Element(by.id("SigninScreen"))).toBeVisible()
  })

  // it("should go to next screen after tap", async () => {
  //   await element(by.id("next-screen-button")).tap()
  //   await expect(element(by.id("DemoScreen"))).toBeVisible()
  // })
})
