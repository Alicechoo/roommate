// import storage from './storageUtil.js';

global.user = {
	loginState: null,
	userData: null,
	userSocket: null,
};

function getUid(store) {
	console.log('store: ', store);
	store.load({
		key: 'loginState',
	}).then(ret => {
		//找到数据
		console.log('ret: ', ret);
		global.user.loginState = true;
		global.user.userData = ret;
		return global.user.userData.uid;
	}).catch(err => {
		//没有找到数据且无Sync方法
		global.user.loginState = false;
		global.user.userData = '';
		console.log('err: ', err);
		return null;
	})
}

global.getUid = getUid;