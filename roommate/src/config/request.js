let common_url = 'http://192.168.253.1:8080/'; //服务器地址
let token = '';

function fetchRequest(url, method, params = '') {
	let header = {
		'Content-Type': 'application/json; charset=UTF-8',
		'accesstoken': token,
		'Host': '192.168.253.1',
	};

	console.log('request url: ', url, params);
	if(params == '') {
		return new Promise(function (resolve, reject) {
			fetch(common_url + url, {
				method: method,
				// headers: header,
				// body: JSON.stringify(params)
			}).then((response) => response.json())
			.then((responseData) => {
				console.log('res: ', url, responseData);
				resolve(responseData);
			})
			.catch((err) => {
				console.log('err: ', url, err);
				reject(err);
			});
		});
	}
	else {
		// console.log('params exist');
		return new Promise(function(resolve, reject) {
			// console.log('in promise');
			fetch(common_url + url, {
				method: method,
				headers: header,
				body: JSON.stringify(params)
			})
			.then((response) => {
				if(response.ok) {
					console.log('response: ', response); 
					return response.json();
				}
				else {
					console.log('response.status: ', response.status);
					reject('服务器繁忙，请稍后再试; \r\nCode: ', response.status);
				}
			})
			.then((responseData) => {
				console.log('res: ', url, responseData);
				resolve(responseData);
			})
			.catch((err) => {
				console.log('err: ', url, err);
				reject(err);
			});
		});
	}
}

export default fetchRequest;