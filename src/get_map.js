var trim = require('string-fns/src/trim');
var parseDate = require('date-fns/src/parse');
var crypto = require('crypto');

var getTodo = function(filename, line, options) {
  var captureToken = options.ack ? /^(\d+):(\d+)():(.+)$/
                                 : /^(\d+);(\d+)\s(\d+):(.+)$/;

  var captures = line.replace('\0', '').match(captureToken);
  var lineNumber = parseInt(captures[1]);
  var column = parseInt(captures[2]);
  var length = parseInt(captures[3]);
  var source = captures[4];

  if (options.ack) {
    column = column - 1;
  }

  var id = crypto
    .createHash('sha1')
    .update([filename, lineNumber, column, source].join(' '))
    .digest('hex');

  var tags = [];
  var tagCaptures = source.match(/(?:#)([^#\s.,:]+)(?=[\s.,:]|$)/g);
  if (tagCaptures) {
    tags = tagCaptures.map(function(tag) {
      return tag.replace('#', '');
    });
  }

  var reviewedAt;
  var reviewedCaptures = source.match(/(?:@)([^@\s.,:]+)(?=[\s.,:]|$)/);
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
    } else if (lastFilename == null) { // it's a filename!
      var filename = line.replace(':', '');
      map[filename] = [];
      return filename;
    } else { // it's line!
      map[lastFilename].push(getTodo(lastFilename, line, options));
      return lastFilename;
    }
  }, null);

  return map;
};

module.exports = getMap;
