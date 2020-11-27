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
var command = Object.keys(pack.bin)[0];

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
    pack.description,
    '',
    ' [filepath]  - Path to the archive.',
    ' [files]     - Files to add.',
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
    '  -sdel  (Delete files after compression)',
    '  -sfx   (Create SFX archive)',
    '  -si    (read data from stdin)',
    '  -sni   (Store NT security information)',
    '  -sns   (Store NTFS alternate Streams)',
    '  -so    (write data to stdout)',
    '  -spf   (Use fully qualified file paths)',
    '  -ssw   (Compress files open for writing)',
    '  -stl   (Set archive timestamp from the most recently modified file)',
    '  -t     (set Type of archive)',
    '  -u     (Update options)',
    '  -v     (Create Volumes)',
    '  -w     (set Working directory)',
    '  -x     (Exclude filenames)',
    '',
    'Example:',
    '> ' + command + ' disc/master.7z *.md help.doc -r',
    ''
  ].join('\n  ') + '\n';
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
  let withoutOptions = argv._;
  let filepath = withoutOptions.shift();
  delete argv._;
  if (filepath && withoutOptions) {
    options = Object.assign(options, argv)
    console.log("Creating/adding...");
    createArchive(filepath, withoutOptions, options)
      .progress((info) => {
        console.log(info);
      })
      .then(() => {
        console.log('The creation of archive ' + filepath + ' done!');
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
