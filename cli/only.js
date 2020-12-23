#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-exit */

/*
 * Dependencies.
 */
import {
  onlyArchive
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
    'Extracts only the selected files from an archive to the current directory, or in an output directory',
    'Usage: ' + command + ' [filepath] [destination] [files] ...Options',
    '',
    pack.description,
    '',
    ' [filepath]    - Path to the archive.',
    ' [destination] - Output destination path.',
    ' [files]       - Files in archive to extract.',
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
    '  -ao    (Overwrite mode)',
    '  -ax    (Exclude archive filenames)',
    '  -i     (Include filenames)',
    '  -m     (Set compression Method)',
    '  -p     (Set Password)',
    '  -r     (Recurse subdirectories)',
    '  -si    (read data from stdin)',
    '  -sni   (Store NT security information)',
    '  -sns   (Store NTFS alternate Streams)',
    '  -so    (write data to stdout)',
    '  -spf   (Use fully qualified file paths)',
    '  -t     (set Type of archive)',
    '  -x     (Exclude filenames)',
    '  -y     (assume Yes on all queries)',
    '',
    'Example:',
    '> ' + command + ' disc/master.7z home/support.js -y',
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
  destination = files.shift();
  delete argv._;
  if (filepath && destination && files) {
    options = Object.assign(options, argv)
    console.log("Extracting files...");
    onlyArchive(filepath, destination, files, options)
      .progress((info) => {
        console.log(info);
      })
      .then(() => {
        console.log('Extraction of files from archive ' + filepath + ' to ' + destination + ' done!');
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
