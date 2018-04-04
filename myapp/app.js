var express = require('express');
var mysql = require('mysql');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var crypto = require('crypto');

// router.get('/app/signIn', function(req, res, next) )
app.use(bodyParser.json());
app.use(cookieParser('sessiontest'));
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
			res.json('error in select');
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

app.post('/app/answer', function(req, res) {
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
	})
	connection.end();

})
// //返回问卷
// app.get('/app/getQues', function (req, res, next) {
// 	// console.log('')
// 	var connection = mysql.createConnection({
// 		host: 'localhost',
// 		user: 'root',
// 		password: 'lijinlong',
// 		database: 'roommate'
// 	});
// 	connection.connect();

// 	var titlesql = 'SELECT title FROM question';
// 	connection.query(titlesql, function(err, result) {
// 		if(err) {
// 			console.log('err: ', err);
// 			return;
// 		}
// 		console.log('result: ', result);
// 		var choicesql = 'SELECT ques_id, choice FROM choices';
// 	})

// })

var server = app.listen(8080, '0.0.0.0', function() {
	console.log('server.address(): ', server.address());
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at htp://%s:%s', host, port);
});