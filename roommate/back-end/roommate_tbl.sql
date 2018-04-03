-- DROP TABLE IF EXISTS `roommate_tbl`;

-- 用户信息
CREATE TABLE `user_info` (
	`uid` int(11) NOT NULL AUTO_INCREMENT,
	`name` char(20) NOT NULL,
	`password` char(20) NOT NULL,
	`avatar` varchar(255) NOT NULL DEFAULT '',
	`labels` varchar(255) NULL,
	`sign` text NULL,
	`rid` int(11) NOT NULL,
	PRIMARY KEY(`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 问卷相关
CREATE TABLE `question` (
	`ques_id` int(11) NOT NULL AUTO_INCREMENT,
	`title` varchar(50) NOT NULL,
	PRIMARY KEY(`ques_id`)
);

CREATE TABLE `choices` (
	`ques_id` int(11) NOT NULL AUTO_INCREMENT,
	`choice` varchar(50) NOT NULL,
	`value` int(4) NOT NULL,
	PRIMARY KEY(`ques_id`, `choice`)
);

CREATE TABLE `ques_result` (
	`uid` int(11) NOT NULL,
	`results` varchar(20) NOT NULL
);

-- 话题相关
CREATE TABLE `mement` (
	`mem_id` int(11) NOT NULL AUTO_INCREMENT,
	`uid` int(11) NOT NULL,
	`content` text NOT NULL,
	PRIMARY KEY(`mem_id`)
);

CREATE TABLE `comment` (
	`mem_id` int(11) NOT NULL,
	`uid` int(11) NOT NULL,
	`date` datetime NOT NULL,
	`content` text NOT NULL
);

CREATE TABLE `like` (
	`uid` int(11) NOT NULL,
	`mem_id` int(11) NOT NULL
);

-- 打招呼问题
CREATE TABLE `sayHi_ques` (
	`sid` int(11) NOT NULL AUTO_INCREMENT,
	`uid` int(11) NOT NULL,
	`question` varchar(50) NOT NULL,
	PRIMARY KEY(`sid`)
);

-- 房间信息
CREATE TABLE `room` (
	`rid` int(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(`rid`)
);

CREATE TABLE `friends` (
	`fid` int(11) NOT NULL AUTO_INCREMENT,
	`fri_id` int(11) NOT NULL,
	`uid` int(11) NOT NULL,
	`fri_name` varchar(15) NULL,
	PRIMARY KEY(`fid`)
);

CREATE TABLE `message` (
	`mid` int(11) NOT NULL AUTO_INCREMENT,
	`message` text NOT NULL,
	`status` bit NOT NULL,
	`time` datetime NOT NULL,
	`from_uid` int(11) NOT NULL,
	`to_uid` int(11) NOT NULL,
	PRIMARY KEY(`mid`)
);



