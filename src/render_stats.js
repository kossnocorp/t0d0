var renderStats = function(stats, options, cb) {
  console.log('  All TODOs:      ' + stats.all);
  console.log('  Reviewed TODOs: ' + stats.reviewed);
  // TODO: use stats.files for statistics per file
  cb();
}

module.exports = renderStats;
