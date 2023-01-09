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
    if (isUndefined(files)) return '';
    return (Array.isArray(files) ? files : [files])
        .map((file) => `"${file}"`)
        .join(' ');
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
    return when.promise<string[]>(function (
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
            const files = switches.files;
            delete switches.files;

            const filesArray = Array.isArray(files) ? files : [files];
            args = [...args, ...filesArray, '-r', '-aoa'];
        }

        // Add switches to the `args` array.
        let switchesArray = Switches(switches);
        args = [...args, ...switchesArray];

        // Remove double quotes. If present in the spawned process, 7-Zip will
        // read them as part of the path (e.g.: create a `"archive.7z"` with
        // quotes in the file-name);
        args.forEach(function (arg, i) {
            if (!isString(arg)) return;
            const doubleQuotesMatch = arg.match(/^\"(.+)\"$/);
            if (doubleQuotesMatch) {
                args[i] = doubleQuotesMatch[1];
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
                err = new Error(res[2].slice(0, -1));
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
    let a = [];
    // Set default values of boolean switches
    for (const key of ['so', 'spl', 'ssw']) {
        if (switches[key] !== true) switches[key] = false;
    }
    for (const key of ['ssc', 'y']) {
        if (switches[key] !== false) switches[key] = true;
    }

    /*jshint forin:false*/
    for (const s in switches) {
        // Switches that are set or not. Just add them to the array if they are
        // present. Differ the `ssc` switch treatment to later in the function.
        if (switches[s] === true && s !== 'ssc') {
            a.push('-' + s);
        }

        // Switches with a value. Detect if the value contains a space. If it does
        // wrap the value with double quotes. Else just add the switch and its value
        // to the string. Doubles quotes are used for parsing with a RegExp later.
        if (!isBool(switches[s])) {
            if (s === 'wildcards') {
                // Special treatment for wildcards
                a.unshift(switches.wildcards);
            } else if (s === 'raw') {
                // Allow raw switches to be added to the command, 
                // otherwise repeating switches like -i is not possible.                
                a = [...a, ...switches.raw];
            } else {
                const quote = switches[s].includes(' ') ? '"' : '';
                a.push(`-${s}${quote}${switches[s]}${quote}`);
            }
        }

        // Special treatment for `-ssc`
        if (s === 'ssc') {
            a.push(switches.ssc === true ? '-ssc' : '-ssc-');
        }
    }

    return a;
};
