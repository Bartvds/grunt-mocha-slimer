'use strict';

chai.config.includeStack = true;

var assert = chai.assert;

describe('fail', function() {

	it('works 2', function() {
		assert.isTrue(true);
	});

	it('fails sync', function() {
		assert.isTrue(false);
	});

	it('fails async', function(done) {
		setTimeout(function() {
			assert.isTrue(false);

			done();
		}, 50);
	});

	it.skip('skips', function() {
		console.log('nooo!');
		assert.isTrue(false);
	});
});
