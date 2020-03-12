import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';

import Chats from './src/screens/Chat';
import Screen from './src/screens/Home';
import Login from './src/screens/Login';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';

const AppStack = createStackNavigator({
  Home: Screen,
  Chat: Chats,
});
const AuthStack = createStackNavigator({Login: Login});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
