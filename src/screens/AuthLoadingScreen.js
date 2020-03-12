import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import firebase from 'firebase';

import User from '../../User';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  UNSAFE_componentWillMount() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: 'AIzaSyDnMRLjp-sadRKr_W-DQyXjgFsayNpVmQs',
      authDomain: 'omega-winter-270302.firebaseapp.com',
      databaseURL: 'https://omega-winter-270302.firebaseio.com',
      projectId: 'omega-winter-270302',
      storageBucket: 'omega-winter-270302.appspot.com',
      messagingSenderId: '382263024051',
      appId: '1:382263024051:web:34fa2973709e10021413c6',
      measurementId: 'G-H3HXB5BWM3',
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
