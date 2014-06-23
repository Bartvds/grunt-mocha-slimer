# grunt-mocha-slimer

> Grunt [plugin](http://gruntjs.com/) to run [Mocha](https://visionmedia.github.io/mocha/) tests in a (nearly) headless Gecko browser via [Slimerjs](http://slimerjs.org/)

[![Build Status](https://secure.travis-ci.org/Bartvds/grunt-mocha-slimer.svg?branch=master)](http://travis-ci.org/Bartvds/grunt-mocha-slimer) [![NPM version](https://badge.fury.io/js/grunt-mocha-slimer.svg)](http://badge.fury.io/js/grunt-mocha-slimer) [![Dependency Status](https://david-dm.org/Bartvds/grunt-mocha-slimer.svg)](https://david-dm.org/Bartvds/grunt-mocha-slimer) [![devDependency Status](https://david-dm.org/Bartvds/grunt-mocha-slimer/dev-status.svg)](https://david-dm.org/Bartvds/grunt-mocha-slimer#info=devDependencies)

Build on [slimerjs](https://github.com/graingert/slimerjs) npm modules.

Some parts sourced from [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) by @kmiyashiro.

:warning: Very early version, user beware.


## Getting Started

This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
$ npm install grunt-mocha-slimer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mocha-slimer');
```


## The "grunt-mocha-slimer" task

### Default Options

All options are passed directly to [mocha-slimerjs](https://github.com/Bartvds/mocha-slimerjs)

```js
grunt.initConfig({
	mocha_slimerjs: {
		all: {
			options: {
				ui: 'bdd'
				reporter: 'Spec'
			},
			src: ['test/index.html']
		}
	}
});
```

## History

* 0.0.1 - Dev release


## Contributing

Contributions are very welcome, please create an Issue before doing something major.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## License

Copyright (c) 2014 [Bart van der Schoor](https://github.com/Bartvds)

Licensed under the MIT license.

Various snippets copied from [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) by Kelly Miyashiro

