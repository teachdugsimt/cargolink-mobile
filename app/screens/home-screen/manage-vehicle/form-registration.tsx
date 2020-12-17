import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';


const FormRegistration = () => {


    const [textInput, settextInput] = useState([])
    const [inputData, setinputData] = useState([])

    //function to add TextInput dynamically
    const addTextInput = (index) => {
        let textInputTmp = textInput;
        textInputTmp.push(<TextInput style={styles.textInput}
            onChangeText={(text) => addValues(text, index)} />);
        settextInput(textInputTmp);
    }

    //function to remove TextInput dynamically
    const removeTextInput = () => {
        let textInputTmp = textInput;
        let inputDataTmp = inputData;
        textInputTmp.pop();
        inputDataTmp.pop();
        settextInput(textInputTmp)
        setinputData(inputDataTmp)
    }

    //function to add text from TextInputs into single array
    const addValues = (text, index) => {
        let dataArray = inputData;
        let checkBool = false;
        if (dataArray.length !== 0) {
            dataArray.forEach(element => {
                if (element.index === index) {
                    element.text = text;
                    checkBool = true;
                }
            });
        }
        if (checkBool) {
            setinputData(dataArray)

        }
        else {
            dataArray.push({ 'text': text, 'index': index });
            setinputData(dataArray)
        }
    }

    //function to console the output
    const getValues = () => {
        console.log('Data', inputData);
    }


    return (
        <View>
            <View style={styles.row}>
                <View style={{ margin: 10 }}>
                    <Button title='Add' onPress={() => addTextInput(textInput.length)} />
                </View>
                <View style={{ margin: 10 }}>
                    <Button title='Remove' onPress={() => removeTextInput()} />
                </View>
            </View>
            {textInput.map((value) => {
                return value
            })}
            <Button title='Get Values' onPress={() => getValues()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    buttonView: {
        flexDirection: 'row'
    },
    textInput: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        margin: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
});

export default FormRegistration;

















// import React, { Component } from 'react';
// import { View, TextInput, Button, StyleSheet } from 'react-native';


// class FormRegistration extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             textInput: [],
//             inputData: []
//         }
//     }

//     //function to add TextInput dynamically
//     addTextInput = (index) => {
//         let textInput = this.state.textInput;
//         textInput.push(<TextInput style={styles.textInput}
//             onChangeText={(text) => this.addValues(text, index)} />);
//         this.setState({ textInput });
//     }

//     //function to remove TextInput dynamically
//     removeTextInput = () => {
//         let textInput = this.state.textInput;
//         let inputData = this.state.inputData;
//         textInput.pop();
//         inputData.pop();
//         this.setState({ textInput, inputData });
//     }

//     //function to add text from TextInputs into single array
//     addValues = (text, index) => {
//         let dataArray = this.state.inputData;
//         let checkBool = false;
//         if (dataArray.length !== 0) {
//             dataArray.forEach(element => {
//                 if (element.index === index) {
//                     element.text = text;
//                     checkBool = true;
//                 }
//             });
//         }
//         if (checkBool) {
//             this.setState({
//                 inputData: dataArray
//             });
//         }
//         else {
//             dataArray.push({ 'text': text, 'index': index });
//             this.setState({
//                 inputData: dataArray
//             });
//         }
//     }

//     //function to console the output
//     getValues = () => {
//         console.log('Data', this.state.inputData);
//         this.props.getRegistrationField(this.state.inputData)
//     }


//     render() {
//         return (
//             <View>
//                 <View style={styles.row}>
//                     <View style={{ margin: 10 }}>
//                         <Button title='Add' onPress={() => this.addTextInput(this.state.textInput.length)} />
//                     </View>
//                     <View style={{ margin: 10 }}>
//                         <Button title='Remove' onPress={() => this.removeTextInput()} />
//                     </View>
//                 </View>
//                 {this.state.textInput.map((value) => {
//                     return value
//                 })}
//                 <Button title='Get Values' onPress={() => this.getValues()} />
//             </View>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'white',
//     },
//     buttonView: {
//         flexDirection: 'row'
//     },
//     textInput: {
//         height: 40,
//         borderColor: 'black',
//         borderWidth: 1,
//         margin: 20
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'center'
//     },
// });

// export default FormRegistration;