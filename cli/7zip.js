#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-exit */

/*
 * Dependencies.
 */
import minimist from 'minimist';
import platformBinary from '../util/binary.mjs';
import {
  createRequire
} from 'module';

const require = createRequire(
  import.meta.url);
const pack = require('../package.json'),
  sevenBinary = platformBinary();

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
    'Full ' + command + ' Console Commands.',
    '',
    pack.description,
    '',
    '**Commands**',
    '',
    'Adds files to archive.',
    'Usage: `createArchive` archivePath files ...options',
    '',
    'Deletes files from archive.',
    'Usage: `deleteArchive` archivePath files ...options',
    '',
    'Extracts files from an archive to the current directory or to the output directory.',
    'Usage: `extractArchive` archivePath destination ...options',
    '',
    'Extracts files from an archive with their full paths in the current directory, or in an output directory',
    'Usage: `fullArchive` archivePath destination ...options',
    '',
    'Lists contents of archive.',
    'Usage: `listArchive` archivePath ...options',
    '',
    'Renames files in archive.',
    'Usage: `renameArchive` archivePath file pairs ...options',
    '',
    'Tests archive files.',
    'Usage: `testArchive` archivePath ...options',
    '',
    'Update older files in the archive and add files that are not already in the archive.',
    'Usage: `updateArchive` archivePath files ...options',
    '',
    'Create an Sfx - self extracting installation package for targeted platform.',
    'Usage: `createSfx` platform packageName files --dir --gui ...options',
    '',
    '----------------------------------------------------------------',
    'The `7z` and `7za` binary on your system is located in directory: ' + sevenBinary.path,
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
  console.log(help());
} else {
  console.log(help());
}
