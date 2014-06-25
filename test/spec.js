'use strict';

var path = require('path');
var exec = require('child_process').exec;

var chai = require('chai');
chai.config.includeStack = true;

var assert = chai.assert;


function testGrunt(test) {
	var command = [

	];
	command.push('grunt');
	command.push('--no-color');
	command.push('--gruntfile');
	command.push('Gruntfile.js');
	command.push(test.task);

	var options = {
		cwd: path.resolve(__dirname, '..')
	};

	it(test.task + ' should ' + (test.succes ? 'pass' : 'fail'), function (done) {
		exec(command.join(' '), options,
			function (error, stdout, stderr) {
				stdout = String(stdout);
				stderr = String(stderr);

				assert.ok(stdout, 'stdout');

				console.log('---');
				console.log(' | ' + stdout.split(/\r?\n/g).join('\n | '));
				console.log('---');

				if (stderr) {
					console.log(' # ' + stderr.split(/\r?\n/g).join('\n # '));
					console.log('---');
				}

				if (error !== null) {
					if (test.success) {
						assert(error.code === 0, 'expected success but got non-zero exit-code and error: ' + error);
					}
					else {
						assert(error.code !== 0, 'expected failure but got zero exit-code');
					}
				}
				else if (!test.success) {
					assert.fail('expected failure but got no error');
				}

				assert.match(stdout, test.summary, 'expected summary RegExp match');

				done();
			}
		);
	});
}

describe('main', function () {
	testGrunt({
		task: 'mocha_slimer:pass',
		success: true,
		summary: />> passed 2 of 2 tests total \(\d+ms\)/m
	});
	testGrunt({
		task: 'mocha_slimer:fail',
		success: false,
		summary: />> failed 2 and passed 1 of 4 tests total, left 1 pending \(\d+ms\)/m
	});
});
