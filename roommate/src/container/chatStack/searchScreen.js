import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Keyboard, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class SearchScreen extends Component {
	static navigationOptions = {
		header: null,
	};
	
	render() {
		return(
			<View>
				<Text>This is SearchScreen</Text>
			</View>
		)
	}
}