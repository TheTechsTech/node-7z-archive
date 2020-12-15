#!/usr/bin/env node

'use strict';

import fs from 'fs-extra';
import {
  fileURLToPath
} from 'url';
import {
  dirname,
  join,
  sep,
} from 'path';
import spawn from 'cross-spawn';
import { unpack } from 'node-unar';
import { wget, isString } from 'node-wget-fetch';

const __filename = fileURLToPath(
  import.meta.url);
const __dirname = dirname(__filename);

const _7zAppUrl = 'https://7-zip.org/a/',
  cwd = process.cwd(),
  binaryDestination = join(__dirname, 'binaries', process.platform);

const windowsPlatform = {
  source: join(cwd, '7z1900.exe'),
  destination: join(cwd, 'win32'),
  url: 'https://d.7-zip.org/a/',
  filename: '7z1900.exe',
  extraName: '7z1900-extra.7z',
  extractFolder: '',
  appLocation: '',
  binaryFiles: ['7z.exe', '7z.dll', '7z.sfx', '7zCon.sfx'],
  binaryDestinationDir: join(__dirname, 'binaries', 'win32'),
  sfxModules: ['7za.dll', '7za.exe', '7zxa.dll'],
  platform: 'win32',
  binary: '7z.exe',
  extraSourceFile: join(cwd, 'win32', '7z1900-extra.7z'),
};

const windowsOtherPlatform = {
  source: join(cwd, '7z1701.exe'),
  destination: join(cwd, 'other32'),
  url: 'https://d.7-zip.org/a/',
  filename: '7z1701.exe',
  extraName: '7z1701-extra.7z',
  extractFolder: '',
  appLocation: '',
  binaryFiles: ['7z.exe', '7z.dll', '7z.sfx', '7zCon.sfx'],
  binaryDestinationDir: join(__dirname, 'binaries', 'win32', 'other32'),
  sfxModules: ['7za.dll', '7za.exe', '7zxa.dll'],
  platform: 'win32',
  binary: '7z.exe',
  extraSourceFile: join(cwd, 'other32', '7z1701-extra.7z'),
};

const linuxPlatform = {
  source: join(cwd, 'linux-p7zip.7z'),
  destination: join(cwd, 'linux'),
  url: 'https://github.com/techno-express/p7zip/releases/download/17.02/',
  filename: 'linux-p7zip.7z',
  extraName: 'lzma1701.7z',
  extractFolder: '',
  appLocation: '',
  binaryFiles: ['7z', '7z.so', '7za', '7zCon.sfx', '7zr', 'Codecs'],
  binaryDestinationDir: join(__dirname, 'binaries', 'linux'),
  sfxModules: null,
  platform: 'linux',
  binary: '7z',
  extraSourceFile: join(cwd, 'linux', 'lzma1701.7z'),
};

const appleMacPlatform = {
  source: join(cwd, 'macos-p7zip.7z'),
  destination: join(cwd, 'darwin'),
  url: 'https://github.com/techno-express/p7zip/releases/download/17.02/',
  filename: 'macos-p7zip.7z',
  extraName: 'lzma1701.7z',
  extractFolder: '',
  appLocation: '',
  binaryFiles: ['7z', '7z.so', '7za', '7zCon.sfx', '7zr', 'Codecs'],
  binaryDestinationDir: join(__dirname, 'binaries', 'darwin'),
  sfxModules: null,
  platform: 'darwin',
  binary: '7z',
  extraSourceFile: join(cwd, 'darwin', 'lzma1701.7z'),
};

function retrieve(path = {
  url: '',
  dest: ''
}) {
  console.log('Downloading ' + path.url);
  return wget(path.url, path.dest, { retry: { retries: 5 } })
    .then((info) => {
      return info;
    })
    .catch((err) => {
      throw ('Error downloading file: ' + err);
    });
}

function platformUnpacker(platformData = windowsPlatform) {
  return new Promise((resolve, reject) => {
    retrieve({
      url: platformData.url + platformData.filename,
      dest: platformData.source
    }).then(() => {
      console.log('Extracting: ' + platformData.filename);
      if (isString(platformData.platform)) {
        unpack(platformData.source, platformData.destination)
          .then((results) => {
            console.log('Archive of type: ' + results.type)
            console.log('Successfully extracted to: ' + results.directory)
            return resolve(platformData.platform);
          })
          .catch((err) => reject(err));
      }
    }).catch((err) => reject(err));
  }).catch((err) => console.error(err));
}

