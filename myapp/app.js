var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var crypto = require('crypto');
//图片上传
var formidable = require('formidable');
// //主页面Tab路由
// var main = require('./mainTab');
// app.use('/app', main);

// router.get('/app/signIn', function(req, res, next) )
app.use(bodyParser.json());
app.use(cookieParser('sessiontest'));
app.use(express.static('public'));

//跨域
app.use('*', function (req, res, next) {
	// res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  	res.header("X-Powered-By",' 3.2.1')
  	res.header("Content-Type", "application/json;charset=utf-8");
  	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  	next();
})

app.use(session({
	secret: 'sessiontest', //需要跟cookieParser一样
	resave: false,
	saveUninitialized: true,
	cookie: {maxAge: 12 * 36 * 60 * 60 * 1000}
}));

function md5(text) {
	console.log('text: ', text);
	return crypto.createHash('md5').update(text).digest('hex');
}

app.get('/app/signIn', function(req, res) {
	console.log('req.url: ', req.url);
	res.json({ user: 'tobi' }); 
	// res.send('Hello World');
});

app.post('/app/signIn', function(req, res) {
	console.log('req.url: ', req.url);
	console.log('req.body', req.body);
	let name = req.body.name;
	let password = md5(req.body.password);
	
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();
	var sql = 'SELECT * FROM user_info WHERE name = ? AND password = ?';
	var sqlParams = [name, password];
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('select err: ', err);
			res.json('Error');
			return;
		}
		console.log('select result: ', result);
		// console.log('user.info: ', result[0].name);
		//验证通过
		if(result && result.length != 0) {
			//获取用户id
			var user = {
				name: result[0].name,
				uid:result[0].uid,
				// finished: false,
			}
			var queSql = 'SELECT * FROM ques_result WHERE uid = ?';
			var queParam = user.uid;
			console.log('queParam: ', queParam);
			connection.query(queSql, queParam, function(err, result1) {
				if(err) {
					console.log('ques_result err: ', err);
					return;
				}
				console.log('result1: ', result1);
				//该用户已完成问卷
				if(result1 && result1.length != 0) {
					console.log('This guy finished');
					user.finished = true;
					result[0].finished = true;
				}
				req.session.user = user;
				console.log('req.session: ', req.session);
				// result.finished
				console.log('result: ', result);
				res.json(result);
				
			})
		}
		//验证不通过
		else
			res.json(result);
		connection.end();
	})
	// res.send('Hello World');
});

app.post('/app/logout', function (req, res, next) {
	req.session.destroy(function(err) {
		if(err) {
			res.json('Error');
			return;
		}

		res.clearCookie();
		res.json('Success');
	})
})

app.get('/app/check', function (req, res, next) {
	// console.log('Welcome to /');
	// res.json({hello: 'zhouoyi'});
	console.log('req.session in main: ', req.session);
	var sess = req.session;
	var user = sess.user;
	var isLogin = !!user;
	console.log('sess: ', sess);
	console.log('user: ', user);
	console.log('isLogin: ', isLogin);

	// res.json(req.session.user);

	// if(req.session.user) {
	//登陆状态未过期
	if(isLogin) {
		var user = req.session.user;
		var name = user.name;
		var uid = user.uid;
		console.log('uid: ', uid);

		var connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'lijinlong',
			database: 'roommate'
		});
		connection.connect();
		var queSql = 'SELECT * FROM ques_result WHERE uid = ?';
		var queParam = user.uid;
		console.log('queParam: ', queParam);
		connection.query(queSql, queParam, function(err, result) {
			if(err) {
				console.log('ques_result err: ', err);
				res.json('check err');
				return;
			}
			console.log('check result: ', result);
			//该用户已完成问卷
			if(result && result.length != 0) {
				console.log('This guy finished');
				req.session.user.finished = true;
				console.log('req.session after check: ', req.session);
			}
			res.json(req.session.user);
		})
		connection.end();
	}
	//登录状态过期
	else {
		res.json('UnLogin');
	}
})

