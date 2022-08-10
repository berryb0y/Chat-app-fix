import React, { Component } from "react";
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            name: "",
            bgColor: "",
            messages: [],
        };
    }

    componentDidMount() {
        this.setState({
          messages: [
            {
              _id: 1,
              text: 'Hello developer',
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
              },
            },
          ],
        })
      }

    onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
      }

    // Customize message bubbles
    renderBubble(props) {
        return (
        <Bubble
            {...props}
            wrapperStyle={{
            left: {
                backgroundColor: '#fafafa',
            },
            right: {
                backgroundColor: '#2d7ecf',
            },
            }}
        />
        );
    }

    render() {
        // carries over username from start.js
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        // carries over bgcolor from start.js
        let bgColor = this.props.route.params.bgColor;

        return (
            <View 
                style={{
                    backgroundColor: bgColor, flex: 1
                }}
            >
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={(messages) => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />


                {/* /* fix error on display of keyboard for android devices  */}
                {Platform.OS === "android" ? (
                  <KeyboardAvoidingView behavior="height" />
                ) : null}
            </View>
        );
    }
}

