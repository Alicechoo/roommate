import React, { Component, PureComponent } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, FlatList, Image, ScrollView, DeviceEventEmitter } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import ModalView from '../../helpers/ModalView.js';
import fetchRequest from '../../config/request.js';

let imgCom_url = 'http://192.168.253.1:8080/images';
let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let PadSide = 12; //内容与左右两侧间距
let ComTitleHeight = 24; 

let footerHeight = 46; //底部栏高度
let footerInputHeight = 35; //底部输入栏高度
let buttonWidth = 64; //底部发送按钮高度
let marginBottom = 6; //底部左右两侧间距
let IconWidth = 26;

let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let ContentPad = 10; //文本与上下间距
let UserInfoHeight = 58; //用户信息栏高度
let bottomHeight = 38; //底部评论点赞栏高度

let FooterHeight = 52; //底部信息栏高度

let DelBtnWidth = 52;
let DelBtnHeight = 42;

let avatarWidth = 42;
let avatarHeight = 42;

export default class CommentScreen extends PureComponent {
	static navigationOptions = {
		header: null,
	};
	
	constructor(props) {
		super(props);
		this.state = {
			ready: false,
			status: null,
			data: null,
			mem_id: null,

			modalVisible: false,
			commentValue: null,
		}
	}		

	componentDidMount() {
		const { params } = this.props.navigation.state;
		const item = params ? params.item : null;
		let mem_id = item ? item.mem_id : null;
		this.setState({
			mem_id: mem_id,
		})
		console.log('request mem_id: ', mem_id);
		this.getInitialData(mem_id);	
	}


	getInitialData(mem_id) {
		//获取该条动态的所有评论
		if(mem_id) {
			let params = {
				mem_id: mem_id,
			};
			fetchRequest('/app/getComment', 'POST', params).then(res => {
				if(res == 'Error') {
					console.log('getComment err');
					this.setState({
						status: 'failed',
					})
				}
				else {
					console.log('getComment res: ',res);
					res.map((value, key) => {
						value.key = key;
					})
					this.setState({
						status: 'success',
						ready: true,
						data: res,
					})
				}
			})
			.catch(err => {
				console.log('getComment err: ', err);
				this.setState({
					status: 'failed',
				})
			})
		}
		// return [
			// {key: '0', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', comment: '我是评论我是评论我是评论' }, 
			// {key: '1', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', comment: '红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍惚惚红红火火恍恍惚惚'},
			// {key: '2', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', comment: '我是评论我是评论我是评论', },
			// {key: '3', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', comment: '还有谁', },
			// {key: '4', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', comment: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', },
			// {key: '5', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', comment: '还有谁', },
			// {key: '6', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', comment: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', },
			// {key: '7', userId: 1, avatar: '', userName: '冬瓜瓜瓜瓜', time: '2018/01/23 20:34', comment: '还有谁', },
		// ];
	}

	listHeader(name, time, content, avatar, uid, userId) {
		return (
			<View>
				<View style={styles.TopicWrap}>
					<View style={styles.userInfoWrap}>
						<TouchableOpacity activeOpacity={0.6} onPress={() => {console.log('pressed'); this.props.navigation.navigate('UserInfo', {uid: uid})}}>
							<Image style={styles.avatar} source={{ uri: imgCom_url + avatar }} />
						</TouchableOpacity>
						<View style={styles.middleWrap}>
							<Text style={{ fontSize: 15 }}>{name}</Text>
							<Text style={{ fontSize: 12 }}>{time}</Text>
						</View>
						{this._showTrash(uid, userId, this)}
					</View>
					<View style={styles.contentWrap}>
						<Text>{content}</Text>
					</View>
				</View>
				<View style={styles.commentTitle}>
						<Text style={{ fontSize: 12 }}>精彩评论</Text>
				</View>
			</View>
		)
	}

	listFooter() {
		let text = '';
		let color = '#ccc';
		//获取数据失败
		if(this.state.status == 'failed') {
			text = '获取数据失败';
			color = 'red';
		}
		else if(this.state.ready) {
			console.log('this.state.data: ', this.state.data);
			console.log('this.state.data.length: ', this.state.data.length);
			text = this.state.data.length == 0 ? '还没有人评论哦~' : '没有其他评论了哦~';
		}
		else {
			text = '正在加载...';
		}
		return (
			<View style={styles.listFooter}>
				<Text style={{ fontSize: 13, color: color }} >{text}</Text>
			</View>
		)
	}

	_showList() {
		return (
			<View></View>
		)
	}

	_showTrash(currentUser, userId, that) {
		// Todo: delete from db
		if(currentUser == userId)
			return (
				<TouchableOpacity 
					style={styles.delWrap} 
					activeOpacity={0.6} 
					onPress={() => {that.setState({ modalVisible: true,}); }} 
				> 
					<Icon name="trash" size={28} />
				</TouchableOpacity>
			)
		else
			return null;
	}

