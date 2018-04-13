import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Modal, FlatList, DeviceEventEmitter, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalView from '../../helpers/ModalView.js';
import fetchRequest from '../../config/request.js';

let imgCom_url = 'http://192.168.253.1:8080/images';
let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let PadSide = 15; //内容与左右两侧间距
let PadBottom = 8; //上下两条内容间距
let ContentPad = 10; //文本与上下间距
let UserInfoHeight = 58; //用户信息栏高度
let bottomHeight = 38; //底部评论点赞栏高度

let FooterHeight = 52; //底部信息栏高度

let DelBtnWidth = 52;
let DelBtnHeight = 42;

let avatarWidth = 42;
let avatarHeight = 42;

// let data = [
// 	{key: '0', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
// 	{key: '1', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isliked: true, content: '轰轰轰轰轰轰及激励窘境积极哦欧炯炯 李炯交警哦我机加酒噢诶过解放街32还有谁', img: ''},
// 	{key: '2', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
// 	{key: '3', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isliked: true, content: '还有谁', img: ''},
// 	{key: '4', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
// 	{key: '5', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isliked: true, content: '还有谁', img: ''},
// 	{key: '6', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
// 	{key: '7', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isliked: true, content: '还有谁', img: ''},
// ];

export default class MomentScreen extends Component {
	static navigationOptions = {
		header: null,
		title: '发现',
		// tabBarVisible: false,
	};

	constructor(props) {
		super(props);
		this.state={
			uid: null, //当前用户id
			data: null, //话题列表数据
			modalVisible: false,
		}
	}

	componentDidMount() {
		//获取数据
		this.getInitData();
		let self = this;
		this.listener = DeviceEventEmitter.addListener('getNewMoment', function() {
			console.log('emitter working');
			self.getInitData();
		})
	}

	componentWillUnmount() {
		this.listener.remove();
	}

	getInitData() {
		let params = {
			uid: global.user.userData.uid,
		};
		console.log('params: ', params);
		fetchRequest('/app/getMoment', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('getMoment error');
			}
			else {
				res.map((value, key) => {
					value.key = key;
				})
				console.log('getMoment res: ', res);
				this.setState({
					uid: global.user.userData.uid,
					data: res,
				})
			}
		})
		.catch(err => {
			console.log('getMoment err: ',err);
		})
	}

	// _onDel(mem_id) {
	// 	//删除动态
	// 	console.log('del success');
	// 	let params = {
	// 		mem_id: mem_id,
	// 	};
	// 	fetchRequest('/app/delMoment', 'POST', params).then(res => {
	// 		if(res == 'Error') {
	// 			console.log('delMoment err');
	// 		}
	// 		else {
	// 			console.log('delMoment success');
	// 		}
	// 	})
	// 	.catch(err => {
	// 		console.log('delMoment err: ', err);
	// 	})
	// }

	_onFooter() {
		return (
			<View style={styles.footerWrap}>
				<Text style={styles.footerContent}>暂无更多内容~</Text>
			</View>
		)
	}


	render() {
		let items = []; 
		return (
			<View style={styles.mainContainer}>
				<View style={styles.container}>
					<View style={styles.header}>	
						<View style={styles.headerButton}></View>
						<Text style={styles.headerTitle}>发现</Text>
						<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={ () => {this.props.navigation.navigate('EditMoment')} }>
							<Icon name='edit' size={21} />
						</TouchableOpacity>
					</View>
					<View style={styles.main}>
						<FlatList data={this.state.data} 
							renderItem={({item}) => <MomentItem item={item} uid={this.state.uid} parentRef={this} />}
							style={styles.list}
							contentContainerStyle={{paddingBottom: 88 }}
							ListFooterComponent={this._onFooter}
						/>
					</View>
				</View>
			</View>
		);
	}
}

