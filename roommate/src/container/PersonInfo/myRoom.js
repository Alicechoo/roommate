import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, DrawerLayoutAndroid, FlatList, } from 'react-native';
import ModalView from '../../helpers/ModalView.js';
import Icon from 'react-native-vector-icons/Ionicons';
import fetchRequest from '../../config/request.js';

let imgCom_url = 'http://192.168.253.1:8080/images';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let PadSide = 12;
let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let avatarWidth = 64;
let avatarHeight = 64;
let imgWidth = 42;
let imgHeight = 42;
let itemHeight = 66;
let drawerBtnWidth = 42;
let drawerBtnHeight = 24;

let modalWidth = ScreenWidth - 80;
let modalHeight = 160;
let modalTitleHeight = 42;
let modalBtnWidth = 64;
let modalBtnHeight = 28;

// let drawerTitleHei = 36; 

let roomMember = [
	{key: 1, userId: 1, avatar: '', userName: '冬瓜瓜瓜', remark: null, inRoom: false},
	{key: 2, userId: 3, avatar: '', userName: '咚咚锵', remark: null, inRoom: true},
];
// let friList = [
// 	{key: 0, userId: 2, avatar: '', userName: '白富美', remark: null, inRoom: false },
// 	{key: 1, userId: 1, avatar: '', userName: '冬瓜瓜瓜', remark: null, inRoom: false},
// 	{key: 2, userId: 3, avatar: '', userName: '咚咚锵', remark: null, inRoom: true},
// 	{key: 3, userId: 4, avatar: '', userName: '小小希', remark: null, inRoom: false},
// 	{key: 4, userId: 5, avatar: '', userName: '小白', remark: null, inRoom: false },
// 	{key: 5, userId: 8, avatar: '', userName: '小红', remark: null, inRoom: false },
// 	{key: 6, userId: 10, avatar: '', userName: '小紫', remark: null, inRoom: false },
// 	{key: 7, userId: 22, avatar: '', userName: '小花', remark: null, inRoom: false },
// 	{key: 8, userId: 12, avatar: '', userName: '小草', remark: null, inRoom: false },
// ];

