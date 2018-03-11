import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Keyboard, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GiftedChat, Bubble, Send, InputToolbar, } from 'react-native-gifted-chat';

let Dimensions = require("Dimensions");
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let PadSideMain = 15;
let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 52; //顶部栏按钮宽度
let ButtonHeight = 32; //顶部栏按钮高度
let PadSide = 8; //内容与左右两侧间距
let MainColor = '#fce23f'; //主色调
let DeepColor = '#f7d451';

export default class ChatRoomScreen extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.state={
			messages: [],
			typingText: true,
		}

		// this.renderFooter = this.renderFooter.bind(this);
	}

	componentWillMount() {
		this.setState({
			messages: [
				{
					_id: 1,
					text: 'Hello developer',
					createAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
					},
				},
				{
					_id: 2,
					text: 'Hello developer',
					createAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
					},
				},
				{
					_id: 3,
					text: 'Hello developer',
					createAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
					},
				},
			],
		})
	}

	onSend(messages = []) {
		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}) )
	}

	renderBubble(props) {
		return (
			<Bubble 
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: DeepColor,
					}
				}}
			/>
		);
	}

	renderSend(props) {
			return (
				<Send 
					{...props}
					label="发送"
					textStyle={{
						fontSize: 15,
						color: MainColor,
					}}
				/>
			)
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.header}>	
					<TouchableOpacity style={styles.headerButton} onPress={() => { Keyboard.dismiss(); this.props.navigation.goBack();} }>
						<Icon name='ios-arrow-back-outline' size={21}  color={'white'}/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>冬瓜瓜瓜瓜</Text>
					<TouchableOpacity style={styles.headerButton} activeOpacity={0.7} onPress={() => { Keyboard.dismiss(); this.props.navigation.navigate('UserInfo');} }>
							<Icon name='ios-person' size={28} color={'white'} />
					</TouchableOpacity>
				</View>
				<GiftedChat
					messages={this.state.messages}
					placeholder="请输入..."
					isAnimated={true}
					onSend={(messages) => this.onSend(messages)}
					showUserAvatar={true}
					showAvatarForEveryMessage={true}
					renderAvatarOnTop={true}
					onPressAvatar={ () => {console.log("now user is ", this.user); this.props.navigation.navigate('UserInfo')} }
					renderBubble={this.renderBubble}
					renderSend={this.renderSend}
					user={{
						_id: 1,
						// name: 'zhouyi',
						avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
					}}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		width: ScreenWidth,
		height: HeaderHeight,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: MainColor,
		// paddingLeft: PadSide,
		// paddingRight: PadSide,
		// backgroundColor: '#ddd',	
	},
	headerTitle: {
		fontSize: 16,
		color: 'white',
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
	footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: 'pink',

  },
  sendButton: {
  	// borderWidth: 1,
  	// height: '100%',
  	// width: '100%',
  	// marginRight: PadSide,
  	// justifyContent: 'center',
  	// alignItems: 'center',
  	marginRight: 20,
  	marginBottom: 10,
  }
})