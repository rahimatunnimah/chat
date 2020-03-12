import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

import {Text, Input} from 'native-base';
import {FlatList} from 'react-native-gesture-handler';

import firebase from 'firebase';

import User from '../../User';
// import styless from '../../Styles';

const isIOS = Platform.OS === 'ios';

export default class MChats extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('name', null),
      headerTintColor: '#4169E1',
      headerStyle: {
        backgroundColor: '#ffff',
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      person: {
        name: props.navigation.getParam('name'),
        phone: props.navigation.getParam('phone'),
      },
      textMessage: '',
      messageList: [],
      dbRef: firebase.database().ref('message'),
    };
    this.keyboardHeight = new Animated.Value(0);
    this.bottomPadding = new Animated.Value(60);
  }

  componentDidMount() {
    this.keyboardShowListener = Keyboard.addListener(
      isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
      e => this.keyboardEvent(e, true),
    );
    this.keyboardHideListener = Keyboard.addListener(
      isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
      e => this.keyboardEvent(e, false),
    );
    this.state.dbRef
      .child(User.phone)
      .child(this.state.person.phone)
      .on('child_added', value => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      });
  }

  componentWillUnmount() {
    this.state.dbRef.off();
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardEvent = (e, isShow) => {
    let heightOS = isIOS ? 60 : 0;
    let bottomOS = isIOS ? 120 : 60;
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: e.duration,
        toValue: isShow ? heightOS : 0,
      }),
      Animated.timing(this.bottomPadding, {
        duration: e.duration,
        toValue: isShow ? bottomOS : 60,
      }),
    ]).start();
  };

  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
    }
    return result;
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = this.state.dbRef
        .child(User.phone)
        .child(this.state.person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.phone,
      };
      updates[
        User.phone + '/' + this.state.person.phone + '/' + msgId
      ] = message;
      updates[
        this.state.person.phone + '/' + User.phone + '/' + msgId
      ] = message;
      this.state.dbRef.update(updates);
      this.setState({textMessage: ''});
    }
  };

  renderRow = ({item}) => {
    if (item.from !== User.phone) {
      return (
        <View style={[styles.chatLeft]}>
          <Text style={[styles.chatTextLeft]}>
            {item.message}
            {'\n'}
            <Text style={{fontSize: 11, color: '#808080'}}>
              {this.convertTime(item.time)}
            </Text>
          </Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.chatRight]}>
          <Text style={[styles.chatTextRight]}>
            {item.message}
            {'\n'}
            <Text style={{fontSize: 11, color: '#808080'}}>
              {this.convertTime(item.time)}
            </Text>
          </Text>
        </View>
      );
    }
  };

  render() {
    let {height} = Dimensions.get('window');
    return (
      <>
        {/* <Image style={styles.BgimageStyle} source={Bgimage} /> */}
        <Animated.View
          style={[styles.btnBottom, {bottom: this.keyboardHeight}]}>
          <Input
            placeholder="Type message ..."
            value={this.state.textMessage}
            style={styles.textInput}
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity
            onPress={this.sendMessage}
            style={[styles.bgPurple, styles.btnSend, styles.shadow]}>
            <Text style={{color: 'blue'}}>Send</Text>
          </TouchableOpacity>
        </Animated.View>
        <KeyboardAvoidingView
          behavior="height"
          style={{
            flex: 1,
            backgroundColor: '#eee',
            paddingBottom: 64,
          }}>
          <FlatList
            ref={ref => (this.flatList = ref)}
            onContentSizeChange={() =>
              this.flatList.scrollToEnd({animated: true})
            }
            style={{padding: 10, height: height * 0.8}}
            data={this.state.messageList}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        </KeyboardAvoidingView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  btnBottom: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    paddingHorizontal: 20,
    width: '80%',
    marginLeft: 5,
  },
  btnSend: {
    marginRight: 5,
    width: '20%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    tintColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  btnSpasi: {
    width: '1%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatLeft: {
    alignSelf: 'flex-start',
    paddingHorizontal: 1,
    paddingVertical: 10,
    width: 'auto',
    flexDirection: 'row',
  },
  chatRight: {
    alignSelf: 'flex-end',
    paddingHorizontal: 1,
    paddingVertical: 10,
    width: 'auto',
    flexDirection: 'row',
  },
  chatTextRight: {
    borderWidth: 1,
    marginLeft: 80,
    marginRight: 10,
    padding: 10,
    borderRadius: 20,
    borderColor: '#e0e0e0',
    textAlign: 'right',
    backgroundColor: '#fff',
  },
  chatTextLeft: {
    borderWidth: 1,
    marginRight: 80,
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
    borderColor: '#e0e0e0',
    backgroundColor: '#B0C4DE',
  },
});
