import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ImageBackground, ScrollView, Image, StatusBar, TextInput, TouchableOpacity, FlatList, SectionList, DeviceEventEmitter} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import fetchRequest from '../../config/request.js';

let imgCom_url = 'http://192.168.253.1:8080/images';
let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let HeaderHight = 160; //头部栏高度
let AvatarWidth = 72; //头像宽度
let AvatarHeight = 72; //头像高度
let SwitchTabHeight = 42; //转换栏高度
let PadSide = 12; //内容与左右两侧间距
let VerPadSide = 7; //上下内容间距
let SearchHeight = 28; //搜索栏高度

let itemHeight = 64;
let listAvatarWidth = 42;
let listAvatarHeight = 42;
let addBtnWidth = 56;
let addBtnHeight = 28;

let currentUserName = '西瓜瓜瓜瓜';
let contactsData = [
	{ title: 'B', data: [{key: '9', userId: 2, avatar: '', userName: '白富美', remark: null,},] },
	{ title: 'D', data: [
							{key: '7', userId: 1, avatar: '', userName: '冬瓜瓜瓜', remark: null,},
							{key: '6', userId: 3, avatar: '', userName: '咚咚锵', remark: null,},
						]
	},
	{ title: 'X', data: [
							{key: '1', userId: 4, avatar: '', userName: '小小希', remark: null,},
							{key: '2', userId: 5, avatar: '', userName: '小白', remark: null, },
							{key: '3', userId: 8, avatar: '', userName: '小红', remark: null, },
							{key: '4', userId: 10, avatar: '', userName: '小紫', remark: null, },
							{key: '5', userId: 22, avatar: '', userName: '小花', remark: null, },
							{key: '8', userId: 12, avatar: '', userName: '小草', remark: null, },
						]
	},
];
let sayHiToMe = [
	{key: '0', userId: 3, avatar: '', userName: '知士', question: '喜不喜欢吃榴莲', },
	{key: '1', userId: 6, avatar: '', userName: '小红', question: '乔乔是对面的吗', },
];
let sayHiOther = [
	{key: '0', userId: 3, avatar: '', userName: '知士', question: '喜不喜欢吃榴莲', },
	{key: '1', userId: 6, avatar: '', userName: '小红', question: '乔乔是对面的吗', },
]
let friReqData =  [
	{key: '0', userId: 3, avatar: '', userName: '知士', isFriend: false },
	{key: '1', userId: 6, avatar: '', userName: '小红', isFriend: false},
	{key: '2', userId: 4, avatar: '', userName: '小白', isFriend: false},
	{key: '3', userId: 9, avatar: '', userName: '小青蛙', isFriend: false},
	{key: '4', userId: 5, avatar: '', userName: '二狗子', isFriend: true},
	{key: '5', userId: 0, avatar: '', userName: '冬瓜瓜瓜瓜', isFriend: false},
	{key: '6', userId: 1, avatar: '', userName: '哈哈哈', isFriend: false},
	{key: '7', userId: 2, avatar: '', userName: '啦啦啦啦', isFriend: true, },
	{key: '8', userId: 1, avatar: '', userName: '哈哈哈', isFriend: false,},
	{key: '9', userId: 2, avatar: '', userName: '啦啦啦啦', isFriend: false,},
];

export default class FriendScreen extends Component {
	static navigationOptions = {
		title: '通讯录',
	};	

	constructor(props) {
		super(props);
		this.state = {
			tabShow: 'friends',
			userInfo: null,
			ready: false,
		}
	}

