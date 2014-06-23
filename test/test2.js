console.log('let\'s rock!');

chai.config.includeStack = true;

var assert = chai.assert;

describe('slimer', function() {

	it('works', function() {
		console.log('booya!');
		assert.isTrue(true);
	})

	it('fails', function() {
		console.log('nooo!');
		assert.isTrue(false);
	})

	it.skip('skips', function() {
		console.log('nooo!');
		assert.isTrue(false);
	})
});
