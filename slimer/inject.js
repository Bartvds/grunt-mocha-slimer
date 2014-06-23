// this function gets called in the context of the tst html page
// all values need to be passed in, no closures allowed

module.exports = function (messageKey, options) {
	'use strict';

	function sendMessage(type, content) {
		console.log(JSON.stringify([messageKey, type, content]));
	}

	var mochaInstance = window.Mocha || window.mocha;
	var Reporter = function (runner) {
		if (!mochaInstance) {
			throw new Error('Mocha was not found, make sure you include Mocha in your HTML spec file.');
		}

		mochaInstance.reporters.HTML.call(this, runner);

		// listen for mocha events
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

					if (type === 'end') {
						data.stats = runner.stats;
					}

					sendMessage('mocha', {type: type, data: data});
				});
			});
	};
	// setup customized HTML reporter
	var Klass = function () {};
	Klass.prototype = mochaInstance.reporters.HTML.prototype;
	Reporter.prototype = new Klass();

	// config for mocha
	var config = {
		ui: 'bdd',
		ignoreLeaks: true
	};
	if (options) {
		if (typeof options === 'string') {
			config.ui = options;
		} else {
			Object.keys(options.mocha).forEach(function(key) {
				config[key] = options.mocha[key];
			});
		}
	}
	// make sure we use this
	config.reporter = Reporter;

	mocha.setup(config);

	if (options.run) {
		mocha.run();
	}
};
