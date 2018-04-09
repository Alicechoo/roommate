import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, Alert, Image, ImageBackground, ScrollView, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import fetchRequest from '../../config/request.js';

let imgCom_url = 'http://192.168.253.1:8080/images';
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let headerHeight = 210;
let HeaderBarHeight = 48; //顶部栏高度
let HeaderBtnWidth = 28; //顶部栏按钮宽度
let PadSide = 12;
let avatarHeight = 88;
let avatarWidth = 88;
let footerHeight = 48;
let listHeight = 46; //信息项高度

let modalWidth = ScreenWidth - 80;
let modalHeight = 160;
let modalTitleHeight = 42;
let modalBtnWidth = 64;
let modalBtnHeight = 28;

let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let selected = [0, 2, 1, 2, 0, 3, 1];
let labels = ['爱玩游戏','处女座', '早睡', '爱干净', '喝酒', '不抽烟', '喜欢小动物', '喜静'];

export default class UserInfoScreen extends Component {
	static navigationOptions = {
		header: null,
	};
	
	constructor(props) {
		super(props);
		this.state = {
			isFriend: false,
			friName: null,
			correlation: null,
			//推荐用户信息
			userId: null,
			userInfo: null,
			ready: false,

			inputLen: 0,
			remark: null,
			modalVisible: false,
		}
	}

	componentDidMount() {
		let { params } = this.props.navigation.state;
		let userId = params ? params.uid : null;
		let correlation = params ? params.correlation : null;
		console.log('uid: ', userId);
		if(userId && correlation) {
			this.setState({
				userId: userId,
				correlation: correlation,
			})
			let param1 = {
				uid: userId,
			};
			//获取用户数据
			fetchRequest('/app/getUserInfo', 'POST', param1).then(res1 => {
				if(res1 == 'Error') {
					console.log('getUserInfo failed in userInfo');
				}
				else {
					console.log('userInfo: ', res1);
					let param2 = {
						current_uid: global.user.userData.uid,
						fri_uid: userId,
					};
					//获取好友信息
					fetchRequest('/app/friCheck', 'POST', param2).then(res2 => {
						if(res2 == 'Error') {
							console.log('friendCheck failed');
						}
						else {
							console.log('friCheck res: ',res2);
							this.setState({
								isFriend: res2.length ? true : false,
								friName: res2.length ? res2[0].fri_name : null,
								userInfo: res1[0],
								ready: true,
							})
						}
					})
					.catch(err => {
						console.log('friCheck err: ', err);
					}) 
				}

			}).catch(err => {
				console.log('getUserInfo error: ', err);
			})
		}
	}

	_showStars(num) {
		//相似度存在时
		if(num != 'empty') {
			let stars = [];
			num = Math.ceil(Math.round(num*10)/2)
			console.log("star num is ", num);
			if(num > 0) {
				for(let i = 0; i < num; i++) {
					stars.push(
						<Icon name='md-star' key={i} color={MainColor} size={18} />
					)
				}
				return stars;
			}
			else {
				return (
					<Icon name='md-star' color={'#ccc'} size={18} />
				)
			}
		}
		//某一方用户尚未完成问卷，不存在相似度
		else {
			return (
				<Text style={{ fontSize: 12, color: '#ccc', }}>该用户尚未完成的问卷</Text>
			)
		}
	}

	_addRemarks(isFriend) {
		if(isFriend) {
			console.log("yes, she's my friend");
			return (
				<TouchableOpacity style={styles.addRemarks} activeOpacity={0.6} onPress={ () => {this._onShow()} }>
					<Text style={{ fontSize: 12, color: 'white' }}>修改备注</Text>
				</TouchableOpacity>
			);
		}
		else
			return null;
	}

	_onShow() {
		this.setState({
			modalVisible: true,
			inputLen: 0,
		})
	}

	_onClose() {
		this.setState({modalVisible: false,});
	}

	_onModalTextChange(text) {
		console.log('text length is ', text.length);
		this.setState({
			inputLen: text.length,
			remark: text,
		})
	}

	_onAddRemark() {
		//Todo add remark to the back-end if the remark isn't empty
		this._onClose();
	}

	_onSendMes() {
		let userId = this.state.userId;
		const resetAction = NavigationActions.reset({ 
			index: 1,
			actions: [
				NavigationActions.navigate({ routeName: 'Main'}),
				NavigationActions.navigate({ routeName: 'ChatRoom', params: { userid: {userId} } })
			],
		});
		this.props.navigation.dispatch(resetAction);
	}

	_onSendFriendRequest() {
		// Alert.alert(
		// 	'加好友',
		// 	'好友请求已发送',
		// 	[
		// 		{text: '确定', onPress: () => console.log('OK Pressed')},
		// 	]
		// )
		//Todo: send invate to userId
		this.setState({
			modalVisible: true,
		})
	}

