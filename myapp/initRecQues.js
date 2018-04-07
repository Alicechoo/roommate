//使用express框架
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
// var app = express();

fs.readFile('sayHiRec.txt', function(err, data) {
	if(err) {
		return console.log('err: ', err)
	}

	let items = data.toString().split('|');
	console.log('items: ', items);
	let questions = [];
	items.map((value, key) => {
		let temp = [];
		temp[0] = null;
		temp[1] = value;
		questions.push(temp);
	})
	console.log('questions: ', questions);

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate',
	});
	connection.connect();

	// console.log('students: ', students);
	// (?, ?, ?, ?, ?, ?, ?, ?)
	var sql = 'INSERT INTO sayhi_rec(sid, question) VALUES ?';
	connection.query(sql, [questions], function(err, rows, fields) {
		if(err) {
			console.log('Insert Error: ', err.message);
			return;
		}
		console.log('insert success');

	})
	connection.end();
})