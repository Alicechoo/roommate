import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, DrawerLayoutAndroid, FlatList, } from 'react-native';
import ModalView from '../../helpers/ModalView.js';
import Icon from 'react-native-vector-icons/Ionicons';

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
let friList = [
	{key: 0, userId: 2, avatar: '', userName: '白富美', remark: null, inRoom: false },
	{key: 1, userId: 1, avatar: '', userName: '冬瓜瓜瓜', remark: null, inRoom: false},
	{key: 2, userId: 3, avatar: '', userName: '咚咚锵', remark: null, inRoom: true},
	{key: 3, userId: 4, avatar: '', userName: '小小希', remark: null, inRoom: false},
	{key: 4, userId: 5, avatar: '', userName: '小白', remark: null, inRoom: false },
	{key: 5, userId: 8, avatar: '', userName: '小红', remark: null, inRoom: false },
	{key: 6, userId: 10, avatar: '', userName: '小紫', remark: null, inRoom: false },
	{key: 7, userId: 22, avatar: '', userName: '小花', remark: null, inRoom: false },
	{key: 8, userId: 12, avatar: '', userName: '小草', remark: null, inRoom: false },
];

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
			roomMember: null,
			addMember: null,
		}
	}

	componentDidMount() {
		this.setState({
			roomMember: roomMember,
		})
	}

	showMember(members) {
		let items = [];
		if(members && members.length > 0)
		{
			members.map((value, key) => {
				items.push(
					<View style={styles.memberWrap} key={key}>
						<Image style={styles.avatar} source={require('../../../localResource/images/avatar1.jpg')} />
						<Text style={{ fontSize: 13, marginTop: 8, }}>{value.userName}</Text>
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

	_onSendInvite(userId) {
		//Todo: send System Messge of invite
	}

	showBtn(item) {
		if(item.inRoom) {
			return (
				<Text style={{fontSize: 12, color: '#ccc', }}>已绑定</Text>
			)
		}
		else {
			return (
				<TouchableOpacity style={styles.drawerBtn} onPress={() => this._onSendInvite(item.userId)}>
					<Text style={{ fontSize: 13, color: 'white', }}>邀请</Text>
				</TouchableOpacity>
			)
		}
	}

	_onClose() {
		this.setState({
			modalVisible: false,
		})
	}

	showModal(type) {
		if(type == 'buildFail') {
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
							<Text style={{ fontSize: 15 }}>单人不可创建房间哦~</Text>
							<TouchableOpacity style={styles.modalBtn} onPress={ () => this._onClose() }>
								<Text>确定</Text>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</Modal>
			)
		}
		else if(type == 'dropOut') {
			return (
				<ModalView 
					title={'确认退出'} 
					content={'确定要退出房间吗？'}  
					buttonLeft={'取消'} 
					buttonRight={'确定'} 
					modalVisible={this.state.modalVisible}
					onConfirm={() => {}}
				/>
			)
		}
	}

	_onPressBtn(roomMember) {
		//创建房间
		if(roomMember && roomMember.length == 0) {
			if(!this.state.addMember) {
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

	render() {
		let roomMember = this.state.roomMember;
		let headerTitle = (roomMember && roomMember.length == 0) ? '创建房间' : '我的房间';
		let btnContent = (roomMember && roomMember.length == 0) ? '创建房间' : '退出房间';

		let navigationView = (
			<View style={{ flex: 1, }}>
				<View style={styles.drawerHeader}>
					<Text style={{ fontSize: 15, color: 'white', }}>好友列表</Text>
				</View>
				<FlatList
					data={friList}
					renderItem={({item, index}) => (
						<View style={styles.itemWrap}>
							<View style={styles.itemLeft} key={index}>
								<Image style={styles.drawerImg} source={require('../../../localResource/images/avatar1.jpg')} />
								<Text>{item.userName}</Text>
							</View>
							{this.showBtn(item)}
						</View>
					)}
				/>
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
								<Image style={styles.avatar} source={require('../../../localResource/images/avatar1.jpg')} />
								<Text style={{ fontSize: 13, marginTop: 8, }}>我</Text>
							</View>
							{this.showMember(this.state.roomMember)}
							<TouchableOpacity style={styles.addBtn} activeOpacity={0.6} onPress={() => this.drawer.openDrawer()}>
								<Icon name='ios-add-outline' size={42} />
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity style={styles.footerBtn} onPress={() => this._onPressBtn(this.state.roomMember)}>
						<Text>{btnContent}</Text>
					</TouchableOpacity>
				</View>
			</DrawerLayoutAndroid>
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