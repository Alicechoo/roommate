import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/constants/router.js';

export default class App extends Component {
  componentDidMount() {
  	SplashScreen.hide(); //隐藏启动屏
  }

  render() {
    return (
      <AppNavigator />
    )
  }
}

