import React, { Component } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom, addNavigationHelpers } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import SelfScreen from '../container/PersonInfo/self.js';
import {MainTab} from './router.js';

let DeepColor = '#f7d451';
const MainDraw = DrawerNavigator({
	MainTab: {
		screen: MainTab,
	},
	Self: {
		screen: SelfScreen,
	}
}, {
	drawerOpenRoute: 'DrawerOpen',
	drawerCloseRoute: 'DrawerClose',
	drawerToogleRoute: 'DrawerToggle',
	contentOptions: {
		activeTintColor: DeepColor,
	},
	contentComponent: props => {
		console.log('contentComponent');
		console.log(props);
		return (
			<View>
			</View>
		)
	}
	
});

export default MainDraw;
