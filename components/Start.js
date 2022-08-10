import React from "react";
import { View, Text, Button, TextInput, StyleSheet, Pressable, ImageBackground, TouchableOpacity, KeyboardAvoidingView } from "react-native";

// background image
import BackgroundImage from '../assets/chatappbackground.png';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            bgColor: "",
        };
    }

    // function to update the state with the new background color for Chat Screen chosen by the user
    changeBgColor = (newColor) => {
        this.setState({ bgColor: newColor });
    };

    // backgroud colors to choose
    colors = {
        black: "#090C08",
        purple: "#474056",
        grey: "#8A95A5",
        green: "#B9C6AE",
    };
    render() {
        return (
            // Components to create the color arrays, titles and the app's colors
            <View style={styles.container}>
                <ImageBackground
                    source={BackgroundImage} 
                    resizeMode="cover"
                    style={styles.imagebg}
                >
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>Welcome!</Text>
                    </View>

                    <View style={styles.inputMain}>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={ styles.input }
                                onChangeText={(name) => this.setState({ name })}
                                value={this.state.name}
                                placeholder="Your Name ..."
                            />
                        </View>
                    </View>

                    <View style={styles.colorBox}>
                        <Text style={[styles.chooseColor]}>
                            {" "}
                            Click to choose background color!{" "}
                        </Text>
                    </View>

                    {/* All the colors to change the background are here! */}
                    <View style={styles.colorArray}>
                        <TouchableOpacity
                            style={[styles.color1, styles.shadowPropCircle]}
                            onPress={() => this.changeBgColor(this.colors.black)}
                        ></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.color2, styles.shadowPropCircle]}
                            onPress={() => this.changeBgColor(this.colors.purple)}
                        ></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.color3, styles.shadowPropCircle]}
                            onPress={() => this.changeBgColor(this.colors.grey)}
                        ></TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.color4, styles.shadowPropCircle]}
                            onPress={() => this.changeBgColor(this.colors.green)}
                        ></TouchableOpacity>
                    </View>


                <Pressable
                    style={styles.button}                                                            
                    onPress={() =>
                        this.props.navigation.navigate("Chat", {
                            name: this.state.name,
                            bgColor: this.state.bgColor,
                        })
                    }
                >
                    <Text style={styles.buttonText}>Start Chatting</Text>                        
                </Pressable>
                </ImageBackground>

                {/* /* fix error on display of keyboard for android devices  */}
                {Platform.OS === "android" ? (
                <KeyboardAvoidingView behavior="height" />
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imagebg: {
      flex: 1,
      justifyContent: "space-evenly",
      alignItems: 'center',
      width: "100%",
    },
    titleBox: {
        height: "40%",
        width: "88%",
        alignItems: "center",
        paddingTop: 100,
    },
    title: {
        fontSize: 45,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    textinput: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "lightgray",
        borderRadius: 5 
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    button: {
        width: "75%",
        height: 70,
        borderRadius: 8,
        backgroundColor: "#757083",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        marginBottom: 40,
    },
    container: {
        flex: 1,
    },
    inputMain: {
        height: "46%",
        width: "75%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    inputBox: {
        backgroundColor: "#D2B4BC",
        borderWidth: 2,
        borderRadius: 1,
        borderColor: "grey",
        width: "75%",
        height: 60,
        paddingLeft: 20,
        flexDirection: "row",
        alignItems: "center",
        opacity: .9,
    },
    input: {
        marginLeft:10,
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        width:"100%",
    },
    colorBox: {
        width: "75%",
        paddingBottom: 25,
    },
    chooseColor: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 100,
        backgroundColor: "#D2B4BC",
        borderWidth: 2,
        borderRadius: 20,
        borderColor: "grey",
        height: 40,
        paddingLeft: 20,
        paddingTop: 7,
        flexDirection: "row",
        alignItems: "center",
    },
    colorArray: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "75%",
        paddingBottom: 25,
        marginTop: 15,
    },
    color1: {
        backgroundColor: "#090C08",
        width: 50,
        height: 50,
        borderRadius: 25,
    },    
    color2: {
        backgroundColor: "#474056",
        width: 50,
        height: 50,
        borderRadius: 25,
    },    
    color3: {
        backgroundColor: "#8A95A5",
        width: 50,
        height: 50,
        borderRadius: 25,
    },    
    color4: {
        backgroundColor: "#B9C6AE",
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    shadowPropCircle: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
    
        elevation: 24,
    },

})