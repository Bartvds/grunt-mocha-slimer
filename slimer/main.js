/* global phantom */
/* global alert */
/* jshint -W014 */
/* jshint -W098 */

'use strict';

var params = JSON.parse(phantom.args[0]);
var inject = require('./inject');
var webpage = require('webpage');
var system = require('system');

var queue = params.tests.slice(0);

function getURL(test) {
	if (/^https?:\/\//.test(test)) {
		return test;
	}
	return 'file:///' + test.replace(/\\/g, '/');
}
var num = 0;

function sendMessage(type, content) {
	type = type || 'log';
	system.stdout.writeLine(JSON.stringify([params.key, type,  content, ++num]));
}

var messageScan = '["' + params.key + '",';
var messageScanL = messageScan.length;

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
var timeout;
function resetTimeout() {
	if (timeout) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(function () {
		bridge.exit(2, 'timeout');
	}, params.timeout);
}

resetTimeout();

// TODO properly pass this through (rebuild as fake Error?)
phantom.onError = function (msg, stack) {
	msg = '\nScript Error: ' + msg + '\n';
	if (stack && stack.length) {
		msg += '       Stack:\n';
		stack.forEach(function (t) {
			msg += '         -> '
				+ (t.file || t.sourceURL) + ': '
				+ t.line
				+ (t.function ? ' (in function '
				+ t.function + ')' : '')
				+ '\n';
		});
	}
	bridge.error(msg);
	bridge.exit(2);
};

var page = webpage.create();

function runSuite() {
	if (queue.length === 0) {
		bridge.exit(0, 'done');
		return;
	}

	resetTimeout();

	var url = getURL(queue.shift());
	var isInit = false;

	bridge.log('testing ' + url);

	page.onInitialized = function () {
		if(isInit) {
			return;
		}
		page.evaluate(function() {
			document.addEventListener('DOMContentLoaded', function () {
				alert('inject');
			}, false);
		});
	};

	page.open(url, function (status) {
		if (status !== 'success') {
			bridge.exit(1, 'could not open: ' + url);
		}
		else {
			page.evaluate(inject, params.key, params.options);
		}
	});
}
page.onError = function (err) {
	bridge.error(err);
};

page.onConsoleMessage = function (message) {
	bridge.log(message);
};

page.onAlert = function (message) {
	if (String(message).substr(0, messageScanL) === messageScan) {
		system.stdout.writeLine(message);

		var data = JSON.parse(message);
		if (data.length === 3 && data[1] === 'mocha' && data[2] && data[2].type === 'end') {
			// try next suite
			page.close();
			runSuite();
		}
	}
};

// ok let's go
runSuite();