app.get('/app/answer', function(req, res) {
	res.send('Hello');
})

//将问卷结果插入数据库
app.post('/app/answer', function(req, res, next) {
	console.log('req.url: ', req.url);
	console.log('req.body: ', req.body);
	let uid = req.body.uid;
	let answers = req.body.answer;
	// console.log('answers: ', answers);
	// console.log('JSON.stringify(req.body.answers): ', JSON.stringify(answers));
	console.log('answers', answers);
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	var sql = 'INSERT INTO ques_result(uid, results) VALUES (?, ?)';
	var sqlParams = [uid, JSON.stringify(answers)];
	connection.query(sql, sqlParams, function(err, rows, fields) {
		if(err) {
			console.log('err: ', err);
			res.json('error');
			return;
		}
		res.json('success');
		console.log('insert success');
		//计算该用户与其他所有已完成问卷的用户的Pearson相似度
		next();
	})
	connection.end();

}, function(req, res) {
	console.log('insertAnsert next req.body: ', req.body);
	let currentUser = req.body;
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sexSql = 'SELECT sex FROM user_info WHERE uid = ? ';
	let sexSqlParam = currentUser.uid;
	//获取当前用户性别
	connection.query(sexSql, sexSqlParam, function(err, result1) {
		if(err) {
			console.log('corsex Err: ', sex);
			res.json('Error');
			return;
		}
		console.log('sex result: ', result1);
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
			//对当前用户所有偏好求和，平方和
			currentUser.answer.map((value, key) => {
				sum1 += value;
				sum1Sq += Math.pow(value, 2);
			})
			console.log('sum1: ', sum1);
			console.log('sum1Sq: ', sum1Sq);
			let correlation = [];
			//对这些用户进行相似度计算，并插入数据库
			result2.map((value, key) => {
				console.log('key: ', key, 'value: ', value);
				//除去自身
				if(value.uid != currentUser.uid) {
					let score = JSON.parse(value.results);
					console.log('score: ', score);
					let temp1 = [];
					let temp2 = [];
					let sum2 = 0;
					let sum2Sq = 0;
					let pSum = 0;
					let n = score.length;
					temp1[0] = currentUser.uid;
					temp1[1] = value.uid;
					temp2[0] = value.uid;
					temp2[1] = currentUser.uid;
				
					//对用户所有偏好求和，以及平方和
					score.map((value, key) => {
						sum2 += value;
						sum2Sq += Math.pow(value, 2);
					})
					console.log('sum2: ', sum2);
					console.log('sum2Sq: ', sum2Sq);
					//求乘积之和
					for(let i = 0; i < n; i++) {
						pSum += score[i] * currentUser.answer[i];
					} 
					//计算Pearson相似度
					let num = pSum - (sum1 * sum2 / n);
					let den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n)*(sum2Sq - Math.pow(sum2, 2)/n));
					if(den == 0) {
						temp1[2] = 0;
						temp2[2] = 0;
					}
					else {
						let r = num/den;
						temp1[2] = r;
						temp2[2] = r;
					}
					console.log('temp1: ', temp1);
					console.log('temp2: ', temp2);
					correlation.push(temp1);
					correlation.push(temp2);
				}
			})
			//将用户之间的相似度插入数据库
			if(correlation.length > 0) {
				let corSql = 'INSERT INTO user_correlation(current_uid, rec_uid, correlation) VALUES ?';
				let corSqlParams = [correlation];
				connection.query(corSql, corSqlParams, function(err, result) {
					if(err) {
						console.log('insert correlation error');
						// res.json('Error');
						return;
					}
					console.log('insert correlation: ', result.insertId);
				})
			}
		})
	})

})

//获取用户问卷调查结果
app.post('/app/getAnswer', function(req, res) {
	let uid = req.body.uid;
	console.log('getAnswer uid: ', uid);
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	var sql = 'SELECT results FROM ques_result WHERE uid = ?';
	var sqlParams = uid;
	connection.query(sql, sqlParams, function(err, results) {
		if(err) {
			console.log('err: ', err);
			res.json('error');
			return;
		}
		console.log('getAnswer result: ', results);
		results = JSON.parse(results[0].results);
		console.log('getAnswer results: ', results);
		res.json(results);
		// console.log('insert success');
	})
	connection.end();
})

