import React, { Component } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Image, StatusBar, Keyboard } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let InputWidth = ScreenWidth - 120; //输入框与登录按钮宽度
let InputHeight = 45; //输入框高度
let InputRadius = InputHeight / 3; //输入框圆角
let ButtonHeight = 36; //登录按钮高度
let ButtonRadius = 8; //登录按钮圆角
let InfoWidth = ScreenWidth -160; //TextInput组件宽度
let ImageWidth = 120; //首页图片宽
let ImageHeight = 110; //首页图片高

let BorderColor = '#ccc'; //边框颜色
let MainColor = '#fce23f'; //主色调

const onButtonPress = () => {
		Alert.alert('you pressed the button');
}

export default class LoginScreen extends Component {
	static navigationOptions = ({navigation}) => {
		return {
			header: null,
		}
	};

	_onLogin() {
		Keyboard.dismiss();
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'QuizConfirm' })],
		});
		this.props.navigation.dispatch(resetAction);

		// this.props.navigation.navigate('QuizConfirm');
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar backgroundColor={'#000'} barStyle='dark-content'/>
				<View style={styles.mainWrap}>
					<Image source={require('../../localResource/images/reach_cartoon.png')} style={styles.cartImage} />
					<View style={styles.loginWrap}>
						<View style={[styles.infoInput, { borderBottomWidth: 1, borderBottomColor: '#ccc'}]}>
							<Icon name="user" size={25} color={MainColor}/>
							<TextInput placeholder='用户名' style={styles.userInfo} underlineColorAndroid='transparent' maxLength={15} />	
						</View>
						<View style={styles.infoInput}>
							<Icon name="lock" size={26} color={MainColor} />
							<TextInput placeholder='密码' secureTextEntry={true} style={styles.userInfo} underlineColorAndroid='transparent' />
						</View>	
					</View>				
					<TouchableOpacity style={styles.loginButton} activeOpacity={0.5} onPress={ () => this._onLogin() }>
						<Text style={{fontSize: 18,}} >登录</Text>
					</TouchableOpacity>
				</View>				
				<View style={styles.loginFooter}>
					<Text>———初始用户名为姓名，初始密码为学号———</Text>
				</View>
			</View>
		)
	}
}

export class ModalScreen extends Component {
	render() {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ fontSize: 30 }}>This is a Modal!</Text>
				<Button
					onPress={ () => this.props.navigation.goBack() }
					title='Dismiss'
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'space-around',
		height: ScreenHeight,
	},
	mainWrap: {
		alignItems: 'center',
	},
	cartImage: {
		width: ImageWidth, 
		height: ImageHeight,
	},
	loginWrap: {
		width: InputWidth,
		borderWidth: 1,
		borderRadius: InputRadius,
		borderColor: '#ccc',
		marginBottom: 15,
	},
	infoInput: {
		width: InputWidth,
		height: InputHeight,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	userInfo: {
		width: InfoWidth,
	},
	loginButton: {
		width: InputWidth,
		height: ButtonHeight,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: MainColor,
		borderRadius: ButtonRadius,
		marginTop: 10,
	},
	loginFooter: {
		alignItems: 'center',
		// borderWidth: 1,
	}
})