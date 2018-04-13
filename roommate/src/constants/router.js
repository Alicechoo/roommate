import React, { Component } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ImageBackground, Image, TouchableOpacity, StatusBar,} from 'react-native';
import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom, addNavigationHelpers } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import fetchRequest from '../config/request.js';

import ChatListScreen from '../container/TabMain/chatList.js';
import RecListScreen from '../container/TabMain/recList.js';
import MomentScreen from '../container/TabMain/momentShow.js';
import FriendScreen from '../container/TabMain/friends.js';

//PersonInfo
import SelfScreen from '../container/PersonInfo/modifyInfo.js';
import MyMomentScreen from '../container/PersonInfo/myMoments.js';
import RoomScreen from '../container/PersonInfo/myRoom.js';
import PersonChartScreen from '../container/PersonInfo/personChart.js';
import SayHiQueScreen from '../container/PersonInfo/sayHiQue.js';
import LogOutScreen from '../container/PersonInfo/logOut.js';

//First LoginIn
import LoginScreen from '../container/login.js';
import { ModalScreen } from '../container/login.js';
import QuizConfirmScreen from '../container/questionConfirm.js';
import QuestionScreen from '../container/question.js';
import ResultShowScreen from '../container/resultShow.js';

//stack navigator
import ChatRoomScreen from '../container/chatStack/chatRoom.js';
import UserInfoScreen from '../container/chatStack/userInfo.js';
import UserDetailScreen from '../container/chatStack/userDetail.js';
import SearchScreen from '../container/chatStack/searchScreen.js';
import EditMomentScreen from '../container/momentStack/editMoment.js';
import CommentScreen from '../container/momentStack/comment.js';

import '../config/UserAgent';
import io from 'socket.io-client/dist/socket.io.js';
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let imgCom_url = 'http://192.168.253.1:8080/images';
// let userInfo = {};

class ReadyScreen extends Component {
	static navigationOptions = {
		header: null,
	};

	componentDidMount() {
		let resetAction = [];
		//检测用户登录状态
		fetchRequest('/app/check', 'GET').then(res => {
			console.log('res: ', res);
			//登录状态未过期
			if(res.uid !== undefined) {
				//设置用户的socket
				this.socket = io('http://192.168.253.1:8080', {jsonp: false});
				// this.socket.connect();
				console.log('this.socket: ', this.socket);	
				global.user.loginState = true;
				global.user.userData = res;
				global.user.userSocket = this.socket;
				global.user.userSocket.emit('join', {uid: global.user.userData.uid});
				console.log('global.user.userData: ', global.user.userData);
				let param = {
					uid: global.user.userData.uid,
				};
				console.log('route param: ', param);
				//登录态未过期且完成问卷，跳转到主页
				if(global.user.userData.finished) {
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
				// fetchRequest('/app/getUserInfo', 'POST', param).then(res => {
				// 	console.log('userinfo res: ', res);
				// 	//找到该用户
				// 	if(res && res.length != 0) {
				// 		userInfo = {
				// 			name: res[0].name,
				// 			avatar: res[0].avatar,
				// 			signature: res[0].signature,
				// 		};
				// 		userInfo.avatar = imgCom_url + userInfo.avatar;
				// 		userInfo.signature = userInfo.signature ? userInfo.signature : 'TA什么都没留下哦~';
				// 		console.log('userInfo: ', userInfo);
				// 		// global.user.userInfo = userInfo;
				// 	}
				// })
			}
			//登录状态过期
			else {
				global.user.loginState = false;
				global.user.userData = null;
				global.user.userInfo = null;
				console.log('global.user: ', global.user);
				resetAction = NavigationActions.reset({
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'Login' })],
				});
				this.props.navigation.dispatch(resetAction);
			}
		})
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<StatusBar backgroundColor={'#000'} barStyle='dark-content'/>
				<Text>正在加载...</Text>
			</View>
		)
	}
}

