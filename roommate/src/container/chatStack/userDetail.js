import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Chart from '../../helpers/PersonChart.js';
import fetchRequest from '../../config/request.js';

let HeaderBarHeight = 48; //顶部栏高度
let HeaderBtnWidth = 28; //顶部栏按钮宽度
let PadSide = 12; 

//Todo get user questionnaire selected Info from back-end
let selected = [1, 3, 4, 2, 1, 2, 0];

export default class UserDetailScreen extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.state = {
			type: null,
			text: null,
			content: null,
		}
	}

	componentDidMount() {
		let { params } = this.props.navigation.state;
		let type = params ? params.type : null;
		let content = params ? params.content : null;
		this.setState({
			type: type,
			title: type == 'text' ? 'Ta想对室友说的话' : 'Ta的问卷调查结果',
			content: content,
		})
		//获取用户问卷结果
		if(type == 'chart') {
			let params1 = {
				uid: content,
			};
			fetchRequest('/app/getAnswer', 'POST', params1).then(res => {
				if(res == 'Error') {
					console.log('userDetail getAnswer failed');
				}
				else {
					console.log('userdetail res: ', res);
					this.setState({
						content: res,
					})
				}
			})
		}
	}

	_showContent(type) {
		if(type == 'chart') {
			return (
				<View style={styles.contentWrap}>
					<Chart score = {this.state.content} />
				</View>
			)
		}
		else {
			let text = this.state.content ? this.state.content : 'Ta还没有添加想对室友说的话哦~';
			let color = this.state.content ? '#444' : '#ccc';
			let size = this.state.content ? 16 : 13;
			return (
				<View style={styles.contentWrap}>
					<Text style={{ fontSize: size, color: color, paddingBottom: 2*PadSide, }}>{text}</Text>
				</View>
			) 
		}
	}

	render() {
		// let { params } = this.props.navigation.state;
		// let type = params ? params.type : null;
		// let title = type == 'text' ? 'Ta想对室友说的话' : 'Ta的问卷调查结果';

		// console.log("type is ", type);
		return (
			<View style={styles.container}>
				<View style={styles.headerBar}>
					<TouchableOpacity style={styles.headBackBtn} onPress={() => {this.props.navigation.goBack()} }>
						<Icon name='ios-arrow-back-outline' size={22} />
					</TouchableOpacity>
					<Text style={{ fontSize: 16, }}>{this.state.title}</Text>
					<View style={styles.headBackBtn} ></View>
				</View>
				{this._showContent(this.state.type)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	headerBar: {
		height: HeaderBarHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
	},
	headBackBtn: {
		// borderWidth: 1,
		width: HeaderBtnWidth,
		height: HeaderBarHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentWrap: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
})
