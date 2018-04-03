var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'lijinlong',
	database: 'roommate'
});


connection.connect();

var sql = 'SELECT * FROM user_info WHERE name="zhouyi" AND password="123"';
connection.query(sql, function(err, result) {
	if(err) {
		console.log('err: ', err.message);
		return;
	}

	console.log('Login in succeed');
});

connection.end();
