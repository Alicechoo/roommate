import React, { Component } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Image, StatusBar, Keyboard } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import fetchRequest from '../config/request.js';

// import storage from '../config/storageUtil.js';
import '../config/global.js';
//密码加密
// let forge = require('node-forge');
// var md = forge.md.md5.create();

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
			// drawerLabel: '退出登录',
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			name: null,
			password: null,
			request: null,
		}
	}

	componentDidMount() {
		//本地登录状态未过期
		console.log('global.user.loginState: ', global.user.loginState);
		if(global.user.loginState) {
			let resetAction;
			//用户完成问卷跳转到主页
			if(global.user.finished) {
				resetAction = NavigationActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'Main' })],
				});
			}
			//用户未完成跳转到问卷
			else {
				resetAction = NavigationActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'QuizConfirm' })],
				});
			}
			this.props.navigation.dispatch(resetAction);
		}
		//检查服务器session是否过期
		else {
			fetchRequest('app/check', 'GET').then(res => {
				console.log('res log: ', res);
				return res;
				//未登录或登录信息过期
				// if(res.uid === undefined) {
				// 	console.log('session expire');
				// 	return false;
				// }
				// else {
				// 	return res;
				// }
			})
			.then(res => {
				console.log('res in then2: ', res);
				//登录状态未过期
				if(res.uid !== undefined) {
					let resetAction;
					global.user.loginState = true;
					global.user.userData = res;
					console.log('global.user.userData: ', global.user.userData);
					//用户完成问卷跳转到主页
					if(res.finished) {
						resetAction = NavigationActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'Main' })],
						});
					}
					//用户未完成问卷跳转到问卷
					else {
						resetAction = NavigationActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'QuizConfirm' })],
						});
					}
					this.props.navigation.dispatch(resetAction);
				}
			})
		}
	}

	// _isQueFinished() {
	// 	console.log('check quefinish');
	// 	fetchRequest('/app/userQues', 'GET').then(res => {
	// 		console.log('res user_ques')
	// 	})
	// }

	_onName(text) {
		this.setState({
			name: text,
		})
	}

	_onPwd(text) {
		if(text) {
			//对密码进行md5加密
			// md.update(text);
			// let password = md.digest().toHex();
			this.setState({
				password: text,
			})
		}
	}

	_onRequest() {
		console.log('pressed');
		fetchRequest('', 'GET').then(res => {
			console.log('res quesCon: ', res);
		})
	}

	_onLogin() {
		Keyboard.dismiss();
		if(this.state.name && this.state.password) {
			this.setState({
				request: 'ok',
			})
			let params = {
				name: this.state.name,
				password: this.state.password,
			};
			fetchRequest('app/signIn', 'POST', params).then(res => {
				console.log('res in login.js: ', res);
				//验证不通过
				if(res && res.length == 0) {
					this.setState({
						request: 'notMatch',
					})
				}
				//验证通过
				else {
					console.log('res.name: ', res[0].name);
					console.log('res.uid: ', res[0].uid);
					//将用户信息保存
					global.storage.save({
						key: 'loginState',
						data: {
							name: res[0].name,
							uid: res[0].uid,
							finished: res[0].finished, //完成则为true,未完成为undefined
						},
						expires: 1000 * 3600 * 24 * 14,
					})
					console.log('storage inLogin: ', global.storage);
					//修改global中的登录状态
					global.user.loginState = true;
					global.user.userData = {
							name: res[0].name,
							uid: res[0].uid,
							finished: res[0].finished,
					};
					// global.getUid(global.storage);
					console.log('global.user', global.user);
					// global.getUid
					let resetAction;
					//用户完成问卷
					if(res[0].finished) {
						resetAction = NavigationActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'Main' })],
						});
					}
					//用户未完成问卷
					else {
						resetAction = NavigationActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'QuizConfirm' })],
						});
					}
					this.props.navigation.dispatch(resetAction);
				}
			}).catch( err => {
				//网络请求失败
				console.log('err in login.js: ', err);
				this.setState({
					request: 'fail',
				})
			})
			// this.props.navigation.navigate('QuizConfirm');
		}
		else
			this.setState({
				request: 'missKey',
			})
	}

	_showTip(type) {
		let text = null;
		if(type == 'fail') {
			text = '服务器异常，请稍后再试...';
		}
		// else if(type == 'serverFail') {
		// 	return (
		// 		<Text style={{ color: 'red', }}>服务器异常</Text>
		// 	)
		// }
		else if(type == 'missKey') {
			text = '账号或密码不能为空';
		}
		else if(type == 'notMatch') {
			text = '账号或密码错误';
		}
		if(text) {
			return (
				<Text style={{ color: 'red', }}>{text}</Text>
			)
		}
		else
			return null;
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
							<TextInput 
								placeholder='账号' 
								style={styles.userInfo} 
								underlineColorAndroid='transparent' 
								maxLength={15}
								onChangeText={(text) => this._onName(text)}
							/>	
						</View>
						<View style={styles.infoInput}>
							<Icon name="lock" size={26} color={MainColor} />
							<TextInput 
								placeholder='密码' 
								secureTextEntry={true} 
								style={styles.userInfo} 
								underlineColorAndroid='transparent' 
								onChangeText={(text) => this._onPwd(text)}
							/>
						</View>	
					</View>		
					{this._showTip(this.state.request)}		
					<TouchableOpacity style={styles.loginButton} activeOpacity={0.5} onPress={ () => this._onLogin() }>
						<Text style={{fontSize: 18,}} >登录</Text>
					</TouchableOpacity>
				</View>				
				<View style={styles.loginFooter}>
					<Text>———初始用户名为学号，初始密码为校园卡号———</Text>
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