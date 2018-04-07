import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import fetchRequest from '../../config/request.js';

let imgCom_url = 'http://192.168.253.1:8080/images';
let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let PadSide = 12; //内容与左右两侧间距

let itemHeight = 64;
let avatarWidth = 45;
let avatarHeight = 45;
let footerHeight = 45;

let data = [
	{key: '0', userId: 3, avatar: '', matchScore: '9', userName: '知士', },
	{key: '1', userId: 6, avatar: '', matchScore: '8', userName: '小红', },
	{key: '2', userId: 4, avatar: '', matchScore: '8', userName: '小白', },
	{key: '3', userId: 9, avatar: '', matchScore: '7', userName: '小青蛙', },
	{key: '4', userId: 5, avatar: '', matchScore: '6', userName: '二狗子', },
	{key: '5', userId: 0, avatar: '', matchScore: '6', userName: '冬瓜瓜瓜瓜', },
	{key: '6', userId: 1, avatar: '', matchScore: '6', userName: '哈哈哈',  },
	{key: '7', userId: 2, avatar: '', matchScore: '5', userName: '啦啦啦啦', },
	{key: '8', userId: 1, avatar: '', matchScore: '5', userName: '哈哈哈', },
	{key: '9', userId: 2, avatar: '', matchScore: '4', userName: '啦啦啦啦', },
];

export default class RecListScreen extends Component {
	static navigationOptions = {
		title: '推荐',
	};

	constructor(props) {
		super(props);
		this.state={
			uid: null,
			data: null,
		};
	}

	componentDidMount() {
		fetchRequest('/app/getRec', 'POST').then(res => {
			if(res != 'Error') {
				console.log('getRec: ', res);
				console.log('global.user.userData.uid: ', global.user.userData.uid);
				res.map((value, key) => {
					value.key = key;
				})
				this.setState({
					uid: global.user.userData.uid,
					data: res,
				})
			}
			else 
				console.log('getRec error');
		})
		.catch(err => {
			console.log('getRecList error');
		})
	}

	onFooter() {
		return (
			<View style={styles.listFooter}>
				<Text style={{ fontSize: 12, color: '#ccc', }}>暂无其他推荐~</Text>
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container} >
				<View style={styles.header}>	
					<Text style={styles.headerTitle}>推荐列表</Text>
				</View>
				<View style={styles.main}>
					<FlatList 
						data={this.state.data}
						renderItem={ ({item, index}) => <RecItem item={item} parentRef={this} key={index} /> }
						contentContainerStyle={{paddingBottom: 54 }} 
						ListFooterComponent={this.onFooter()}
					/>
				</View>
			</View>
		)
	}
}

class RecItem extends Component {
	_showStars(num) {
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

	render() {
		const item = this.props.item;
		const that = this.props.parentRef;

		return (
			<TouchableOpacity style={styles.itemWrap} activeOpacity={0.6} onPress={ () => { that.props.navigation.navigate('UserInfo', {uid: item.rec_uid, correlation: item.correlation}) }} >
				<Image style={styles.itemLeft} source={{uri: imgCom_url + item.avatar }} />
				<View style={styles.itemRight}>
					<View style={styles.infoMiddle}>
						<Text style={{ color: '#444', fontSize: 15,}}>{item.name}</Text>
						<View style={styles.stars}>
							<Text style={{ fontSize: 12, marginRight: 5 }}>匹配指数: </Text>
							{this._showStars(item.correlation)}
						</View>
					</View>					
					<Icon name='ios-arrow-forward' size={18} />					
				</View>				
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	itemWrap: {
		flex: 1,
		height: itemHeight,
		flexDirection: 'row',
		// justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
		marginLeft: PadSide,
		marginRight: PadSide,
	},
	itemLeft: {
		width: avatarWidth,
		height: avatarHeight,
		borderRadius: avatarWidth/2,
	},
	itemRight: {
		paddingLeft: PadSide,
		width: ScreenWidth - avatarWidth - 3*PadSide,
		height: avatarHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		// borderWidth: 1,
	},
	infoMiddle: {
		// borderWidth: 1,
		height: '100%',
		justifyContent: 'space-between',
	},
	stars: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	header: {
		width: ScreenWidth,
		height: HeaderHeight,
		// borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
		backgroundColor: 'white',
		
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
	listFooter: {
		height: footerHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
});