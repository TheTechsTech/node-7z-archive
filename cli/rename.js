#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-exit */

/*
 * Dependencies.
 */
import {
  renameArchive
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
var command = Object.keys(pack.bin)[6];

/**
 * Help.
 *
 * @return {string}
 */
function help() {
  return [
    'Renames files in archive.',
    'Usage: ' + command + ' [filepath] [file-pair] ...Options',
    '',
    pack.description,
    '',
    ' [filepath]    - Path to the archive.',
    ' [file-pair]   - Files pairs to rename in archive.',
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
    '  -stl   (Set archive timestamp from the most recently modified file)',
    '  -u     (Update options)',
    '  -w     (set Working directory)',
    '  -x     (Exclude filenames)',
    '',
    'Example:',
    '> ' + command + ' disc/master.7z docOld.js docNew.mjs -p',
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
    console.log("Renaming...");
    renameArchive(filepath, files, options)
      .progress((info) => {
        console.log(info);
      })
      .then(() => {
        console.log('Renamed files from archive ' + filepath + ' done!');
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
