import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalView from '../../helpers/ModalView.js';

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

let data = [
	{key: '0', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '1', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isliked: true, content: '轰轰轰轰轰轰及激励窘境积极哦欧炯炯 李炯交警哦我机加酒噢诶过解放街32还有谁', img: ''},
	{key: '2', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '3', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isliked: true, content: '还有谁', img: ''},
	{key: '4', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '5', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isliked: true, content: '还有谁', img: ''},
	{key: '6', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '7', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', isliked: true, content: '还有谁', img: ''},
];

export default class MomentScreen extends Component {
	static navigationOptions = {
		header: null,
		title: '发现',
		// tabBarVisible: false,
	};

	constructor(props) {
		super(props);
		this.state={
			uid: 1, //当前用户id
			data: null, //话题列表数据
			modalVisible: false,
		}
	}

	componentDidMount() {
		this.setState({
			data: data,
		})
	}

	_onDel = () => {
		console.log("delete success");
		// this.setState({
		// 	modalVisible: false,
		// })
	}

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
				<ModalView title='删除确认' content='确定删除这条动态吗' buttonLeft='取消' buttonRight='删除' onConfirm={this._onDel} modalVisible={this.state.modalVisible} />
				<View style={styles.container}>
					<View style={styles.header}>	
						<View style={styles.headerButton}></View>
						<Text style={styles.headerTitle}>发现</Text>
						<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={ () => {this.props.navigation.navigate('EditMoment')} }>
							<Icon name='edit' size={21} />
						</TouchableOpacity>
					</View>
					<View style={styles.main}>
						<FlatList data={data} 
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
		this.setState({
			islike: this.props.item.isliked,
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

	_onLikePress(heartColor) {
		console.log("onLike pressed");
		this.setState({
			isliked: !this.state.isliked,
		})
	}

	render() {
		let that = this.props.parentRef;
		let item = this.props.item;
		console.log("item in MomentItem is ", item);
		console.log("that is ", that);

		let uid = this.props.uid;
		let heartColor = this.state.isliked ? 'red' : '#666';
		
		if(item !== undefined)
			return (
				<View style={styles.ItemWrap}>
					<View style={styles.userInfoWrap}>
						<TouchableOpacity activeOpacity={0.6} onPress={ () => {that.props.navigation.navigate('UserInfo');} }>
							<Image style={styles.avatar} source={require('../../../localResource/images/avatar1.jpg')} />
						</TouchableOpacity>
						<View style={styles.middleWrap}>
							<Text style={{ fontSize: 15 }}>{item.userName}</Text>
							<Text style={{ fontSize: 12 }}>{item.time}</Text>
						</View>
						{this._showTrash(uid, item.userId, that)}
					</View>
					<View style={styles.contentWrap}>
						<Text>{item.content}</Text>
					</View>
					<View style={styles.bottomWrap}>
						<TouchableOpacity style={styles.button} activeOpacity={1} onPress={() => {that.props.navigation.navigate('Comment', { item: item, uid: uid,});}} >
							<Icon name='commenting-o' size={16} style={{ paddingRight: ContentPad, marginBottom: 3, }} />
							<Text style={{ fontSize: 13 }}>评论</Text>
						</TouchableOpacity>
						<View style={styles.verLine}></View>
						<TouchableOpacity style={styles.button} activeOpacity={1} onPress={(heartColor) => this._onLikePress(heartColor)}>
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