export default class RoomScreen extends Component {
	static navigationOptions = {
		drawerLabel: '查看/创建房间',
		drawerIcon: <Icon name="ios-people-outline" size={22} />
	};

	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			selectedItem: null,
			userInfo: null,
			rid: null,
			ready: false,
			roomMember: null,
			addMember: null,
			friReady: false,
			friList: null,
		}
	}

	componentDidMount() {
		this.getInitData();
		this.getDrawerData();
		// this.setState({
		// 	roomMember: roomMember,
		// })
	}

	getInitData() {
		let params = {
			uid: global.user.userData.uid,
		};
		fetchRequest('/app/getUserInfo', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('getUserInfo error');
			}
			else {
				console.log('getUserInfo res: ', res);
				this.setState({
					userInfo: res[0],
				})
				//该用户没有创建房间，未邀请室友，或邀请未被通过
				if(res[0].rid === null) {
					this.setState({
						roomMember: [],
						addMember: [],
						ready: true,
					})
				}
				//用户已绑定
				else if(res[0].rid > 0) {
					let params = {
						rid: res[0].rid,
						uid: global.user.userData.uid,
					}
					fetchRequest('/app/getRoomMember', 'POST', params).then(res1 => {
						if(res1 == 'Error') {
							console.log('getRoomMember error');
						}
						else {
							console.log('getRoomMember res1: ', res1);
							this.setState({
								rid: res[0].rid,
								roomMember: res1,
								ready: true,
							})
						}
					})
					.catch(err => {
						console.log('getRoomMember err: ', err);
					})
				}
				//当前用户未创建房间，但有其他用户进入房间（房主）
				else if(res[0].rid == 0) {
					let params = {
						from_uid: global.user.userData.uid,
					};
					fetchRequest('/app/getRoomStay', 'POST', params).then(res1 => {
						if(res1 == 'Error') {
							console.log('getRoomStay error');
						}
						else {
							console.log('getRoomStay res1: ', res1);
							this.setState({
								rid: res[0].rid,
								addMember: res1,
								ready: true,
							})
						}
					})
					.catch(err => {
						console.log('getRoomMember err: ', err);
					})
				}
				//当前用户在房间中，未绑定，非房主
				else if(res[0].rid == -1) {
					let params = {
						to_uid: global.user.userData.uid,
					};
					fetchRequest('/app/getRoomOther', 'POST', params).then(res1 => {
						if(res1 == 'Error') {
							console.log('getRoomOther error');
						}
						else {
							console.log('getRoomOther res1: ', res1);
							this.setState({
								rid: res[0].rid,
								addMember: res1,
								ready: true,
							})
						}
					})
					.catch(err => {
						console.log('getRoomMember err: ', err);
					})
					
				}
			}
		})
		.catch(err => {
			console.log('getUserInfo err: ', err);
		})
	}

	getDrawerData() {
		let params = {
			uid: global.user.userData.uid,
		};
		fetchRequest('/app/getRoomFri', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('getRoomFri error');
			}
			else {
				console.log('getRoomFri res: ', res);
				res.map((value, key) => {
					value.key = key;
				})
				this.setState({
					friReady: true,
					friList: res,
				})
			}
		})
		.catch(err => {
			console.log('getRoomFri err: ', err);
		})
	}

	showMember(members) {
		let items = [];
		console.log('roomMember: ', members);
		if(members && members.length > 0)
		{
			members.map((value, key) => {
				items.push(
					<View style={styles.memberWrap} key={key}>
						<Image style={styles.avatar} source={{ uri: imgCom_url + value.avatar }} />
						<Text style={{ fontSize: 13, marginTop: 8, }}>{value.name}</Text>
					</View>
				)
			})
			return items;
		}
		else
			return null;
		
	}

	showAddMember(members) {
		let items = [];
		console.log('addMember: ', members);
		if(members && members.length > 0)
		{
			members.map((value, key) => {
				items.push(
					<View style={styles.memberWrap} key={key}>
						<Image style={styles.avatar} source={{ uri: imgCom_url + value.avatar }} />
						<Text style={{ fontSize: 13, marginTop: 8, }}>{value.name}</Text>
					</View>
				)
			})
			return items;
		}
		else
			return null;
		
	}
	
	openDrawer() {
		this.refs.drawerLayout.openDrawer();
	}

	showItem(item) {
		console.log('item: ', item);
	}

	_onClose() {
		this.setState({
			modalVisible: false,
		})
	}

	_onOutRoom(rid, members, that) {
		let params = {
			uid: global.user.userData.uid,
			rid: rid,
			members: members,
		};
		fetchRequest('/app/outRoom', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('outRoom error');
			}
			else {
				that.setState({
					rid: null,
					addMember: [],
					roomMember: [],
					modalVisible: false,
					//设置emit使drawer重新判断是否可邀请
				})
			}
		})
		.catch(err => {
			console.log('outRoom err: ', err);
		})
	}

	showModal(type) {
		if(type == 'buildFail') {
			let text = this.state.addMember ? (this.state.addMember.length < 5 ? '单人不可创建房间哦~' : '人数超过上限，一个房间最多只能有五个人哦') : '单人不可创建房间哦~';
			return (
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {}}
				>
					<TouchableOpacity style={styles.bgModal} onPress={ () => this._onClose() }>
						<View style={styles.modalWrap}>
							<View style={styles.placehold}></View>
							<Text style={{ fontSize: 15 }}>{text}</Text>
							<TouchableOpacity style={styles.modalBtn} onPress={ () => this._onClose() }>
								<Text>确定</Text>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</Modal>
			)
		}
		else if(type == 'dropOut') {
			let params = {
				that: this,
				rid: this.state.rid, 
				members: this.state.roomMember
			};
			return (
				<ModalView 
					title={'确认退出'} 
					content={'确定要退出房间吗？'}  
					buttonLeft={'取消'} 
					buttonRight={'确定'} 
					modalVisible={this.state.modalVisible}
					params = {params}
					onConfirm={this._onOutRoom}
				/>
			)
		}
	}

	_showFriList(ready, readyFri, friList) {
		//数据加载完毕
		if(ready && readyFri) {
			return (
				<FlatList
					data={friList}
					renderItem={({item, index}) => <RoomFri item={item} index={index} parentRef={this} rid={this.state.rid} />}
				/>
			)
		}
		//数据加载中
		else {
			return (
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<Text>正在加载...</Text>
				</View>
			)
		}
	}
	_onPressBtn(rid, ready, addMember) {
		if(ready) {
			//创建房间
			if(rid === null) {
				//单人不可创建房间
				if(!this.state.addMember) {
					this.setState({
						modalVisible: true,
						selectedItem: 'buildFail',
					})
				}
			}
			//房主创建房间，将房间中所有人rid均设置为房主uid
			else if(rid == 0) {
				if(addMember.length < 5) {
					let params = {
						host_uid: global.user.userData.uid,
						members: addMember,
					};
					fetchRequest('/app/buildRoom', 'POST', params).then( res => {
						if(res == 'Error') {
							console.log('buildRoom failed');
						}
						else {
							console.log('buildRoom success');
							this.setState({
								rid: global.user.userData.uid,
							})
						}
					})
					.catch(err => {
						console.log('buildRoom err: ', err);
					})
				}
				else {
					this.setState({
						modalVisible: true,
						selectedItem: 'buildFail',
					})
				}
			}
			//退出房间
			else {
				this.setState({
					modalVisible: true,
					selectedItem: 'dropOut',
				})
			}
		}
	}

	render() {
		let roomMember = this.state.roomMember;
		let avatar = this.state.userInfo ? this.state.userInfo.avatar : null;
		let rid = this.state.rid;
		let headerTitle = rid ? '我的房间' : '创建房间';
		let btnContent = rid ? '退出房间' : '创建房间';

		let navigationView = (
			<View style={{ flex: 1, }}>
				<View style={styles.drawerHeader}>
					<Text style={{ fontSize: 15, color: 'white', }}>好友列表</Text>
				</View>
				{this._showFriList(this.state.ready, this.state.friReady, this.state.friList)}
			</View>
		)
		return (
			<DrawerLayoutAndroid
				ref={(drawer) => {this.drawer = drawer;}}
				drawerWidth={280}
				drawerPosition={DrawerLayoutAndroid.positions.Right}
				renderNavigationView={() => navigationView}
			>
				{this.showModal(this.state.selectedItem)}
				<View style={styles.container}>
					<View>
						<View style={styles.header}>
							<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
								<Icon name='ios-arrow-back' size={21} />
							</TouchableOpacity>	
							<Text style={styles.headerTitle}>{headerTitle}</Text>
							<View style={styles.headerButton}></View>					
						</View>
						<View style={styles.main}>
							<View style={styles.memberWrap}>
								<Image style={styles.avatar} source={{ uri: imgCom_url + avatar }} />
								<Text style={{ fontSize: 13, marginTop: 8, }}>我</Text>
							</View>
							{this.showMember(this.state.roomMember)}
							{this.showAddMember(this.state.addMember)}
							<TouchableOpacity style={styles.addBtn} activeOpacity={0.6} onPress={() => this.drawer.openDrawer()}>
								<Icon name='ios-add-outline' size={42} />
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity style={styles.footerBtn} onPress={() => this._onPressBtn(rid, this.state.ready, this.state.addMember)}>
						<Text>{btnContent}</Text>
					</TouchableOpacity>
				</View>
			</DrawerLayoutAndroid>
		)
	}
}

