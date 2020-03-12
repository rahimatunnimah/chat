import React, {Component} from 'react';
import {StyleSheet, View, Image, AsyncStorage, Alert} from 'react-native';
import {Item, Input, Form, Label, Button, Thumbnail, Text} from 'native-base';
import Bgimage from '../image/screen.jpeg';
import Logo from '../image/chat.png';
import firebase from 'firebase';

import User from '../../User';

class Login extends Component {
  static navigationOptions = {
    headerMode: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      name: '',
    };
  }
  handleChange = key => val => {
    this.setState({[key]: val});
  };
  componentWillMount() {
    AsyncStorage.getItem('phone').then(val => {
      if (val) {
        this.setState({phone: val});
      }
    });
  }

  submitForm = async () => {
    if (this.state.phone.length < 5) {
      Alert.alert('Error,Phone must > 5');
    } else if (this.state.name.length < 3) {
      Alert.alert('Wrong Name');
    } else {
      // alert(this.state.phone + '\n' + this.state.name);
      await AsyncStorage.setItem('userPhone', this.state.phone);
      User.phone = this.state.phone;
      firebase
        .database()
        .ref('users/' + User.phone)
        .set({name: this.state.name});
      this.props.navigation.navigate('App');
    }
  };
  render() {
    return (
      <View style={styles.containerStyle}>
        <Image style={styles.BgimageStyle} source={Bgimage} />
        <View style={styles.logoStyle}>
          <Thumbnail square large source={Logo} />
          <Text styles={styles.textLogoStyle}>Let's Chat</Text>
        </View>
        <Form style={styles.formLoginStyle}>
          <Item floatingLabel>
            <Label>
              <Text style={styles.inputStyle} />
              phone
              <Text />
            </Label>
            <Input
              style={styles.inputStyle}
              keyboardType="number-pad"
              value={this.setState.phone}
              onChangeText={this.handleChange('phone')}
            />
          </Item>
          <Item floatingLabel>
            <Label>
              <Text style={styles.inputStyle} />
              name
              <Text />
            </Label>
            <Input
              style={styles.inputStyle}
              value={this.setState.name}
              onChangeText={this.handleChange('name')}
            />
          </Item>
        </Form>
        <Button
          block
          info
          style={styles.footerBottomStyle}
          onPress={this.submitForm}>
          <Text>Enter</Text>
        </Button>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  BgimageStyle: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  logoStyle: {
    marginTop: 20,
    marginBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogoStyle: {
    fontSize: 18,
    color: 'white',
  },
  formLoginStyle: {
    marginTop: -80,
    paddingLeft: 10,
    paddingRight: 30,
  },
  inputStyle: {
    color: 'white',
    marginBottom: 6,
    fontSize: 14,
  },
  footerBottomStyle: {
    marginTop: 30,
    paddingTop: 10,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 10,
  },
});

export default Login;
