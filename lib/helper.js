'use strict';

var reporters = require('mocha').reporters;
var path = require('path');

function reduceStats (stats) {
	var initial = {
		pending : 0,
		passes : 0,
		failures : 0,
		tests : 0,
		duration : 0
	};

	var total = stats.reduce(function(prev, stats) {
		prev.passes += stats.passes;
		prev.failures += stats.failures;
		prev.pending += stats.pending;
		prev.tests += stats.tests;
		prev.duration += stats.duration;
		return prev;
	}, initial);

	return total;
}

function getReporter(option) {
	var Reporter;
	if (reporters[option]) {
		Reporter = reporters[option];
	} else {
		// Resolve external reporter module
		var externalReporter;
		try {
			externalReporter = require.resolve(option);
		} catch (e) {
			// Resolve to local path
			externalReporter = path.resolve(option);
		}

		if (externalReporter) {
			try {
				Reporter = require(externalReporter);
			}
			catch (e) {
			}
		}
	}
	return Reporter;
}

module.exports = {
	getReporter: getReporter,
	reduceStats: reduceStats
};
