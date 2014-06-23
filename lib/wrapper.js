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
	var messageKey = crypto.createHash('md5').update('magic' + Date.now() + '|' + Math.random()).digest('hex').substr(0, 16);
	var messageScan = '["' + messageKey + '",';
	var messageScanL = messageScan.length;

	params.key = messageKey;

	var args = [];
	args.push(path.resolve(__dirname, '..', 'slimer', 'main.js'));
	args.push(JSON.stringify(params));

	var opts = {
		cwd: process.cwd()
	};

	var cp = childProcess.spawn(binPath, args, opts);

	lineInputStream(cp.stdout).on('line', function (line) {
		if (line.substr(0, messageScanL) === messageScan) {
			try {
				var data = JSON.parse(line);
			}
			catch (e) {
				bridge.emit('error', e);
			}

			if (data.length !== 3) {
				bridge.emit('error', new Error('bad message length ' + data.length));
			}
			data.shift();

			var type = data[0];

			switch (type) {
				case 'error':
				case 'mocha':
				case 'exit':
					bridge.emit(type, data[1]);
					break;
				case 'log':
				default:
					bridge.emit('log', data[1]);
			}
		}
		else {
			bridge.emit('log', line);
		}
	});

	lineInputStream(cp.stderr).on('line', function (line) {
		bridge.emit('error', line);
	});

	// exit code is always null as slimer doesn't support it
	cp.on('exit', function () {
		bridge.emit('close');
	});

	return bridge
}


module.exports = {
	create: create
};
