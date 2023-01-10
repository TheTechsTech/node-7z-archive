'use strict';

import { createArchive } from './index.js';
import when from 'when';
import { fileURLToPath } from 'url';
import { dirname, sep, join } from 'path';
import fs from 'fs-extra';
import { Binary } from './utility.js';
import { isWindows } from 'node-sys';
const platformTitle = {
    win32: 'Windows OS',
    darwin: 'Apple macOS',
    linux: 'Linux OS',
} as Record<NodeJS.Platform, string>;
const title =
    ' installation package created on ' + platformTitle[process.platform] + '.';
const prompt = 'Do you want to install ';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

// our parent folder path
const pwd = __dirname.split(sep);

/* c8 ignore next 18 */
function getPath(module: string, folder = pwd): string | null {
    if (folder.length < 1) {
        return null;
    }

    const nodePath = folder.concat(['node_modules']).join(sep);
    const parent = module ? join(nodePath, module) : nodePath;

    if (fs.existsSync(parent)) {
        return parent.includes('node_modules')
            ? join(parent, '..' + sep + '..')
            : nodePath;
    }

    let find = getPath(module, folder.slice(0, -1));

    if (!find) {
        console.error('Could not find NPM node_modules for: ' + module);
        return join(__dirname, '..');
    }

    return find;
}

/**
let config = fs.createReadStream('configFile', {
  flags: 'r',
  encoding: "binary",
});
let archive = fs.createReadStream('archiveFile', {
  flags: 'r',
  encoding: "binary",
});

let SfxDirectory = fs.createWriteStream('Sfx', {
  flags: 'w',
  encoding: "binary",
});

config.pipe(SfxDirectory, {
  end: false
});
archive.pipe(SfxDirectory, {
  end: false
});
*/

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
export function createSfx(
    name: string,
    files: Array<string>,
    destination: string = '',
    options: Record<string, any> = {
        title: null,
        beginPrompt: null,
        progress: null,
    },
    type: string = 'gui',
    platform: string = 'win32',
    extension: string = '.exe'
) {
    return when.promise<string>(function (
        resolve: (sfx: string) => void,
        reject: (err: string) => void,
        progress: (data: any) => any
    ) {
        let directory = undefined;
        if (destination && fs.existsSync(destination))
            directory = destination;
        else {
            const whenPath = getPath('when');
            if (!whenPath) return reject('Path not found!');
            directory = whenPath;
        }

        let SfxDirectory = join(directory, 'SfxPackages');
        fs.ensureDirSync(SfxDirectory);
        const override = isWindows() && ['linux', 'darwin'].includes(platform);
        let binaryDirectory = Binary(override);
        let configFile = join(binaryDirectory.path, 'config.txt');
        //let configFile = join(SfxDirectory, 'config.txt');
        let config = fs.createWriteStream(configFile, {
            flags: 'w+',
            encoding: 'utf8',
        });
        let text = '';
        config.write(';!@Install@!UTF-8!' + '\n');
        text = options.title || name + title;
        config.write('Title=' + text + '\n');
        text = options.prompt || options.beginPrompt || prompt + name;
        config.write('BeginPrompt=' + text + '?\n');
        text = options.progress || 'no';
        config.write('Progress=' + text + '\n');
        text = options.runProgram || options.run || null;
        if (text) config.write('RunProgram=' + text + '\n');
        if (options.directory)
            config.write('Directory=' + options.directory + '\n');
        text = options.executeFile || options.execute || null;
        if (text) config.write('ExecuteFile=' + text + '\n');
        text = options.executeParameters || options.parameters || null;
        if (text) config.write('ExecuteParameters=' + text + '\n');
        config.write(';!@InstallEnd@!' + '\n');
        config.close();
        [
            'title', 
            'prompt', 
            'beginPrompt', 
            'progress', 
            'run', 
            'runProgram', 
            'directory', 
            'execute', 
            'executeFile', 
            'parameters', 
            'executeParameters'
        ].forEach((name) => delete options[name]);
        const sfxModule = type === 'gui' 
            ? '7zwin32.sfx' 
            : `7zCon${platform}.sfx`;
        const sfxFilename = name.includes(extension) 
            ? name 
            : name + extension;
        const sfx = join(SfxDirectory, sfxFilename);
        let list = Array.isArray(files) 
            ? [configFile, ...files]
            : `${configFile} ${files}`;
        let params = Object.assign(options, {
            sfx: sfxModule,
        });
        createArchive(sfx, list, params, override)
            .progress((data: any) => {
                return progress(data);
            })
            .then((data: any) => {
                fs.unlink(configFile, (err) => {
                    if (err) console.error(err);

                    if (fs.existsSync(sfx)) {
                        return resolve(sfx);
                        /* c8 ignore next 4 */
                    } 

                    console.error(data);
                    return reject('Failed! The Sfx application could not be created!');
                });
            })
            .catch((err: string) => {
                fs.removeSync(configFile);
                return reject(err);
            });
    });
}
