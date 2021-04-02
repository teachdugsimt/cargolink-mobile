import { Platform, StyleSheet } from 'react-native'
import { color } from '../../../theme';
export default StyleSheet.create({
  rowCenter: { flexDirection: 'row', justifyContent: 'center', marginTop: 60 },
  buttonBack: {
    borderRadius: 11, backgroundColor: color.disable, position: 'absolute', left: 10, top: 10
  },
  paddingTop10: { paddingTop: 7.5 },
  map: {
    flex: 1
  },
  marker: {
    width: 30, height: 49,
    // backgroundColor: 'green'
  },
  markerFixed: {
    left: "50%",
    marginLeft: -15,
    marginTop: -49,
    position: "absolute",
    top: "50%",
  },
  addressText: {
    color: "black",
    marginLeft: 12.5,
    marginTop: 5,
    fontSize: 18,
    fontFamily: "Kanit-Medium",
  },
  star: {
    marginTop: 5,
    fontSize: 18,
    color: color.red,
    marginLeft: 3,
  },
  footer: {
    backgroundColor: "white",
    bottom: 35,
    position: "absolute",
    width: "100%",
    height: "25%",
    borderRadius: 5
  },
  panelFill: {
    position: "absolute",
    top: 0,
    alignSelf: "stretch",
    right: 0,
    left: 0,
  },
  panel: {
    position: "absolute",
    top: 0,
    alignSelf: "stretch",
    right: 0,
    left: 0,
    flex: 1,
  },
  panelHeader: {
    //add custom header
  },
  buttonSubmit: {
    width: "40%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: color.primary,
    borderRadius: 16.5,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android 
    marginRight: 10
  },
  inputAddressFinal: {
    marginBottom: 5,
    padding: 10,
    width: "90%",
    minHeight: 80,
    alignSelf: "center",
    borderColor: color.mainGrey,
    borderWidth: 1,
    fontSize: 15,
    borderRadius: 5,
    flex: 0.5,
    alignContent: "flex-start",
    textAlignVertical: "top",
    fontFamily: "Kanit-Medium",
    backgroundColor: color.grey
  }
});