	componentDidMount() {
		//获取用户个人信息
		let params = {
			uid: global.user.userData.uid,
		};
		fetchRequest('/app/getUserInfo', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('friends getUserInfo Error');
			}
			else {
				console.log('friends.getUserInfo res: ', res);
				this.setState({
					userInfo: res[0],
					ready: true,
				})
			}
		})
		.catch(err => {
			console.log('friends.getUserInfo err: ',err);
		})
	}

	_showUser(ready, user) {
		if(ready) {
			return (
				<View style={{ alignItems: 'center' }}>
					<Image source={{ uri: imgCom_url + this.state.userInfo.avatar}} style={styles.avatar} />
					<Text>{this.state.userInfo.name}</Text>
				</View>
			)
		}
	}

	_showContent() {
			if(this.state.tabShow == 'friends')
				return (<Friends parentRef={this} />);
			else
				return (<NewFriends parentRef={this} />);
		}

	render() {

		let friendTabColor = this.state.tabShow == 'friends' ? MainColor : 'white';
		let newFriTabColor = this.state.tabShow == 'newFriends' ? MainColor : 'white';

		return (
			<View style={styles.container}>
				<ImageBackground source={require('../../../localResource/images/bgFriend.png')} style={styles.header}>
					{this._showUser(this.state.ready, this.state.userInfo)}
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

class Friends extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ready: null,
			data: null,
		};
	}

	componentDidMount() {
		//get friends
		this.getFriends();
	}

	getFriends() {
		let params = {
			uid: global.user.userData.uid,
		};
		fetchRequest('/app/getFriends', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('getFriends error');
			}
			else {
				console.log('getFriends res: ', res);
				res.map((value, key) => {
					value.key = key;
				})
				//找出所有种类首字母的第一次出现位置
				let title = null;
				let bkPoint = [];
				let reg = /[a-z]/;
				let firstIllegal = false;
				res.map((value, key) => {
					if(!title && reg.test(value.firstLetter)) {
						title = value.firstLetter;
						bkPoint.push(key);
						console.log('firstletter: ', value.firstLetter, 'key: ', key);
					}
					else if(reg.test(value.firstLetter) && (title != value.firstLetter) ) {
						bkPoint.push(key);
						title = value.firstLetter;
						bkPoint.push(key);
					}
					//字母用户名后首位用户名首字母为非字母的用户名
					else if( title && !reg.test(value.firstLetter) && !firstIllegal) {
						bkPoint.push(key);
						firstIllegal = true;
					}
					if((key == res.length - 1) && reg.test(value.firstLetter)) {
						bkPoint.push(res.length);
					}
				})
				let sectionData = [];
				//添加所有首字符为字母的用户
				for(let i = 0; i < bkPoint.length - 1; i += 2) {
					let temp = {};
					temp.title = res[bkPoint[i]].firstLetter.toUpperCase();
					temp.data = res.slice(bkPoint[i], bkPoint[i+1]);					
					sectionData.push(temp);
				}
				
				//存在首字符为非字母的用户名
				if(bkPoint[0] != 0 || (bkPoint[bkPoint.length - 1] < res.length - 1)) {
					res.splice(bkPoint[0], bkPoint[bkPoint.length - 1]);
					let temp = {};
					temp.title = '#';
					temp.data = res;
					sectionData.push(temp);
				}
				console.log('sectionData: ', sectionData);
				this.setState({
					data: sectionData,
					ready: true,
				})
				console.log('bkPoint: ', bkPoint);
			}
		})
		.catch(err => {
			console.log('getFriends err: ', err);
		})
	}

	_onCheckUser(that, userId) {
		let uid = global.user.userData.uid;
		let params = {
			current_uid: uid,
			rec_uid: userId,
		};
		fetchRequest('/app/getCor', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('getCor error');
			}
			//获取两用户之间的评分成功
			else {
				console.log('getCor res: ', res);
				let correlation = res[0].correlation;
				that.props.navigation.navigate('UserInfo', {uid: userId, correlation: correlation});
			}
		})
		.catch(err => {
			console.log('getCor err: ', err);
		})		
	}

	_showItem(item, that) {
		let userName = item ? item.userName : null;
		let avatar = item ? item.avatar : null;
		
		return (
			<TouchableOpacity 
				style={styles.friItemWrap} 
				activeOpacity={1} 
				onPress={ () => this._onCheckUser(that, item.uid) }
			>
				<Image style={styles.friItemAvatar} source={{ uri: imgCom_url + item.avatar}} />
				<Text>{item.name}</Text>
			</TouchableOpacity>
		)
	}

	_showFriFooter() {
		return (
			<View style={styles.listFooter}>
				<Text style={{ fontSize: 12, color: '#ccc', }}>暂无更多消息~</Text>
			</View>
		)
	}

	_showFriends(ready, data, that) {
		//数据加载完毕
		if(ready) {
			return (
				<SectionList 
					// listFooterComponent={ () => <Text>Nothing more </Text>}	
					// contentContainerStyle={{paddingBottom: 54 }}
					sections={data} 
					renderItem={ ({item}) => this._showItem(item, that) }
					renderSectionHeader={ ({section}) => <Text style={styles.sectionHeader}>{section.title}</Text> } 
				/>
			)
		}
		else {
			return (
				<View style={{height: listAvatarHeight, justifyContent: 'center', alignItems: 'center'}}>
					<Text>正在加载...</Text>
				</View>
			)
		}
	}

	render() {
		let that = this.props.parentRef;
		if(contactsData) {
			return (
				<View style={styles.friendsWrap}>
					<View style={styles.searchWrap}>
						<TouchableOpacity style={styles.search} activeOpacity={1} onPress={ () => {that.props.navigation.navigate('Search')} }>
							<Icon name="ios-search" size={21} />
							<Text style={{ paddingLeft: PadSide, fontSize: 13, color: '#ccc', }}>搜索</Text>
						</TouchableOpacity>
					</View>
					{this._showFriends(this.state.ready, this.state.data, that)}
				</View>
			)
		}
		else
			return (
				<View style={styles.noFriend}>
					<Text style={{ color: '#ccc', }}>暂时还没有好友哦~</Text>
				</View>
			)
	}
}

