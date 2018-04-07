import React, { Component } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Modal, } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
import fetchRequest from '../../config/request.js';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let modalWidth = ScreenWidth - 80;
let modalHeight = 160;
let modalTitleHeight = 42;
let modalBtnWidth = 64;
let modalBtnHeight = 28;

let PadSide = 12;
let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let ImageWidth = 110; //图片宽
let ImageHeight = 110; //图片高
let TitleWidth = ScreenWidth - 98;
let TitleHeight = 72;
let listHeight = 48;

let circleWidth = 22;
let circleHeight = 22;

let questions = [
	{question: "喜不喜欢吃榴莲", key: 0,},
	{question: "喜欢周杰伦吗", key: 1,},
];
let recQues = [
	{question: '能接受在宿舍吃螺蛳粉吗',},
	{question: '早上大概几点起',},
	{question: '有考研的打算吗',},
];

export default class SayHiQueScreen extends Component {
	static navigationOptions = {
		drawerLabel: '设置我的打招呼问题',
		drawerIcon: <Icon name="sc-telegram" size={25} />
	};

	constructor(props) {
		super(props);
		this.state = {
			questions: null,
			recQues: null,
			recData: null,
			modalVisible: false,
			inputLen: 0,
			inputText: null,
		}
	}

	componentDidMount() {
		this.getInitData(global.user.userData.uid);
		this.getRecData();
	}

	getInitData(uid) {
		let params = {
			uid: uid,
		};
		fetchRequest('/app/getSayHi', 'POST', params).then(res => {
			if(res != 'Error') {
				console.log('getSayHi res: ', res);
				res.map((value, key) => {
					value.key = key;
				})
				console.log('getSayhi setKey res: ', res);
				this.setState({
					questions: res,
				})
			}
		})
		.catch(err => {
			console.log('getSayHi Err: ', err);
			this.setState({
				questions: [],
			})
		})
	}

	getRecData() {
		fetchRequest('/app/getRecData', 'POST').then(res => {
			if(res != 'Error') {
				console.log('getRecData res: ', res);
				this.setState({
					recData: res,
				})
				this.getRecQue(this.state.recData);
			}
			else {
				console.log('getRecData Error');
			}
		})
		.catch(err => {
			console.log('getRecQue Err: ', err);
		})
	}	

	getRecQue(data) {
		// console.log('recData: ', recData);
		let rec = [];

		//随机从中取四个
		for(let i = 0; i < 4; i++) {
			let num = Math.round(Math.random() * 100 ) % data.length;
			console.log('num: ', num);
			rec.push(data[num]);
		}
		console.log('rec: ',rec);
		this.setState({
			recQues: rec,
		})
	}

	setKey(data) {
		if(data) {
			data.map((value, key) => {
				value['key'] = key;
			})
		}
		console.log('data in setKey: ', data)
		return data;
	}

	_onDelQue(index) {
		let questions = this.state.questions;
		questions.splice(index, 1);
		questions.map((item, key) => {
			item.key = key;
		})
		console.log('questions in Del: ', questions);
		this.setState({
			questions: questions,
		})
	}

	showindex(data) {
		console.log('data in swipe is: ', data);
		return (
			<Text style={{ color: 'white', paddingBottom: 2,}}>{data.index + 1}</Text>
		)
	}
	showQues(questions) {
		let items = [];
		console.log('questions: ', questions);
		if(questions && questions.length > 0) {
			return (
				<SwipeListView
					useFlatList
					data={questions}
					renderItem={(data, rowMap) => (
						<View key={data.index} style={styles.queWrap}>
							<View style={styles.indexWrap}>
								{this.showindex(data)}
							</View>
							<Text style={{fontSize: 15,}}>{data.item.question}</Text>
						</View>
					)}
					renderHiddenItem={ (data, rowMap) => (
						<TouchableOpacity style={styles.delQue} onPress={() => this._onDelQue(data.index)}>
							<View style={styles.delWrap}>
								<Text>删除</Text>
							</View>
						</TouchableOpacity>
					)}
					rightOpenValue={-48}
				/>
			)
		}
		else {
			console.log('no question');
			return (
				<Text style={{ fontSize: 13, color: '#ccc', marginTop: 8, marginBottom: 8, }}>尚未添加任何问题</Text>
			)
		}
	}

	_onAddQue(data, key) {
		console.log('data in _onAddQue: ', data);
		let questions = this.state.questions;
		let recQues = this.state.recQues;
		data.key = questions.length;
		console.log('data added: ', data);
		questions.push(data);
		recQues.splice(key, 1);
		this.setState({
			questions: questions,
			recQues: recQues,
		})
	}

	showRecQues(recQues) {
		let items = [];
		if(recQues && recQues.length > 0) {
			console.log('recQues: ', recQues);
			recQues.map( (data, key) => {
				items.push(
					<View style={styles.recQueWrap} key={key}>
						<Text style={{fontSize: 15, }}>{data.question}</Text>
						<TouchableOpacity style={styles.addRecQue} onPress={() => this._onAddQue(data, key)}>
							<Text style={{ color: MainColor }}>添加</Text>
						</TouchableOpacity>
					</View>
				)
			})
			return items;
		}
	}

	_onClose() {
		this.setState({
			inputLen: 0,
			inputText: 0,
			modalVisible: false,
		})
	}

