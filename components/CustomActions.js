import React from "react";
//  import PropTypes
import PropTypes from "prop-types";
//import necessary components from react-native
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
//import permissions and imagepicker
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";
// import Firestore
const firebase = require('firebase');
require('firebase/firestore');



export default class CustomActions extends React.Component {

    imagePicker = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        try {
            if(status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
            }).catch(error => console.log(error));
        
            if (!result.cancelled) {
                const imageUrl = await this.uploadImageFetch(result.uri);
                this.props.onSend({ image: imageUrl });  
            }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    /**
     * allows users to take a picture,
     * turning it into a blob, uploading it to Firebase Storage and then adding the image URL to the message object
     */
    takePhoto = async () => {

      // Ask user for permission to access photo library and camera
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
      try {
          // If permission is granted, let user take a picture
          if (status === 'granted') {
              let result = await ImagePicker.launchCameraAsync().catch(err => console.log(err));

              // If the user doesn't cancel process, set image status to the image took by the user
              if (!result.cancelled) {
                  const blob = await this.createBlob(result.uri);
                  const imageUrl = await this.uploadImageFetch(blob);
                  this.props.onSend({ image: imageUrl });
              }
          }
      } catch (err) {
          console.log(err.message);
      }
  }

    getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
        try {
          if (status === "granted") {
            let result = await Location.getCurrentPositionAsync({}).catch(
              (error) => {
                console.error(error);
              }
            );
            // Send latitude and longitude to locate the position on the map
            if (result) {
              console.log(result);
              this.props.onSend({
                location: {
                  longitude: result.coords.longitude,
                  latitude: result.coords.latitude,
                },
              });
            }
          }
        } catch (error) {
          console.error(error);
        }
    }


    // Upload images to firebase
    uploadImageFetch = async (uri) => {
        // create your own blob with a new XMLHttpRequest
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        // create a reference to the storage, use put to store the content retrieved from the Ajax request
        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length - 1];
    
        const ref = firebase.storage().ref().child(`images/${imageName}`);
    
        const snapshot = await ref.put(blob);
    
        blob.close();
    
        return await snapshot.ref.getDownloadURL();
    };

    // Handling all communication features
    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          async (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                console.log('user wants to pick an image');
                return this.imagePicker();
              case 1:
                console.log('user wants to take a photo');
                return this.takePhoto();
              case 2:
                console.log('user wants to get their location');
                return this.getLocation();
            }
          },
        );
    };
    render() {
        return (
          <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
            <View style={[styles.wrapper, this.props.wrapperStyle]}>
              <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
            </View>
          </TouchableOpacity>
        );
      }
}
const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};