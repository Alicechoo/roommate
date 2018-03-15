import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

export default class SelfScreen extends Component {
	static navigationOptions = {
		drawerLabel: '编辑个人资料',
	};
	
	render() {
		return (
			<View>
				<Text>Hello, This is SelfScreen</Text>
			</View>
		)
	}
}