	_onModalTextChange(text) {
		this.setState({
			inputLen: text.length,
			inputText: text,
		})
	}

	_onPressBtn(text) {
		if(text) {
			let questions = this.state.questions;
			questions.push({question: text, key: questions.length});
			this.setState({
				questions: questions,
				modalVisible: false,
				inputLen: 0,
				inputText: null,
			})
		}
	}

	//确认Sayhi问题设置
	_onSubmit() {
		let uid = global.user.userData.uid;
		let params = {
			uid: uid,
			questions: this.state.questions,
		};
		console.log('submit params: ', params);
		fetchRequest('/app/setSayHi', 'POST', params).then(res => {
			if(res != 'Error') {
				console.log('set sayhi success');
			}
			else 
				console.log('set sayhi fail');
		})
		.catch(err => {
			console.log('submit Err: ', err);
		})
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
					<TouchableOpacity style={styles.bgModal} onPress={ () => this._onClose() }>
						<View style={styles.modalWrap}>
							<View style={styles.modalTitle}>
								<Text style={{ color: '#444', }}>添加问题</Text>
							</View>
							<View style={styles.horLine}></View>
							<View style={{height: 72}}>
								<TextInput 
									underlineColorAndroid="transparent"
									multiline={true} 
									placeholder='我想问问...'
									maxLength={18}
									autoFocus={true}
									onChangeText={(text) => this._onModalTextChange(text)} 
								/>
							</View>
							<View style={styles.modalFooter}>
								<View style={styles.modalRemind}></View>
								<TouchableOpacity style={styles.modalBtn} onPress={ () => this._onPressBtn(this.state.inputText) }>
									<Text>添加</Text>
								</TouchableOpacity>
								<View style={styles.modalRemind}>
									<Text>{this.state.inputLen}/18</Text>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</Modal>
				<View style={styles.container}>
					<View style={styles.header}>
						<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
							<Icon name='chevron-left' size={32} />
						</TouchableOpacity>	
						<Text style={styles.headerTitle}>我的SayHi问题</Text>
						<View style={styles.headerButton}></View>					
					</View>
					<ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 52, }}>
						<View style={styles.titleWrap}>
							<View style={styles.title}>
								<Text>在主页通讯录的新朋友项中可以看到打招呼消息哦~</Text>
							</View>
							<Image source={require('../../../localResource/images/reach_cartoon.png')} style={styles.cartImage} />
						</View>
						<View style={styles.questionsWrap}>
							<Text style={{ fontWeight: 'bold', fontSize: 17, color: '#555' }}>我设定的打招呼问题</Text>
							{this.showQues(this.state.questions)}
							<TouchableOpacity style={[styles.queWrap, {borderBottomWidth: 0},]} onPress={() => this.setState({ modalVisible:true, })}>
								<View style={styles.indexWrap}>
									<Text style={{ fontSize: 15, color: 'white', paddingBottom: 2,}}>+</Text>
								</View>
								<Text style={{color: MainColor, fontSize: 15,}}>添加打招呼问题</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.recQue}>
							<View style={styles.recTitleWrap}>
								<Text style={{ fontWeight: 'bold', fontSize: 17, color: '#555' }}>推荐问题</Text>
								<TouchableOpacity style={styles.titleRight} activeOpacity={0.6} onPress={() => this.getRecQue(this.state.recData)}>
									<Icon name='refresh' size={21} color={'white'} />
									<Text style={{ color: 'white', fontSize: 13, }}>换一换</Text>
								</TouchableOpacity>
							</View>
							{this.showRecQues(this.state.recQues)}
						</View>
						<TouchableOpacity style={styles.footerBtn} onPress={() => this._onSubmit()}>
							<Text>确认修改</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
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
		// marginTop: 36,
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
		// flex: 1,
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
		flex: 1,
		paddingLeft: PadSide + 5,
		paddingRight: PadSide + 5,
	},
	titleWrap: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		height: ImageHeight,
		marginBottom: 2*PadSide,
	},
	cartImage: {
		position: 'absolute',
		width: ImageWidth,
		height: ImageHeight,
	},
	questionsWrap: {
		marginBottom: PadSide,
	},
	title: {
		width: TitleWidth,
		height: TitleHeight,
		justifyContent: 'center',
		marginLeft: ImageWidth/2,
		borderWidth: 1,
		borderColor: DeepColor,
		borderRadius: 8,
		paddingLeft: ImageWidth/2,
		paddingRight: PadSide,
	},
	queWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		height: listHeight,
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
		backgroundColor: 'white',
	},
	indexWrap: {
		justifyContent: 'center',
		alignItems: 'center',
		width: circleWidth,
		height: circleHeight,
		borderRadius: circleWidth/2,
		backgroundColor: MainColor,
		marginRight: PadSide,
	},
	recTitleWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// marginBottom: PadSide,
	},
	titleRight: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: 68,
		height: 26,
		paddingRight: 4,
		borderRadius: 13,
		backgroundColor: MainColor,
	},
	recQueWrap: {
		height: listHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.4,
		borderColor: '#ccc',
	},
	delQue: {
		height: listHeight,
		alignItems: 'flex-end',
	},
	delWrap: {
		width: 48,
		height: listHeight,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: MainColor,
	},
	footerBtn: {
		width: ScreenWidth - 6*PadSide,
		height: 38,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: 10,
		backgroundColor: MainColor,
		marginTop: 42,
	}
})