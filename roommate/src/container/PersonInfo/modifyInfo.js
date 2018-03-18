import React, { Component } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Modal, } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

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
			userName: '西瓜瓜瓜瓜',
			modalVisible: false,
			selectedItem: null,
			labels: null,
			delLabel: null,
			delLabelKey: null,
		};
	}

	componentDidMount() {
		this.setState({
			labels: labels,
		})
	}

	_onModifyName() {
		this.setState({
			modalVisible: true,
			selectedItem: 'name',
		})
	}

	_onDelLabel(label, key) {
		this.setState({
			modalVisible: true,
			delLabel: label,
			delLabelKey: key,
		})
	}

	_showLabels(labels) {
		let items = [];
		console.log('labels is ', labels);
		if(labels) {
			labels.map( (label, key) => {
				items.push(
					<TouchableOpacity style={styles.labelWrap} key={key} onPress={ () => this._onDelLabel(label, key) }>
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
	
	render() {
		return (
			<Modal 
				animationType={"fade"}
				transparent={true}
				visible={this.state.modalVisible}
				onRequestClose={() => {}}
			>
			</Modal>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
						<Icon name='chevron-left' size={32} />
					</TouchableOpacity>	
					<Text style={styles.headerTitle}>编辑个人资料</Text>
					<View style={styles.headerButton}></View>					
				</View>
				<View style={styles.main}>
					<TouchableOpacity style={styles.itemWrap} onPress={ () => {} }>
						<Text style={styles.itemTitle}>头像</Text>
						<Image style={styles.avatar} source={require('../../../localResource/images/avatar1.jpg')} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.itemWrap} onPress={ () => this._onModifyName() }>
						<Text style={styles.itemTitle}>昵称</Text>
						<Text>{userName}</Text>
					</TouchableOpacity>
					<View style={styles.personLabel}>
						<View style={styles.itemTop}>
							<Text style={styles.itemTitle}>我的个性标签</Text>
							<TouchableOpacity style={styles.addBtn} activeOpacity={0.6}>
								<Text style={{ color: MainColor }}>+自定义</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.itemBottomWrap}>
							{this._showLabels(this.state.labels)}
						</View>
					</View>
					<View style={styles.itemWrap}>
						<Text style={[styles.lastTitle, styles.itemTitle]}>想对室友说</Text>
						<TouchableOpacity>
							<Text style={styles.wordsWrap}>{words}</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.footer}>
					<TouchableOpacity style={styles.footerBtn}>
						<Text>确认修改</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
		position: 'absolute',
		bottom: 52,
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