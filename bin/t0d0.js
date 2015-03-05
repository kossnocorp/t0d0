#!/usr/bin/env node

var program = require('commander');
var cli = require('../src/cli');

program
  .usage('[options] <files>')
  .option(
    '-l, --lines <number>',
    'number of lines including TODO statement (default - 3)'
  )
  .option(
    '--since <date>',
    'don\'t show reviews reviewed after date'
  )
  .option(
    '--until <date>',
    'show reviewed TODOs after date'
  )
  .option(
    '-d, --days <number>',
    'same as --since N.days.ago'
  )
  .option(
    '--blame',
    'fetch TODO author from git'
  )
  .option(
    '--all',
    'show all TODOs, including reviewed'
  )
  .option(
    '--reviewed',
    'show only reviewed TODOs'
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
    '--ack',
    'use ack instead of ag'
  )
  .parse(process.argv);

cli(program)
  .then(function(exitCode) {
    process.exit(exitCode);
  });
