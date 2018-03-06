import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Chart from '../helpers/PersonChart';
import { NavigationActions } from 'react-navigation';

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let ContentPad = 50; //文本与界面间隔
let ButtonWidth = ScreenWidth - 88;
let ButtonHeight = 42; //按钮高度
let ButtonRadius = 5; //按钮圆角
let MainColor = '#fce23f'; //主色调

export default class ResultShowScreen extends Component {
	static navigationOptions = {
		header: null,
	};

	_goToMain() {
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Main' })],
		});
		this.props.navigation.dispatch(resetAction);
		// this.props.navigation.navigate('Main');
	}

	render() {
		const { params } = this.props.navigation.state;
		const selected = params ? params.selected : null;

		return (
			<View style={styles.container}>
				<Text style={styles.title}>我的问卷调查结果</Text>
					<Chart selected={selected} />
				<TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={() => this._goToMain()}>
					<Text style={{ fontSize: 15 }}>继续</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		height: ScreenHeight,
		alignItems: 'center',
		justifyContent: 'space-around',
		backgroundColor: 'white',
	},
	title: {
		fontSize: 18,
		fontWeight: '900',
		paddingTop: ContentPad,
	},
	button: {
		width: ButtonWidth,
		height: ButtonHeight,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: ButtonRadius,
		backgroundColor: MainColor,
		// marginTop: 50,
		marginBottom: ContentPad + 36,
	}
})