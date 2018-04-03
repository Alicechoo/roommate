import React, { Component } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ImageBackground, Image, TouchableOpacity, NavigationActions, } from 'react-native';
import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom, addNavigationHelpers } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { DrawerItems, SafeAreaView } from 'react-navigation';

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

let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

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
	// Login: {
	// 	screen: LoginScreen,
	// },
}, {
	drawerOpenRoute: 'DrawerOpen',
	drawerCloseRoute: 'DrawerClose',
	drawerToggleRoute: 'DrawerToggle',
	order: ['Self', 'SayHiQue', 'PersonChart', 'MyMoment', 'MyRoom', 'MainTab'],
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
						<Image source={require('../../localResource/images/avatar1.jpg')} style={styles.avatar} />
						<View style={styles.headerRight}>
							<Text>西瓜瓜瓜</Text>
							<Text numberOfLines={1} style={{ fontSize: 14, }}>我想说的是哈hi我hi二纺机时代峰峻我快速减肥IE</Text>
						</View>
					</ImageBackground>
					<DrawerItems {...props} />
					<TouchableOpacity 
						style={styles.footer} 
						activeOpacity={0.6}
						onPress={() => {
							// const resetAction = NavigationActions.reset({
							// 	index: 0,
							// 	actions: [NavigationActions.navigate({ routeName: 'Login'})],
							// });
							console.log('this in drawer: ', this);
							this.props.navigation.dispatch(resetAction)
						}}
					>
						<Text>退出登录</Text>
					</TouchableOpacity>
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
	}
},
{
	initialRouteName: 'Login', //调试主界面
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
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 8,
		paddingRight: 8,
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