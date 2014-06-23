module.exports = function (messageKey, options) {
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
};
