import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableOpacity, Image, Modal, DeviceEventEmitter } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import fetchRequest from '../../config/request.js';

var ImagePicker = require('react-native-image-picker');
let imgCom_url = 'http://192.168.253.1:8080/images';

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

let options = {
	title: '选择图片',
	cancelButtonTitle: '取消',
	takePhotoButtonTitle: '拍照',
	chooseFromLibraryButtonTitle: '从相册中选择',
	// customButtons: [
	// 	{name: 'fb', title: 'Choose Photo from Facebook'},
	// ],
	storageOptions: {
		skipBackup: true,
		path: 'images'
	}
};

export default class EditMoment extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.state = {
			text: null,
			modalVisible: false,
			picture: null,
		};
	}

	_onSendMoment() {
		Keyboard.dismiss();
		if(this.state.text || this.state.picture) {
			//动态中含有图片，需要上传图片
			if(this.state.picture) {
				let formData = new FormData();
				let file = {uri: this.state.picture, type: 'multiPart/form-data', name: 'image.jpg'};

				formData.append('files', file);
				//上传图片
				fetch('http://192.168.253.1:8080/app/uploadPic', {
					method: 'POST',
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					body: formData,
				}).then( (response) => response.json())
				.then((responseData) => {
					console.log('responseData: ', responseData);
					//上传图片成功
					if(responseData != 'Error') {
						let params = {
							uid: global.user.userData.uid,
							content: this.state.text,
							picture: responseData.picture,
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
						
				})
			}
			//动态中不含图片，无须上传图片
			else {
				let params = {
					uid: global.user.userData.uid,
					content: this.state.text,
					picture: this.state.picture,
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
		
	_onAddPic() {
		Keyboard.dismiss();
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response: ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				// let source = { uri: response.uri };
				this.setState({
					picture: response.uri,
				});
			}
		});
	}

	_showPic(picture) {
		if(picture) {
			return (
				<Image style={styles.pic} source={{uri: picture}} />
			)
		}
		else {
			return (
				<TouchableOpacity style={styles.addPic} onPress={() => this._onAddPic()}>
					<Icon name='ios-add' size={44} />
				</TouchableOpacity>
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
							<Icon name='ios-arrow-back' size={22} />
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
							{this._showPic(this.state.picture)}
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
		flexDirection: 'row',
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
	},
	addPic: { 
		width: ImageWidth, 
		height: ImageHeight, 
		borderWidth: 1, 
		borderColor: '#ccc', 
		alignItems: 'center', 
		justifyContent: 'center'
	},
	pic: {
		width: ImageWidth, 
		height: ImageHeight, 
	},
})