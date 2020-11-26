'use strict';

const add = require('./add'),
  when = require('when'),
  path = require('path'),
  fs = require('fs-extra'),
  binary = require('../util/path'),
  platformTitle = {
    win32: 'Windows OS',
    darwin: 'Apple macOS',
    linux: 'Linux OS'
  },
  title = ' installation package created on ' + platformTitle[process.platform] + '.',
  prompt = 'Do you want to install ';

// our parent folder path
const pwd = __dirname.split(path.sep);

function getPath(module, folder = pwd) {
  if (folder.length < 1) {
    return null;
  }

  const nodePath = folder.concat(["node_modules"]).join(path.sep);
  const parent = module ? path.join(nodePath, module) : nodePath;
  if (fs.existsSync(parent)) {
    return parent.includes('node_modules') ? path.join(parent, '..' + path.sep + '..') : nodePath;
  }

  let find = getPath(module, folder.slice(0, -1));
  if (!find) {
    console.error('Could not find NPM node_modules for: ' + module);
    return path.join(__dirname, '..');
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
module.exports = function (
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
    let SfxDirectory = path.join(directory, 'SfxPackages');
    fs.ensureDirSync(SfxDirectory);
    let override = ((process.platform == 'win32') && (platform == 'linux' || platform == 'darwin'));
    let binaryDirectory = binary({}, override);
    let configFile = path.join(binaryDirectory.path, 'config.txt');
    //let configFile = path.join(SfxDirectory, 'config.txt');
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

    if (type == 'gui')
      var sfxModule = '7zSD' + (process.platform == 'win32' ? 'win32' : 'other32');
    else
      var sfxModule = (platform == 'win32' ? '7zS2con' : '7zCon') + (platform == 'win32' ? 'other32' : platform);

    let sfx = name.includes(extension) ? name : name + extension;
    let list = Array.isArray(files) ? [configFile].concat(files) : configFile + ' ' + files;
    sfx = path.join(SfxDirectory, sfx);
    let params = Object.assign(options, {
      sfx: sfxModule + '.sfx'
    });

    return add(sfx, list, params, override)
      .progress((data) => {
        return progress(data);
      })
      .then((data) => {
        fs.unlink(configFile, (err) => {
          if (err) console.error(err);
          if (fs.existsSync(sfx)) {
            return resolve(sfx);
          } else {
            console.error(data);
            return reject('Failed! The Sfx application could not be created!');
          }
        });
      })
      .catch((err) => {
        fs.removeSync(configFile);
        return reject(err)
      });
  });
}
