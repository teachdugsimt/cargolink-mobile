
var fs = require('fs')
const TARGET_FILE = "./node_modules/react-native-screens/ios/RNSScreenStackHeaderConfig.m"
const FROM_FILE = "./start-script/RNSScreenStackHeaderConfig.m"
const replaceFile = (form, to) => {
  const result_from_file = fs.readFileSync(form, { encoding: 'utf8' })
  fs.writeFileSync(to, result_from_file);
}
replaceFile(FROM_FILE, TARGET_FILE)
