var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'lijinlong',
	database: 'roommate',
});

connection.connect();

let queSql = 'SELECT uid, results FROM ques_result';
connection.query(queSql, function(err, userResult) {
	if(err) {
		console.log('select results error');
		return;
	}

	userResult.map((currentUser, key1) => {
		let correlation = [];
		let sexSql = 'SELECT sex FROM user_info WHERE uid = ? ';
		let sexSqlParam = currentUser.uid;
		//获取当前用户性别
		connection.query(sexSql, sexSqlParam, function(err, result1) {
			if(err) {
				console.log('corsex Err: ', sex);
				res.json('Error');
				return;
			}
			// console.log('sex result: ', result1);
			let sql = 'SELECT a.uid, a.results FROM ques_result a INNER JOIN user_info b ON a.uid = b.uid WHERE b.sex = ?';
			let sqlParams = result1[0].sex;
			//获取当前已完成问卷的所有同性问卷结果
			connection.query(sql, sqlParams, function(err, result2) {
				if(err) {
					console.log('getOtherAnwer Error: ', err);
					res.json('Error');
					return;
				}
				let sum1 = 0;
				let sum1Sq = 0;
				let currentAnswer = JSON.parse(currentUser.results);
				//对当前用户所有偏好求和，平方和
				currentAnswer.map((value, key) => {
					sum1 += value;
					sum1Sq += Math.pow(value, 2);
				})
				// console.log('sum1: ', sum1);
				// console.log('sum1Sq: ', sum1Sq);
				//对这些用户进行相似度计算，并插入数据库
				result2.map((value, key) => {
					console.log('key: ', key, 'value: ', value);
					//除去自身
					if(value.uid != currentUser.uid) {
						let score = JSON.parse(value.results);
						// console.log('score: ', score);
						let temp1 = [];
						// let temp2 = [];
						let sum2 = 0;
						let sum2Sq = 0;
						let pSum = 0;
						let n = score.length;
						temp1[0] = currentUser.uid;
						temp1[1] = value.uid;
						// temp2[0] = value.uid;
						// temp2[1] = currentUser.uid;
					
						//对用户所有偏好求和，以及平方和
						score.map((value, key) => {
							sum2 += value;
							sum2Sq += Math.pow(value, 2);
						})
						// console.log('sum2: ', sum2);
						// console.log('sum2Sq: ', sum2Sq);
						//求乘积之和
						for(let i = 0; i < n; i++) {
							pSum += score[i] * currentAnswer[i];
						} 
						//计算Pearson相似度
						let num = pSum - (sum1 * sum2 / n);
						let den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n)*(sum2Sq - Math.pow(sum2, 2)/n));
						if(den == 0) {
							temp1[2] = 0;
							// temp2[2] = 0;
						}
						else {
							let r = num/den;
							temp1[2] = r;
							// temp2[2] = r;
						}
						console.log('temp1: ', temp1);
						// console.log('temp2: ', temp2);
						correlation.push(temp1);
						// correlation.push(temp2);
					}
				})
				//将用户之间的相似度插入数据库
				if(correlation.length > 0) {
					let corSql = 'INSERT INTO user_correlation(current_uid, rec_uid, correlation) VALUES ?';
					let corSqlParams = [correlation];
					connection.query(corSql, corSqlParams, function(err, result) {
						if(err) {
							console.log('insert correlation error: ', err);
							// res.json('Error');
							return;
						}
						console.log('insert correlation: ', result.insertId);
					})
				}
			})
		})
	})
})
 //计算Pearson相似度，插入user_correlation表
	// // let correlation = [];
	// quesResult.map((val1, key1) => {
	// 	let sexSql = 'SELECT sex FROM user_info WHERE uid = ? ';
	// 	let sexSqlParam = val1[0];
	// 	//获取当前用户性别
	// 	connection.query(sexSql, sexSqlParam, function(err, result1) {
	// 		if(err) {
	// 			console.log('corsex Err: ', sex);
	// 			res.json('Error');
	// 			return;
	// 		}
	// 		console.log('sex result: ', result1);
	// 		let sql = 'SELECT a.uid, a.results FROM ques_result a INNER JOIN user_info b ON a.uid = b.uid WHERE b.sex = ?';
	// 		let sqlParams = result1[0].sex;
	// 		//获取当前已完成问卷的所有同性问卷结果
	// 		connection.query(sql, sqlParams, function(err, result2) {
	// 			if(err) {
	// 				console.log('getOtherAnwer Error: ', err);
	// 				res.json('Error');
	// 				return;
	// 			}
	// 			let sum1 = 0;
	// 			let sum1Sq = 0;
	// 			//对当前用户所有偏好求和，平方和
	// 			currentUser.answer.map((value, key) => {
	// 				sum1 += value;
	// 				sum1Sq += Math.pow(value, 2);
	// 			})
	// 			console.log('sum1: ', sum1);
	// 			console.log('sum1Sq: ', sum1Sq);
	// 			let correlation = [];
	// 			//对这些用户进行相似度计算，并插入数据库
	// 			result2.map((value, key) => {
	// 				console.log('key: ', key, 'value: ', value);
	// 				//除去自身
	// 				if(value.uid != currentUser.uid) {
	// 					let score = JSON.parse(value.results);
	// 					console.log('score: ', score);
	// 					let temp1 = [];
	// 					let temp2 = [];
	// 					let sum2 = 0;
	// 					let sum2Sq = 0;
	// 					let pSum = 0;
	// 					let n = score.length;
	// 					temp1[0] = currentUser.uid;
	// 					temp1[1] = value.uid;
	// 					temp2[0] = value.uid;
	// 					temp2[1] = currentUser.uid;
					
	// 					//对用户所有偏好求和，以及平方和
	// 					score.map((value, key) => {
	// 						sum2 += value;
	// 						sum2Sq += Math.pow(value, 2);
	// 					})
	// 					console.log('sum2: ', sum2);
	// 					console.log('sum2Sq: ', sum2Sq);
	// 					//求乘积之和
	// 					for(let i = 0; i < n; i++) {
	// 						pSum += score[i] * currentUser.answer[i];
	// 					} 
	// 					//计算Pearson相似度
	// 					let num = pSum - (sum1 * sum2 / n);
	// 					let den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n)*(sum2Sq - Math.pow(sum2, 2)/n));
	// 					if(den == 0) {
	// 						temp1[2] = 0;
	// 						temp2[2] = 0;
	// 					}
	// 					else {
	// 						let r = num/den;
	// 						temp1[2] = r;
	// 						temp2[2] = r;
	// 					}
	// 					console.log('temp1: ', temp1);
	// 					console.log('temp2: ', temp2);
	// 					correlation.push(temp1);
	// 					correlation.push(temp2);
	// 				}
	// 			})
	// 	})
	// })var mysql = require('mysql');

