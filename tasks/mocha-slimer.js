module.exports = function (grunt) {
	'use strict';

	var path = require('path');
	var events = require('events');
	var brigdeMod = require('../lib/bridge');
	var reporters = require('mocha').reporters;

	grunt.registerMultiTask('mocha_slimer', 'Run mocha in slimerjs', function () {
		var options = this.options({
			urls: [],
			timeout: 10000,
			ui: 'bdd',
			mocha: {},
			reporter: 'Spec'
		});
		var done = this.async();

		var params = {
			timeout: options.timeout,
			cwd: process.cwd(),
			tests: this.filesSrc.reduce(function(memo, src) {
				if (/^https?:\/\//.test(src)) {
					memo.push(src);
				}
				memo.push(path.resolve(process.cwd(), src));
				return memo;
			}, options.urls),
			options: {
				ui: options.ui,
				mocha: options.mocha
			}
		};

		function multi(data, sep) {
			if (typeof data !== 'string') {
				return data;
			}
			return sep + String(data).split(/\r?\n/g).join('\n' + sep);
		}

		var runner = new events.EventEmitter();

		var Reporter = null;
		if (reporters[options.reporter]) {
			Reporter = reporters[options.reporter];
		} else {
			// Resolve external reporter module
			var externalReporter;
			try {
				externalReporter = require.resolve(options.reporter);
			} catch (e) {
				// Resolve to local path
				externalReporter = path.resolve(options.reporter);
			}

			if (externalReporter) {
				try {
					Reporter = require(externalReporter);
				}
				catch (e) { }
			}
		}
		if (Reporter === null) {
			grunt.fatal('Specified reporter is unknown or unresolvable: ' + options.reporter);
		}
		var reporter = new Reporter(runner);

		var bridge = brigdeMod.create(params);

		bridge.on('log', function (data) {
			console.log(multi(data, '> '));
		});

		bridge.on('error', function (error) {
			console.error(multi(error, '! '));
		});

		var suites = [];

		bridge.on('mocha', function (ev) {
			var fullTitle, slow;

			if (ev.type === 'end') {
				// whut?
			}

			var test = ev.data;

			// Expand test values (and façace the Mocha test object)
			if (test) {
				fullTitle = test.fullTitle;
				test.fullTitle = function() {
					return fullTitle;
				};

				slow = this.slow;
				test.slow = function() {
					return slow;
				};

				test.parent = suites[suites.length - 1] || null;
			}

			if (ev.type === 'suite') {
				suites.push(test);
			}
			else if (ev.type === 'suite end') {
				suites.pop();
			}

			runner.emit(ev.type, test, (test ? test.err : null));
		});

		bridge.on('exit', function (reason) {
			console.log(multi(reason, '>> '));
		});

		bridge.on('close', function (status) {
			if (status.code !== 0) {
				grunt.log.warn('slimer exited with code ' + status.code);
				done(false);
			}
			else {
				done();
			}
		});
	});
};
