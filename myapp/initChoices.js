//使用express框架
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'lijinlong',
	database: 'roommate',
});

fs.readFile('choices.txt', function(err, data) {
	if(err) {
		return console.log('err: ', err);
	}
	console.log('readFile success data: ', data.toString());
	let queItems = data.toString().split('\r\n');
	queItems = queItems.slice(1); //第一行为各项名称
	console.log('queItems: ', queItems);

	connection.connect();
	//获得quesid
	var getQid = 'SELECT ques_id FROM question';
	connection.query(getQid, function(err, results, fields) {
		if(err) {
			console.log('err: ', err);
			return;
		}
		console.log('ques_id: ', results);
		let i = 0;
		let choices = [];

		queItems.map((val, k1) => {
			let temp = val.split('|');
			console.log('temp: ', temp);
			temp.map((value, key) => {
				let arr = value.split('-');
				console.log('arr: ', arr);
				let id = results[k1].ques_id;
				console.log('id: ', id);
				choices[i] = [id, arr[0], arr[1], key];
				i++;
			// 	console.log('choice: ', choice[i]);
			})
		})
		console.log('choices: ', choices);

		var insql = 'INSERT INTO choices(ques_id, choice, value, chid) VALUES ?';
		var sqlParams = choices;
		connection.query(insql, [sqlParams], function(err, rows, fields) {
			if(err) {
				console.log('err: ', err);
				return;
			}
			console.log('insert success');
		})
	})
	// connection.end();

})

