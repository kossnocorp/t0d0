var childProcess = require('child_process');

var blameSingleTodo = function(todoIndex, filename, map, options, callback) {
  var todo = map[filename][todoIndex];
  var ln = todo.lineNumber;

  childProcess.exec(
    ['git blame', filename, '-L', [ln,ln].join(',')].join(' '),
    function(err, output) {
      var blameCaptures = /^([\^a-f0-9]+) \(([^\)]+)(?=\))/.exec(output);
      if (blameCaptures) {
        var authorCaptures = /(.*)( [^ ]+){4}/.exec(blameCaptures[2]);
        if (authorCaptures) {
          map[filename][todoIndex].commit = blameCaptures[1];
          map[filename][todoIndex].author = authorCaptures[1];
        }
      }
      callback(map);
    }
  );
};

var blameTodos = function(todoIndices, filename, map, options, callback) {
  if (todoIndices.length > 0) {
    var todoIndex = todoIndices[0];

    blameSingleTodo(todoIndex, filename, map, options, function(newMap) {
      blameTodos(todoIndices.slice(1), filename, newMap, options, callback);
    });

  } else {
    callback(map);
  }
};

var blameFiles = function(files, map, options, callback) {
  if (files.length > 0) {
    var filename = files[0];
    var todoIndices = Object.keys(map[filename]);

    blameTodos(todoIndices, filename, map, options, function(newMap) {
      blameFiles(files.slice(1), newMap, options, callback);
    });

  } else {
    callback(map, options);
  }

};

var blameMap = function(map, options, callback) {
  if (!options.blame) {
    callback(map);
    return;
  }

  var files = Object.keys(map);
  blameFiles(files, map, options, callback);
};

module.exports = blameMap;
