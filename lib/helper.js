function reduceStats (stats) {
	var initial = {
		pending : 0,
		passes : 0,
		failures : 0,
		tests : 0,
		duration : 0
	};

	var total = stats.reduce(function(prev, stats, i, list) {
		prev.passes += stats.passes;
		prev.failures += stats.failures;
		prev.pending += stats.pending;
		prev.tests += stats.tests;
		prev.duration += stats.duration;
		return prev;
	}, initial);

	// total.duration = this.formatMs(total.duration);

	return total;
}

function formatMs (ms) {
	return (Math.ceil(ms * 100) / 100000).toFixed(2);
}

module.exports = {
	reduceStats: reduceStats,
	formatMs: formatMs
};
