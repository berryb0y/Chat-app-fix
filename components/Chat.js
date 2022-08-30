import React, { Component } from "react";
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, Platform, KeyboardAvoidingView, FlatList, TouchableOpacityBase } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";

// // import the necessary components from Expo
// import MapView from 'react-native-maps';
// import Firestore
const firebase = require('firebase');
require('firebase/firestore');
// import async storage
import AsyncStorage from "@react-native-async-storage/async-storage";
// import netinfo package to find out if a user is online or not
import NetInfo from '@react-native-community/netinfo';
// import custom actions to add to GiftedChats
import CustomActions from './CustomActions';


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

            },
            isConnected: false,
            image: null,
            location: null,
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
        //references the database
        this.referenceChatMessages = firebase.firestore().collection("messages");
        this.refMsgsUser = null;    
    };

    

    // retrieves chat messages from ascync storage
    async getMessages() {
        let messages = '';
        try {
          messages = await AsyncStorage.getItem('messages') || [];
          this.setState({
            messages: JSON.parse(messages)
          });
        } catch (error) {
          console.log(error.message);
        }
    };

    // saves message in asynstorage
    async saveMessages() {
        try {
          await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
          console.log(error.message);
        }
    }
    // deletes messages in asynstorage
    async deleteMessages() {
        try {
          await AsyncStorage.removeItem('messages');
          this.setState({
            messages: []
          })
        } catch (error) {
          console.log(error.message);
        }
    }

    componentDidMount() {

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
          
        // Referencing messages of current user
        this.refMsgsUser = 
        firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', user.uid)
        })

        // check if user is online

        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {

                this.setState({ isConnected: true })
                console.log('online');

                //listens for updates in collection
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);
                

                //save messages if user is online
                this.saveMessages()
            } else {
                //if user is offline
                this.setState({ isConnected: false })
                console.log('offline');
                //retrieve messages from AsyncStorage
                this.getMessages()
            }
        })
    }

    //add message to database
    addMessage() {
        // add a new message to the firebase collection
        const message = this.state.messages[0];        
        this.referenceChatMessages.add({
          uid: this.state.uid,
          _id: message._id,
          createdAt: message.createdAt,
          text: message.text || '',
          user: this.state.user,
          image: message.image || null,
          location: message.location || null,
        })
    }

    componentWillUnmount() {
        if (this.state.isConnected) {
          // stop listening to authentication
          this.authUnsubscribe()
          // stop listening for changes
          this.unsubscribe()
        }
    }

    //updated message state
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
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
            messages: messages,
        });
        this.saveMessages()
    };




    onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            // add messages to local AsyncStorage
            this.addMessage();
            // save messages to local AsyncStorage
            this.saveMessages();
        })
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

    // renders the chat input field toolbar only when user is online
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
          return <InputToolbar {...props} />;
        }
    }

    renderCustomView (props) {
      const { currentMessage} = props;
      if (currentMessage.location) {
        return (
            <MapView
              style={{
                width: 150,
                height: 100,
                borderRadius: 13,
                margin: 3
              }}
              region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
        );
      }
      return null;
    }

    // displays the communication features
    renderCustomActions = (props) => {
      return <CustomActions {...props} />;
    };

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
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    messages={this.state.messages}
                    renderActions={this.renderCustomActions}
                    onSend={(messages) => this.onSend(messages)}
                    renderCustomView={this.renderCustomView}
                    user={{
                        _id: this.state.user._id,
                        name: this.state.name,
                        avatar: this.state.avatar,  
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

