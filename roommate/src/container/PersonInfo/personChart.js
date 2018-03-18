import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Chart from '../../helpers/PersonChart.js';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;

let HeaderHeight = 48; //顶部栏高度
let HeaderWidth = 48; //顶部栏按钮宽度
//Todo get user questionnaire selected Info from back-end
let selected = [1, 3, 4, 2, 1, 2, 0];

export default class PersonChartScreen extends Component {
	static navigationOptions = {
		drawerLabel: '查看我的问卷调查结果',
		drawerIcon: <Icon name="ios-analytics" size={21} />
	};
	
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
				<Chart selected={selected} />
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