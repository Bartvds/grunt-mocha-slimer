# grunt-mocha-slimer

> Grunt [plugin](http://gruntjs.com/) to run [Mocha](http://mochajs.org/) tests in a (nearly) headless Mozilla Firefox browser-engine via [SlimerJS](http://slimerjs.org/)

[![Build Status](https://secure.travis-ci.org/Bartvds/grunt-mocha-slimer.svg?branch=master)](http://travis-ci.org/Bartvds/grunt-mocha-slimer) [![NPM version](https://badge.fury.io/js/grunt-mocha-slimer.svg)](http://badge.fury.io/js/grunt-mocha-slimer) [![Dependency Status](https://david-dm.org/Bartvds/grunt-mocha-slimer.svg)](https://david-dm.org/Bartvds/grunt-mocha-slimer) [![devDependency Status](https://david-dm.org/Bartvds/grunt-mocha-slimer/dev-status.svg)](https://david-dm.org/Bartvds/grunt-mocha-slimer#info=devDependencies)

Run your [Mocha](http://mochajs.org/) browser tests in SlimerJS's [npm wrapper](https://github.com/graingert/slimerjs) with all the regular reporters.

Some internal parts sourced from [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) by @kmiyashiro. 


:warning: Very early version, user beware.

## Known issues

- no error messages in async errors
- stack traces missing
- needs a lot more real-world use
- needs write-to-file support for some reporters


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

For an example html see the [./test folder](https://github.com/Bartvds/grunt-mocha-slimer/tree/master/test).

### Basic options

```js
grunt.initConfig({
	mocha_slimerjs: {
		all: {
			options: {
				ui: 'bdd'
				reporter: 'Spec'
				run: true,
			},
			src: ['test/index.html']
		}
	}
});
```

### Advanced options

```js
grunt.initConfig({
	mocha_slimerjs: {
		all: {
			options: {
				ui: 'bdd'
				reporter: 'Spec'
				grep: 'some keyword'
				// SlimerJS timeout
				timeout: 10000,
				// set to false and call it later for async tests (AMD etc)
				run: false,
				// run SlimerJS via 'xvfb-run': for true headless testing
				// must be true on Travis-CI, use: (process.env.TRAVIS === 'true')
				xvfb: true,
				// pass http urls (use grunt-contrib-connect etc)
				urls: ['http://localhost:8080/test/index.html']
			}
		}
	}
});
```

Better docs at a later date.


## Why not a PhantomJS based grunt + mocha?

- SlimerJS uses Firefox/XulRunner (Gecko) so it's something different PhantomJS' Webkit (V8).
- PhantomJS uses an ancient Webkit version that is missing some modern features, like Uint8ClampedArray, Float64Array etc. You need this to test interesting `canvas` libraries on a generic node.js based CI like Travis.
- SlimerJS could enable supports addons and user-profiles (let me know if there is a use-case).
- `grunt-mocha-slimer` seems slightly faster then `grunt-mocha` as all tests are in one process (not sure why grunt-mocha doesn't do that, we'll see).
- This modules streams test- and log data over SlimerJS' stdout for snappy feedback.


## Why the flashing windows?

This is the nature of SlimerJS and the engine it runs, as . On Linux and OSX SlimerJS has support for `xvfb` if you have it installed. For more info see the [SlimerJS documentantion](http://docs.slimerjs.org/current/installation.html#having-a-headless-slimerjs).

You can enable this by setting `xvfb: true` (you need this for Travis-CI, see below).


## Is this ready to use?

Wisdom says no, adventure and necessity say.. give it a  try. It is the simplest way to do all the mocha-flavoured things you cannot do in PhantomJS's crappy archaic Webkit.

I needed it for some OSS projects and it seems to work (well, at least it properly fails if assertions fail).


## Future

Probably

- loot some more features from grunt-mocha
    - growl support
    - output-to-file (for XUnit etc)
- support more SlimerJS commandline parameters?
    - user profile handling?
    - proxy support?
- extract mocha/slimer runner to own module 
 
Maybe

- expose screenshot feature?
- expose a file-io stream (to dump debug data to disk)?
- auto-inject mocha JS & CSS?
- support direct JS tests without html?
- auto-enable xvfb on known CI's?

Out-of-scope:

- WebDriver support (use CasperJS)


## History

* 0.0.x - Early releases.


## Contributing

Contributions are very welcome, please create an Issue before doing something major.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## License

Copyright (c) 2014 [Bart van der Schoor](https://github.com/Bartvds)

Licensed under the MIT license.

Various snippets copy/hacked from [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) by [Kelly Miyashiro](https://github.com/kmiyashiro).

