'use strict';

import createArchive from './createArchive.mjs';
import when from 'when';
import {
  fileURLToPath
} from 'url';
import {
  dirname,
  sep,
  join
} from 'path';
import fs from 'fs-extra';
import binary from '../util/binary.mjs';

const platformTitle = {
  win32: 'Windows OS',
  darwin: 'Apple macOS',
  linux: 'Linux OS'
};
const title = ' installation package created on ' + platformTitle[process.platform] + '.';
const prompt = 'Do you want to install ';

const __filename = fileURLToPath(
  import.meta.url);
const __dirname = dirname(__filename);

// our parent folder path
const pwd = __dirname.split(sep);

/* c8 ignore next 18 */
function getPath(module, folder = pwd) {
  if (folder.length < 1) {
    return null;
  }

  const nodePath = folder.concat(["node_modules"]).join(sep);
  const parent = module ? join(nodePath, module) : nodePath;
  if (fs.existsSync(parent)) {
    return parent.includes('node_modules') ? join(parent, '..' + sep + '..') : nodePath;
  }

  let find = getPath(module, folder.slice(0, -1));
  if (!find) {
    console.error('Could not find NPM node_modules for: ' + module);
    return join(__dirname, '..');
  }

  return find;
};

/**
 * Creates self extracting archive, an Installation Package.
 *
 * @param {String} name Application name.
 * @param {Array} files Files to add.
 * @param {String} destination Application root for the `SfxPackages` directory, will default to package root.
 * - All Sfx package archives are stored in the **created** `SfxPackages` directory.
 * - The `destination` directory must already exists.
 * @param {Object} options Object for Installer config and 7-zip switch options.
 *
 * `{`
 *
 * `title:` - Window title message, Default "`name` installation package created on `Current running platform OS`"
 *
 * `beginPrompt:` - Begin Prompt message, Default "Do you want to install `name`?""
 *
 * `installPath:` - "path_to_extract", Sets the extraction path. The extraction folder will not be deleted after the extraction.
 *
 * `progress:` - Value can be "yes" or "no". Default value is "yes".
 *
 * `runProgram:` - Command for executing. Default value is "setup.exe".
 * Substring `% % T` will be replaced with path to temporary folder,
 * where files were extracted
 *
 * `directory:` - Directory prefix for `RunProgram`. Default value is `.\`
 *
 * `executeFile:` Name of file for executing
 *
 * `executeParameters:` Parameters for `ExecuteFile`
 *
 * `}`
 *
 * `NOTE:` There are two ways to run program: `RunProgram` and `ExecuteFile`.
 * - Use `RunProgram`, if you want to run some program from .7z archive.
 * - Use `ExecuteFile`, if you want to open some document from .7z archive or
 * if you want to execute some command from Windows.
 * @param {String} type Application type `gui` or `console`. Default `gui`. Only `console` possible on **Linux** and **Mac** OS.
 * @param {String} platform What platform application targeting? Either `win32`, `darwin`, or `linux`.
 * @param {String} extension Binary extension name.
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export default function (
  name,
  files,
  destination = '',
  options = {
    title: null,
    beginPrompt: null,
    progress: null
  },
  type = 'gui',
  platform = 'win32',
  extension = '.exe') {
  return when.promise(function (resolve, reject, progress) {
    let directory = (destination != '' && fs.existsSync(destination)) ? destination : getPath('when');
    let SfxDirectory = join(directory, 'SfxPackages');
    fs.ensureDirSync(SfxDirectory);
    let override = ((process.platform == 'win32') && (platform == 'linux' || platform == 'darwin'));
    let binaryDirectory = binary(override);
    let configFile = join(binaryDirectory.path, 'config.txt');
    //let configFile = join(SfxDirectory, 'config.txt');
    let config = fs.createWriteStream(configFile, {
      flags: 'w+',
      encoding: 'utf8'
    });

    let text = '';
    config.write(';!@Install@!UTF-8!' + "\n");
    text = options.title || name + title;
    config.write('Title=' + text + "\n");
    text = options.beginPrompt || prompt + name;
    config.write('BeginPrompt=' + text + "?\n");
    text = options.progress || 'no';
    config.write('Progress=' + text + "\n");

    if (options.runProgram)
      config.write('RunProgram=' + options.runProgram + "\n");
    if (options.directory)
      config.write('Directory=' + options.directory + "\n");
    if (options.installPath)
      config.write('InstallPath=' + options.installPath + "\n");
    if (options.executeFile)
      config.write('ExecuteFile=' + options.executeFile + "\n");
    if (options.executeParameters)
      config.write('ExecuteParameters=' + options.executeParameters + "\n");

    config.write(';!@InstallEnd@!' + "\n");
    config.close();

    delete options.title;
    delete options.beginPrompt;
    delete options.installPath;
    delete options.progress;
    delete options.runProgram;
    delete options.directory;
    delete options.executeFile;
    delete options.executeParameters;

    let sfxModule = (type == 'gui') ? '7zwin32.sfx' : '7zCon' + platform + '.sfx';
    let sfx = name.includes(extension) ? name : name + extension;
    let list = Array.isArray(files) ? [configFile].concat(files) : configFile + ' ' + files;
    sfx = join(SfxDirectory, sfx);
    let params = Object.assign(options, {
      sfx: sfxModule
    });

    return createArchive(sfx, list, params, '7z', override)
      .progress((data) => {
        return progress(data);
      })
      .then((data) => {
        fs.unlink(configFile, (err) => {
          if (err) console.error(err);
          if (fs.existsSync(sfx)) {
            return resolve(sfx);
            /* c8 ignore next 4 */
          } else {
            console.error(data);
            return reject('Failed! The Sfx application could not be created!');
          }
        });
      })
      .catch(() => {
        // Override try different binary
        return createArchive(sfx, list, params, '7za', override)
          .progress((data) => {
            return progress(data);
          })
          .then((data) => {
            fs.unlink(configFile, (err) => {
              if (err) console.error(err);
              if (fs.existsSync(sfx)) {
                return resolve(sfx);
                /* c8 ignore next 4 */
              } else {
                console.error(data);
                return reject('Failed! The Sfx application could not be created!');
              }
            });
          })
          .catch((err) => {
            fs.removeSync(configFile);
            return reject(err);
          });
      });
  });
}