export class MomentItem extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isliked: null,
		}
	}

	componentDidMount() {
		console.log('this.props.item.liked: ', this.props.item.liked);
		this.setState({
			isliked: this.props.item.liked,
		})
	}

	componentWillReceiveProps(nextProps) {
		console.log('willreceive worked nextProps: ', nextProps);
		this.setState({
			isliked: nextProps.item.liked,
		})
	}

	_showTrash(currentUser, userId, that) {
		console.log("that is ", that);
		if(currentUser == userId)
			return (
				<TouchableOpacity 
					style={styles.delWrap} 
					activeOpacity={0.6} 
					onPress={() => { console.log("press del"); that.setState({ modalVisible: true,}); console.log("that is ", that); }} 
				> 
					<Icon name="trash-o" size={22} />
				</TouchableOpacity>
			)
		else
			return null;
	}

	_onLikePress(mem_id) {
		console.log("onLike pressed");
		let params = {
			uid: global.user.userData.uid,
			mem_id: mem_id,
		};
		console.log('likePress params: ', params);
		//当前状态为喜欢，点击后设置为不喜欢
		if(this.state.isliked) {
			this.setState({
				isliked: !this.state.isliked,
			})
			fetchRequest('/app/setUnlike', 'POST', params).then(res => {
				if(res == 'Error') {
					console.log('setUnlike failed');
				}
				else {
					console.log('setUnlike success');
				}
			})
			.catch(err => {
				console.log('setUnlike err: ', err);
			})
		}
		//当前状态为不喜欢，点击后设置为喜欢
		else {
			this.setState({
				isliked: !this.state.isliked,
			})
			fetchRequest('/app/setLike', 'POST', params).then(res => {
				if(res == 'Error') {
					console.log('setlike failed');
				}
				else {
					console.log('setlike success');
				}
			})
			.catch(err => {
				console.log('setlike err: ', err);
			})
		}
	}

	_onOpenUserInfo(userId, uid, that) {
		console.log('navigate UserInfo userId: ', userId, 'uid: ', uid);
		//点击本人头像不跳转
		if(userId != uid) {
			let params = {
				current_uid: uid,
				rec_uid: userId,
			}
			fetchRequest('/app/getCor', 'POST', params).then(res => {
				if(res == 'Error') {
					console.log('getCor error');
				}
				else {
					console.log('getCor res: ', res);
					that.props.navigation.navigate('UserInfo', {uid: userId, correlation: res[0].correlation});
				}
			})
			.catch(err => {
				console.log('getCor err: ', err);
			})
		}
	}

	_showPicture(picture) {
		if(picture) {
			return (
				<Image style={{ width: ScreenWidth - 3*PadSide, height: 220 }} source={{ uri: imgCom_url + picture}} />
			)
		}
		else {
			return null;
		}
	}
	render() {
		let that = this.props.parentRef;
		let item = this.props.item;
		console.log("item in MomentItem is ", item);
		console.log("that is ", that);

		let uid = this.props.uid;
		let mem_id = item.mem_id;
		let picture = item.picture;
		console.log('mem_id: ', mem_id);
		let heartColor = this.state.isliked ? 'red' : '#666';
		
		// if(item !== undefined)
		return (
			<View style={styles.ItemWrap}>
				<View style={styles.userInfoWrap}>
					<TouchableOpacity activeOpacity={0.6} onPress={ () => this._onOpenUserInfo(item.uid, uid, that)}>
						<Image style={styles.avatar} source={{ uri: imgCom_url + item.avatar}} />
					</TouchableOpacity>
					<View style={styles.middleWrap}>
						<Text style={{ fontSize: 15 }}>{item.name}</Text>
						<Text style={{ fontSize: 12 }}>{item.time}</Text>
					</View>
					{this._showTrash(uid, item.userId, that)}
				</View>
				<View style={styles.contentWrap}>
					<Text>{item.content}</Text>
					{this._showPicture(picture)}
				</View>
				<View style={styles.bottomWrap}>
					<TouchableOpacity style={styles.button} activeOpacity={1} onPress={() => {that.props.navigation.navigate('Comment', { item: item, uid: uid,});}} >
						<Icon name='commenting-o' size={16} style={{ paddingRight: ContentPad, marginBottom: 3, }} />
						<Text style={{ fontSize: 13 }}>评论</Text>
					</TouchableOpacity>
					<View style={styles.verLine}></View>
					<TouchableOpacity style={styles.button} activeOpacity={1} onPress={() => this._onLikePress(mem_id)}>
						<Icon name="heart-o" size={16} style={{ paddingRight: ContentPad, color: heartColor, }} />
						<Text style={{ fontSize: 13 }}>喜欢</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	container: {
		// flex: 1,
		width: ScreenWidth,
		// borderWidth: 1,
		// alignItems: 'center',
	},
	header: {
		width: ScreenWidth,
		height: HeaderHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
		backgroundColor: 'white',
		// marginBottom: PadBottom,		
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
	ItemWrap: {
		width: ScreenWidth,
		// borderWidth: 1,
		paddingLeft: PadSide,
		paddingRight: PadSide,
		marginBottom: PadBottom,
		backgroundColor: 'white',
	},
	userInfoWrap: {
		height: UserInfoHeight,
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: avatarWidth,
		height: avatarHeight,
		borderRadius: avatarWidth/2,
	},
	middleWrap: {
		justifyContent: 'space-around',
		height: avatarHeight,
		marginLeft: PadSide,
		// borderWidth: 1,
	},
	delWrap: {
		position: 'absolute',
		right: 0,
		width: DelBtnWidth,
		height: DelBtnHeight,
		// borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	contentWrap: {
		// borderWidth: 1,
		paddingTop: ContentPad,
		paddingBottom: ContentPad,
		borderBottomWidth: 0.3,
		borderColor: '#ddd',
	},
	bottomWrap: {
		height: bottomHeight,
		// flex: 1,
		// borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		// flex: 0.49,
		// borderWidth: 1,
		width: (ScreenWidth - 2*PadSide)/2,
		height: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	verLine: {
		height: bottomHeight - 10,
		width: 0.3,
		backgroundColor: '#ccc',
	},
	main: {
		
	},
	list: {
		// paddingBottom: 150,
	},
	footerWrap: {
		height: FooterHeight,
		// borderWidth: 1,
		alignItems: 'center',
		// marginBottom: 300,
	},
	footerContent: {
		fontSize: 12,
		color: '#ccc',
	}

});