class RoomFri extends Component {
	constructor(props) {
		super(props);
		//当前用户已绑定或在房间中时不可被邀请
		let item = this.props.item;
		let rid = this.props.rid;
		// this.setState({
		// 	item: item,
		// 	rid: rid,
		// })
		this.state = {
			request: null,
			item: item,
			rid: rid,
			ready: false,
		}
	}

	componentDidMount() {
		// this.getItem();
		this.getUserAvail(this.state.item, this.state.rid);
	}

	componentWillReceiveProps(nextProps) {
		console.log('componentWillReceiveProps work');
		this.setState({
			rid: nextProps.rid,
		})
	}

	getUserAvail(item, rid) {
		//当前用户为初始用户（未在房间中）或为房主时才可进行邀请
		if(!rid) {
			let item_rid = item ? item.rid : null;
			let to_uid = item ? item.uid : null;
			console.log('item_rid item: ', item);
			if(to_uid && item_rid === null) {
				let params = {
					from_uid: global.user.userData.uid,
					to_uid: to_uid, 
				};
				fetchRequest('/app/checkRoomReq', 'POST', params).then( res => {
					if(res == 'Error') {
						console.log('checkRoomReq error');
					}
					else {
						console.log('checkRoomReq res: ', res);
						//当前用户没有对该用户发起邀请
						if(res.length == 0) {
							this.setState({
								request: false,
								ready: true,
							})
						}
						else{
							this.setState({
								request: true,
								ready: true,
							})
						}
					}
				})
				.catch(err => {
					console.log('checkRoomReq err: ', err);
				})
			}
			else if(to_uid) {
				this.setState({
					ready: true,
				})
			}
		}
		else {
			this.setState({
				ready: true,
			})
		}
	}

