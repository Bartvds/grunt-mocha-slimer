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
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.loadTasks('tasks');

	grunt.initConfig({
		clean: {
			test: ['./test/tmp']
		},
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
		mocha_slimer: {
			options: {
				xvfb: !!process.env.TRAVIS,
				reporter: 'mocha-unfunk-reporter',
				timeout: 10000,
				run: true
			},
			all: {
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
		'clean',
		'jshint',
		'mocha_slimer'
	]);
	grunt.registerTask('default', ['test']);
	grunt.registerTask('dev', ['mocha']);
};
