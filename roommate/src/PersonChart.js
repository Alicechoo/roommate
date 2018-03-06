import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

const data = [
	{ quarter: 1, earnings: 12000 },
	{ quarter: 2, earnings: 15000 },
	{ quarter: 3, earnings: 13000 },
	{ quarter: 4, earnings: 19000 }
];

class Chart extends Component {
	render() {
		return (
			<View style={styles.container}>
				<VictoryChart width={350} theme={VictoryTheme.material}>
					<VictoryBar data={data} x="quarter" y='earnings' />
				</VictoryChart>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'blue',
	}
})

module.export = Chart;