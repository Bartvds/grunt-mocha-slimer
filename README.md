# grunt-mocha-slimer

> Grunt [plugin](http://gruntjs.com/) to run [Mocha](https://visionmedia.github.io/mocha/) tests in a (nearly) headless Gecko browser via [SlimerJS](http://slimerjs.org/)

[![Build Status](https://secure.travis-ci.org/Bartvds/grunt-mocha-slimer.svg?branch=master)](http://travis-ci.org/Bartvds/grunt-mocha-slimer) [![NPM version](https://badge.fury.io/js/grunt-mocha-slimer.svg)](http://badge.fury.io/js/grunt-mocha-slimer) [![Dependency Status](https://david-dm.org/Bartvds/grunt-mocha-slimer.svg)](https://david-dm.org/Bartvds/grunt-mocha-slimer) [![devDependency Status](https://david-dm.org/Bartvds/grunt-mocha-slimer/dev-status.svg)](https://david-dm.org/Bartvds/grunt-mocha-slimer#info=devDependencies)

Build on [SlimerJS](https://github.com/graingert/slimerjs) npm module, some parts sourced from [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) by @kmiyashiro.


:warning: Very early version, user beware.


## Missing/borken

- error messages in async errors
- stack traces missing
- real-world use


## Wish-list

- support for `xvfb` command for Travis etc
- support some commandline parameters
    - user profile handling
    - proxy etc
    -many more
- loot some more features from grunt-mocha
- expose screenshot feature?
- expose a file-io stream (to dump debug data to disk)?


## Why this and not a PhantomJS based grunt + mocha?

- SlimerJS uses Gecko so it's another flavour browser engine
- Seems slightly faster as all tests are run in one process (not sure why grunt-mocha doesn't do that, we'll see).
- PhantomJS uses an ancient Webkit version that is missing some modern features, like Uint8ClampedArray, Float64Array etc.
- SlimerJS supports add-ons and user-profiles (could be added here hf thee is a use-case)
- This modules streams tests and log data over stdout for faster feedback.

## I see flashing windows.

This is the nature of SlimerJS and the engine it runs. At some point this moduile will support the `xvfb` wrapper for Linux and OSX. For more info see the [SlimerJS documentantion](http://docs.slimerjs.org/current/installation.html#having-a-headless-slimerjs).

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

### Options


```js
grunt.initConfig({
	mocha_slimerjs: {
		all: {
			options: {
				ui: 'bdd'
				reporter: 'Spec'
				run: true,
				urls: []
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

