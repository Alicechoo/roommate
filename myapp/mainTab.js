var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now());
	next();
});

router.post('/getRec', function(req, res) {
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

		let sql = 'SELECT a.rec_uid, a.correlation, b.name, b.avatar FROM user_correlation a INNER JOIN  user_info b ON a.rec_uid = b.uid WHERE a.current_uid = ? ORDER BY correlation DECS LIMIT 50';
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