import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let PadSide = 15; //内容与左右两侧间距

export default class ChatListScreen extends Component {
	static navigationOptions = {
		title: '聊天',
	};

	render() {
		return (
			<View style={styles.container} >
				<StatusBar opacity={0.2} />
				<View style={styles.header}>	
					<View style={styles.headerButton}></View>
					<Text style={styles.headerTitle}>消息</Text>
					<TouchableOpacity style={styles.headerButton} activeOpacity={0.6}>
						<Icon name='search' size={21} />
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		// borderWidth: 1,
		flex: 1,
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