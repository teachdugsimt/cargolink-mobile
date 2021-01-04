module.exports = {
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "HTML Report for Cargo Link Mobile",
        outputPath: "ut-report/index.html",
        includeFailureMsg: true,
      },
    ],
  ],
  moduleNameMapper: {
    "^react-native": "react-native-web",
  },
  globals: {
    __DEV__: true,
  },
  testEnvironment: "node",
}
