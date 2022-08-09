import React from "react";
import { View, Text, Button, TextInput, StyleSheet, ImageBackground } from "react-native";

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            name: "",
            bgColor: "",
        };
    }
    render() {
        // carries over username from start.js
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        // carries over bgcolor from start.js
        const bgColor = this.props.route.params.bgColor;

        return (
            <View style={{ backgroundColor: bgColor, flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Button
                    title="Go to Start"
                    onPress={() => this.props.navigation.navigate("Start")}
                />  
            </View>
        );
    }
}

