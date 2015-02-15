#!/usr/bin/env node

var program = require('commander');
var cli = require('../src/cli');

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
    'fetch TODO author from git'
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

cli(program)
  .then(function(exitCode) {
    process.exit(exitCode);
  });
