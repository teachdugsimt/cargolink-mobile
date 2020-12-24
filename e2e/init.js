const detox = require("detox")
const config = require("../package.json").detox
const adapter = require("detox/runners/jest/adapter")
const specReporter = require('detox/runners/jest/specReporter');

jest.setTimeout(120000)
jasmine.getEnv().addReporter(adapter)
// This takes care of generating status logs on a per-spec basis. By default, jest only reports at file-level.
// This is strictly optional.
jasmine.getEnv().addReporter(specReporter);

beforeAll(async () => {
  try {
    await detox.init(config);
  } catch (e) {
    await detox.cleanup();
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.exit(1);
  }
})

beforeEach(async () => {
  await adapter.beforeEach()
})

afterAll(async () => {
  await adapter.afterAll()
  await detox.cleanup()
  // let data = getFile()
  // console.log("DATA HERE FILE NAME :: ", data)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
