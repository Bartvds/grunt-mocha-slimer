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
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/**/*.js'
			]
		},
		mocha_slimer: {
			test: {
				options: {
					xvfb: !!process.env.TRAVIS,
					reporter: 'mocha-unfunk-reporter',
					timeout: 10000,
					run: true
				},
				src: ['test/*.html']
			}
		}
	});

	grunt.registerTask('test', [
		'clean',
		// 'jshint',
		'mocha_slimer'
	]);
	grunt.registerTask('default', ['test']);
	grunt.registerTask('dev', ['mocha']);
};
