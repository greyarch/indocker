#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const parser = require("nomnom");

const options = parser
  .script('indocker')
  .help('indocker [options] [commands to execute]')
  .option('image', {
    abbr: 'i',
    help: 'use this docker image',
    default: 'alpine'
  })
  .option('entrypoint', {
    abbr: 'e',
    help: 'will be used as a docker run entrypoint'
  })
  .option('command', {
    abbr: 'c',
    help: 'will be used as a docker run command'
  })
  .option('dir', {
    abbr: 'd',
    help: 'input dir',
    default: '.'
  })
  .option('out', {
    abbr: 'o',
    help: 'output dir',
    default: '.'
  })
  .option('user', {
    abbr: 'u',
    help: 'execute as this user[:group]',
    default: '`id -u`:`id -g`'
  })
  .option('opts', {
    help: 'additional docker options to be passed as docker run options'
  })
  .option('debug', {
    flag: true,
    hidden: true
  })
  .parse();


const cmd = 'docker';
const indir = path.resolve(options.dir);
const outdir = path.resolve(options.out);
var args = ['run', '--rm'];
if(options.entrypoint) {
  args = args.concat(['--entrypoint', options.entrypoint])
};
args = args.concat([
  '-v', `${indir}:${indir}`,
  '-v', `${outdir}:${outdir}`,
  '-w', indir,
  '-u', options.user,
  options.opts || '',
  options.image
]);
if(options.command) {args.push(options.command)};
args = args.concat(options._);
const opts = {
  shell: true
};

if(options.debug) {
  console.log('INDOCKER DEBUG:');
  console.log(' OPTIONS:\n', options);
  console.log();
  console.log(' DOCKER ARGS:\n', args);
}

const ind = spawn(cmd, args, opts)

ind.stdout.on('data', (data) => {
  console.log(`${data}`);
});

ind.stderr.on('data', (data) => {
  console.error(`${data}`);
});

ind.on('close', (code) => {
  if(code) {
    console.error(`Child process exited with code ${code}`);
    process.exit(code);
  }
});

ind.on('error', (err) => {
  console.error('Failed to start child process.');
  process.exit(1);
});