	_onDel(mem_id) {
		//删除动态
		console.log('del success');
		let params = {
			mem_id: mem_id,
		};
		fetchRequest('/app/delMoment', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('delMoment err');
			}
			else {
				console.log('delMoment success');
				DeviceEventEmitter.emit('getNewMoment');
			}
		})
		.catch(err => {
			console.log('delMoment err: ', err);
		})
	}

	_onSubmit(content) {
		// console.log("this.state.commentValue is ", this.state.commentValue); 
		let params = {
			mem_id: this.state.mem_id,
			content: content,
			uid: global.user.userData.uid,
		};
		console.log('addComment params: ', params);
		fetchRequest('/app/addComment', 'POST', params).then(res => {
			if(res == 'Error') {
				console.log('addComment Error');
			}
			else {
				console.log('addComment success');
				this.setState({
					commentValue: null,
				})
				Keyboard.dismiss();
				this.getInitialData(this.state.mem_id);
			}
		})
		.catch(err => {
			console.log('addComment err: ', err);
		})
	}

	render() {
		const { params } = this.props.navigation.state;
		const item = params ? params.item : null;
		const uid = params ? params.uid : null;

		let name = item ? item.name : null;
		let time = item ? item.time : null;
		let content = item ? item.content : null;
		let userId = item ? item.uid : null;
		let avatar = item ? item.avatar : null;
		let mem_id = item ? item.mem_id : null;
		// let uid = global.user.userData.uid;

		// console.log("item is ", item);
		console.log("this.state.data is ", this.state.data);
		return (
			<View style={styles.mainContainer}>
				<ModalView title='删除确认' content='确定删除这条动态吗' buttonLeft='取消' buttonRight='删除' onConfirm={this._onDel} params={mem_id} parentRef={this} modalVisible={this.state.modalVisible} />
				<View style={styles.container}>
					<View style={styles.header}>
						<TouchableOpacity style={styles.headerButton} onPress={() => { Keyboard.dismiss(); this.props.navigation.goBack();} }>
							<Icon name='chevron-left' size={35} />
						</TouchableOpacity>	
						<Text style={styles.headerTitle}>话题正文</Text>
						<View style={styles.headerButton}>
						</View>
					</View>
					<ScrollView style={styles.main}>
						<FlatList 
							data={ this.state.data }
							ListHeaderComponent={this.listHeader(name, time, content, avatar, uid, userId)}
							ListFooterComponent={this.listFooter()} 
							renderItem={ ({item}) => <CommentItem item={item} uid={uid} parentRef={this}/> }
							contentContainerStyle={{paddingBottom: 8 }}
						/>
					</ScrollView>
					<View style={styles.footer}>
						<View style={styles.footerLeft}>
							<View style={styles.IconWrap}>
								<Icon name='pencil' size={26}/>
							</View>
							<TextInput 
								multiline={false}
								value={this.state.commentValue}
								underlineColorAndroid='transparent'
								style={styles.input}
								placeholder='写评论'
								onChangeText={ (text) => this.setState({ commentValue: text }) }
							/>
						</View>
						<TouchableOpacity 
							style={styles.footerRight} 
							activeOpacity={0.6}
							onPress={() => this._onSubmit(this.state.commentValue)}
						>
							<Text>发送</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
}

class CommentItem extends Component {
	
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

	render() {
		let item = this.props.item;
		let uid = this.props.uid;
		let that = this.props.parentRef;

		return (
			<View style={styles.TopicWrap}>
				<View style={[styles.userInfoWrap, { height: 45 }] }>
					<TouchableOpacity activeOpacity={0.6} onPress={() => this._onOpenUserInfo(item.uid, uid, that)}>
						<Image style={[styles.avatar, { width: 32, height: 32}] } source={{ uri: imgCom_url + item.avatar}} />
					</TouchableOpacity>
					<View style={[styles.middleWrap, { height: 32}] }>
						<Text style={{ fontSize: 12 }}>{item.name}</Text>
						<Text style={{ fontSize: 10 }}>{item.time}</Text>
					</View>
				</View>
				<View style={styles.commentWrap}>
					<Text style={{ fontSize: 13, color: '#666', }} >{item.content}</Text>
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
		flex: 1,
		backgroundColor: 'white',
	},
	header: {
		width: ScreenWidth,
		height: HeaderHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',	
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
	main: {
		// flex: 1,
		// height: ScreenHeight - 120,
	},
	TopicWrap: {
		width: ScreenWidth,
		paddingLeft: PadSide,
		paddingRight: PadSide,
		// marginBottom: PadBottom,
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
		paddingTop: ContentPad,
		paddingBottom: ContentPad,
		// borderBottomWidth: 1,
		// borderColor: '#ddd',
	},
	commentWrap: {
		paddingBottom: PadSide,
		marginLeft: 32 + PadSide,
		borderBottomWidth: 0.4,
		borderColor: '#ddd',
		// borderWidth: 'thin',
		// borderWidth: 1,
	},
	commentTitle: {
		// borderWidth: 1,
		backgroundColor: '#eee',
		paddingLeft: PadSide,
		height: ComTitleHeight,
		justifyContent: 'center',
	},
	listFooter: {
		height: footerHeight,
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	footer: {
		// position: 'absolute',
		// top: ScreenHeight - footerHeight - 50,
		flexDirection: 'row',
		// borderWidth: 1,
		height: footerHeight,
		paddingLeft: PadSide,
		paddingRight: PadSide,
		alignItems: 'center',
		alignSelf: 'flex-end',
		// backgroundColor: 'blue',
	},
	footerLeft: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		// width: ScreenWidth - 2*PadSide - buttonWidth - marginBottom,
		height: footerInputHeight,
		borderWidth: 0.5,
		borderColor: '#ccc',
		marginRight: marginBottom,
	},
	IconWrap: {
		width: IconWidth, 
		height: footerInputHeight, 
		justifyContent: 'center', 
		alignItems: 'center',
		// borderWidth: 1,
	},
	input: {
		position: 'absolute',
		left: IconWidth,
		right: marginBottom,
		height: footerInputHeight + 5,
		fontSize: 13,
		// borderWidth: 1,
	},
	footerRight: {
		width: buttonWidth,
		height: footerInputHeight,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: MainColor,
	}
})