import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableNativeFeedback, Modal, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { NavigationActions } from 'react-navigation';
import fetchRequest from '../config/request.js';

let Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let PadSide = 15; //与界面两侧间距
let PadBottom = 30; //与界面底部间距
let MainColor = '#fce23f'; //主色调
let InactiveColor = 'gray';
let DeepColor = '#f7d451';
let TextMargin = 30; //问题与选项间隔

let FootHeight = 80; //底部栏高度
let OptionWidth = ScreenWidth - 120; //选项item宽度
let OptionHeight = 45; //选项item高度
let CircleWidth = 20;
let CircleHeight = 20;
let CircleRadius = CircleWidth / 2;
let chevWidth = 60; //底部左右箭头宽度

let ConfirmBoxWidth = ScreenWidth - 80; //确认框宽度
let ConfirmBoxHeight = 160; //确认框高度
let ContentPad = 15; //弹出框信息与上下文间距 
let ImageRight = ConfirmBoxWidth / 4; //图像与中间线距离
let ImageWidth = 120; //Modal图片宽
let ImageHeight = 110; //Modal图片高
let TitleHeight = 50; //Modal标题栏高度
let ButtonHeight = 45; //Modal按钮高度
let ContentHeight = 56; //Modal内容高度

let QuestionInfo = [{id: 0, title: '对于你来说，是习惯早睡还是习惯熬夜', options: ['早睡，习惯性11点前睡觉', '晚睡，基本不到1点不睡', '熬夜，一般3, 4点睡']},
	{id: 1, title: '你大概习惯多久打扫一次卫生呢', options: ['一天一次', '三天一次', '一周一次', '无时无刻，一丝灰尘都不能忍', '能不打扫就不打扫']},
	// {id: 2, title: '如果第二天有早课，你会选择几点上床睡觉', options: ['10点前', '10点-11点', '11点-12点', '12点-1点', '1点之后']},
	{id: 3, title: '你抽烟吗，抽烟的时候会打扰室友吗', options: ['抽烟，希望室友也一样', '抽烟，但会尽量不影响他人','不抽烟，不能忍受二手烟', '不抽烟，但不介意室友抽烟']},
	{id: 4, title: '你是喜欢安静的宿舍氛围还是热闹的呢', options: ['安静，不希望被打扰','热闹，大家一起玩超开心的']},
	{id: 5, title: '如果有舍友要养小宠物，你能接受吗', options: ['不能', '能']},
	{id: 6, title: '你会主动打扫公共区域如洗手间，洗漱台吗', options: ['会，希望大家能轮流打扫', '会，不介意自己一个人打扫', '不会']}
];

let score = [[10, 5, 1], [8, 6, 3, 10, 1], [2, 5, 9, 7], [10, 2], [1, 10], [7, 9, 1]];

export default class QuestionScreen extends Component {
	static navigationOptions = {
		header: null,
	};
	
	constructor(props) {
		super(props);
		this.state = {
			nowPage: 0,
			// quesTitle: null,
			// quesChoices: null,
			selected: [],
			score: [],
			modalVisible: false,
			finished: false,
			unFinishFirst: null,
			requestSta: null,
		};
	}
	// componentDidMount() {
	// 	fetchRequest('/app/getQues', 'get').then( res => {
	// 		console.log('res: ', res);
	// 		res.send(result);
	// 		// if(res)
	// 	})
	// }

	_onSelect(selected, now, num, key) { 
			selected[now] = key;
			this.setState({ selected: selected });
			setTimeout( function() {
				console.log("now is", now);
				console.log('num is ', num);
				//防止数组越界
				if(now < num - 1)
					this.setState({ nowPage: now + 1 });
			}.bind(this), 200);
			
			console.log("option index is", key);
	}

	//确认是否所有问题都回答完毕
	_onConfirm() {
		let selected = this.state.selected;
		let i;
		console.log("selected is ", selected);
		for( i = 0; i < QuestionInfo.length; i++ ) {
			if(selected[i] === undefined) {
				this.setState({ unFinishFirst: i })
				break;
			}
		}
		console.log("i is ", i);
		if(i == QuestionInfo.length) {
			this.setState({ finished: true});
			console.log("this finished is ", this.state.finished);
		}

		this._onShow();
	}

	_onShow() {
		this.setState({
			modalVisible: !this.state.modalVisible,
		});
	}