class NewFriends extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		sayHi: null, //我跟别人打招呼的
	// 		sayHiOther: null, //别人跟我打招呼的
	// 		friRequests: null,
	// 		ready: false,
	// 	}
	// }

	render() {
		let that = this.props.parentRef;
		return (
			<ScrollView style={styles.newFriWrap}>
				<NewFriSec title="跟我打招呼的" that={that}/>
				<NewFriSec title="我向Ta打招呼的" that={that}/>
				<NewFriSec title="申请与我聊天的" that={that}/>
				<NewFriSec title="邀请我进入房间的" that={that} />
			</ScrollView>
		)
	}
}

class NewFriSec extends Component {
	constructor(props) {
		super(props);
		this.state={
			rotateAnim: new Animated.Value(90),
			contentVisible: true,
			data: null,
			ready: false,
		}
	}
	//获取好友请求
	getFriReq() {
		let params = {
			uid: global.user.userData.uid,
		};
		fetchRequest('/app/getFriReq', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('getFriReq error');
			}
			else {
				console.log('getFriReq res: ', res);
				res.map((value, key) => {
					value.key = key;
				})
				this.setState({
					data: res,
					ready: true,
				})
			}
		})
		.catch(err => {
			console.log('getFriReq err: ', err);
		})
	}

	//获取房间请求
	getRoomReq() {
		let params = {
			to_uid: global.user.userData.uid,
		};
		fetchRequest('/app/getRoomReq', 'POST', params).then( res => {
			if(res == 'Error') {
				console.log('getRoomReq error');
			}
			else {
				console.log('getRoomReq res: ', res);
				res.map((value, key) => {
					value.key = key;
				})
				this.setState({
					data: res,
					ready: true,
				})
			}
		})
		.catch(err => {
			console.log('getRoomReq err: ', err);
		})
	}

	componentDidMount() {
		if(this.props.title == '跟我打招呼的') {
			//get sayhitome data
			this.setState({
				data: sayHiToMe,
			})
		}
		else if(this.props.title == '我向Ta打招呼的') {
			//get sayhiOther data
			this.setState({
				data: sayHiOther,
			})
		}
		//好友请求列表
		else if(this.props.title == '申请与我聊天的') {
			this.getFriReq();
			this.listener = DeviceEventEmitter.addListener('getNewMoment', function() {
				console.log('emitter working');
				this.getFriReq();
			})
		}
		//房间邀请列表
		else {
			this.getRoomReq();
		}
	}

	spin() {
		let value = this.state.contentVisible ? 0 : 90 ;

		this.setState({
			contentVisible: !this.state.contentVisible,
		})
		Animated.timing(
			this.state.rotateAnim,
			{
				toValue: value,
				easing: Easing.linear,
				duration: 200,
			}
		).start();
	}

	_showSayHi(type, item, that) {
		let userName = item ? item.userName : null;
		let avatar = item ? item.avatar : null;
		let question = item ? item.question : null;
		let content = type == 'toMe' ? ('回答了"' + question + '"') : ('我回答了Ta的"' + question + '"');

		return (
			<TouchableOpacity style={styles.itemWrap} activeOpacity={0.6} onPress={ () => {that.props.navigation.navigate('ChatRoom');} }>
				<View style={styles.itemLeft}>
					<Image style={styles.friItemAvatar} source={require('../../../localResource/images/avatar2.jpg')} />
					<View style={styles.itemMiddle}>
						<Text style={{ color: '#333', fontSize: 15,}}>{userName}</Text>
						<Text numberOfLines={1} style={{ fontSize: 13, }}>{content}</Text>
					</View>
				</View>
				<Icon name='ios-arrow-forward' size={21} />
			</TouchableOpacity>
		)
	}

	_showContent(ready, title, that, contentVisible) {
		//数据加载成功并且当前项目可见
		if(ready && contentVisible) {
			if(title == '跟我打招呼的') {
				return (
					<FlatList data={this.state.data} renderItem={ ({item}) => this._showSayHi('toMe', item, that) } />
				)
			}
			else if(title == '我向Ta打招呼的') {
				return (
					<FlatList data={this.state.data} renderItem={ ({item}) => this._showSayHi('toOther',item, that) } />
				)
			}
			//好友邀请与房间邀请
			else {
				return (
					<FlatList data={this.state.data} renderItem={ ({item, index}) => <FriRequest item={item} index={index} that={that} /> } />
				)
			}
		}
		else if(contentVisible) {
			return (
				<View style={{height: listAvatarHeight, justifyContent: 'center', alignItems: 'center'}}>
					<Text>正在加载...</Text>
				</View>
			)
		}
		else 
			return null;
	}

	render() {
		let spin = this.state.rotateAnim.interpolate({
			inputRange: [0, 360],
			outputRange: ['0deg', '360deg']
		});
		// console.log("spin is ", spin);

		return (
			<View>
				<TouchableOpacity style={styles.newTitleWrap} onPress={() => this.spin() }>
					<Animated.View style={{ transform: [{rotate: spin}]}}>
						<Icon name='ios-arrow-forward-outline' size={18} />
					</Animated.View>
					<Text style={{ paddingLeft: PadSide, fontSize: 13,}}>{this.props.title}</Text>
				</TouchableOpacity>
				<View style={styles.mainWrap}>
					{this._showContent(this.state.ready, this.props.title, this.props.that, this.state.contentVisible)}
				</View>
			</View>
		)
	}
}

