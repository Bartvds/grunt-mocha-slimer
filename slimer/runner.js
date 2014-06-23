var params = JSON.parse(phantom.args[0]);

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
		sendMessage('exit', reason || '<unknown>');
		phantom.exit(code);
	}
}

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

var page = require('webpage').create();

page.onError = function (arguments) {
	bridge.log('onError');
	bridge.error(arguments);
};


function getURL(test) {
	if (/^https?:\/\//.test(test)) {
		return test;
	}
	return 'file:///' + test.replace(/\\/g, '/');
}

var url = getURL(params.tests[0]);

bridge.log(url);

page.open(url, function (status) {
	if (status !== 'success') {
		bridge.exit(1, 'could not open: ' + url);
	}

	page.evaluate(function (messageKey, options) {
		function sendMessage(type, content) {
			console.log(JSON.stringify([messageKey, type, content]));
		}

		sendMessage('log', 'hi from ' + window.location.href);

		var mochaInstance = window.Mocha || window.mocha;
		var Reporter = function (runner) {
			if (!mochaInstance) {
				throw new Error('Mocha was not found, make sure you include Mocha in your HTML spec file.');
			}

			// Setup HTML reporter to output data on the screen
			mochaInstance.reporters.HTML.call(this, runner);

			[
				'start',
				'test',
				'test end',
				'suite',
				'suite end',
				'fail',
				'pass',
				'pending',
				'end'
			].forEach(function(type) {
				runner.on(type, function (test, err) {
					var data = {
						err: err
					};

					if (test) {
						data.title = test.title;
						data.fullTitle = test.fullTitle();
						data.state = test.state;
						data.duration = test.duration;
						data.slow = test.slow;
					}

					sendMessage('mocha', {type: type, data: data});
				});
			});
		};
		var Klass = function () {};
		Klass.prototype = mochaInstance.reporters.HTML.prototype;
		Reporter.prototype = new Klass();

		// Default mocha options
		var config = {
			ui: 'bdd',
			ignoreLeaks: true,
			reporter: Reporter
		};
		if (options) {
			// If options is a string, assume it is to set the UI (bdd/tdd etc)
			if (typeof options === "string") {
				config.ui = options;
			} else {
				// Extend defaults with passed options
				for (key in options.mocha) {
					config[key] = options.mocha[key];
				}
			}
		}

		sendMessage('log', config);

		mocha.setup(config);
		mocha.run();

	}, params.key, params.options);
});

var messageScan = '["' + params.key + '",';
var messageScanL = messageScan.length;

page.onConsoleMessage = function (message) {
	if (String(message).substr(0, messageScanL) === messageScan) {
		var data = JSON.parse(message);
		if (data.length === 3 && data[1] === 'mocha' && data[2].type === 'end') {
			console.log(message);
			bridge.exit(1, 'mocha-end');
		}
		else {
			console.log(message);
		}
	}
	else {
		bridge.log(message);
	}
};
