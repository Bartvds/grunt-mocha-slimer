var params = JSON.parse(phantom.args[0]);
var inject = require('./inject');
var webpage = require('webpage');

var messageScan = '["' + params.key + '",';
var messageScanL = messageScan.length;

var queue = params.tests.slice(0);

function getURL(test) {
	if (/^https?:\/\//.test(test)) {
		return test;
	}
	return 'file:///' + test.replace(/\\/g, '/');
}

function sendMessage(type, content) {
	type = type || 'log';
	console.log(JSON.stringify([params.key, type, content]));
}


var bridge = {
	log: function (content) {
		sendMessage('log', content);
	},
	error: function (content) {
		sendMessage('error', content || '<unknown>');
	},
	exit: function (code, reason) {
		sendMessage('exit', {code: code, reason: reason || '<unknown>'});
		// slimer doesn't support real exit-codes
		phantom.exit();
	}
};

var timeout = setTimeout(function () {
	bridge.exit(2, 'timeout');
}, params.timeout);


phantom.onError = function (msg, stack) {
	var msg = '\nScript Error: ' + msg + '\n';
	if (stack && stack.length) {
		msg += '       Stack:\n';
		stack.forEach(function (t) {
			msg += '         -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function + ')' : '') + '\n';
		});
	}
	bridge.error(msg);
	bridge.exit(2);
};

function step() {
	if (queue.length === 0) {
		// give it a breather or it crashes
		setTimeout(function () {
			bridge.exit(0, 'done');
		}, 10);
		return;
	}
	var url = getURL(queue.shift());

	bridge.log('Testing ' + url);

	var page = webpage.create();

	page.onError = function (err) {
		bridge.error(err);
	};

	page.onConsoleMessage = function (message) {
		if (String(message).substr(0, messageScanL) === messageScan) {
			var data = JSON.parse(message);
			if (data.length === 3 && data[1] === 'mocha' && data[2] && data[2].type === 'end') {
				console.log(message);
				step();
			}
			else {
				console.log(message);
			}
		}
		else {
			bridge.log(message);
		}
	};

	page.open(url, function (status) {
		if (status !== 'success') {
			bridge.exit(1, 'could not open: ' + url);
		}
		page.evaluate(inject, params.key, params.options);
	});
}

step();
