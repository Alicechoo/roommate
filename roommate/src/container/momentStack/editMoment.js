import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableOpacity, Image, Modal, DeviceEventEmitter } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import fetchRequest from '../../config/request.js';

let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let modalWidth = ScreenWidth - 80;
let modalHeight = 160;
let modalBtnWidth = 64;
let modalBtnHeight = 28;

let PadSideMain = 15;
let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 52; //顶部栏按钮宽度
let ButtonHeight = 32; //顶部栏按钮高度
let PadSide = 8; //内容与左右两侧间距
let InputHeight = 210; //输入栏高度
let TextInputHeight = 120; //输入框高度
let ContentMargin = 10; //上下文内容间距
let selectBarHeight = 42; //拍照，照片选择框高度

let ImageWidth = 64; //已选择图片宽度
let ImageHeight = 64; 
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

export default class EditMoment extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.state = {
			text: null,
			modalVisible: false,
		};
	}

	_onSendMoment() {
		Keyboard.dismiss();
		if(this.state.text) {
			let params = {
				uid: global.user.userData.uid,
				content: this.state.text,
				// date: new Date();
			}
			//将发送的动态插入数据库
			fetchRequest('/app/addMoment', 'POST', params).then(res => {
				if(res == 'Error') {
					console.log('addMoment Error');
				}
				else {
					console.log('addMoment res: ', res);
					DeviceEventEmitter.emit('getNewMoment');
				}
			})
			.catch(err => {
				console.log('addMoment Error');
			})
			this.props.navigation.goBack();
		}
		else {
			this.setState({
				modalVisible: true,
			})
		}
	}

	_onClose() {
		this.setState({
			modalVisible: false,
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
							<View style={styles.placehold}></View>
							<Text style={{ fontSize: 15 }}>话题内容不能为空</Text>
							<TouchableOpacity style={styles.modalBtn} onPress={ () => {this._onClose();} }>
								<Text>确定</Text>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</Modal>
				<View style={styles.container}>
					<View style={styles.header}>	
						<TouchableOpacity style={styles.headerButton} onPress={() => { Keyboard.dismiss(); this.props.navigation.goBack();} }>
							<Icon name='chevron-left' size={35} />
						</TouchableOpacity>
						<Text style={styles.headerTitle}>编辑话题</Text>
						<TouchableOpacity style={[styles.headerButton, {backgroundColor: MainColor, }, ]} activeOpacity={0.7} onPress={() => this._onSendMoment()} >
							<Text>发送</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.inputWrap} >
						<View style={styles.textInputWrap}>
							<TextInput placeholder='此刻的想法...'
								multiline={true}  
								autoFocus={true} 
								underlineColorAndroid='transparent' 
								maxLength={142}
								onChangeText={(text) => {
									this.setState({
										text: text,
									})
								}}
							>
							</TextInput>
						</View>
						<View style={styles.ImageWrap}>
							<View style={{ width: ImageWidth, height: ImageHeight, borderWidth: 1, }}></View>
						</View>
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
		justifyContent: 'space-around',
		alignItems: 'center',
		borderWidth: 0.3,
		borderColor: '#ccc',
		borderRadius: 10,
		backgroundColor: 'white',
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	//布局占位
	placehold: {
		height: 1, 
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
		flex: 1,
	},
	header: {
		width: ScreenWidth,
		height: HeaderHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: PadSide,
		paddingRight: PadSide,
		// backgroundColor: '#ddd',	
	},
	headerTitle: {
		fontSize: 18,
		color: '#666',
		fontWeight: '200',
	},
	headerButton: {
		// borderWidth: 1,
		width: HeaderWidth,
		height: ButtonHeight,
		borderRadius: HeaderWidth/5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputWrap: {
		height: InputHeight,
		// borderWidth: 1,
		backgroundColor: 'white',
		marginBottom: ContentMargin,
		paddingLeft: PadSideMain,
		paddingRight: PadSideMain,
	},
	textInputWrap: {
		height: TextInputHeight,
	},
	ImageWrap: {
		position: 'absolute',
		bottom: 2*ContentMargin,
		left: PadSideMain,
	},
	selectBar: {
		height: selectBarHeight,
		// borderWidth: 1,
		backgroundColor: 'white',
	},
	iconWrap: {
		// borderWidth: 1,
		height: '100%',
		width: ScreenWidth/3,
		paddingLeft: PadSideMain,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	}

})