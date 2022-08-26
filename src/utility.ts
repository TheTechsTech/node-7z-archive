'use strict';

import when from 'when';
import { EOL } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join, sep, sep as nativeSeparator, normalize } from 'path';
import { spawning, isUndefined, isString, isWindows, isBool } from 'node-sys';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const Binary = function (override = false, binary = '7z') {
    let path = join(
        __dirname,
        '..',
        'binaries',
        override === true
            ? process.platform + sep + 'other32'
            : process.platform
    );
    let filename = isWindows() ? binary + '.exe' : binary;
    return {
        path: path,
        filename: filename,
        filepath: join(path, filename),
    };
};

/**
 * Transform a list of files that can be an array or a string into a string
 * that can be passed to the `run` function as part of the `command` parameter.
 * @param  {string|array} files
 * @return {string}
 */
export const Files = function (files: string | string[]): string {
    if (isUndefined(files)) {
        return '';
    }

    let toProcess = '';

    if (Array.isArray(files)) {
        files.forEach(function (f) {
            toProcess += '"' + f + '" ';
        });
        toProcess = toProcess.trim();
    } else {
        toProcess = '"' + files + '"';
    }

    return toProcess;
};

/**
 * @param {string} path A path with the native directory separator.
 * @return {string} A path with / for directory separator.
 */
export const ReplaceNativeSeparator = function (path: string): string {
    let result = path,
        next;

    while ((next = result.replace(nativeSeparator, '/')) !== result) {
        result = next;
    }

    return result;
};

/**
 * @param {string} binary which binary to use.
 * @param {string} command The command to run.
 * @param {Array} switches Options for 7-Zip as an array.
 * @param {boolean} override should binary directory change?
 *
 * @progress {string} stdout message.
 * @reject {Error} The error issued by 7-Zip.
 * @reject {number} Exit code issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export function Run(
    binary: string = '7z',
    command: string | null = null,
    switches: { files?: string[] } = {},
    override: boolean = false
) {
    return when.promise(function (
        fulfill: (arg0: string[]) => void,
        reject: (arg0: Error) => void,
        progress: (arg0: any) => void
    ) {
        // Parse the command variable. If the command is not a string reject the
        // Promise. Otherwise transform the command into two variables: the command
        // name and the arguments.
        if (typeof command !== 'string' || !isString(binary)) {
            return reject(new Error('Command and Binary must be a string'));
        }

        // add platform binary to command
        let sevenBinary = Binary(override, binary);
        let cmd = sevenBinary.filepath;
        let args = [command.split(' ')[0]];
        // Parse and add command (non-switches parameters) to `args`.
        let regexpCommands = /"((?:\\.|[^"\\])*)"/g;
        let commands = command.match(regexpCommands);

        if (commands) {
            commands.forEach(function (c) {
                c = c.replace(/\//g, sep);
                c = c.replace(/\\/g, sep);
                c = normalize(c);
                args.push(c);
            });
        }

        // Special treatment for the output switch because it is exposed as a
        // parameter in the API and not as a option. Plus wildcards can be passed.
        let regexpOutput = /-o"((?:\\.|[^"\\])*)"/g;
        let output = command.match(regexpOutput);

        if (output) {
            args.pop();
            let o = output[0];
            o = o.replace(/\//g, sep);
            o = o.replace(/\\/g, sep);
            o = o.replace(/"/g, '');
            o = normalize(o);
            args.push(o);
        }

        if (switches.files) {
            let files = switches.files;
            delete switches.files;

            if (Array.isArray(files)) {
                files.forEach(function (s) {
                    args.push(s);
                });
            } else {
                args.push(files);
            }

            args.push('-r');
            args.push('-aoa');
        }

        // Add switches to the `args` array.
        let switchesArray = Switches(switches);
        switchesArray.forEach(function (s) {
            args.push(s);
        });
        // Remove now double quotes. If present in the spawned process 7-Zip will
        // read them as part of the paths (e.g.: create a `"archive.7z"` with
        // quotes in the file-name);
        args.forEach(function (e, i) {
            if (!isString(e)) {
                return;
            }

            if (e.substr(0, 1) !== '-') {
                e = e.replace(/^"/, '');
                e = e.replace(/"$/, '');
                args[i] = e;
            }
        });
        // Add bb2 to args array so we get file info
        args.push('-bb2');
        // When an stdout is emitted, parse it. If an error is detected in the body
        // of the stdout create an new error with the 7-Zip error message as the
        // error's message. Otherwise progress with stdout message.
        let err: Error;
        let reg = new RegExp('Error:(' + EOL + '|)?(.*)', 'i');

        let onprogress = (object: { output: any }) => {
            progress(object.output);
            return args;
        };

        let onerror = (data: string) => {
            let res = reg.exec(data);

            if (res) {
                err = new Error(res[2].substr(0, res[2].length - 1));
                return err;
            }
            return;
        };

        let res = {
            cmd: cmd,
            args: args,
            options: {
                stdio: 'pipe',
                onprogress: onprogress,
                onerror: onerror,
            },
        };
        spawning(res.cmd, res.args, res.options)
            .then((data) => {
                if (data === args) return fulfill(args);
                return reject(err);
            })
            .catch((err: Error) => {
                return reject(err);
            });
    });
}

/**
 * Transform an object of options into an array that can be passed to the
 * spawned child process.
 * @param  {Object} switches An object of options
 * @return {array} Array to pass to the `run` function.
 */
export const Switches = function (switches: Record<string, any>) {
    // Default value for switches
    switches = switches || {};
    var a = [];
    // Set default values of boolean switches
    switches.so = switches.so === true ? true : false;
    switches.spl = switches.spl === true ? true : false;
    switches.ssc = switches.ssc === false ? false : true;
    switches.ssw = switches.ssw === true ? true : false;
    switches.y = switches.y === false ? false : true;
    var s;

    /*jshint forin:false*/
    for (s in switches) {
        // Switches that are set or not. Just add them to the array if they are
        // present. Differ the `ssc` switch treatment to later in the function.
        if (switches[s] === true && s !== 'ssc') {
            a.push('-' + s);
        }

        // Switches with a value. Detect if the value contains a space. If it does
        // wrap the value with double quotes. Else just add the switch and its value
        // to the string. Doubles quotes are used for parsing with a RegExp later.
        if (!isBool(switches[s])) {
            // Special treatment for wildcards
            if (s === 'wildcards') {
                a.unshift(switches.wildcards);
            } // Allow raw switches to be added to the command, repeating switches like
            // -i is not possible otherwise.
            else if (s === 'raw') {
                switches.raw.forEach(function (rawValue: any) {
                    a.push(rawValue);
                });
            } else if (switches[s].indexOf(' ') === -1) {
                a.push('-' + s + switches[s]);
            } else {
                a.push('-' + s + '"' + switches[s] + '"');
            }
        }

        // Special treatment for `-ssc`
        if (s === 'ssc') {
            a.push(switches.ssc === true ? '-ssc' : '-ssc-');
        }
    }

    return a;
};
