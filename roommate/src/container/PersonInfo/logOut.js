import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, StatusBar, } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { NavigationActions } from 'react-navigation';
import fetchRequest from '../../config/request.js';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let modalWidth = ScreenWidth - 80;
let modalHeight = 160;
let modalTitleHeight = 42;
let modalBtnWidth = 64;
let modalBtnHeight = 28;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度

let PadSide = 12;
export default class LogOutScreen extends Component {
	static navigationOptions = {
		drawerLabel: '退出登录',
		drawerIcon: <Icon name="gear" size={25} />
	};

	_onLogOut() {
		//退出登录
		fetchRequest('/app/logout', 'POST').then(res => {
			if(res == 'Error') {
				console.log('logout failed');
				return;
			}
			console.log('logout success');
			//退出登录后跳转至登录页
			const resetAction = NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'Login'})],
			});
			this.props.navigation.dispatch(resetAction);
		})
		.catch(err => {
			console.log('logOut err: ', err);
		})
	}

	render() {
		return (
			<View style={{ backgroundColor: 'white', flex: 1, }}>
				<View style={styles.header}>
					<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
						<Icon name='chevron-left' size={32} />
					</TouchableOpacity>	
					<Text style={styles.headerTitle}>退出登录</Text>
					<View style={styles.headerButton}></View>					
				</View>
				<View style={styles.main}>
					<View style={styles.titleWrap}>
						<Text>退出登录后，进入应用需要重新输入用户名密码登录。确认退出吗？</Text>
					</View>
					<TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={ () => this._onLogOut() } >
						<Text>退出登录</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	header: {
		width: ScreenWidth,
		height: HeaderHeight,
		// borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
		backgroundColor: 'white',
		
	},
	headerTitle: {
		fontSize: 16,
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
	main: {
		flex: 1,
		justifyContent: 'space-between',
	},
	titleWrap: {
		padding: 2*PadSide,
		// paddingRight: PadSide,
	},
	button: {
		width: ScreenWidth - 5*PadSide,
		height: 42,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		backgroundColor: MainColor,
		// marginTop: 42,
		marginBottom: 88,
	}
})