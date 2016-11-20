#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const program = require('commander');

function volumes(vol, memo) {
  memo.push(vol);
  return memo;
}

program
  .version(require('./package.json').version)
  .usage('[options] "command arg1 arg2..."')
  .option('-i, --image <image>', 'Will run the command in this image', 'alpine')
  .option('-e, --entrypoint <executable>', 'Will be used to override the image entrypoint')
  .option('-v, --volume <dir>', 'Volumes (directories and/or files) to mount inside the container. Can be specified multiple times. Current directory will always be mounted', volumes, ['.'])
  .option('-u, --user <uid[:guid]>', 'Will run the command as this user[:group]', '`id -u`:`id -g`')
  .option('-o, --opts <options>', 'Additional docker run options', '')
  .option('--debug', 'Run in debug mode')
  .arguments('<cmd>')
  .action(function (command, options) {
    const cmd = 'docker';
    var args = ['run', '--rm'];
    if(options.entrypoint) {
      args = args.concat(['--entrypoint', options.entrypoint])
    };
    options.volume.map(vol => {
      const v = path.resolve(vol);
      args.push('-v');
      args.push(`${v}:${v}`);
    });
    args = args.concat([
      '-w', process.cwd(),
      '-u', options.user,
      options.opts,
      options.image
    ]);
    args = args.concat(command);
    const opts = {
      shell: true
    };

    if(options.debug) {
      console.log('INDOCKER DEBUG:');
      console.log(' OPTIONS:\n', args);
      console.log();
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
  });

program.parse(process.argv);