	_onSendInvite(rid, userId) {
		console.log('invite pressed');
		//Todo: send System Messge of invite
		//仅房主与未邀请过的用户可进行邀请
		if(!rid) { 
			let params = {
				from_uid: global.user.userData.uid,
				to_uid: userId,
			};
			fetchRequest('/app/sendRoomReq', 'POST', params).then(res => {
				if(res == 'Error') {
					console.log('sendFriReq error');
				}
				else {
					console.log('sendFriReq success');
					this.setState({
						request: true,
					})
				}
			})
			.catch(err => {
				console.log('sendFriReq err: ', err);
			})
		}
	}

	showBtn(request, ready, item, rid) {
		// return (
		// 		<Text style={{fontSize: 12, color: '#ccc', }}>已绑定</Text>
		// 	)
		if(ready) {
			let text = null;
			if(item.rid > 0) {
				text = '已绑定';
			}
			else if(item.rid == 0 || item.rid == -1) {
				text = '房间中';
			}
			else if(request) {
				text = '已邀请';
			}
			else {
				//房主与未邀请任何的用户的用户才能发起邀请
				console.log('showBtn rid: ', this.state.rid);
				let color = rid ? '#ccc' : MainColor;
				let opacity = rid ? 1 : 0.6;
				return (
					<TouchableOpacity 
						style={[styles.drawerBtn, {backgroundColor: color}]} 
						onPress={() => this._onSendInvite(rid, item.uid)}
						activeOpacity = {opacity}
					>
						<Text style={{ fontSize: 13, color: 'white', }}>邀请</Text>
					</TouchableOpacity>
				)
			}
			return (
				<Text style={{fontSize: 12, color: '#ccc', }}>{text}</Text>
			)
		}
		else {
			return null;
		}
	}

	render() {
		let rid = this.state.rid;
		// let index = this.props.index;
		let item = this.state.item;
		let avatar = item ? item.avatar : null;
		let name = item ? (item.fri_name ? `${item.name}(${item.fri_name})` : item.name) : null;
		// let ready = this.state.ready;

		return (
			<View style={styles.itemWrap}>
				<View style={styles.itemLeft}>
					<Image style={styles.drawerImg} source={{ uri: imgCom_url + avatar}} />
					<Text>{name}</Text>
				</View>
				{this.showBtn(this.state.request, this.state.ready, item, rid)}
			</View>
		)
	}
}
const styles = StyleSheet.create({
	drawerHeader: {
		height: HeaderHeight,
		backgroundColor: MainColor,
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
		flexDirection: 'row',
		alignItems: 'center',
	},
	memberWrap: {
		alignItems: 'center',
		marginRight: PadSide,
		// borderWidth: 1,
	},
	drawerImg: {
		width: imgWidth,
		height: imgHeight,
		borderRadius: imgWidth/2,
		marginRight: PadSide,
	},
	drawerBtn: {
		width: drawerBtnWidth,
		height: drawerBtnHeight,
		backgroundColor: MainColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5, 
	},
	bgModal: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 88,
	},
	modalWrap: {
		width: modalWidth,
		height: modalHeight,
		justifyContent: 'space-around',
		alignItems: 'center',
		borderWidth: 0.3,
		borderColor: '#ccc',
		borderRadius: 10,
		backgroundColor: 'white',
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	modalBtn: {
		width: modalBtnWidth,
		height: modalBtnHeight,
		backgroundColor: MainColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	},
	//布局占位
	placehold: {
		height: 1, 
	},
	container: {
		// flex: 1,
		// borderWidth: 1,
		justifyContent: 'space-between',
		height: ScreenHeight,
		backgroundColor: 'white',
	},
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
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 18,
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	avatar: {
		width: avatarWidth,
		height: avatarHeight,
		borderRadius: avatarWidth/2,
	},	
	addBtn: {
		width: avatarWidth + 1,
		height: avatarHeight + 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: avatarWidth/2,
		borderWidth: 1,
		borderColor: '#ccc',
	},
	footerBtn: {
		width: ScreenWidth - 6*PadSide,
		height: 42,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		backgroundColor: MainColor,
		marginBottom: 72,
	},
})