app.get('/app/getUserInfo', function(req, res) {
	console.log('Hello user');
});

app.post('/app/getUserInfo', function(req, res) {
	console.log('req.body: ', req.body);
	let uid = req.body.uid;
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	var sql = 'SELECT name, avatar, labels, signature, sex FROM user_info WHERE uid=?';
	var sqlParams = uid;
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('getuserInfo err: ', err);
			res.json('Error');
			return;
		}
		console.log('getUserInfo result: ', result);
		result[0].labels = JSON.parse(result[0].labels);
		console.log('parsed result: ', result);
		res.json(result);
	})
	connection.end();
})

app.post('/app/uploadImage', function(req, res) {
	let domain = 'http://localhost:8080';
	let AVATAR_UPLOAD_FOLDER = '/images/userAvatar/';
	let form = new formidable.IncomingForm(); //创建上传表单
	form.encoding = 'utf-8';
	form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;
	form.keepExtension = true; //保留后缀

	console.log('about to parse');
	form.parse(req, function(err, fields, files) {
		console.log('uploadImage req.session: ', req.session);
		if(err) {
			console.log('uploadImage err: ', err);
			res.json('Error');
			return;
		}
		
		console.log('uploadImage files: ', files);
		// console.log(files.upload.path);
		let avatarName = `image${req.session.user.uid}.jpg`;
		console.log('avatarName: ', avatarName);
		let newPath = form.uploadDir + avatarName;
		let showUrl = '/userAvatar/' + avatarName;
		console.log('newPath: ', newPath);
		fs.renameSync(files.files.path, newPath);
		res.json({
			'avatar': showUrl,
		})
		// fs.writeFileSync('public/images/test.png', fs.readFileSync(files.upload.path));
		// res.redirect('/public/upload.html')
	})
})

app.post('/app/modifyInfo', function(req, res) {
	console.log('modifyInfo req.body: ', req.body);
	let userInfo = req.body;
	userInfo.labels = JSON.stringify(userInfo.labels);
	let uid = req.session.user.uid;
	console.log('modifyInfo uid: ', uid);

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	var sql = 'UPDATE user_info SET name=?, avatar=?, labels=?, signature=? WHERE uid=?';
	var sqlParams = [userInfo.name, userInfo.avatar, userInfo.labels, userInfo.signature, uid];
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('modify err: ', err);
			res.json('Error');
			return;
		}
		console.log('modify result: ', result.affectedRows);
		res.json(result);
	})
	connection.end();
})

//获取用户设置的打招呼问题
app.post('/app/getSayHi', function (req, res) {
	let uid = req.body.uid;
	console.log('getSayHI uid: ', uid);

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	var sql = 'SELECT question from sayhi_ques WHERE uid=?';
	var sqlParams = uid;
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('getSayHi err: ', err);
			res.json('Error');
			return;
		}
		console.log('getSayHi result: ', result);
		// let questions = [];
		// result.map((value, key) => {
		// 	let temp = {};
		// 	temp.value = value;
		// 	temp.key = key;
		// 	questions.push(temp);
		// })
		// console.log('questions: ', questions);
		res.json(result);
	})
	connection.end();
})

