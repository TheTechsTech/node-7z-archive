#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-exit */

/*
 * Dependencies.
 */
import {
  testArchive,
} from '../lib/index.mjs';
import minimist from 'minimist';
import {
  createRequire
} from 'module';

const require = createRequire(
  import.meta.url);
const pack = require('../package.json');

/*
 * Arguments.
 */
let argv = minimist(process.argv.slice(2));

/*
 * Command.
 */
var command = Object.keys(pack.bin)[7];

/**
 * Help.
 *
 * @return {string}
 */
function help() {
  return [
    'Tests archive files.',
    'Usage: ' + command + ' [filepath] ...Options',
    '',
    pack.description,
    '',
    ' [filepath]  - Path to the archive.',
    '',
    'Options:',
    '',
    '  -h, --help       output usage information',
    '  -v, --version    output version number',
    '',
    ' Any of these 7zip switches this command accepts:',
    '',
    '  -ai    (Include archive filenames)',
    '  -an    (Disable parsing of archive_name)',
    '  -ax    (Exclude archive filenames)',
    '  -i     (Include filenames)',
    '  -sns   (Store NTFS alternate Streams)',
    '  -p     (Set Password)',
    '  -r     (Recurse subdirectories)',
    '  -x     (Exclude filenames)',
    '',
    'Example:',
    '> ' + command + ' disc/master.7z -r',
    ''
  ].join('\n ') + '\n';
}

/*
 * Program.
 */
if (argv.help || argv.h) {
  console.log(help());
} else if (argv.version || argv.v) {
  console.log(pack.version);
} else if (argv) {
  let options = {};
  let filepath = argv._;
  filepath = filepath.shift();
  delete argv._;
  if (filepath) {
    options = Object.assign(options, argv)
    console.log("Testing...");
    testArchive(filepath, options)
      .progress((info) => {
        console.log(info);
      })
      .then(() => {
        console.log('Integrity of archive ' + filepath + ' done!');
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
