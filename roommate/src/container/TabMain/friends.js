import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, StatusBar, TouchableOpacity } from 'react-native';

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let HeaderHight = 160; //头部栏高度
let AvatarWidth = 100; //头像宽度
let AvatarHeight = 100; //头像高度
let SwitchTabHeight = 42; //转换栏高度
let PadSide = 15; //内容与左右两侧间距
let VerPadSide = 7; //上下内容间距
let SearchHeight = 32; //搜索栏高度

// console.log('ScreenWidth is', ScreenWidth);
// console.log("ScreenHeight is ", ScreenHeight);

class Friends extends Component {
	render() {
		return (
			<View style={styles.friendsWrap}>
				<View style={styles.searchWrap}>
					<View style={styles.search}>
					</View>
				</View>
			</View>
		)
	}
}

class NewFriends extends Component {
	render() {
		return (
			<View style={styles.newFriWrap}>
			</View>
		)
	}
}

export default class FriendScreen extends Component {
	static navigationOptions = {
		title: '通讯录',
	};	

	constructor(props) {
		super(props);
		this.state = {
			tabShow: 'friends',
		}
	}

	_showContent() {
			if(this.state.tabShow == 'friends')
				return (<Friends />);
			else
				return (<NewFriends />);
		}

	render() {

		let friendTabColor = this.state.tabShow == 'friends' ? MainColor : 'white';
		let newFriTabColor = this.state.tabShow == 'newFriends' ? MainColor : 'white';

		return (
			<View style={styles.container}>
				<ImageBackground source={require('../../../localResource/images/bgLemon.jpg')} style={styles.header}>
					<Image source={require('../../../localResource/images/avatar1.jpg')} style={styles.avatar} />
				</ImageBackground>
				<View style={styles.switchTabWrap}>
					<TouchableOpacity 
						activeOpacity={0.6}
						style={[styles.switchTab, { backgroundColor: friendTabColor, }, ]}
						onPress={() => { this.setState({ tabShow: 'friends', }) }}
					>
						<Text>好友</Text>
					</TouchableOpacity>
					<View style={styles.verLine}></View>
					<TouchableOpacity 
						activeOpacity={0.5}
						style={[styles.switchTab, { backgroundColor: newFriTabColor, }, ]}
						onPress={() => { this.setState({ tabShow: 'newFriends',}) }}
					>
						<Text>新朋友</Text>
					</TouchableOpacity>
				</View>
				{this._showContent()}
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
		height: HeaderHight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatar: {
		width: AvatarWidth,
		height: AvatarHeight,
		borderRadius: AvatarWidth / 2,
	},
	switchTabWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		height: SwitchTabHeight,
		borderBottomWidth: 1,
		borderColor: '#ccc',
	},
	switchTab: {
		// flex: 0.49,
		// borderWidth: 1,
		width: ScreenWidth/2,
		height: SwitchTabHeight,
		alignItems: 'center',
		justifyContent: 'center',
	},
	verLine: {
		width: 1,
		height: SwitchTabHeight - 2,
		// borderWidth: 1,
		backgroundColor: '#ccc',
	},
	friendsWrap: {
		flex: 1,
		// borderWidth: 1,
	},
	searchWrap: {
		paddingTop: VerPadSide,
		paddingBottom: VerPadSide,
		paddingLeft: PadSide,
		paddingRight: PadSide,
		backgroundColor: 'white',
	},
	search: {
		height: SearchHeight,
		borderWidth: 1,
		borderRadius: SearchHeight/2,
		borderColor: '#ccc',
	},
	newFriWrap: {
		width: ScreenWidth,
	}
})