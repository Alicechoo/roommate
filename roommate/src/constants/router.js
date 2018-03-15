import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigator, DrawerNavigator, TabNavigator, TabBarBottom, addNavigationHelpers } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatListScreen from '../container/TabMain/chatList.js';
import RecListScreen from '../container/TabMain/recList.js';
import MomentScreen from '../container/TabMain/momentShow.js';
import FriendScreen from '../container/TabMain/friends.js';
import SelfScreen from '../container/PersonInfo/self.js';

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
});

const RootStack = StackNavigator({
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
	initialRouteName: 'Main', //调试主界面
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

const AppNavigator = StackNavigator({
	Root: {
		screen: RootStack,
	},
	MyModal: {
		screen: ModalScreen,
	},
},{
	mode: 'modal',
	headerMode: 'none',
})

export default AppNavigator;