	_footerContent(isFriend) {
		if(isFriend) {
			return (
				<TouchableOpacity style={styles.footer} activeOpacity={0.6} onPress={() => {this._onSendMes()} }>
					<Icon name="ios-text-outline" size={24} />
					<Text style={{ marginLeft: PadSide, }}>发消息</Text>
				</TouchableOpacity>
			);
		}
		else {
			return (
				<View style={styles.footer}>
					<TouchableOpacity style={styles.footerBtn} activeOpacity={0.6} onPress={() => {this._onSendFriendRequest()} }>
						<Icon name="ios-person-add-outline" size={26} />
						<Text style={{ marginLeft: PadSide, }}>加好友</Text>
					</TouchableOpacity>
					<View style={styles.verLine}></View>
					<TouchableOpacity style={styles.footerBtn} activeOpacity={0.6} onPress={ () => {this.props.navigation.navigate('ChatRoom', { userId: this.state.userId, })} }>
						<Icon name="ios-text-outline" size={24} />
						<Text style={{ marginLeft: PadSide, }}>打招呼</Text>
					</TouchableOpacity>
				</View>
			);
		}
	}

	modalShow() {
		//是好友关系时，可以修改备注，modal显示为修改备注
		if(this.state.isFriend) {
			return (
				<View style={styles.modalWrap}>
					<View style={styles.modalTitle}>
						<Text style={{ color: '#444', }}>添加备注</Text>
					</View>
					<View style={styles.horLine}></View>
					<TextInput 
						underlineColorAndroid="transparent" 
						placeholder='添加备注...' 
						maxLength={15}
						style={styles.modalInput}
						onChangeText={(text) => this._onModalTextChange(text)} 
					/>
					<View style={styles.modalFooter}>
						<View style={styles.modalRemind}></View>
						<TouchableOpacity style={styles.modalBtn} onPress={ () => {this._onAddRemark()} }>
							<Text>添加</Text>
						</TouchableOpacity>
						<View style={styles.modalRemind}>
							<Text>{this.state.inputLen}/15</Text>
						</View>
					</View>
				</View>
			)
		}
		else {
			return (
				<View style={[styles.modalWrap, styles.modalAdd]}>
					<View style={styles.placehold}></View>
					<Text style={{ fontSize: 15 }}>好友请求已发送</Text>
					<TouchableOpacity style={styles.modalBtn} onPress={ () => this._onClose() }>
						<Text>确定</Text>
					</TouchableOpacity>
				</View>
			)
		}
	}

	_showNickName(isFriend) {
		if(isFriend) 
			return (
				<View style={styles.detailList}>
					<View style={styles.detailList}>
						<Icon name="ios-at-outline" size={21} />
						<Text style={{ marginLeft: PadSide, }}>Ta的昵称：{this.state.friName}</Text>
					</View>
				</View>
			);
		else
			return null;
	}

	_showLabels(labels) {
		let items = [];
		//用户标签不为空
		if(labels) {
			labels.map( (label, key) => {
				items.push(
					<View style={styles.label} key={key}>
						<Text>{label}</Text>
					</View>
				)
			})
			return items;
		}
		//用户标签为空
		else {
			return (
				<View style={{width: ScreenWidth - 2*PadSide, height: 28, alignItems: 'center'}}>
					<Text style={{ fontSize: 13, color: '#ccc' }}>该用户还没有为自己添加标签哦~</Text>
				</View>
			)
		}
	}

