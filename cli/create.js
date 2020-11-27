#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-exit */

/*
 * Dependencies.
 */

import {
  createArchive,
  deleteArchive,
  extractArchive,
  fullArchive,
  listArchive,
  testArchive,
  updateArchive
} from './';
import {
  bin,
  description,
  version
} from './package.json';
import minimist from 'minimist';

/*
 * Arguments.
 */
let argv = minimist(process.argv.slice(2));

/*
 * Command.
 */
var command = Object.keys(bin)[0];

/**
 * Help.
 *
 * @return {string}
 */
function help() {
  return [
    '',
    'Usage: ' + command + ' [filepath] [files] Options...',
    '',
    description,
    '',
    ' [filepath]  - Path to the archive.',
    ' [files]     - Files to add.',
    '',
    'Options:',
    '',
    '  -h, --help           output usage information',
    '  -v, --version        output version number',
    '',
    '  or any valid 7zip `-` switches',
    '',
    'Usage:',
    '',
    '# Create/add file to an archive.',
    '$ ' + command + ' disc/master.7z "*.md help.doc" -r',
    ''
  ].join('\n  ') + '\n';
}

/*
 * Program.
 */
if (argv.help || argv.h) {
  console.log(help());
} else if (argv.version || argv.v) {
  console.log(version);
} else if (argv) {
  let options = {};
  let withoutOptions = argv._;
  let filepath = withoutOptions.shift();
  delete argv._;
  if (filepath.length > 0) {
    options = Object.assign(options, argv)
    console.log("Creating...");
    createArchive(filepath, withoutOptions, options)
      .progress((info) => {
        console.log(info);
      })
      .then(() => {
        console.log('The creation of archive ' + filepath + ' is done!');
      })
      .catch((error) => {
        console.log('--- error:');
        console.log(error);
      });
  } else {
    console.log(help());
  }
} else {
  console.log(help());
}
