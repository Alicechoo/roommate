//使用express框架
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var app = express();
//加密

app.use(express.static('public'));
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
	let names = [];
	// console.log('tempStu: ', tempStu);
	let reg = /[^\d]/;
	while(items.length != 0) {
		let tempStu = [];
		for(let i = 0; i < 7; i++) {
			tempStu[i] = null;
		}
		temp = items.splice(0, 6);
		console.log('temp: ', temp);

		// 用户账号含有非数字
		if(reg.test(temp[1])) {
			continue;
		}
		let name = temp[2];
		names.push(name);
		tempStu[1] = temp[2];
		//用户密码
		tempStu[2] = md5(temp[1].slice(2));
		tempStu[6] = temp[3] == '女' ? 'female' : 'male';
		//设置用户默认头像
		//用户为female
		let common_url;
		if(tempStu[6] == 'female') {
			common_url = '/default_girl';
		}
		//用户为male
		else {
			common_url = '/default_boy';
		}
		let picId = Math.round(Math.random() * 10) % 9;
		// console.log('picId: ', picId);
		let avatar = `${common_url}/default${picId}.jpg`;
		// console.log('avatar: ', avatar);
		tempStu[3] = avatar;
		// console.log('tempStu: ', tempStu);
		students.push(tempStu);
		// console.log('students: ', students);
	}
	connection.connect();
	// console.log('name: ', names);
	// console.log('students: ', students);
	// (?, ?, ?, ?, ?, ?, ?, ?)
	var sql = 'INSERT INTO user_info(uid, name, password, avatar, labels, signature, sex) VALUES ?';
	// var sql = 'UPDATE user_info set name = ?';
	// var sqlParams = names;
	connection.query(sql, [students], function(err, rows, fields) {
		if(err) {
			console.log('Insert Error: ', err.message);
			return;
		}
		console.log('insert success');

	})
	connection.end();

})