	_showContent(ready) {
		//获取数据完毕
		if(ready) {
			return (
				<View style={styles.container}>
					<ScrollView 
						contentContainerStyle={{paddingBottom: 54 }}
					>
						<ImageBackground 
							style={styles.header}
							source={require('../../../localResource/images/bgFriend.jpg')}
						>
							<View style={styles.headerBar}>
								<TouchableOpacity style={styles.headBackBtn} onPress={() => {this.props.navigation.goBack()} }>
									<Icon name='ios-arrow-back-outline' size={22} />
								</TouchableOpacity>
								<Text style={{ fontSize: 16, }}>{this.state.userInfo.name}</Text>
								<View style={styles.headBackBtn} ></View>
							</View>
							<View style={styles.infoWrap}>
								<View style={styles.userInfoWrap}>
									<Image style={styles.userAvatar} source={{ uri: imgCom_url + this.state.userInfo.avatar }} />
									<View style={styles.userInfo}>
										<View style={styles.topUserInfo}>
											<Text numberOfLines={1} style={{ width: '65%', fontSize: 16, color: '#666',  }}>{this.state.userInfo.name}</Text>
											{this._addRemarks(this.state.isFriend)}
										</View>
										<Text numberOfLines={2} style={{ width: '100%', }}>
											{this.state.userInfo.signature}
										</Text> 
									</View>
								</View>
								<View style={styles.recWrap}>
									<Text style={{ fontSize: 13, marginRight: 5 }}>Ta与我的相似度为: </Text>
									{this._showStars(this.state.correlation)}
								</View>
							</View>
						</ImageBackground>
						<View style={styles.detailWrap}>
							{this._showNickName(this.state.isFriend)}
							<TouchableOpacity style={styles.detailList} onPress={() => this.props.navigation.navigate('UserDetail', { type: 'chart', content: this.state.userId})}>
								<View style={styles.detailList}>
									<Icon name="ios-analytics" size={21} />
									<Text style={{ marginLeft: PadSide, }}>Ta的问卷调查结果</Text>
								</View>
								<Icon name="ios-arrow-forward-outline" size={18} />
							</TouchableOpacity>
							<TouchableOpacity style={styles.detailList} onPress={() => this.props.navigation.navigate('UserDetail', { type: 'text', content: this.state.userInfo.signature})}>
								<View style={styles.detailList}>
									<Icon name="ios-cafe-outline" size={21} />
									<Text style={{ marginLeft: PadSide, }}>Ta想对室友说的话</Text>
								</View>
								<Icon name="ios-arrow-forward-outline" size={18} />
							</TouchableOpacity>
							<View>
								<View style={styles.labelTitle}>
									<View style={[styles.horLine, { width: 88, }]}></View>
									<Text style={{ marginLeft: PadSide, marginRight: PadSide, }}>Ta的个性标签</Text>
									<View style={[styles.horLine, { width: 88, }]}></View>
								</View>
								<View style={styles.labelWrap}>
									{this._showLabels(this.state.userInfo.labels)}
								</View>
							</View>
						</View>
					</ScrollView>
					{this._footerContent(this.state.isFriend)}
				</View>
			)
		}
		else {
			return (
				<View style={{height: ScreenHeight, justifyContent: 'center', alignItems: 'center'}}>
					<Text>正在加载...</Text>
				</View>
			)
		}
	}

	render() {
		return (
			<View>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {}}
				>
					<TouchableOpacity style={styles.modalBackground} onPress={() => {this._onClose()} }>
						{this.modalShow()}
					</TouchableOpacity>
				</Modal>
				{this._showContent(this.state.ready)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 88,
	},
	modalWrap: {
		width: modalWidth,
		height: modalHeight,
		borderWidth: 0.3,
		borderColor: '#ccc',
		borderRadius: 10,
		backgroundColor: 'white',
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	modalAdd: {
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	//布局占位
	placehold: {
		height: 1, 
	},
	modalTitle: {
		height: modalTitleHeight,
		justifyContent: 'center',
	},
	horLine: {
		height: 0.5,
		backgroundColor: '#ccc',
	},
	modalInput: {
		height: modalTitleHeight,
	},
	modalFooter: {
		marginTop: 36,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	modalRemind: {
		width: modalBtnWidth/2,
	},
	modalBtn: {
		width: modalBtnWidth,
		height: modalBtnHeight,
		backgroundColor: MainColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	},
	container: {
		height: ScreenHeight,
		backgroundColor: 'white',
	},
	header: {
		height: headerHeight,
		// borderBottomWidth: 0.3,
		// borderColor: '#ccc',
		paddingLeft: PadSide,
		paddingRight: PadSide,
		marginBottom: PadSide,
	},
	headerBar: {
		height: HeaderBarHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headBackBtn: {
		// borderWidth: 1,
		width: HeaderBtnWidth,
		height: HeaderBarHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	infoWrap: {
		flex: 1,
		justifyContent: 'center',
		// borderWidth: 1,
	},
	userInfoWrap: {
		flexDirection: 'row',
	},
	userAvatar: {
		width: avatarWidth,
		height: avatarHeight,
		marginRight: 2*PadSide,
		marginBottom: PadSide,
	},
	userInfo: {
		width: ScreenWidth - 4*PadSide - avatarWidth,
		height: avatarHeight,
		justifyContent: 'center',
		// borderWidth: 1,
	},
	topUserInfo: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: PadSide,
		// borderWidth: 1,
	},
	addRemarks: {
		width: '30%',
		height: 25,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		backgroundColor: MainColor,
	},
	recWrap: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	detailWrap: {
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	detailList: {
		height: listHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	labelTitle: {
		height: listHeight,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: PadSide,
	},
	labelWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	label: {
		height: modalBtnHeight,
		paddingLeft: 5,
		paddingRight: 5,
		justifyContent: 'center',		
		borderWidth: 1,
		borderRadius: 8,
		borderColor: '#ccc',
		marginRight: PadSide,
		marginBottom: PadSide,
	},
	footer: {
		height: footerHeight,
		// borderWidth: 1,
		marginBottom: PadSide + 8,
		backgroundColor: MainColor,
		borderTopWidth: 0.3,
		borderColor: DeepColor,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	verLine: {
		width: 0.5,
		height: footerHeight - PadSide,
		backgroundColor: '#888',
	},
	footerBtn: {
		flex: 0.49,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,

	}
})