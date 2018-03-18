import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, FlatList, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

//头部栏
let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let PadSide = 12; //内容与左右两侧间距
let PadHead = 8; //头部栏与两侧间距
let avatarHeight = 34;
let avatarWidth = 34;

//列表item
let itemHeight = 64; 
let imgHeight = 45;
let imgWidth = 45;
let footerHeight = 45;

let chatList = [
	{key: '0', userId: 3, avatar: '', userName: '知士', time: '20:45', isRead: false, message: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '1', userId: 6, avatar: '', userName: '小红', time: '20:34', isRead: true, message: '轰轰轰轰轰轰及激励窘境积极哦欧炯炯 李炯交警哦我机加酒噢诶过解放街32还有谁', img: ''},
	{key: '2', userId: 4, avatar: '', userName: '小白', time: '20:45', isRead: false, message: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '3', userId: 9, avatar: '', userName: '小青蛙', time: '20:34', isRead: true, message: '还有谁', img: ''},
	{key: '4', userId: 5, avatar: '', userName: '二狗子', time: '20:45', isRead: false, message: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '5', userId: 0, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isRead: true, message: '还有谁', img: ''},
	{key: '6', userId: 1, avatar: '', userName: '哈哈哈', time: '2017/11/27 20:45', isRead: false, message: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '7', userId: 2, avatar: '', userName: '啦啦啦啦', time: '2017/11/23 20:34', isRead: true, message: '还有谁', img: ''},
	{key: '8', userId: 1, avatar: '', userName: '哈哈哈', time: '2017/11/21 20:45', isRead: false, message: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '9', userId: 2, avatar: '', userName: '啦啦啦啦', time: '2017/01/23 20:34', isRead: true, message: '还有谁', img: ''},
];

export default class ChatListScreen extends Component {
	static navigationOptions = {
		title: '聊天',
		drawerLabel: '返回主页',
		drawerIcon: <Icon name='ios-home-outline' size={25} />
	};

	constructor(props) {
		super(props);
		this.state={
			uid: null,
			data: null,
		}
	}

	componentDidMount() {
		this.setState({
			data: chatList,
		})
	}

	onFooter() {
		return (
			<View style={styles.listFooter}>
				<Text style={{ fontSize: 12, color: '#ccc', }}>暂无更多消息~</Text>
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container} >
				<StatusBar opacity={0.2} />
				<View style={styles.header}>	
					<TouchableOpacity style={styles.headerButton} onPress={() => {this.props.navigation.navigate('DrawerOpen')}}>
						<Image style={styles.avatar} source={require('../../../localResource/images/avatar1.jpg')} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>消息</Text>
					<TouchableOpacity style={styles.headerButton} activeOpacity={0.6} onPress={() => {this.props.navigation.navigate('Search')} }>
						<Icon name='ios-search' size={25} />
					</TouchableOpacity>
				</View>
				<View style={styles.main}>
					<FlatList 
						data={this.state.data}
						renderItem={ ({item}) => <ChatItem item={item} uid={this.state.uid} parentRef={this} /> }
						contentContainerStyle={{paddingBottom: 54 }}
						ListFooterComponent={this.onFooter()}
					/>
				</View>
			</View>
		);
	}
}

class ChatItem extends Component {
	render() {
		const item = this.props.item;
		const uid = this.props.uid;
		const that = this.props.parentRef;
		const userName = item ? item.userName : null;

		return (
			<TouchableOpacity style={styles.itemWrap} activeOpacity={0.6} onPress={ () => {that.props.navigation.navigate('ChatRoom');} }>
				<Image style={styles.itemLeft} source={require('../../../localResource/images/avatar2.jpg')} />
				<View style={styles.itemRight}>
					<View style={styles.topInfo}>
						<Text style={{ color: '#333', fontSize: 15,}}>{item.userName}</Text>
						<Text style={{ fontSize: 12, color: '#ccc',}}>{item.time}</Text>
					</View>
					<View style={styles.bottomMes}>
						<Text numberOfLines={1} style={{ fontSize: 13, }}>{item.message}</Text>
					</View>
				</View>
			</TouchableOpacity>
			
		);
	}
}

const styles = StyleSheet.create({
	container: {
		// borderWidth: 1,
		flex: 1,
		backgroundColor: 'white',
	},
	header: {
		// width: ScreenWidth,
		height: HeaderHeight,
		// borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: PadHead,
		paddingRight: PadHead,
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
		backgroundColor: 'white',		
	},
	avatar: {
		width: avatarWidth,
		height: avatarHeight,
		borderRadius: avatarWidth /2,
	},
	headerTitle: {
		fontSize: 18,
		color: '#666',
		fontWeight: '200',
	},
	headerButton: {
		// borderWidth: 1,
		width: avatarWidth,
		height: avatarHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	listFooter: {
		height: footerHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemWrap: {
		height: itemHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
		marginLeft: PadSide,
		marginRight: PadSide,
	},
	itemLeft: {
		width: imgWidth,
		height: imgHeight,
		borderRadius: imgWidth/2,
	},
	itemRight: {
		width: ScreenWidth -3*PadSide - imgWidth,
		height:imgHeight,
		// paddingLeft: 6,
		justifyContent: 'space-between',
		// borderWidth: 1,
	},
	topInfo: {
		// borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		// alignItems: 'center',
	},
	bottomMes: {
		// borderWidth: 1,
	},
});