import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

let PadSide = 12;
let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
let avatarWidth = 64;
let avatarHeight = 64;

let roomMember = [];
export default class RoomScreen extends Component {
	static navigationOptions = {
		drawerLabel: '查看/创建房间',
		drawerIcon: <Icon name="ios-people-outline" size={22} />
	};

	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			roomMember: null,
		}
	}

	componentDidMount() {
		this.setState({
			roomMember: roomMember,
		})
	}

	showMember(members) {
		let items = [];
		if(members && members.length > 0)
		{
			members.map((value, key) => {
				items.push(
					<Image style={styles.avatar} source={value.avatar} />
				)
			})
			return items;
		}
		else
			return null;
		
	}
	
	render() {
		let roomMember = this.state.roomMember;
		let headerTitle = (roomMember && roomMember.length == 0) ? '创建房间' : '我的房间';
		let btnContent = (roomMember && roomMember.length == 0) ? '创建房间' : '退出房间';
		return (
			<View>
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {}}
				>
					<TouchableOpacity style={styles.bgModal} onPress={ () => this._onClose() }>
						
					</TouchableOpacity>
				</Modal>
				<View style={styles.container}>
					<View>
						<View style={styles.header}>
							<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => this.props.navigation.navigate('DrawerOpen')}>
								<Icon name='ios-arrow-back' size={21} />
							</TouchableOpacity>	
							<Text style={styles.headerTitle}>{headerTitle}</Text>
							<View style={styles.headerButton}></View>					
						</View>
						<View style={styles.main}>
							<Image style={styles.avatar} source={require('../../../localResource/images/avatar1.jpg')} />
							{this.showMember(this.state.roomMember)}
							<TouchableOpacity style={styles.addBtn} activeOpacity={0.6}>
								<Icon name='ios-add-outline' size={42} />
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity style={styles.footerBtn}>
						<Text>{btnContent}</Text>
					</TouchableOpacity>
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
	container: {
		// flex: 1,
		// borderWidth: 1,
		justifyContent: 'space-between',
		height: ScreenHeight,
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
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 18,
		paddingLeft: PadSide,
		paddingRight: PadSide,
	},
	avatar: {
		width: avatarWidth,
		height: avatarHeight,
		borderRadius: avatarWidth/2,
		marginRight: PadSide,
	},	
	addBtn: {
		width: avatarWidth + 2,
		height: avatarHeight + 2,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: avatarWidth/2,
		borderWidth: 1,
		borderColor: '#ccc',
	},
	footerBtn: {
		width: ScreenWidth - 6*PadSide,
		height: 42,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		backgroundColor: MainColor,
		marginBottom: 72,
	},
})