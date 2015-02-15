#!/usr/bin/env node

var renderResult = require('../src/render_result');
var renderStats = require('../src/render_stats');
var runEditor = require('../src/run_editor');
var getMap = require('../src/get_map');
var filterTodos = require('../src/filter_todos');
var countTodos = require('../src/count_todos');
var findTodoByID = require('../src/find_todo_by_id');
var blameTodos = require('../src/blame_todos');

var trim = require('string-fns/src/trim');
var childProcess = require('child_process');

var program = require('commander');

program
  .usage('[options]')
  .option(
    '-l, --lines <number>',
    'number of lines including TODO statement (default - 3)'
  )
  .option(
    '-d, --days <number>',
    'days since review is considered obsolete'
  )
  .option(
    '--blame',
    'blame TODOs'
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
  .option(
    '--tag <value>',
    'filter TODOs by tag'
  )
  .option(
    '--tagged',
    'show only tagged TODOs'
  )
  .option(
    '--untagged',
    'show only untagged TODOs'
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
        filterTodos(fullMap, program, function(map) {
          blameTodos(map, program, function(map) {
            renderResult(map, program);
          });
        });
      }

    } else {
      console.error(
        'ag process exited with code ' + code  + ", output: \n"  + data
      );
      process.exit(1);
    }
  });
});
