import React, { Component } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, DeviceEventEmitter, } from 'react-native';

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let MainColor = '#fce23f'; //主色调
let InactiveColor = 'gray';
let DeepColor = '#f7d451';

let ConfirmBoxWidth = ScreenWidth - 80; //确认框宽度
let ConfirmBoxHeight = 160; //确认框高度
let ContentPad = 15; //弹出框信息与上下文间距 
let ImageRight = ConfirmBoxWidth / 4; //图像与中间线距离
let ImageWidth = 120; //Modal图片宽
let ImageHeight = 110; //Modal图片高
let TitleHeight = 50; //Modal标题栏高度
let ButtonHeight = 45; //Modal按钮高度
let ContentHeight = 56; //Modal内容高度

export default class ModalView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
		}
	}

	componentDidMount() {
		console.log("this.props.modalVisible is ", this.props.modalVisible);
		this.setState({
			modalVisible: this.props.modalVisible,
			strFunc: this.props.onConfirm,
		})
		console.log("this.state.strFunc is ", this.state.strFunc);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			modalVisible: nextProps.modalVisible,
		})
	}

	_onClose() {
		this.setState({
			modalVisible: !this.state.modalVisible,
		});
	}

	_onConfirm = (that) => {
		console.log('this.props.onConfirm: ', this.props.onConfirm);
		this.props.onConfirm(this.props.params);
		that.props.navigation.goBack();
		console.log("delete complete");
		this._onClose();
	}

	render() {
		let params = this.props.params;
		let that = this.props.parentRef;
		return (
			<Modal visible={this.state.modalVisible}
					animationType={'fade'}
					transparent={true}
					onRequestClose={() => {}}
			>
				<TouchableOpacity style={styles.modalBackground} onPress={() => {this._onClose()}}>
					<Image source={require('../../localResource/images/reach_cartoon.png')} style={styles.cartImage} />
					<View style={styles.confirmWrap}>
						<View style={styles.titleWrap}>
							<Text style={styles.alertTitle}>{this.props.title}</Text>
						</View>
						<View style={styles.contentWrap}>
							<Text style={{ fontSize: 15 }}>{this.props.content}</Text>
						</View>
						<View style={styles.horLine}></View>
						<View style={styles.buttonWrap}>
							<TouchableOpacity style={styles.Button} activeOpacity={0.5} onPress={() => this._onClose()}>
								<Text>{this.props.buttonLeft}</Text>
							</TouchableOpacity>
							<View style={styles.verLine}></View>
							<TouchableOpacity style={styles.Button} activeOpacity={0.5} onPress={() => this._onConfirm(that)}>
								<Text style={{ color: DeepColor }}>{this.props.buttonRight}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</TouchableOpacity>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 220,
	},
	cartImage: {
		width: ImageWidth, 
		height: ImageHeight,
		position: 'relative',
		right: ImageRight + 20,
	},
	confirmWrap: {
		width: ConfirmBoxWidth,
		// height: ConfirmBoxHeight,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'lightgrey',
	},
	titleWrap: {
		height: TitleHeight,
		justifyContent: 'center',
		alignItems: 'center',
		// borderWidth: 1,
	},
	alertTitle: {
		fontSize: 18, 
		fontWeight:'800', 
	},
	contentWrap: {
		height: ContentHeight,
		// justifyContent: 'center',
		paddingLeft: ContentPad,
		paddingRight: ContentPad,
	},
	horLine: {
		height: 1,
		width: '100%',
		backgroundColor: 'lightgrey',
	},
	buttonWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		height: ButtonHeight,
	},
	verLine: {
		height: ButtonHeight - 8,
		width: 1,
		backgroundColor: 'lightgrey',
	},
	Button: {
		flex: 0.49,
		height: ButtonHeight,
		alignItems: 'center',
		justifyContent: 'center',
		// borderWidth: 1,
	},
});