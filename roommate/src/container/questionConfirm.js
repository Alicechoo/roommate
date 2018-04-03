import React, { Component } from 'react';
import { View, Text, TouchableOpacity , StyleSheet, } from 'react-native';
import { NavigationActions } from 'react-navigation';
import fetchRequest from '../config/request.js';
import storage from '../config/storageUtil.js';

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let PadSide = 15; //文本与界面边缘间隔
let ContentMargin = 10; //上下文本之间的间隔
let ButtonWidth = ScreenWidth - 30; //按钮宽度
let ButtonHeight = 42; //按钮高度
let ButtonRadius = 8; //登录按钮圆角

let MainColor = '#fce23f'; //主色调

export default class QuizConfirmScreen extends Component {
	static navigationOptions = {
		header: null,
	};

	// componentDidMount() 
	_onPress() {
		this.props.navigation.navigate('Question');
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={[{ fontSize: 24 }, styles.content]}>开始习惯问卷调查</Text>
				<Text style={[{ fontSize: 16 }, styles.content]}>习惯调查问卷中，包括了一些生活习惯上的问题。请根据自己平时的生活习惯，选出最贴合实际情况的一项答案。这样才能选出与自己更合拍的室友哦~</Text>
				<Text style={[{ fontSize: 14, marginTop: ContentMargin}, styles.content]}>该测试可能会占用2~3分钟时间</Text>
				<TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={() => this._onPress()}>
					<Text style={{ fontSize: 18 }}>开始答题</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		height: ScreenHeight,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: PadSide,
		paddingRight: PadSide,
		backgroundColor: 'white',
	},
	content: {
		marginBottom: ContentMargin,
	},
	button: {
		width: ButtonWidth,
		height: ButtonHeight,
		borderRadius: ButtonRadius,
		backgroundColor: MainColor,
		justifyContent: 'center',
		alignItems: 'center',
	},
	
})