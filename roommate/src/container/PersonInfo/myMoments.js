import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, FlatList, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MomentItem } from '../TabMain/momentShow.js';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let PadBottom = 8; //上下两条内容间距

let data = [
	{key: '0', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '2', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '4', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
	{key: '6', userId: 0, avatar: '', userName: '西西西西瓜', time: '2017/11/27 20:45', isliked: false, content: '破碎的奇迹，好过没有。苦恼的希望，胜于迷惘。', img: null, },
];

export default class MyMomentScreen extends Component {
	static navigationOptions = {
		drawerLabel: '我发表的动态',
		drawerIcon: <Icon name="ios-pizza-outline" size={22} />
	};

	constructor(props) {
		super(props);
		this.state = {
			uid: 0,
		};
	}

	_onFooter() {
		return (
			<View style={styles.footerWrap}>
				<Text style={{ fontSize: 12, color: '#ccc', }}>暂无更多内容~</Text>
			</View>
		)
	}
	
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
						<Icon name='ios-arrow-back' size={21} />
					</TouchableOpacity>	
					<Text style={styles.headerTitle}>我发表的</Text>
					<View style={styles.headerButton}></View>					
				</View>
				<View style={styles.main}>
					<FlatList data={data} 
						renderItem={({item}) => <MomentItem item={item} uid={this.state.uid} parentRef={this} />}
						style={styles.list}
						contentContainerStyle={{paddingBottom: 88 }}
						ListFooterComponent={this._onFooter}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		// backgroundColor: 'white',
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
	footerWrap: {
		height: 32,
		alignItems: 'center',
	}
})