chai.config.includeStack = true;

var assert = chai.assert;

describe('pass', function() {

	it('works', function() {
		assert.isTrue(true);
	})

	it('this also works', function(done) {
		assert.isTrue(true);

		setTimeout(function() {
			done();
		}, 50);
	})
});
