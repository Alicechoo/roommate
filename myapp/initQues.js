var express = require('express');
var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'lijinlong',
	database: 'roommate',
});

fs.readFile('questions.txt', function(err, data) {
	if(err) {
		return console.log('err: ', err);
	}
	console.log('data in initQues: ', data.toString());
	let items = data.toString().split('|');
	let questions = [];
	console.log('items: ', items);
	items.map((value, key) => {
		console.log('key: ', key, 'value: ', value);
		questions[key] = [null, value];
		// console.log('questions', questions[key]);
	})
	//去掉第一行的标题
	questions = questions.slice(1);
	console.log('questions', questions);
	connection.connect();
	var sql = 'INSERT INTO question(ques_id, title) VALUES ?';
	connection.query(sql, [questions], function(err, fields){
		if(err) {
			console.log('Insert Error: ', err);
			return ;
		}
		console.log('Insert Success');
	})

})