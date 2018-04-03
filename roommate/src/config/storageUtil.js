import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';

var storage = new Storage({
	size: 100,
	//存储引擎
	storageBackend: AsyncStorage,

	defaultExpires: 14 * 24 * 60 * 60 * 1000,
	enableCache: true,
})

global.storage = storage;
export default global.storage;