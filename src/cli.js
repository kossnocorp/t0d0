var blameTodos = require('./blame_todos');
var countTodos = require('./count_todos');
var filterTodos = require('./filter_todos');
var findTodoByID = require('./find_todo_by_id');
var getMap = require('./get_map');
var renderError = require('./render_error');
var renderResult = require('./render_result');
var renderStats = require('./render_stats');
var runEditor = require('./run_editor');

var Promise = require('bluebird');
var trim = require('string-fns/src/trim');
var childProcess = require('child_process');

var runAg = function(options) {
  var prc;

  if (options.ack) {
    prc = childProcess.spawn(
      'ack',
      ['--nocolor', '--heading', '--break', '--column', '-HQ', 'TODO:'].concat(options.args || [])
    );
  } else {
    prc = childProcess.spawn(
      'ag',
      ['-HQ', 'TODO:', '--ackmate'].concat(options.args || [])
    );
  }

  return prc;
}

var runCli = function(program, callback) {
  var agPrc = runAg(program);

  agPrc.stdout.setEncoding('utf8');
  agPrc.stdout.on('data', function(data) {
    agPrc.on('close', function(code) {
      if (code == 0) {
        var output = trim(data).split(/\n/g);
        var fullMap = getMap(output, program);

        if (program.stats) {
          countTodos(fullMap, program, function(stats) {
            renderStats(stats, program, function(exitCode) {
              callback(exitCode);
            });
          });

        } else if (program.edit) {
          findTodoByID(fullMap, program.edit, program, function(err, todo) {
            if (err) {
              renderError(err);
              callback(1);
            } else {
              runEditor(todo, program, function(exitCode) {
                callback(exitCode);
              });
            }
          });

        } else {
          filterTodos(fullMap, program, function(map) {
            blameTodos(map, program, function(map) {
              renderResult(map, program, function(exitCode) {
                callback(exitCode);
              });
            });
          });
        }

      } else {
        console.error(
          'ag process exited with code ' + code  + ", output: \n"  + data
        );
        callback(1);
      }
    });
  });
};


var cli = function(program) {
  return new Promise(function(resolve) {
    runCli(program, function(exitCode) {
      resolve(exitCode);
    });
  });
};

module.exports = cli;