class FriRequest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// item: null,
			isFriend: null,
		}
	}

	componentDidMount() {
		let isFriend = this.props.item.status ? true : false;
		this.setState({
			// item: this.props.item,
			isFriend: isFriend,
		})
	}

	componentWillReceiveProps(nextProps) {
		let isFriend = nextProps.item.status ? true : false;
		this.setState({
			// item: this.props.item,
			isFriend: isFriend,
		})
	}

	_onAddFri(userId) {
		let params = {
			uid: global.user.userData.uid,
			userId: userId,
		};
		fetchRequest('/app/addFriend', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('addFriend error');
			}
			else {
				console.log('addFriend success');
				this.setState({
					isFriend: true,
				})
			}
		})
		.catch(err => {
			console.log('addFriend err: ', err);
		})
	}

	_showAddBtn(isFriend, userId, index) {
		if(isFriend) {
			return (
				<View style={[styles.addBtn, {backgroundColor: 'white'},]}>
					<Text style={{ fontSize: 12, color: '#ccc', }}>已添加</Text>
				</View>
			);
		}
		else {
			return (
				<TouchableOpacity 
					style={styles.addBtn} 
					onPress={ () => this._onAddFri(userId) }
				>
					<Text>添加</Text>
				</TouchableOpacity>
			)
		}
	}

	_onCheckUser(userId, that) {
		let uid = global.user.userData.uid;
		let params = {
			current_uid: uid,
			rec_uid: userId,
		};
		fetchRequest('/app/getCor', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('getCor error');
			}
			//获取两用户之间的评分成功
			else {
				console.log('getCor res: ', res);
				let correlation = res[0].correlation;
				that.props.navigation.navigate('UserInfo', {uid: userId, correlation: correlation});
			}
		})
		.catch(err => {
			console.log('getCor err: ', err);
		})
	}

	render() {
		let item = this.props.item;
		let that = this.props.that;
		let index = this.props.index;
		let userId = item ? item.uid : null;
		let name = item ? (item.fri_name ? `${item.name}(${item.fri_name})` : item.name) : null;
		let avatar = item ? item.avatar : null;

		return (
			<View style={styles.itemWrap}>
				<TouchableOpacity style={styles.itemLeft} activeOpacity={0.6} onPress={() => this._onCheckUser(userId, that) }>
					<Image style={styles.friItemAvatar} source={{ uri: imgCom_url + avatar }} />
					<Text>{name}</Text>
				</TouchableOpacity>
				{this._showAddBtn(this.state.isFriend, userId, index)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
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
	addBtn: {
		width: addBtnWidth,
		height: addBtnHeight,
		backgroundColor: MainColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	},
	itemRight: {
		width: ScreenWidth -3*PadSide - listAvatarWidth,
		height: listAvatarHeight,
		// paddingLeft: 6,
		justifyContent: 'space-between',
		// borderWidth: 1,
	},
	itemLeft: {
		flexDirection: 'row',
		alignItems: 'center',		
	},
	itemMiddle: {
		height: listAvatarHeight,
		justifyContent: 'space-between',
	},
	newTitleWrap: {
		height: SearchHeight,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: PadSide,
		backgroundColor: '#eee',
	},
	friItemWrap: {
		height: itemHeight,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: PadSide,
		backgroundColor: 'white',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
	},
	friItemAvatar: {
		width: listAvatarWidth,
		height: listAvatarHeight,
		borderRadius: listAvatarWidth/2,
		marginRight: PadSide,
	},
	sectionHeader: {
		paddingLeft: PadSide,
	},
	listFooter: {
		height: itemHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
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
		marginBottom: PadSide,
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
		width: 0.3,
		height: SwitchTabHeight - 2,
		backgroundColor: '#ccc',
	},
	noFriend: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 2*PadSide,
		backgroundColor: 'white',
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
		flexDirection: 'row',
		alignItems: 'center',
		height: SearchHeight,
		borderWidth: 0.3,
		borderRadius: SearchHeight/2,
		borderColor: '#ccc',
		paddingLeft: PadSide,
	},
	newFriWrap: {
		// width: ScreenWidth,
		flex: 1,
		backgroundColor: 'white',
	}
})