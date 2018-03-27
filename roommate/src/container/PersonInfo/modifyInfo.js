import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let modalWidth = ScreenWidth - 80;
let modalHeight = 160;
let modalTitleHeight = 42;
let modalBtnWidth = 64;
let modalBtnHeight = 28;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度

let ButtonWidth = 64;
let ButtonHeight = 28;

let avatarWidth = 64;
let avatarHeight = 64;
let PadSide = 12;

let userName = '西瓜瓜瓜瓜';
let words = '扶我起来，我还能浪，希望跟你们一起熬夜打游戏，吃火锅，努力学习，天天向上';
let labels = ['爱玩游戏','处女座', '早睡', '爱干净', '喝酒', '不抽烟', '喜欢小动物', '喜静'];

export default class SelfScreen extends Component {
	static navigationOptions = {
		drawerLabel: '编辑个人资料',
		drawerIcon: <Icon name="pencil" size={25} />
	};

	constructor(props) {
		super(props)
		this.state={
			userName: null,
			labels: null,
			words: null,
			modalVisible: false,
			selectedItem: null,
			
			delLabel: null,
			delLabelKey: null,
			// inputLen: 0,
		};
	}

	componentDidMount() {
		this.setState({
			userName: userName,
			labels: labels,
			words: words,
		})
	}

	_onModifyAva() {

	}

	_onModifyName() {
		this.setState({
			modalVisible: true,
			selectedItem: 'name',
		})
	}

	_onModifyWords() {
		this.setState({
			modalVisible: true,
			selectedItem: 'words',
		})
	}

	_onDelLabel(labels, key) {
		labels.splice(key, 1);
		this.setState({
			labels: labels,
		})
	}

	_showLabels(labels) {
		let items = [];
		console.log('labels is ', labels);
		if(labels) {
			labels.map( (label, key) => {
				items.push(
					<TouchableOpacity style={styles.labelWrap} key={key} onPress={ () => this._onDelLabel(labels, key) }>
						<Text style={{ paddingLeft: 5, paddingRight: 5, }}>{label}</Text>
						<Icon name='close' size={16} color={MainColor} />
					</TouchableOpacity>
				)
			})
			return items;
		}
		else
			return null;
	}

	_onAddLabel() {
		this.setState({
			modalVisible: true,
			selectedItem: 'label',
		})
	}

	showModal(type) {
		if(type == 'name') {
			return (
				<Content parentRef={this} title={'修改昵称'} placeholder={'输入昵称...'} maxlength={15} type={'name'} />
			)
		}
		else if(type == 'label') {
			return (
				<Content parentRef={this} title={'添加自定义标签'} placeholder={'输入标签...'} maxlength={8} type={'label'} />
			)
		}
		else if(type == 'words') {
			return (
				<Content parentRef={this} title={'想对室友说'} placeholder={'想对室友说...'} maxlength={100} type={'words'}/>
			)
		}
		else if(type == 'submit') {
			return (
				<View style={[styles.modalWrap, styles.modalAdd]}>
					<View style={styles.placehold}></View>
					<Text style={{ fontSize: 15 }}>信息修改成功</Text>
					<TouchableOpacity style={styles.modalBtn} onPress={ () => {this._onClose(); this.props.navigation.navigate('DrawerOpen');} }>
						<Text>确定</Text>
					</TouchableOpacity>
				</View>
			)
		}
	}

	_onClose() {
		this.setState({
			modalVisible: false,
		})
	}

