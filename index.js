#!/usr/bin/env node
'use strict';

const fs = require('fs');
const spawn = require('child_process').spawn;
const parser = require("nomnom");
const yaml = require("js-yaml");

var defaults = {};
if (fs.existsSync('.indocker')) {
  defaults = yaml.safeLoad(fs.readFileSync('.indocker', 'utf8')) || {};
} else {};

const options = parser
  .option('image', {
    abbr: 'i',
    help: 'use this docker image',
    default: defaults.image || 'alpine'
  })
  .option('command', {
    abbr: 'c',
    help: 'execute this command passign the target file as an argument',
    default: defaults.command || 'sh'
  })
  .option('dir', {
    abbr: 'd',
    help: 'input dir; will be mappped to /.indocker/input inside the container, defaults to the current folder',
    default: defaults.dir || '$(pwd)'
  })
  .option('out', {
    abbr: 'o',
    help: 'output dir; will be mappped to /.indocker/output inside the container, defaults to the current folder',
    default: defaults.out || '$(pwd)'
  })
  .option('user', {
    abbr: 'u',
    help: 'execute as this user:group',
    default: defaults.user || '`id -u`:`id -g`'
  })
  .parse();


const cmd = 'docker';
const args = [
  'run',
  '--rm',
  '-v', `${options.dir}:/.indocker/input`,
  '-v', `${options.out}:/.indocker/output`,
  '-w', `/.indocker/input`,
  '-u', options.user,
  options.image,
  options.command,
  options._[0]];
const opts = {
  shell: true
};

console.log('indocker is starting', defaults, options, args);

const ind = spawn(cmd, args, opts)

ind.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ind.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ind.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

ind.on('error', (err) => {
  console.error('Failed to start child process.');
});
