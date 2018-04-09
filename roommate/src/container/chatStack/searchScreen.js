import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, FlatList, Image, Keyboard, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import fetchRequest from '../../config/request.js';

let imgCom_url = 'http://192.168.253.1:8080/images';
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let SearchBarHeight = 32; //搜索栏高度
let HeaderBtnWidth = 28; //顶部栏按钮宽度
let HeaderHeight = 48; //头部栏高度
let ItemHeight = 64; //搜索结果显示栏高度
let avatarWidth = 42;
let avatarHeight = 42;

let itemHeight = 64;
let PadSide = 12;
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

// let data = [
// 	{key: '0', userId: 3, avatar: '', isFriend: true, userName: '知士', },
// 	{key: '1', userId: 6, avatar: '', isFriend: false, userName: '小红', },
// 	{key: '2', userId: 4, avatar: '', isFriend: true, userName: '小红', },
// 	{key: '3', userId: 9, avatar: '', isFriend: false, userName: '小青蛙', },
// 	{key: '4', userId: 5, avatar: '', isFriend: true, userName: '二狗子', },
// 	{key: '5', userId: 0, avatar: '', isFriend: true, userName: '冬瓜瓜瓜瓜', },
// 	{key: '6', userId: 1, avatar: '', isFriend: false, userName: '哈哈哈',  },
// 	{key: '7', userId: 2, avatar: '', isFriend: false, userName: '啦啦啦啦', },
// 	{key: '8', userId: 1, avatar: '', isFriend: false, userName: '哈哈哈', },
// 	{key: '9', userId: 2, avatar: '', isFriend: false, userName: '啦啦啦啦', },
// ];

export default class SearchScreen extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.state={
			searchContent: null,
			searchFinished: false,
			searchResult: null,
		}
	}
	
	_onSearch() {
		Keyboard.dismiss();
		//输入内容不为空时，进行搜索
		let params = {
			uid: global.user.userData.uid,
			name: this.state.searchContent,
		}
		if(this.state.searchContent) {
			fetchRequest('/app/searchUser', 'POST', params).then(res => {
				if(res == 'Error') {
					console.log('searchUser error');
				}
				else {
					console.log('searchUser res: ', res);
					res.map((value, key) => {
						value.key = key;
					})
					this.setState({
						searchFinished: true,
						searchResult: res,
					})
				}
			})
			.catch(err => {
				console.log('searchUser err: ',err);
			})
		}
		// console.log('this.state.searchContent is ', this.state.searchContent);
		// let result = [];
		// data.map( (item, key) => {
		// 	if(item.userName == this.state.searchContent) {
		// 		// console.log('key is ', key);
		// 		result.push(item);
		// 	}
		// })
		// if(result.length != 0) {
		// 	this.setState({
		// 		searchResult: result,
		// 	})
		// }
		// else
		// 	this.setState({
		// 		searchResult: null,
		// 	})
		// this.setState({
		// 	searchFinished: true,
		// })
	}

	_showResult() {
		this._showFriends();
		this._showUsers();
	}

	_showFriends(finished, result) {
		console.log('searchResult is ', result);
		// let resultFri = [];
		// let result = this.state.searchResult;
		if(finished && result[0] && result[0].isFriend) {
			return (
				<SearchSection title='我的好友' data={result} parentRef={this} />	
			);
			// result.map( (item, wrap) => {
			// 	if(item.isFriend)
			// 		resultFri.push(item);
			// })
			// console.log('resultFri is ', resultFri);
			// if(resultFri) {
			// 	console.log('_showFriends is true');
			// 	return (
			// 		<SearchSection title='我的好友' data={resultFri} />	
			// 	);
			// }
			// else {
			// 	console.log('_showFriends is false ');
			// 	return null;
			// }
		}
		else
			return null;
	}

	_showUsers(finished, result) {
		if(finished && result[0] && !result[0].isFriend) {
			return (
				<SearchSection title='其他用户' data={result} parentRef={this} />	
			)
		}
		// let resultNew = [];
		// let result = this.state.searchResult;
		// if(result) {
		// 	result.map( (item, key) => {
		// 		if(!item.isFriend)
		// 			resultNew.push(item);
		// 	})
		// 	console.log('resultNew is ', resultNew);
		// 	if(resultNew) 
		// 		return (
		// 			<SearchSection title='其他用户' data={resultNew} />	
		// 		)
		// 	else
		// 		return null;
		// }
		else
			return null;
	}

	_noResult(result, content, finished) {
		console.log('There is no searchResult');
		if(finished) {
			console.log('noResult return');
			if(result && result.length == 0)
				return (
					<View style={styles.noneWrap}>
						<Text>暂无" <Text style={{ color: DeepColor, }}>{content}</Text> "相关内容</Text>
					</View>
				)
		}
	}

	render() {
		return(
			<View style={styles.container}>
				<View style={styles.headerBar}>
					<TouchableOpacity style={styles.headBackBtn} onPress={() => {Keyboard.dismiss(); this.props.navigation.goBack()} }>
						<Icon name='ios-arrow-back-outline' size={22} />
					</TouchableOpacity>
					<View style={styles.searchBar}>
						<Icon name="ios-search" size={21} />
						<TextInput 
							autoFocus={true}
							placeholder={'输入用户名...'}
							returnKeyType='done'
							underlineColorAndroid="transparent" 
							style={{ flex: 1, height: HeaderHeight, }}
							onChangeText={ (text) => {this.setState({ searchContent: text, })} } 
						/>
					</View>
					<TouchableOpacity style={styles.headBackBtn} onPress={ () => this._onSearch() }>
						<Text>搜索</Text>
					</TouchableOpacity>
				</View>
				<ScrollView style={styles.main}>
					{this._showFriends(this.state.searchFinished, this.state.searchResult)}
					{this._showUsers(this.state.searchFinished, this.state.searchResult)}
					{this._noResult(this.state.searchResult, this.state.searchContent, this.state.searchFinished)}
				</ScrollView>
			</View>
		)
	}
}

