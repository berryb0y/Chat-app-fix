import React, { Component } from 'react';

import 'react-native-gesture-handler';
// import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack'; 
// importing views
import Chat from './components/Chat';
import Start from './components/Start';
// import async storage
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();


export default class App extends React.Component {
//  constructor(props) {
//    super(props);
//    this.state = { text: "" };
//  }

 render() {
   return (
     <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen  name="Start" component={Start} />
        <Stack.Screen  name="Chat" component={Chat} />
      </Stack.Navigator>
     </NavigationContainer>
   );
 }
}