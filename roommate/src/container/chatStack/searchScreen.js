import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, FlatList, Image, Keyboard, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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

let data = [
	{key: '0', userId: 3, avatar: '', isFriend: true, userName: '知士', },
	{key: '1', userId: 6, avatar: '', isFriend: false, userName: '小红', },
	{key: '2', userId: 4, avatar: '', isFriend: true, userName: '小红', },
	{key: '3', userId: 9, avatar: '', isFriend: false, userName: '小青蛙', },
	{key: '4', userId: 5, avatar: '', isFriend: true, userName: '二狗子', },
	{key: '5', userId: 0, avatar: '', isFriend: true, userName: '冬瓜瓜瓜瓜', },
	{key: '6', userId: 1, avatar: '', isFriend: false, userName: '哈哈哈',  },
	{key: '7', userId: 2, avatar: '', isFriend: false, userName: '啦啦啦啦', },
	{key: '8', userId: 1, avatar: '', isFriend: false, userName: '哈哈哈', },
	{key: '9', userId: 2, avatar: '', isFriend: false, userName: '啦啦啦啦', },
];

export default class SearchScreen extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.state={
			searchContent: null,
			searchResult: null,
			searchFinished: false,
		}
	}
	
	_onSearch() {
		Keyboard.dismiss();
		console.log('this.state.searchContent is ', this.state.searchContent);
		let result = [];
		data.map( (item, key) => {
			if(item.userName == this.state.searchContent) {
				// console.log('key is ', key);
				result.push(item);
			}
		})
		if(result.length != 0) {
			this.setState({
				searchResult: result,
			})
		}
		else
			this.setState({
				searchResult: null,
			})
		this.setState({
			searchFinished: true,
		})
	}

	_showResult() {
		this._showFriends();
		this._showUsers();
	}

	_showFriends() {
		console.log('searchResult is ', this.state.searchResult);
		let resultFri = [];
		let result = this.state.searchResult;
		if(result) {
			result.map( (item, wrap) => {
				if(item.isFriend)
					resultFri.push(item);
			})
			console.log('resultFri is ', resultFri);
			if(resultFri) {
				console.log('_showFriends is true');
				return (
					<SearchSection title='我的好友' data={resultFri} />	
				);
			}
			else {
				console.log('_showFriends is false ');
				return null;
			}
		}
		else
			return null;
	}

	_showUsers() {
		let resultNew = [];
		let result = this.state.searchResult;
		if(result) {
			result.map( (item, key) => {
				if(!item.isFriend)
					resultNew.push(item);
			})
			console.log('resultNew is ', resultNew);
			if(resultNew) 
				return (
					<SearchSection title='其他用户' data={resultNew} />	
				)
			else
				return null;
		}
		else
			return null;
	}

	_noResult() {
		console.log('There is no searchResult');
		if(this.state.searchContent && this.state.searchFinished) {
			console.log('noResult return');
			if(!this.state.searchResult)
				return (
					<View style={styles.noneWrap}>
						<Text>暂无" <Text style={{ color: DeepColor, }}>{this.state.searchContent}</Text> "相关内容</Text>
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
					{this._showFriends()}
					{this._showUsers()}
					{this._noResult()}
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
		return (
			<View style={styles.sectionWrap}>
				<View style={styles.sectionTitle}>
					<Text>{this.props.title}</Text>
				</View>
				<FlatList 
					data={this.props.data}
					keyExtractor={this._keyExtractor} 
					renderItem={ ({item, index}) => <ListItem item={item} index={index} len={this.props.data.length}/> }
				/>
			</View>
		)
	}
}

class ListItem extends Component {
	render() {
		let item = this.props.item;
		let index = this.props.index;
		let length = this.props.len;
		let avatar = item ? item.avatar : null;
		let userName = item ? item.userName : null; 
		console.log('item index is ', this.props.index); 
		let borderBottomWidth = index == length-1 ? 0 : 0.3;

		return (
			<View style={[styles.itemWrap, {borderBottomWidth: borderBottomWidth,} ]}>
				<Image style={styles.avatar} source={require('../../../localResource/images/avatar2.jpg')} />
				<Text>{userName}</Text>
			</View>
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