//搜索结果展示栏
class SearchSection extends Component {
	 // _keyExtractor = (item, index) => ivfftem.id;

	render() {
		console.log("this.props.data is ", this.props.data);
		let that = this.props.parentRef;
		return (
			<View style={styles.sectionWrap}>
				<View style={styles.sectionTitle}>
					<Text>{this.props.title}</Text>
				</View>
				<FlatList 
					data={this.props.data}
					keyExtractor={this._keyExtractor} 
					renderItem={ ({item, index}) => <ListItem item={item} index={index} len={this.props.data.length} that={that}/> }
				/>
			</View>
		)
	}
}

class ListItem extends Component {
	render() {
		let that = this.props.that;
		let item = this.props.item;
		let index = this.props.index;
		let length = this.props.len;
		let avatar = item ? item.avatar : null;
		let name = item ? item.name : null; 
		let userId = item ? item.uid : null;
		let correlation = item ? item.correlation : null;
		console.log('item index is ', this.props.index); 
		let borderBottomWidth = index == length-1 ? 0 : 0.3;

		return (
			<TouchableOpacity style={[styles.itemWrap, {borderBottomWidth: borderBottomWidth,} ]} 
				activeOpacity={0.6} 
				onPress={() => that.props.navigation.navigate('UserInfo', {uid: userId, correlation: correlation})}
			>
				<Image style={styles.avatar} source={{uri: imgCom_url + avatar}} />
				<Text>{name}</Text>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	sectionWrap: {
		backgroundColor: 'white',
		// borderWidth: 1,
		paddingLeft: PadSide,
		paddingRight: PadSide,
		marginBottom: PadSide,
	},
	sectionTitle: {
		height: HeaderHeight,
		justifyContent: 'flex-end',
		paddingBottom: 5,
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
	},
	itemWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		height: ItemHeight,
		borderBottomWidth: 0.3,
		borderColor: '#ccc',
	},
	avatar: {
		width: avatarWidth,
		height: avatarHeight,
		borderRadius: avatarWidth/2,
		marginRight: PadSide,
	},
	noneWrap: {
		height: ScreenHeight - HeaderHeight,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 120,
	},
	// main:{
	// 	flex: 1,
	// 	// borderWidth: 1,
	// 	backgroundColor: 'pink',
	// },
	container: {
		flex: 1,
	},
	headerBar: {
		height: HeaderHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: MainColor,
		paddingLeft: PadSide,
		paddingRight: PadSide,
		// borderWidth: 1,
	},
	headBackBtn: {
		// borderWidth: 1,
		width: HeaderBtnWidth,
		height: HeaderHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchBar: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		height: SearchBarHeight,
		borderWidth: 0.3,
		borderRadius: SearchBarHeight/2,
		borderColor: '#ccc',
		paddingLeft: PadSide,
		marginLeft: PadSide,
		marginRight: PadSide,
		backgroundColor: 'white',
	},
	main: {
		// flex: 1,
	},

})