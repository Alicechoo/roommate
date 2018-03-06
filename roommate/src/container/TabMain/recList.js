import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';

let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let PadSide = 15; //内容与左右两侧间距

export default class RecListScreen extends Component {
	static navigationOptions = {
		title: '推荐',
	};

	render() {
		return (
			<View style={styles.container} >
				<View style={styles.header}>	
					<View style={styles.headerButton}></View>
					<Text style={styles.headerTitle}>推荐列表</Text>
					<TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
						<Text style={{ color: DeepColor }}>筛选</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// borderWidth: 1,
	},
	header: {
		width: ScreenWidth,
		height: HeaderHeight,
		// borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#ccc',
		backgroundColor: 'white',
		
	},
	headerTitle: {
		fontSize: 18,
		color: '#666',
		fontWeight: '200',
	},
	headerButton: {
		// borderWidth: 1,
		width: HeaderWidth,
		height: HeaderHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
});