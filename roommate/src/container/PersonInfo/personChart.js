import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Chart from '../../helpers/PersonChart.js';
import fetchRequest from '../../config/request.js';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
//Todo get user questionnaire selected Info from back-end
// let selected = [1, 3, 4, 2, 1, 2, 0];

export default class PersonChartScreen extends Component {
	static navigationOptions = {
		drawerLabel: '查看我的问卷调查结果',
		drawerIcon: <Icon name="ios-analytics" size={21} />
	};

	constructor(props) {
		super(props);
		this.state = {
			score: null,
			ready: false,
			status: null,
		}
	}

	componentDidMount() {
		this.getInitData(global.user.userData.uid);
	}

	getInitData(uid) {
		let params = {
			uid: uid,
		};
		fetchRequest('/app/getAnswer', 'POST', params).then(res => {
			console.log('getAnser res: ', res);
			this.setState({
				ready: true,
				status: 'success',
				score: res,
			})
		})
		.catch(err => {
			this.setState({
				ready: true,
				status: 'fail',
			})			
		})
	}

	_showContent() {
		//数据加载完毕
		if(this.state.ready) {
			//数据加载成功
			if(this.state.status == 'success') {
				return (						
					<Chart score={this.state.score} />
				)
			}
			else {
				return (
					<Text>数据加载错误</Text>
				)
			}
		}
		else {
			return (
				<Text>数据加载中...</Text>
			)
		}
	}
	
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
						<Icon name='ios-arrow-back' size={21} />
					</TouchableOpacity>	
					<Text style={styles.headerTitle}>我的问卷调查结果</Text>
					<View style={styles.headerButton}></View>					
				</View>
				{this._showContent()}
				<View style={styles.header}></View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
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
})