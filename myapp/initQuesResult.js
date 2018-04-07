var mysql = require('mysql');
let score = [[10, 5, 1], [8, 6, 3, 10, 1], [2, 5, 9, 7], [10, 2], [1, 10], [7, 9, 1]];

function getRandom(range) {
	let num = Math.round(Math.random() * 10) % range;
	return num;
}

function getAnswers() {
	let answers = [];
	score.map((value, key) => {
		let index = getRandom(value.length);
		answers.push(value[index]);
	})
	return answers;
}

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'lijinlong',
	database: 'roommate',
});

connection.connect();
let uidSql = 'SELECT uid FROM user_info';
connection.query(uidSql, function(err, result) {
	if(err) {
		console.log('uid error');
		return;
	}
	let quesResult = [];

	//生成一百个用户问卷结果
	for(let i = 400; i < 600; i++) {
		let item = [];
		item[0] = result[i].uid;
		item[1] = JSON.stringify(getAnswers());
		quesResult.push(item);
	}
	console.log('quesResult: ', quesResult);
	// 插入ques_result表
	let resSql = 'INSERT INTO ques_result(uid, results) VALUES ?';
	let resParams = [quesResult];
	connection.query(resSql, resParams, function(err, rows, fields) {
		if(err) {
			console.log('insert res error');
			return;
		}
		console.log('insert res success');
	})
})
	