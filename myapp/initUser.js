//使用express框架
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
//加密

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'lijinlong',
	database: 'roommate',
});

var crypto = require('crypto');

function md5(text) {
	console.log('text: ', text);
	return crypto.createHash('md5').update(text).digest('hex');
}

fs.readFile('students.txt', function(err, data) {
	if(err) {
		return console.log("err: ", err);
	}
	console.log('readFile success data: ', data.toString());
	let items = data.toString().split('|');
	let students = [];
	let temp = [];
	// console.log('tempStu: ', tempStu);
	let reg = /[^\d]/;
	while(items.length != 0) {
		let tempStu = [];
		for(let i = 0; i < 8; i++) {
			tempStu[i] = null;
		}
		temp = items.splice(0, 6);
		console.log('temp: ', temp);

		//用户账号含有非数字
		if(reg.test(temp[1])) {
			continue;
		}
		
		tempStu[1] = temp[1];
		//用户密码
		tempStu[2] = md5(temp[1].slice(2));
		tempStu[7] = temp[3] == '女' ? 'female' : 'male';
		console.log('tempStu: ', tempStu);
		students.push(tempStu);
		// console.log('students: ', students);
	}
	connection.connect();

	// console.log('students: ', students);
	// (?, ?, ?, ?, ?, ?, ?, ?)
	var sql = 'INSERT INTO user_info(uid, name, password, avatar, labels, signature, rid, sex) VALUES ?';
	connection.query(sql, [students], function(err, rows, fields) {
		if(err) {
			console.log('Insert Error: ', err.message);
			return;
		}
		console.log('insert success');

	})

})