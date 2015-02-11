var pad = require('string-fns/src/pad');
var childProcess = require('child_process');
var chalk = require('chalk');

var getIDText = function(id, isShort) {
  return '      ' + chalk.yellow(isShort ? id.substring(0, 7) : id) + '\n';
}

var getLineText = function(line) {
  return chalk.blue(' ' + pad(line.toString(), 4, ' ') + '|');
}

var getTodoText = function(todo, options, cb) {
  var ln = todo.lineNumber;
  var numberOfLines = (options.lines || 3)-1;
  childProcess.exec(
    "awk 'NR >= " +  ln + ' && NR <=' + (ln+numberOfLines) + "' " + todo.filename,
    function(err, output) {
      cb(
        [getIDText(todo.id, options.short)].concat(
          output.replace(/\s+$/, '').split(/\n/g).map(function(line, index) {
            var lineText;
            if (index == 0) {
              lineText = line.replace('TODO:', chalk.red.bold('$&'))

            } else {
              lineText = line;
            }

            return getLineText(ln+index) + lineText + '\n';
          })
        ).join('')
      );
    }
  );
}

var renderTodos = function(todos, options, cb) {
  if (todos.length > 0) {
    var todo = todos[0];

    getTodoText(todo, options, function(text) {
      console.log(text);
      renderTodos(todos.slice(1), options, cb);
    });

  } else {
    cb();
  }
}

var renderFiles = function(files, map, options, cb) {
  if (files.length > 0) {
    var filename = files[0];
    var todos = map[filename];

    console.log(chalk.green.bold(filename) + ' (' + todos.length  + ')\n');

    renderTodos(todos, options, function(text) {
      renderFiles(files.slice(1), map, options, cb);
    });

  } else {
    cb();
  }
}

var renderResult = function(map, options) {
  var files = Object.keys(map);
  renderFiles(files, map, options, function() {
    // TODO:
  });
}

module.exports = renderResult;
