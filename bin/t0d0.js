#!/usr/bin/env node

var trim = require('string-fns/src/trim');
var pad = require('string-fns/src/pad');
var path = require('path');
var childProcess = require('child_process');
var program = require('commander');
var subDays = require('date-fns/src/sub_days');
var isBefore = require('date-fns/src/is_before');
var chalk = require('chalk');
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

  var reviewedAt;

  var reviewedCaptures = source.match(/TODO:\s\((.+)\)/);
  if (reviewedCaptures) {
    reviewedAt = new Date(reviewedCaptures[1]);
  }

  return {
    filename: filename,
    lineNumber: lineNumber,
    column: column,
    length: length,
    source: source,
    isReviewed: !!reviewedAt,
    reviewedAt: reviewedAt,
    id: id
  };
};

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

    console.log(chalk.grey.bold(filename) + ' (' + todos.length  + ')\n');

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

var renderStats = function(stats, options) {
  console.log('  All TODOs:      ' + stats.all);
  console.log('  Reviewed TODOs: ' + stats.reviewed);
  // TODO: use stats.files for statistics per file
}

var runEditor = function(todo, option) {
  var vimPrc = childProcess.spawn('vim', [todo.filename, '+' + todo.lineNumber], {stdio: 'inherit'});
}

var getMap = function(output) {
  var map = {};

  output.reduce(function(lastFilename, line) {
    var isEmpty = /^$/.test(trim(line));

    if (isEmpty) {
      return null;

    } else if (lastFilename == null) { // it's filename!
      var filename = line.slice(1);

      map[filename] = [];
      return filename;

    } else { // it's line!
      map[lastFilename].push(getTodo(lastFilename, line));
      return lastFilename;
    }
  }, null);

  return map;
};

var today = new Date();
var filterTodos = function(fullMap, options) {
  if (options.all) return fullMap;

  var map = {};
  for (var filename in fullMap) {
    var todos = fullMap[filename];
    todos.forEach(function(todo) {
      if (options.reviewed) {
        if (!todo.isReviewed) {
          // Ignore unreviewed
          return;
        }
      } else if (todo.isReviewed) {
        if (isBefore(subDays(today, 14), todo.reviewedAt)) {
          // Ignore reviewed recently
          return;
        }
      }

      map[filename] = map[filename] || [];
      map[filename].push(todo);
    });
  }

  return map;
};

var countTodos = function(fullMap, options) {
  var stats = {};
  stats.all = 0;
  stats.reviewed = 0;
  stats.files = {};

  for (var filename in fullMap) {
    var todos = fullMap[filename];
    var fileStats = {
      all: todos.length,
      reviewed: todos.filter(function(todo) {
        return todo.isReviewed;
      }).length
    }

    stats.all += fileStats.all;
    stats.reviewed += fileStats.reviewed;
    stats.files[filename] = fileStats;
  }

  return stats;
}

var findTodoByID = function(fullMap, id, options) {
  var result;
  for (var filename in fullMap) {
    fullMap[filename].some(function(todo) {
      if (todo.id.indexOf(id) == 0) {
        result = todo;
        return true;
      } else {
        return false;
      }
    });

    if (result) {
      return result;
    }
  }
}

program
  .usage('[options]')
  .option(
    '-l, --lines <number>',
    'number of lines including TODO statement (default - 3)'
  )
  .option(
    '--all',
    'show all TODOs, including reviewed (false)'
  )
  .option(
    '--reviewed',
    'show only reviewed TODOs'
  )
  .option(
    '--short',
    'show abbreviated TODO IDs'
  )
  .option(
    '--stats',
    'display number of TODOs and how many of them are reviewed'
  )
  .option(
    '--edit [id]',
    'open Vim to edit TODO'
  )
  .parse(process.argv);

var agPrc = childProcess.spawn('ag', ['-Q', 'TODO:', '--ackmate']);

agPrc.stdout.setEncoding('utf8');
agPrc.stdout.on('data', function(data) {
  agPrc.on('close', function(code) {
    if (code == 0) {
      var output = trim(data).split(/\n/g);
      var fullMap = getMap(output);

      if (program.stats) {
        var stats = countTodos(fullMap, program);
        renderStats(stats, program);
      } else if (program.edit) {
        var todo = findTodoByID(fullMap, program.edit, program);
        runEditor(todo, program);
      } else {
        var map = filterTodos(fullMap, program);
        renderResult(map, program);
      }

    } else {
      console.error(
        'ag process exited with code ' + code  + ", output: \n"  + data
      );
      process.exit(1);
    }
  });
});
