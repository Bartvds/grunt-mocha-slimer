'use strict';

/* jshint -W098 */
/* jshint -W035 */

var path = require('path');
var events = require('events');
var crypto = require('crypto');
var childProcess = require('child_process');
var lineInputStream = require('line-input-stream');
var slimerjs = require('slimerjs');
var binPath = slimerjs.path;

function create(params) {
	var bridge = new events.EventEmitter();

	// bake unique key to filter messages from stdout
	var messageKey = crypto.createHash('md5')
		.update('magic' + Date.now() + '|' + Math.random())
		.digest('hex');

	var messageScan = '["' + messageKey + '",';
	var messageScanL = messageScan.length;

	params.key = messageKey;

	var spawnOpts = {
		cwd: process.cwd(),
		stdio: ['ignore', 'pipe', 'pipe']
	};

	var args = [];
	args.push(path.resolve(__dirname, '..', 'slimer', 'main.js'));
	args.push(JSON.stringify(params));

	var cp;

	if (params.xvfb) {
		args.unshift(binPath);
		cp = childProcess.spawn('xvfb-run', args, spawnOpts);
	}
	else {
		cp = childProcess.spawn(binPath, args, spawnOpts);
	}

	var stream;
	// parse console by lines
	stream = lineInputStream(cp.stdout).on('line', function (line) {
		if (line.substr(0, messageScanL) === messageScan) {
			var data;
			try {
				data = JSON.parse(line);
			}
			catch (e) {
				bridge.emit('error', e);
				return;
			}

			if (data.length < 3 || data.length > 4) {
				bridge.emit('error', new Error('bad message length ' + data.length));
			}
			data.shift();

			var type = data[0];

			switch (type) {
				case 'mocha':
				case 'error':
				case 'exit':
					bridge.emit(type, data[1]);
					break;
				default:
					bridge.emit('log', data[1]);
			}
		}
		else {
			bridge.emit('log', line);
		}
	});
	stream.setEncoding('utf8');

	stream = lineInputStream(cp.stderr).on('line', function (line) {
		bridge.emit('error', line);
	});
	stream.setEncoding('utf8');

	// exit code is always null as slimer doesn't support it
	cp.on('exit', function () {
		bridge.emit('close');
	});

	return bridge;
}


module.exports = {
	create: create
};
