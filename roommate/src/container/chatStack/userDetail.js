import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Chart from '../../helpers/PersonChart.js';

let HeaderBarHeight = 48; //顶部栏高度
let HeaderBtnWidth = 28; //顶部栏按钮宽度
let PadSide = 12; 

//Todo get user questionnaire selected Info from back-end
let selected = [1, 3, 4, 2, 1, 2, 0];

export default class UserDetailScreen extends Component {
	static navigationOptions = {
		header: null,
	};

	_showContent(type) {
		if(type == 'chart') {
			return (
				<View style={styles.contentWrap}>
					<Chart selected={selected} />
				</View>
			)
		}
		else {
			return (
				<View style={styles.contentWrap}>
					<Text style={{ fontSize: 16, paddingBottom: 2*PadSide, }}>我喜欢你的眼睛 你的睫毛 你的冷傲 我喜欢你的酒窝 你的嘴角 你的微笑 我喜欢你全世界都知道</Text>
				</View>
			) 
		}
	}

	render() {
		let { params } = this.props.navigation.state;
		let type = params ? params.type : null;
		let title = type == 'text' ? 'Ta想对室友说的话' : 'Ta的问卷调查结果';

		console.log("type is ", type);
		return (
			<View style={styles.container}>
				<View style={styles.headerBar}>
					<TouchableOpacity style={styles.headBackBtn} onPress={() => {this.props.navigation.goBack()} }>
						<Icon name='ios-arrow-back-outline' size={22} />
					</TouchableOpacity>
					<Text style={{ fontSize: 16, }}>{title}</Text>
					<View style={styles.headBackBtn} ></View>
				</View>
				{this._showContent(type)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	headerBar: {
		height: HeaderBarHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
	},
	headBackBtn: {
		// borderWidth: 1,
		width: HeaderBtnWidth,
		height: HeaderBarHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentWrap: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
})
