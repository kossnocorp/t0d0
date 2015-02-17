var trim = require('string-fns/src/trim');
var parseDate = require('date-fns/src/parse');
var crypto = require('crypto');

var getTodo = function(filename, line) {
  var captures = line.match(/^(\d+);(\d+)\s(\d+):(.+)$/);
  var lineNumber = parseInt(captures[1]);
  var column = parseInt(captures[2]);
  var length = parseInt(captures[3]);
  var source = captures[4];
  var id = crypto
    .createHash('sha1')
    .update([filename, lineNumber, column, source].join(' '))
    .digest('hex');

  var tags = [];
  var tagCaptures = source.match(/(?:#)([^#]+)(?=[\s.,:,]|$)/g);
  if (tagCaptures) {
    tags = tagCaptures.map(function(tag) {
      return tag.replace('#', '');
    });
  }

  var reviewedAt;
  var reviewedCaptures = source.match(/(?:@)([^@]+)(?=[\s.,:,]|$)/);
  if (reviewedCaptures) {
    reviewedAt = parseDate(reviewedCaptures[1]);
  }

  return {
    filename: filename,
    lineNumber: lineNumber,
    column: column,
    length: length,
    source: source,
    tags: tags,
    isReviewed: !!reviewedAt,
    reviewedAt: reviewedAt,
    id: id
  };
};

var getMap = function(output, options) {
  var map = {};

  output.reduce(function(lastFilename, line) {
    var isEmpty = /^$/.test(trim(line));

    if (isEmpty) {
      return null;

    } else if (lastFilename == null) {
      if (/^:/.test(line)) { // it's a filename!
        var filename = line.slice(1);
        map[filename] = [];
      } else { // it's a line of only file
        var filename = options.args[0];
        map[filename] = [getTodo(filename, line)];
      }

      return filename;
    } else { // it's line!
      map[lastFilename].push(getTodo(lastFilename, line));
      return lastFilename;
    }
  }, null);

  return map;
};

module.exports = getMap;
