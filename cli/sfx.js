#!/usr/bin/env node

'use strict';

/* eslint-disable no-process-exit */

/*
 * Dependencies.
 */
import {
  createSfxMac,
  createSfxLinux,
  createSfxWindows
} from '../lib/index.mjs';
import minimist from 'minimist';
import {
  join
} from 'path';
import {
  userInfo
} from 'os';
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
    'Create an Sfx - self extracting installation package for targeted platform.',
    'Usage: ' + command + ' platform packageName files --dir destination --gui --console ...options',
    '',
    pack.description,
    '',
    ' [platform]  - Target platform, either `windows`, `linux`, or `macos`.',
    ' [name]      - Installation package name.',
    ' [files]     - Files to add.',
    ' --dir       - Save the `SFX` package to directory. Defaults to current user desktop',
    ' --gui       - Make the Sfx installation package have a Graphical User Interfere.',
    ' --console   - Make the Sfx installation package have a Console interfere.',
    '',
    'Options:',
    '',
    '  -h, --help       output usage information',
    '  -v, --version    output version number',
    '',
    ' Any of these 7zip switches this command accepts:',
    '',
    ' For Installer config if GUI and targeting Windows:',
    ' --title       - Window title message, Default "`packageName` installation package created on `Current running platform OS`".',
    ' --prompt      - Begin Prompt message, Default "Do you want to install `packageName`?"',
    ' --progress    - Value can be "yes" or "no". Default value is "no".',
    ' --run         - Command from archive for executing after extracting. Default value is "setup.exe". Substring `% % T` will be replaced with path to temporary folder, where files were extracted.',
    ' --directory   - Directory prefix for --run. Default value is `.\\`',
    ' --execute     - Name of some other system file for executing after extraction.',
    ' --parameters  - Parameters for --execute.',
    '',
    '-----------',
    '',
    '  -i     (Include filenames)',
    '  -m     (Set compression Method)',
    '  -p     (Set Password)',
    '  -r     (Recurse subdirectories)',
    '  -sdel  (Delete files after compression)',
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
    '> ' + command + ' windows Support disc/* support.doc --dir user/desktop --gui --title "Sample Installer Package"',
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
  let platform = files.shift();
  if (platform) {
    let packageName = files.shift();
    let sfxPromise = null;
    let destination = (argv.dir) ? argv.dir : join(userInfo().homedir, 'Desktop');
    let type = (argv.gui) ? 'gui' : 'console';
    type = (argv.console || platform === 'linux' || platform === 'macos') ? 'console' : type;
    delete argv._;
    delete argv.gui;
    delete argv.console;
    delete argv.dir;
    options = Object.assign(options, argv)

    if (platform === 'win32')
      sfxPromise = createSfxWindows(packageName, files, destination, options, type);
    else if (platform === 'macos')
      sfxPromise = createSfxMac(packageName, files, destination, options);
    else if (platform === 'linux')
      sfxPromise = createSfxLinux(packageName, files, destination, options);

    if (packageName && files && typeof sfxPromise.then === 'function') {
      console.log("Creating Sfx Package...");
      sfxPromise.progress((info) => {
          console.log(info);
        })
        .then((file) => {
          console.log('Creation of installation package ' + packageName + ' saved to ' + file + ' done!');
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
} else {
  console.log(help());
}
