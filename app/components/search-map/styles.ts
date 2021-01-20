import { StyleSheet } from 'react-native'
export default StyleSheet.create({
    map: {
        flex: 1
    },
    marker: {
        width: 30, height: 30
    },
    markerFixed: {
        left: "50%",
        marginLeft: -24,
        marginTop: -48,
        position: "absolute",
        top: "50%",
    },
    addressText: {
        color: "black",
        marginLeft: 3,
        marginTop: 12,
        fontFamily: "Kanit-Medium",
    },
    footer: {
        backgroundColor: "white",
        bottom: 0,
        position: "absolute",
        width: "100%",
        height: "30%",
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
});

