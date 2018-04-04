import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { VictoryBar, VictoryLabel, VictoryChart, VictoryArea, VictoryPolarAxis, VictoryTheme } from 'victory-native';

let Dimensions = require('Dimensions');
let ScreenHeight = Dimensions.get('window').height;

// const data = [
//   { quarter: 1, earnings: 13000 },
//   { quarter: 2, earnings: 16500 },
//   { quarter: 3, earnings: 14250 },
//   { quarter: 4, earnings: 19000 }
// ];

let data=[
              { x: '早睡', y: 20, fill: "violet" },
              { x: '洁癖', y: 30, fill: "cornflowerblue" },
              { x: '不抽烟', y: 65, fill: "gold" },
              { x: '喜静', y: 50, fill: "orange" },
              { x: '接受小动物', y: 40, fill: "turquoise" },
              { x: '公共卫生', y: 50, fill: "tomato" },
              // { x: 'null', y: 0, fill: "white" },
            ];

// const des=['早睡', '不抽烟', '爱干净', '接受宠物', '喜静', '雷锋'];

export default class Chart extends Component {
  render() {
    const score = this.props.score;
    console.log('score: ', score);
    // console.log("selected in Chart is ", selected);

    data.map((d, key) => {
      d.y = score[key];
      // if(key == 0)
      //   d.y = score[2] + 1;
      // else if(key == 1)
      //   d.y = score[key] + 1;
      // else
      //   d.y = score[key + 1] + 1;
    });

    return (
      <View style={styles.container}>
        
        <VictoryChart polar height={320} width={320} theme={VictoryTheme.material} animate={{ 
          duration: 2000, 
          onLoad: { duration: 1000 }
        }} >
          <VictoryPolarAxis />
          <VictoryBar domain={{ y: [0, 10] }} polar categories={{
            x: ['早睡', '洁癖', '不抽烟', '喜静', '接受小动物', '公共卫生', 'null']
            }} data={data} style={{ data:{ fill: "tomato", opacity: 0.6, width: 32, } }} 
          />
        </VictoryChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // borderWidth: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    // backgroundColor: '#f5fcff',
  }
})
