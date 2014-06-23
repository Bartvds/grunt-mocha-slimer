/*
 * grunt-export-mocha-slimerjs
 * https://github.com/grunt-ts/grunt-export-mocha-slimerjs
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.loadTasks('tasks');

	grunt.initConfig({
		jshint: {
			options: grunt.util._.extend(grunt.file.readJSON('.jshintrc'), {
				reporter: './node_modules/jshint-path-reporter'
			}),
			all: [
				'Gruntfile.js',
				'slimer/**/*.js',
				'lib/**/*.js',
				'tasks/**/*.js',
				'test/**/*.js'
			]
		},
		mochaTest: {
			options: {
				reporter: 'mocha-unfunk-reporter',
				timeout: 20000
			},
			spec: {
				src: ['test/spec.js']
			}
		},
		mocha_slimer: {
			options: {
				xvfb: (process.env.TRAVIS === 'true'),
				reporter: 'Dot',
				timeout: 5000,
				run: true
			},
			all: {
				options: {
					reporter: 'mocha-unfunk-reporter'
				},
				src: ['test/*.html']
			},
			pass: {
				src: ['test/pass.html']
			},
			fail: {
				src: ['test/fail.html']
			}
		}
	});

	grunt.registerTask('lint', [
		'jshint'
	]);

	grunt.registerTask('test', [
		'lint',
		'mochaTest'
	]);

	grunt.registerTask('default', ['dev']);

	grunt.registerTask('dev', [
		'lint',
		'mocha_slimer'
	]);
};