//Tab页面
const MainTab = TabNavigator({
	//聊天
	ChatList: {
		screen: ChatListScreen,
	},
	//推荐列表页
	RecList: {
		screen: RecListScreen,
	},
	//话题页
	Moments: {
		screen: MomentScreen,
	},
	//好友页
	Friends: {
		screen: FriendScreen,
	},
}, {
	backBehavior: 'none',
	navigationOptions: ({ navigation }) => ({
		tabBarIcon: ({ focused, tintColor }) => {
			// console.log("tintColor is ", tintColor);
			const { routeName } = navigation.state;
			let iconName;
			if (routeName === 'ChatList') {
				iconName = 'ios-chatbubbles-outline';
			} else if (routeName === 'RecList') {
				iconName = 'ios-list-box-outline';
			} else if (routeName === 'Moments') {
				iconName = 'ios-aperture-outline';
			} else if (routeName === 'Friends') {
				iconName = 'ios-contact-outline';
			}

			return <Icon name={iconName} size={28} color={tintColor} />
		}
	}),
	tabBarOptions: {
		activeTintColor: DeepColor,
		// inactiveTintColor: '#aaa',
		showIcon: true,
		labelStyle: {
			fontSize: 10,
		},
		style: {
			backgroundColor: 'white',
			height: 48,
			justifyContent: 'center',
		},
		indicatorStyle: {
			width: 0,
		}
	},
	tabBarComponent: TabBarBottom,
	tabBarPosition: 'bottom',
	animationEnabled: false,
});

//用户注销
function _onLogOut() {
	fetchRequest('/app/logout', 'POST').then(res => {
		if(res == 'Error') {
			console.log('logout failed');
			return;
		}
		console.log('logout success');
	})
}

const MainDraw = DrawerNavigator({
	MainTab: {
		screen: MainTab,
	},
	Self: {
		screen: SelfScreen,
	},
	MyRoom: {
		screen: RoomScreen,
	},
	MyMoment: {
		screen: MyMomentScreen,
	},
	PersonChart: {
		screen: PersonChartScreen,
	},
	SayHiQue: {
		screen: SayHiQueScreen,
	},
	LogOut: {
		screen: LogOutScreen,
	},
}, {
	drawerOpenRoute: 'DrawerOpen',
	drawerCloseRoute: 'DrawerClose',
	drawerToggleRoute: 'DrawerToggle',
	order: ['Self', 'SayHiQue', 'PersonChart', 'MyMoment', 'MyRoom', 'LogOut', 'MainTab'],
	initialRouteName: 'MainTab', 
	contentOptions: {
		activeTintColor: DeepColor,
		inactiveTintColor: '#666',
		labelStyle: {
			fontWeight: '300',
		}
	},
	contentComponent: props => {
		console.log('contentComponent');
		console.log(props);
		return (
			<ScrollView>
				<SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
					<ImageBackground source={require('../../localResource/images/bgLemon.jpg')} style={styles.header}>
					</ImageBackground>
					<DrawerItems {...props} />
				</SafeAreaView>
			</ScrollView>
		)
	}
	
});

const AppNavigator = StackNavigator({
	Login: {
		screen: LoginScreen,
	},
	QuizConfirm: {
		screen: QuizConfirmScreen,
	},
	Question: {
		screen: QuestionScreen,
	},
	ResultShow: {
		screen: ResultShowScreen,
	},
	Main: {
		screen: MainDraw,
		navigationOptions: ({ navigation }) => ({
			header: null,
		}),
	},
	ChatList: {
		screen: ChatListScreen,
	},
	RecList: {
		screen: RecListScreen,
	},
	Moments: {
		screen: MomentScreen,
	},
	Friends: {
		screen: FriendScreen,
	},
	EditMoment: {
		screen: EditMomentScreen, 
	},
	Comment: {
		screen: CommentScreen,
	},
	ChatRoom: {
		screen: ChatRoomScreen,
	},
	//用户信息页
	UserInfo: {
		screen: UserInfoScreen,
	},
	//用户问卷调查等详情页
	UserDetail: {
		screen: UserDetailScreen,
	},
	Search: {
		screen: SearchScreen,
	},
	Ready: {
		screen: ReadyScreen,
	}
},
{
	initialRouteName: 'Ready', //调试主界面
	navigationOptions: {
		headerStyle: {
			backgroundColor: '#f4511e',
		},
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontWeight: 'bold',
		},
	},
});

// const RootNavigator = StackNavigator({
// 	Root: {
// 		screen: RootStack,
// 	},
// 	MyModal: {
// 		screen: ModalScreen,
// 	},
// },{
// 	mode: 'modal',
// 	headerMode: 'none',
// })

const styles = StyleSheet.create({
	header: {
		flex: 1,
		height: 150,
		// flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// paddingLeft: 8,
		// paddingRight: 8,
	},
	avatar: {
		width: 72,
		height: 72,
		borderRadius: 36,
		marginRight: 12,
	},
	headerRight: {
		width: 180,
		height: 56,
		// paddingRight: 4,
		// borderWidth: 1,
		justifyContent: 'space-between',
	},
	footer: {
		flex: 1,
		height: 38,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: MainColor,
		marginTop: 36,
		marginLeft: 20,
		marginRight: 20,
	},
})
export default AppNavigator;