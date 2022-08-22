import React, { Component } from "react";
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, Platform, KeyboardAvoidingView, FlatList } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// import { initializeApp } from "firebase/app";
// import Firestore
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            name: "",
            bgColor: "",
            messages: [],
            uid: 0,
            user: {
                _id: '',
                name: this.props.route.params.name || "Unknown user",
                avatar: 'https://placeimg.com/140/140/any',
                image: null,
                location: null,
            },
        };




        // references & initializes info on database
        if (!firebase.apps.length){
            firebase.initializeApp({
                apiKey: "AIzaSyANS_M1jPr6MCDE0MvVrUj6XcEUdojtAII",
                authDomain: "chat-app-fix.firebaseapp.com",
                databaseURL: "https://chat-app-fix-default-rtdb.firebaseio.com",
                projectId: "chat-app-fix",
                storageBucket: "chat-app-fix.appspot.com",
                messagingSenderId: "913108286123",
                appId: "1:913108286123:web:d7eda89eea065ad03a95ee"
            });
        }



        
    }

    componentDidMount() {
        //references the database
        this.referenceChatMessages = firebase.firestore().collection("messages");
        this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)
        this.refMsgsUser = null;

        this.props.navigation.setOptions({ title: this.props.route.params.name || "Unknown user" })
    
        // Authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
        //  Update user
          this.setState({
            messages: [],
            uid: user.uid,
            user: {
              _id: user?.uid || '0',
              name: user.name || 'Default',
              avatar: 'https://placeimg.com/140/140/any',
            },
          });
          this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);

    
          // Referencing messages of current user
          this.refMsgsUser = 
          firebase
          .firestore()
          .collection('messages')
          .where('uid', '==', user.uid)
        })
        
        
        }

       componentWillUnmount() {
        this.unsubscribe();
        }
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
          // get the QueryDocumentSnapshot's data
          let data = doc.data();
          messages.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
                _id: data.user._id,
                name: data.user.name,
                avatar: data.user.avatar,
              },
              image: data.image || null,
              location: data.location || null,
           });
          });
          this.setState({
            messages,
        });
    }   ;

    addMessage() {
        // add a new message to the firebase collection
        const message = this.state.messages[0];
    
        this.referenceChatMessages.add({
          uid: this.state.uid,
          _id: message._id,
          createdAt: message.createdAt,
          text: message.text || '',
          user: this.state.user,
        });
      };


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