	_onClose() {
		console.log("this.state.modalVisible is ", this.state.modalVisible);
		this.setState({
			requestSta: null,
			modalVisible: !this.state.modalVisible,
		});
		console.log('this.state. modalVisible after close is ', this.state.modalVisible);
	}

	_onSubmit() {		
		//将选择传到后台
		console.log('selected', this.state.selected);
		let answer = [];
		this.state.selected.map((value, key) => {
			answer[key] = score[key][value];
			console.log('answer: ', answer[key]);
		})
		this.setState({
			score: answer,
		})
		console.log('global.user.userData: ', global.user.userData);
		let params = {
			uid: global.user.userData.uid,
			answer: answer,
		};
		console.log('answer params: ', params);
		fetchRequest('/app/answer', 'POST', params).then(res => {
			console.log('res: ', res);
			if(res == 'success') {
				this.setState({
					requestSta: 'success',
				})
				global.user.finished = true;
				this._onClose();
				const resetAction = NavigationActions.reset({ 
					index: 0,
					actions: [NavigationActions.navigate({ routeName: 'ResultShow', params: { score: this.state.score } })],
				});
				this.props.navigation.dispatch(resetAction);
			}
			else {
				this.setState({
					requestSta: 'error',
				})
			}
		})
		// this.props.navigation.navigate('ResultShow', { selected: this.state.selected });
	}

	_onReview() {
		this.setState({ nowPage: this.state.unFinishFirst });
		this._onClose();
	}

	_leftIconShow() {
		if(this.state.nowPage == 0)
			return (<View style={styles.chevLeft}></View>); //使中间文本不错位
		else
			return (
				<TouchableOpacity style={styles.chevLeft} onPress={() => {this.setState({ nowPage: this.state.nowPage-1 })} }>
					<Icon name='chevron-left' size={32} color={InactiveColor} />
				</TouchableOpacity>
			);
	}

	_rightIconShow() {
		if(this.state.nowPage == QuestionInfo.length - 1)
			return (
				<TouchableOpacity activeOpcity={0.7} style={ styles.chevRight } onPress={ () => {this._onConfirm()}
					// () => {
					// 	if(this.state.selected[this.state.nowPage] === undefined)
					// 		Alert.alert('完成这道题才能提交哦');
					// 	else
					// 		this.props.navigation.navigate('ResultShow');
					// }
				}>
					<Text style={{ fontSize: 14, color: MainColor, }}>提交</Text>
				</TouchableOpacity>);
		else
			return (
				<TouchableOpacity style={ styles.chevRight } onPress={() => {
					// if(this.state.selected[this.state.nowPage] !== undefined)
						this.setState({ nowPage: this.state.nowPage+1 });
					// else
					// 	Alert.alert('完成这道题才能进入下一道哦');
				}}>
					<Icon name='chevron-right' size={32} color={InactiveColor} />
				</TouchableOpacity>
			)
	}