	_onSubmit() {
		//Todo: send this.state.userName, this.state.labels,this.state.words to the back-end
		this.setState({
			modalVisible: true,
			selectedItem: 'submit',
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
						{this.showModal(this.state.selectedItem)}
					</TouchableOpacity>
				</Modal>
				<View style={styles.container}>
					<View style={styles.header}>
						<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
							<Icon name='chevron-left' size={32} />
						</TouchableOpacity>	
						<Text style={styles.headerTitle}>编辑个人资料</Text>
						<View style={styles.headerButton}></View>					
					</View>
					<ScrollView style={styles.main}>
						<TouchableOpacity style={styles.itemWrap} onPress={ () => this._onModifyAva() } activeOpacity={1}>
							<Text style={styles.itemTitle}>头像</Text>
							<Image style={styles.avatar} source={require('../../../localResource/images/avatar1.jpg')} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.itemWrap} onPress={ () => this._onModifyName() } activeOpacity={1}>
							<Text style={styles.itemTitle}>昵称</Text>
							<Text>{this.state.userName}</Text>
						</TouchableOpacity>
						<View style={styles.personLabel}>
							<View style={styles.itemTop}>
								<Text style={styles.itemTitle}>我的个性标签</Text>
								<TouchableOpacity style={styles.addBtn} activeOpacity={0.6} onPress={() => this._onAddLabel()}>
									<Text style={{ color: MainColor }}>+自定义</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.itemBottomWrap}>
								{this._showLabels(this.state.labels)}
							</View>
						</View>
						<View style={styles.itemWrap}>
							<Text style={[styles.lastTitle, styles.itemTitle]}>想对室友说</Text>
							<TouchableOpacity onPress={() => this._onModifyWords()}>
								<Text style={styles.wordsWrap}>{this.state.words}</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
					<View style={styles.footer}>
						<TouchableOpacity style={styles.footerBtn} onPress={() => this._onSubmit()}>
							<Text>确认修改</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
}

class Content extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputLen: 0,
			text: null,
		}
	}

	_onModalTextChange(text) {
		this.setState({
			inputLen: text.length,
			text: text,
		})
	}

	_onPressBtn(that, type) {
		if(type == 'name') {
			console.log('this.state.text: ', this.state.text);
			if(this.state.text) {
				that.setState({
					userName: this.state.text,
				})
			}
		}
		else if(type == 'label') {
			if(this.state.text) {
				let labels = that.state.labels;
				labels.push(this.state.text);
				console.log('labels added: ', labels);
				that.setState({
					labels: labels,
				})
			}
		}
		else if(type == 'words') {
			that.setState({
				words: this.state.text,
			})
		}
		that.setState({
			modalVisible: false,
		})
	}

	render() {
		let that = this.props.parentRef;
		let title = this.props.title;
		let placeholder = this.props.placeholder;
		let maxlength = this.props.maxlength;
		let type = this.props.type;
		let inputHeight = type == 'words' ? modalTitleHeight + 32 : modalTitleHeight;
		let remindWidth = type == 'words' ? modalBtnWidth : modalBtnWidth/2;
		let multiline = type == 'words' ? true : false;
		let margintop = type == 'words' ? 0 : 36;

		return (
			<View style={styles.modalWrap}>
				<View style={styles.modalTitle}>
					<Text style={{ color: '#444', }}>{title}</Text>
				</View>
				<View style={styles.horLine}></View>
				<View style={{height: inputHeight}}>
					<TextInput 
						underlineColorAndroid="transparent"
						multiline={multiline} 
						placeholder={placeholder} 
						maxLength={maxlength}
						autoFocus={true}
						onChangeText={(text) => this._onModalTextChange(text)} 
					/>
				</View>
				<View style={[styles.modalFooter, {marginTop: margintop}]}>
					<View style={[styles.modalRemind, {width: remindWidth},]}></View>
					<TouchableOpacity style={styles.modalBtn} onPress={ () => this._onPressBtn(that, type) }>
						<Text>确认</Text>
					</TouchableOpacity>
					<View style={[styles.modalRemind, {width: remindWidth},]}>
						<Text>{this.state.inputLen}/{maxlength}</Text>
					</View>
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
		height: ScreenHeight,
		alignItems: 'center',
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
		// borderWidth: 1,
		height: ScreenHeight - HeaderHeight - 95,
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	itemWrap: {
		width: ScreenWidth - 2*PadSide,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: PadSide,
		paddingBottom: PadSide,
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
	},
	itemTitle: {
		fontSize: 15,
	},
	avatar: {
		width: avatarWidth,
		height: avatarHeight,
	},
	personLabel: {
		paddingTop: PadSide,
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
	},
	itemTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: PadSide,
		// borderWidth: 1,
	},
	itemBottomWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	labelWrap: {
		height: 32,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: MainColor,
		borderRadius: 16,
		// backgroundColor: MainColor,
		paddingLeft: 5,
		paddingRight: 5,
		marginRight: PadSide,
		marginBottom: PadSide,
	},
	addBtn: {
		width: ButtonWidth,
		height: ButtonHeight,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
		borderWidth: 0.3,
		borderColor: '#ccc',
	},
	lastTitle: {
		width: 88,
	},
	wordsWrap: {
		width: 210,
	},
	footer: {
		// position: 'absolute',
		marginBottom: 52,
	},
	footerBtn: {
		width: ScreenWidth - 6*PadSide,
		height: 38,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		backgroundColor: MainColor,
		marginTop: 42,
	}
})