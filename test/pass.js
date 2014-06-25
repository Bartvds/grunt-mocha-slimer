'use strict';

chai.config.includeStack = true;

var assert = chai.assert;

describe('pass', function() {

	it('works', function() {
		console.log('work plz?');
		console.log({a:123, b:23});
		assert.isTrue(true);
	});

	it('this also works', function(done) {
		assert.isTrue(true);

		setTimeout(function() {
			done();
		}, 50);
	});
});