//插入用户设置的打招呼问题
app.post('/app/setSayHi', function(req, res) {
	console.log('setSayHi req.body: ', req.body);
	let data = [];
	let uid = req.body.uid;
	let questions = req.body.questions;
	questions.map((value, key) => {
		let temp = [];
		temp[0] = key;
		temp[1] = uid;
		temp[2] = value.question;
		data.push(temp);
	})

	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'DELETE FROM sayhi_ques WHERE uid=?';
	let sqlParams = uid;
	//删除旧数据
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('deleteSayHi err: ', err);
			res.json('Error');
			return;
		}
		console.log('deleteSayHi result: ', result.affectedRows);
		console.log('insertparam: ', data);
		let insertSql = 'INSERT INTO sayhi_ques(sid, uid, question) VALUES ?';
		let insertSqlParams = [data];
		//插入新数据
		connection.query(insertSql, insertSqlParams, function(err, rows, fileds) {
			if(err) {
				console.log('sayhi insertErr: ', err);
				res.json('Error');
				return;
			}

			console.log('sayhi insert success');
			res.json('Success');
		})		
		// res.json(result);
	})
	// connection.end();
})

app.post('/app/getRecData', function(req, res) {
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'SELECT question FROM sayhi_rec';
	//获取推荐sayhi问题
	connection.query(sql, function(err, result) {
		if(err) {
			console.log('getSayHiRec Err: ', err);
			res.json('Error');
			return;
		}

		console.log('sayhiRec: ', result);
		res.json(result);
	})		
	connection.end();
})

app.post('/app/getRec', function(req, res) {
	console.log('req.session.user: ', req.session.user);
	let uid = req.session.user ? req.session.user.uid: null;

	if(uid) {
		var connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'lijinlong',
			database: 'roommate'
		});
		connection.connect();

		let sql = 'SELECT a.rec_uid, a.correlation, b.name, b.avatar FROM user_correlation a INNER JOIN  user_info b ON a.rec_uid = b.uid WHERE a.current_uid = ? ORDER BY correlation desc LIMIT 50';
		let sqlParams = uid;
		connection.query(sql, sqlParams, function(err, result) {
			if(err) {
				console.log('get reclist error: ', err);
				res.json('Error');
				return;
			}
			console.log('get reclist success');
			res.json(result);
		})
	}
})

//查看用户双方是否为好友
app.post('/app/friCheck', function(req, res) {
	let current_uid = req.body.current_uid;
	let fri_uid = req.body.fri_uid;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'SELECT * FROM friends WHERE current_uid = ? AND fri_id = ? ';
	let sqlParams = [current_uid, fri_uid];
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('friCheck err: ', err);
			res.json('Error');
			return;
		}
		console.log('friCheck result: ', result);
		res.json(result);
	})
	connection.end();
})

//添加动态
app.post('/app/addMoment', function(req, res) {
	console.log('addMoment req.body: ', req.body);
	let uid = req.body.uid;
	let content = req.body.content;
	// let date = req.body.date;

	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'INSERT INTO moment(mem_id, uid, content, time) VALUES (null, ?, ?, null)';
	let sqlParams = [uid, content];
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('addMoment err: ', err);
			res.json('Error');
			return;
		}
		console.log('addMoment success');
		res.json('Success');
	})
	connection.end();
})

//获取动态
app.post('/app/getMoment', function(req, res) {
	console.log('req.body: ', req.body);
	let uid = req.body.uid;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sexSql = 'SELECT sex FROM user_info WHERE uid = ? ';
	let sexSqlParam = uid;
	//获取当前用户性别
	connection.query(sexSql, sexSqlParam, function(err, result1) {
		if(err) {
			console.log('corsex Err: ', sex);
			res.json('Error');
			return;
		}
		console.log('sex result: ', result1);
		let sql = 'SELECT b.name, b.avatar, DATE_FORMAT(a.time, "%Y-%m-%d %H:%i:%s") as time, a.content, a.mem_id, a.uid FROM moment a LEFT JOIN user_info b ON a.uid = b.uid WHERE b.sex = ? ORDER BY time desc';
		let sqlParams = result1[0].sex;
		//获取所有同性用户所发的动态并按时间排序
		connection.query(sql, sqlParams, function(err, result2) {
			if(err) {
				console.log('getMoment err: ', err);
				res.json('Error');
				return;
			}
			console.log('getMoment result: ', result2);
			let likeSql = 'SELECT * FROM thumb WHERE uid = ?';
			let likeSqlParams = uid;
			connection.query(likeSql, likeSqlParams, function(err, result3) {
				if(err) {
					console.log('getlike err: ', err);
					res.json('Error');
					return;
				}
				console.log('getThumb result: ', result3);
				for(let i = 0; i < result2.length; i++) {
					result2[i].liked = false;
					for(let j = 0; j < result3.length; j++) {
						if(result2[i].mem_id == result3[j].mem_id) {
							result2[i].liked = true;
							break;
						}
					}
				}
				console.log('result2: ', result2);
				res.json(result2);
			})
			
		})
	})
})

