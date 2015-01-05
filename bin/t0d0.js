var trim = require('string-fns/src/trim');
var pad = require('string-fns/src/pad');
var path = require('path');
var childProcess = require('child_process');
var program = require('commander');
var addDays = require('date-fns/src/add_days');
var isBefore = require('date-fns/src/is_before');
var chalk = require('chalk');

var getTodo = function(filename, line) {
  var captures = line.match(/^(\d+);(\d+)\s(\d+):(.+)$/);
  var lineNumber = parseInt(captures[1]);
  var column = parseInt(captures[2]);
  var length = parseInt(captures[3]);
  var source = captures[4];

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
    reviewedAt: reviewedAt
  };
};

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
        output.replace(/\s+$/, '').split(/\n/g).map(function(line, index) {
          var lineText;
          if (index == 0) {
            lineText = line.replace('TODO:', chalk.red.bold('$&'))

          } else {
            lineText = line;
          }

          return getLineText(ln+index) + lineText + '\n';
        }).join('')
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
var filterReviewed = function(fullMap, options) {
  if (options.all) return fullMap;

  var map = {};
  for (var filename in fullMap) {
    var todos = fullMap[filename];
    todos.forEach(function(todo) {
      if (todo.isReviewed) {
        if (isBefore(todo.reviewedAt, addDays(today, 14))) {
          // Ignore reviewed
          return;
        }
      }

      map[filename] = map[filename] || [];
      map[filename].push(todo);
    });
  }

  return map;
};

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
  .parse(process.argv);

var agPrc = childProcess.spawn('ag', ['-Q', 'TODO:', '--ackmate']);

agPrc.stdout.setEncoding('utf8');
agPrc.stdout.on('data', function(data) {
  agPrc.on('close', function(code) {
    if (code == 0) {
      var output = trim(data).split(/\n/g);
      var fullMap = getMap(output);


      var map = filterReviewed(fullMap, program);

      renderResult(map, program);

    } else {
      console.error(
        'ag process exited with code ' + code  + ", output: \n"  + data
      );
      process.exit(1);
    }
  });
});
