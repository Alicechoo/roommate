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