//获取个人动态
app.post('/app/getSelfMom', function(req, res) {
	console.log('getSelfMom	req.body: ', req.body);
	let uid = req.body.uid;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'SELECT b.name, b.avatar, DATE_FORMAT(a.time, "%Y-%m-%d %H:%i:%s") as time, a.content, a.mem_id, a.uid FROM moment a LEFT JOIN user_info b ON a.uid = b.uid WHERE a.uid = ? ORDER BY time desc';
	let sqlParams = uid;
	//获取该用户所有动态并按时间排序
	connection.query(sql, sqlParams, function(err, result1) {
		if(err) {
			console.log('getSelfMom err: ', err);
			res.json('Error');
			return;
		}
		console.log('getMoment result: ', result1);
		let likeSql = 'SELECT * FROM thumb WHERE uid = ?';
		let likeSqlParams = uid;
		connection.query(likeSql, likeSqlParams, function(err, result2) {
			if(err) {
				console.log('getlike err: ', err);
				res.json('Error');
				return;
			}
			console.log('getThumb result: ', result2);
			for(let i = 0; i < result1.length; i++) {
				result1[i].liked = false;
				for(let j = 0; j < result2.length; j++) {
					if(result1[i].mem_id == result2[j].mem_id) {
						result1[i].liked = true;
						break;
					}
				}
			}
			console.log('result1: ', result1);
			res.json(result1);
		})
	})
	// connection.end();
})

//用户删除动态
app.post('/app/delMoment', function(req, res, next) {
	console.log('delMoment req.body: ', req.body);
	let mem_id = req.body.mem_id;

	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();	
	let sql = 'DELETE FROM moment WHERE mem_id = ?';
	let sqlParams = mem_id;
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('delMoment err: ', err);
			res.json('Error');
			return;
		}
		console.log('delMoment success');
		res.json('Success');
		next();
	})
	connection.end();
}, function(req, res) {
	let mem_id = req.body.mem_id;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();	
	let comSql = 'DELETE FROM comment WHERE mem_id = ?';
	let comSqlParams = mem_id;
	connection.query(comSql, comSqlParams, function(err, result) {
		if(err) {
			console.log('delComment err: ', err);
			// res.json('Error');
			return;
		}
		console.log('delComment success');
		let likeSql = 'DELETE FROM thumb WHERE mem_id = ?';
		let likeSqlParams = mem_id;
		connection.query(likeSql, likeSqlParams, function(err, result1) {
			if(err) {
				console.log('delThumb err: ', err);
				// res.json('Error');
				return;
			}
			console.log('delThumb success');
		})
		// res.json('Success');
	})
	// connection.end();
})
//用户点赞
app.post('/app/setLike', function(req, res) {
	console.log('setLike req.body: ', req.body);
	let uid = req.body.uid;
	let mem_id = req.body.mem_id;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	var sql = 'INSERT INTO thumb(uid, mem_id) VALUES (?, ?)';
	var sqlParams = [uid, mem_id];
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('setLike err: ', err);
			res.json('Error');
			return;
		}
		console.log('setLike success');
		res.json('Success');
	})
	connection.end();
})

