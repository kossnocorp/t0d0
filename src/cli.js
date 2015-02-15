var renderResult = require('./render_result');
var renderStats = require('./render_stats');
var runEditor = require('./run_editor');
var getMap = require('./get_map');
var filterTodos = require('./filter_todos');
var countTodos = require('./count_todos');
var findTodoByID = require('./find_todo_by_id');
var blameTodos = require('./blame_todos');

var Promise = require('bluebird');
var trim = require('string-fns/src/trim');
var childProcess = require('child_process');

var runAg = function(program, cb) {
  var agPrc = childProcess.spawn('ag', ['-Q', 'TODO:', '--ackmate']);

  agPrc.stdout.setEncoding('utf8');
  agPrc.stdout.on('data', function(data) {
    agPrc.on('close', function(code) {
      if (code == 0) {
        var output = trim(data).split(/\n/g);
        var fullMap = getMap(output);

        if (program.stats) {
          var stats = countTodos(fullMap, program);
          renderStats(stats, program, function() {
            cb(0);
          });
        } else if (program.edit) {
          var todo = findTodoByID(fullMap, program.edit, program);
          runEditor(todo, program, function(exitCode) {
            cb(exitCode);
          });
        } else {
          filterTodos(fullMap, program, function(map) {
            blameTodos(map, program, function(map) {
              renderResult(map, program, function() {
                cb(0);
              });
            });
          });
        }

      } else {
        console.error(
          'ag process exited with code ' + code  + ", output: \n"  + data
        );
        cb(1);
      }
    });
  });
}


var cli = function(program, callback) {
  return new Promise(function(resolve) {
    runAg(program, function(exitCode) {
      resolve(exitCode);
    })
  });
};

module.exports = cli;
