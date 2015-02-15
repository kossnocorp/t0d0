var renderStats = function(stats, options, callback) {
  console.log('  All TODOs:      ' + stats.all);
  console.log('  Reviewed TODOs: ' + stats.reviewed);
  // TODO: use stats.files for statistics per file
  callback(0);
}

module.exports = renderStats;