//用户取消点赞
app.post('/app/setUnlike', function(req, res) {
	console.log('setUnlike req.body: ', req.body);
	let uid = req.body.uid;
	let mem_id = req.body.mem_id;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'DELETE FROM thumb WHERE uid = ? AND mem_id = ?';
	let sqlParams = [uid, mem_id];
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('setUnlike err: ', err);
			res.json('Error');
			return;
		}
		console.log('setUnlike success');
		res.json('Success');
	})
	connection.end();
})
//添加评论
app.post('/app/addComment', function(req, res) {
	console.log('addComment req.body: ', req.body);
	let uid = req.body.uid;
	let mem_id = req.body.mem_id;
	let content = req.body.content;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'INSERT INTO comment(mem_id, uid, time, content, com_id) VALUES (?, ?, null, ?, null)';
	let sqlParams = [mem_id, uid, content];
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('addComment err: ', err);
			res.json('Error');
			return;
		}
		console.log('addComment success');
		res.json('Success');
	})
	connection.end();
})

//获取评论
app.post('/app/getComment', function(req, res) {
	console.log('getComment req.body: ', req.body);
	let mem_id = req.body.mem_id;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'SELECT b.uid, b.name, b.avatar, DATE_FORMAT(a.time, "%Y-%m-%d %H:%i") as time, a.content FROM comment a INNER JOIN user_info b ON a.uid = b.uid WHERE a.mem_id = ? ORDER BY time desc';
	let sqlParams = mem_id;
	connection.query(sql, sqlParams, function(err, result) {
		if(err) {
			console.log('getComment err: ', err);
			res.json('Error');
			return;
		}
		console.log('getComment result: ', result);
		res.json(result);
	})
	connection.end();
})

//获取两用户之间的评分
app.post('/app/getCor', function(req, res) {
	console.log('getCor req.body: ', req.body);
	let current_uid	 = req.body.current_uid;
	let rec_uid = req.body.rec_uid;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'SELECT * FROM user_correlation WHERE current_uid	= ? AND rec_uid = ?';
	let sqlParams = [current_uid, rec_uid];
	connection.query(sql, sqlParams	, function(err, result) {
		if(err) {
			console.log('getCor err: ', err);
			res.json('Error');
			return;
		}
		console.log('getCor result: ', result);
		res.json(result);
	})
	connection.end();
})

//搜索用户
app.post('/app/searchUser', function(req, res) {
	console.log('searchUser req.body: ', req.body);
	let uid = req.body.uid;
	let name = req.body.name;
	let connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'lijinlong',
		database: 'roommate'
	});
	connection.connect();

	let sql = 'SELECT uid, name, avatar FROM user_info WHERE name = ?';
	let sqlParams = name;
	connection.query(sql, sqlParams	, function(err, result) {
		if(err) {
			console.log('searchUser err: ', err);
			res.json('Error');
			return;
		}
		console.log('searchUser result: ', result);
		//该用户不存在
		if(result && result.length == 0) {
			res.json(result);
			return;
		}
		// result.map((value, key) => {
		let corSql = 'SELECT correlation FROM user_correlation WHERE current_uid = ? AND rec_uid = ?';
		let corSqlParams = [uid, result[0].uid];
		connection.query(corSql, corSqlParams, function(err, result1) {
			if(err) {
				console.log('search correlation failed');
				res.json('Error');
				return;
			}
			console.log('search correlation result1: ', result1);
			//搜索用户尚未完成问卷
			if(result1.length == 0) {
				result[0].correlation = 'empty';
				result[0].isFriend = false;
				res.json(result);
				return;
			}
			
			result[0].correlation = result1[0].correlation;

			let friSql = 'SELECT * FROM friends WHERE current_uid = ? AND fri_id = ?';
			let friSqlParams = [uid, result[0].uid];
			connection.query(friSql, friSqlParams, function(err, result2) {
				if(err) {
					console.log('search friends failed');
					res.json('Error');
					return;
				}
				console.log('sarch friends result2: ', result2);
				//两用户为好友关系
				if(result2 && result2.length != 0) {
					result[0].isFriend = true;
				}
				else {
					result[0].isFriend = false;
				}
				console.log('result: ', result);		
				res.json(result);
			})
			
		})
	})
	// connection.end();
})

var server = app.listen(8080, '0.0.0.0', function() {
	console.log('server.address(): ', server.address());
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});