	_modalShow() {
		if(this.state.finished) {
			return (
				<View style={styles.confirmWrap}>
					<View style={styles.titleWrap}>
						<Text style={styles.alertTitle}>确认提交</Text>
					</View>
					<View style={styles.contentWrap}>
						<Text style={{ fontSize: 15 }}>问卷提交后不能再次更改了哦，确认提交吗</Text>
					</View>
					<View style={styles.horLine}></View>
					<View style={styles.buttonWrap}>
						<TouchableOpacity style={styles.Button} activeOpacity={0.5} onPress={() => this._onClose()}>
							<Text>再看看</Text>
						</TouchableOpacity>
						<View style={styles.verLine}></View>
						<TouchableOpacity style={styles.Button} activeOpacity={0.5} onPress={() => this._onSubmit()}>
							<Text style={{ color: DeepColor }}>提交</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
		else {
			return (
				<View style={styles.confirmWrap}>
					<View style={styles.titleWrap}>
						<Text style={styles.alertTitle}>答题未完成</Text>
					</View>
					<View style={[ styles.contentWrap, { paddingTop: ContentPad,}] }>
						<Text>完成所有答题才能提交哦</Text>
					</View>
					<View style={styles.horLine}></View>
					<View style={styles.buttonWrap}>
						<TouchableOpacity style={[styles.Button, { flex: 1 }]} activeOpacity={0.5} onPress={() => this._onReview()}>
							<Text style={{ color: DeepColor }}>继续答题</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
	}

	_showReqSta() {
		let text = '';
		//问卷未完成或请求成功
		if(!this.state.finished || this.state.requestSta == 'success') {
			return null;
		}
		else if(this.state.requestSta == 'error') {
			return (
				<Text style={{ fontSize: 13, color: 'red', marginTop: 20, }}>提交失败，请稍后再试</Text>
			) 
		}
	}

	render() {
		let now = this.state.nowPage;
		let num = QuestionInfo.length;
		let item = QuestionInfo[now];
		let items = [];
		// console.log('now: ', now);
		// console.log('QuestionInfo: ', QuestionInfo);
		// console.log('QuestionInfo[now]: ', QuestionInfo[now]);
		// console.log('QuestionInfo[now].options: ', QuestionInfo[now].options);
		let itemsNum = QuestionInfo[now].options.length;
		// console.log('itemsNum', itemsNum);

		QuestionInfo[now].options.map((option, key) => { 
			let selected = this.state.selected;
			let borderWidth = (key == itemsNum - 1) ? 0 : 1; //最后一个选项没有borderLeft
			let bgColor = (key == selected[now]) ? MainColor : 'white';

			items.push(
				<TouchableOpacity activeOpacity={1} key={key} onPress={() => this._onSelect(selected, now, num, key)}>
					<View style={styles.itemWrap}>
						<View style={[styles.choiceWrap, {borderLeftWidth: borderWidth}]}>
							<Text style={styles.choice}>{option}</Text>
						</View>
						<View style={[styles.circle, {backgroundColor: bgColor}]}></View>
					</View>
				</TouchableOpacity>
			);
		})

		return (
			<View>
				<Modal visible={this.state.modalVisible}
					animationType={'fade'}
					transparent={true}
					onRequestClose={() => {}}
				>
					<TouchableOpacity style={styles.modalBackground} onPress={() => {this._onClose()}}>
						<Image source={require('../../localResource/images/reach_cartoon.png')} style={styles.cartImage} />
						{this._modalShow()}
						{this._showReqSta()}
					</TouchableOpacity>
				</Modal>
				<View style={styles.container}>
					<View style={styles.mainWrap}>
						<Text style={styles.content}>{item.title}</Text>
						<View style={styles.questionWrap}>
							{items}
						</View>
					</View>
					<View style={styles.footer}>		
						{this._leftIconShow()}			
						<Text style={{color: InactiveColor}}>{this.state.nowPage + 1}/{num}</Text>
						{this._rightIconShow()}
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	modalBackground: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
	container: {
		height: ScreenHeight,
		paddingLeft: PadSide,
		paddingRight: PadSide,
		backgroundColor: 'white',
		justifyContent: 'space-between',

	},
	mainWrap: {
		paddingTop: 100,
		// height: ScreenHeight - FootHeight,
		// justifyContent: 'center',
		alignItems: 'center',
	},
	content: {	
		marginBottom: TextMargin,
		fontSize: 17,
	},
	questionWrap: {
		alignItems: 'center',
	},
	itemWrap: {
		width: OptionWidth,
		height: OptionHeight,
		//borderWidth: 1,
		flexDirection: 'row',
		// alignItems: 'center',
		paddingLeft: CircleWidth/2,
	},
	choiceWrap: {
		width: OptionWidth - CircleWidth/2,
		height: OptionHeight,
		//alignItems: 'flex-start',
		paddingLeft: CircleWidth,
		borderLeftWidth: 1,
		borderLeftColor: '#ccc',
	},
	choice: {
		fontSize: 16,
	},
	circle: {
		width: CircleWidth,
		height: CircleHeight,
		borderRadius: CircleRadius,
		borderWidth: 1,
		borderColor: DeepColor,
		// backgroundColor: 'white',
		position: 'relative',
		right: OptionWidth,
	},
	footer: {
		height: FootHeight,
		paddingBottom: PadBottom,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',	
		//borderWidth: 1,
	},
	chevLeft: {
		width: chevWidth,
		height: FootHeight,
		justifyContent: 'center',
		// alignItems: 'flex-start',
		// borderWidth: 1,
	},
	chevRight: {
		width: chevWidth,
		height: FootHeight,
		justifyContent: 'center',
		alignItems: 'flex-end',
		// borderWidth: 1,
	}
});