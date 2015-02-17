var pad = require('string-fns/src/pad');
var chalk = require('chalk');

var repeat = function(char, times) {
  return new Array(times + 1).join(char);
};

var maxLength = function(obj) {
  return Object.keys(obj).reduce(function (a, b) {
    return a.length > b.length ? a : b;
  }).length;
};

var getFilenameText = function(name, maxLength) {
  return name + repeat(' ', maxLength - name.length + 1);
};

var getFileStatText = function(file) {
  var result = '' + pad(file.all.toString(), 2, ' ') + ' ';
  var unreviewed = file.all - (file.reviewed + file.reviewedObsolete);
  result += chalk.green(repeat('✓', file.reviewed));
  result += chalk.yellow(repeat('✗', file.reviewedObsolete));
  result += chalk.red(repeat('✗', unreviewed));
  return result;
};

var renderFileStats = function(files, options) {
  var filenameLength = maxLength(files);

  for (var filename in files) {
    var file = files[filename];
    console.log('  ' + getFilenameText(filename, filenameLength) + '|' + getFileStatText(file));
  }
};

var renderOverallStats = function(stats, options) {
  var unreviewed = stats.all - (stats.reviewed + stats.reviewedObsolete);
  console.log([
    '  ',
    'All TODOs: ', stats.all, ', ',
    chalk.green('reviewed: '), stats.reviewed, ', ',
    chalk.yellow('reviewed long time ago: '), stats.reviewedObsolete, ', ',
    chalk.red('unreviewed: '), unreviewed
  ].join(''));
};

var renderTagStats = function(tags, options) {
  var tagLength = maxLength(tags);

  console.log();
  console.log('  Tags:');
  for (var tag in tags) {
    var stat = tags[tag];
    console.log('  #' + getFilenameText(tag, tagLength) + '|' + pad(stat.toString(), 2, ' '));
  }
};

var renderStats = function(stats, options, callback) {
  renderFileStats(stats.files, options);
  renderOverallStats(stats, options);
  if (Object.keys(stats.tags).length > 0) {
    renderTagStats(stats.tags, options);
  }

  // TODO:
  // TODO:
  // TODO: @2015-02-15
  // TODO: @2012 use stats.files for statistics per file
  callback(0);
};

module.exports = renderStats;