function extraUnpack(cmd = '', source = '', destination = '', toCopy = []) {
  let args = ['e', source, '-o' + destination];
  let extraArgs = args.concat(toCopy).concat(['-r', '-aos']);
  console.log('Running: ' + cmd + ' ' + extraArgs);
  return spawnSync(cmd, extraArgs);
}

function spawnSync(spCmd = '', spArgs = []) {
  let doUnpack = spawn.sync(spCmd, spArgs, {
    stdio: 'pipe'
  });
  if (doUnpack.error) {
    console.error('Error 7za exited with code ' + doUnpack.error);
    console.error('resolve the problem and re-install using:');
    console.error('npm install');
  }
  return doUnpack;
}

function makeExecutable(binary = [], binaryFolder = '') {
  binary.forEach((file) => {
    try {
      if (file == 'Codecs')
        file = 'Codecs' + sep + 'Rar.so'
      fs.chmodSync(join(binaryFolder, file), 777);
    } catch (err) {
      console.error(err);
    }
  });
}

let extractionPromises = [];
let platforms = [linuxPlatform, appleMacPlatform, windowsOtherPlatform];
if (process.platform == 'win32')
  platforms = [linuxPlatform, appleMacPlatform, windowsPlatform, windowsOtherPlatform];

platforms.forEach((dataFor) => {
  fs.mkdir(dataFor.destination, (err) => {
    if (err) { }
  });
  const extracted = retrieve({
    url: _7zAppUrl + dataFor.extraName,
    dest: dataFor.extraSourceFile
  })
    .then(() => {
      return platformUnpacker(dataFor)
        .then(() => {
          dataFor.binaryFiles.forEach((file) => {
            try {
              let from = join(dataFor.destination, dataFor.extractFolder, dataFor.appLocation, file);
              let to = join(dataFor.binaryDestinationDir, file);
              if (file.includes('.sfx')) {
                file = file.replace(/.sfx/g, dataFor.platform + '.sfx');
                let location = join(binaryDestination, (process.platform == 'win32' && !dataFor.source.includes('7z1900.exe') ? 'other32' : ''));
                to = join(location, file);
                fs.copySync(from, to, {
                  overwrite: true
                });

                if (dataFor.platform != 'win32')
                  makeExecutable([file], location);
                console.log('Sfx module ' + file + ' copied successfully!');
              } else if (dataFor.platform == process.platform) {
                to = to.replace(/7z_/g, '7z');
                fs.copySync(from, to, {
                  overwrite: true
                });

                if (dataFor.platform != 'win32')
                  makeExecutable([file.replace(/7z_/g, '7z')], dataFor.binaryDestinationDir);
              }
            } catch (err) {
              throw (err);
            }
          });

          console.log('Binaries copied successfully!');
          fs.unlinkSync(dataFor.source);

          return dataFor;
        })
        .catch((err) => {
          throw ('Unpacking for platform failed: ' + err);
        });
    })
    .catch((err) => {
      throw ('Error downloading file: ' + err);
    });

  extractionPromises.push(extracted);
});

Promise.all(extractionPromises)
  .then((extracted) => {
    extracted.forEach(function (dataFor) {
      if (dataFor.sfxModules && dataFor.platform == process.platform) {
        try {
          const directory = (process.platform == "win32") ? dataFor.binaryDestinationDir : binaryDestination;
          extraUnpack(join(binaryDestination, (process.platform == "win32") ? '7z.exe' : '7z'),
            dataFor.extraSourceFile,
            directory,
            dataFor.sfxModules
          );

          dataFor.sfxModules.forEach((file) => {
            console.log('Sfx module ' + file + ' copied successfully!');
          });
        } catch (err) {
          console.error(err);
        }
      }

      fs.unlinkSync(dataFor.extraSourceFile);
      fs.removeSync(dataFor.destination);
    });
  })
  .catch((err) => console.log(err));
