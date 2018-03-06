import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let PadSide = 15; //内容与左右两侧间距

export default class CommentScreen extends Component {
	static navigationOptions = {
		header: null,
	};
	
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity style={styles.headerButton} onPress={() => { Keyboard.dismiss(); this.props.navigation.goBack();} }>
						<Icon name='chevron-left' size={35} />
					</TouchableOpacity>	
					<Text style={styles.headerTitle}>话题正文</Text>
					<View style={styles.headerButton}>
					</View>
				</View>
				<View style={styles.footer}>
					<View style={styles.footerLeft}>
						<Icon name='pencil' size={21} />
						<TextInput multiline={false} />
					</View>
					<TouchableOpacity style={styles.footerRight}>
						<Text>发送</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		// borderWidth: 1,
	},
	header: {
		width: ScreenWidth,
		height: HeaderHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
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
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,

	},
	footerLeft: {
		flexDirection: 'row'
	}
})