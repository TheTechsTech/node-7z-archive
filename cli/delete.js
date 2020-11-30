#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-exit */

/*
 * Dependencies.
 */
import {
  deleteArchive,
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
var command = Object.keys(pack.bin)[2];

/**
 * Help.
 *
 * @return {string}
 */
function help() {
  return [
    'Deletes files from archive.',
    'Usage: ' + command + ' [filepath] [files] ...Options',
    '',
    pack.description,
    '',
    ' [filepath]  - Path to the archive.',
    ' [files]     - Files to remove.',
    '',
    'Options:',
    '',
    '  -h, --help       output usage information',
    '  -v, --version    output version number',
    '',
    ' Any of these 7zip switches this command accepts:',
    '',
    '  -i     (Include filenames)',
    '  -m     (Set compression Method)',
    '  -p     (Set Password)',
    '  -r     (Recurse subdirectories)',
    '  -sns   (Store NTFS alternate Streams)',
    '  -stl   (Set archive timestamp from the most recently modified file)',
    '  -spf   (Use fully qualified file paths)',
    '  -t     (set Type of archive)',
    '  -u     (Update options)',
    '  -w     (set Working directory)',
    '  -x     (Exclude filenames)',
    '',
    'Example:',
    '> ' + command + ' disc/master.7z *.bak -r',
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
  let files = argv._;
  let filepath = files.shift();
  delete argv._;
  if (filepath && files) {
    options = Object.assign(options, argv)
    console.log("Deleting...");
    deleteArchive(filepath, files, options)
      .progress((info) => {
        console.log(info);
      })
      .then(() => {
        console.log('Deletion of files from archive ' + filepath + ' done!');
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
