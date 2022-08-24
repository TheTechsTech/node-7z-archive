'use strict';

import when from 'when';
import { Files, ReplaceNativeSeparator, Run } from './utility';
import { createSfx } from './createSfx';
import { isWindows } from 'node-sys';

function retry(
    command,
    options,
    override,
    progress,
    onprogress,
    resolve,
    reject,
    archive
) {
    // Start the command
    return Run('7z', command, options, override)
        .progress(function (data) {
            return progress(onprogress(data));
        }) // When all is done resolve the Promise.
        .then(function (args) {
            return resolve(args);
        }) // Catch the error and pass it to the reject function of the Promise.
        .catch(function () {
            console.error(archive + ' failed using `7z`, retying with `7za`.');
            Run('7za', command, options, override)
                .progress(function (data) {
                    return progress(onprogress(data));
                })
                .then(function (args) {
                    return resolve(args);
                })
                .catch(function (err) {
                    return reject(err);
                });
        });
}

/**
 * Create/add content to an archive.
 *
 * @param filepath {string} Path to the archive.
 * @param files {string|array} Files to add.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const createArchive =
    (SevenZip.createArchive =
    SevenZip.add =
        function (filepath, files, options, override = false) {
            return when.promise(function (resolve, reject, progress) {
                /**
                 * When a stdout is emitted, parse each line and search for a pattern.When
                 * the pattern is found, extract the file (or directory) name from it and
                 * pass it to an array. Finally returns this array.
                 */
                function onprogress(data) {
                    let entries = [];
                    data.split('\n').forEach(function (line) {
                        if (line.substr(0, 1) === '+') {
                            entries.push(
                                ReplaceNativeSeparator(
                                    line.substr(2, line.length)
                                )
                            );
                        }
                    });
                    return entries;
                }

                // Convert array of files into a string if needed.
                files = Files(files);
                // Create a string that can be parsed by `run`.
                let command = 'a "' + filepath + '" ' + files;
                // Start the command
                return retry(
                    command,
                    options,
                    override,
                    progress,
                    onprogress,
                    resolve,
                    reject,
                    'CreateArchive'
                );
            });
        });

/**
 * Delete content from an archive.
 *
 * @param filepath {string} Path to the archive.
 * @param files {string|array} Files to remove.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const deleteArchive =
    (SevenZip.deleteArchive =
    SevenZip.delete =
        function (filepath, files, options, override = false) {
            return new Promise(function (resolve, reject) {
                // Convert array of files into a string if needed.
                files = Files(files);
                // Create a string that can be parsed by `run`.
                let command = 'd "' + filepath + '" ' + files;
                // Start the command
                Run('7z', command, options, override) // When all is done resolve the Promise.
                    .then(function (args) {
                        return resolve(args);
                    }) // Catch the error and pass it to the reject function of the Promise.
                    .catch(function () {
                        console.error(
                            'DeleteArchive failed using `7z`, retying with `7za`.'
                        );
                        Run('7za', command, options, override)
                            .then(function (args) {
                                return resolve(args);
                            })
                            .catch(function (err) {
                                return reject(err);
                            });
                    });
            });
        });

/**
 * Extract an archive.
 *
 * @param {string} archive Path to the archive.
 * @param {string} dest Destination.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const extractArchive =
    (SevenZip.extractArchive =
    SevenZip.extract =
        function (filepath, dest = '*', options = {}, override = false) {
            return when.promise(function (resolve, reject, progress) {
                /**
                 * When a stdout is emitted, parse each line and search for a pattern.When
                 * the pattern is found, extract the file (or directory) name from it and
                 * pass it to an array. Finally returns this array.
                 */
                function onprogress(data) {
                    let entries = [];
                    data.split('\n').forEach(function (line) {
                        if (line.substr(0, 1) === '-') {
                            entries.push(
                                ReplaceNativeSeparator(
                                    line.substr(2, line.length)
                                )
                            );
                        }
                    });
                    return entries;
                }

                // Create a string that can be parsed by `run`.
                let command = 'e "' + filepath + '" -o"' + dest + '" ';
                // Start the command
                return retry(
                    command,
                    options,
                    override,
                    progress,
                    onprogress,
                    resolve,
                    reject,
                    'ExtractArchive'
                );
            });
        });

/**
 * Extract an archive with full paths.
 *
 * @param filepath {string} Path to the archive.
 * @param dest {string} Destination.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const fullArchive =
    (SevenZip.fullArchive =
    SevenZip.extractFull =
        function (filepath, dest = '*', options = {}, override = false) {
            return when.promise(function (resolve, reject, progress) {
                /**
                 * When a stdout is emitted, parse each line and search for a pattern.When
                 * the pattern is found, extract the file (or directory) name from it and
                 * pass it to an array. Finally returns this array.
                 */
                function onprogress(data) {
                    let entries = [];
                    data.split('\n').forEach(function (line) {
                        if (line.substr(0, 1) === '-') {
                            entries.push(
                                ReplaceNativeSeparator(
                                    line.substr(2, line.length)
                                )
                            );
                        }
                    });
                    return entries;
                }

                // Create a string that can be parsed by `run`.
                let command = 'x "' + filepath + '" -o"' + dest + '" ';
                return retry(
                    command,
                    options,
                    override,
                    progress,
                    onprogress,
                    resolve,
                    reject,
                    'FullArchive'
                );
            });
        });

/**
 * List contents of archive.
 *
 * @param filepath {string} Path to the archive.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @progress {array} Listed files and directories.
 * @resolve {Object} Tech spec about the archive.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const listArchive =
    (SevenZip.listArchive =
    SevenZip.list =
        function (filepath, options, override = false) {
            return when.promise(function (resolve, reject, progress) {
                let spec = {};

                /* jshint maxlen: 130 */
                let regex =
                    /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ([\.D][\.R][\.H][\.S][\.A]) +(\d+) +(\d+)? +(.+)/;

                /* jshint maxlen: 80 */
                let buffer = ''; //Store incomplete line of a progress data.

                /**
                 * When a stdout is emitted, parse each line and search for a pattern.When
                 * the pattern is found, extract the file (or directory) name from it and
                 * pass it to an array. Finally returns this array.
                 */
                function onprogress(data) {
                    let entries = [];

                    if (buffer.length > 0) {
                        data = buffer + data;
                        buffer = '';
                    }

                    data.split('\n').forEach(function (line) {
                        // Populate the tech specs of the archive that are passed to the
                        // resolve handler.
                        if (line.substr(0, 7) === 'Path = ') {
                            spec.path = line.substr(7, line.length);
                        } else if (line.substr(0, 7) === 'Type = ') {
                            spec.type = line.substr(7, line.length);
                        } else if (line.substr(0, 9) === 'Method = ') {
                            spec.method = line.substr(9, line.length);
                        } else if (line.substr(0, 16) === 'Physical Size = ') {
                            spec.physicalSize = parseInt(
                                line.substr(16, line.length),
                                10
                            );
                        } else if (line.substr(0, 15) === 'Headers Size = ') {
                            spec.headersSize = parseInt(
                                line.substr(15, line.length),
                                10
                            );
                        } else {
                            // Parse the stdout to find entries
                            let res = regex.exec(line);

                            if (res) {
                                let e = {
                                    date: new Date(res[1]),
                                    attr: res[2],
                                    size: parseInt(res[3], 10),
                                    name: ReplaceNativeSeparator(res[5]),
                                };
                                entries.push(e);
                            } // Line may be incomplete, Save it to the buffer.
                            else buffer = line;
                        }
                    });
                    return entries;
                }

                // Create a string that can be parsed by `run`.
                let command = 'l "' + filepath + '" ';
                Run(isWindows() ? '7z' : '7za', command, options, override)
                    .progress(function (data) {
                        return progress(onprogress(data));
                    })
                    .then(function () {
                        return resolve(spec);
                    })
                    .catch(function (err) {
                        if (isWindows()) {
                            console.error(
                                'ListArchive failed using `7z`, retying with `7za`.'
                            );
                            Run('7za', command, options, override)
                                .progress(function (data) {
                                    return progress(onprogress(data));
                                })
                                .then(function (args) {
                                    return resolve(args);
                                })
                                .catch(function (err) {
                                    return reject(err);
                                });
                        } else {
                            return reject(err);
                        }
                    });
            });
        });

/**
 * Extract only selected files from archive.
 *
 * @param {string} filepath Path to the archive.
 * @param {string} dest Destination.
 * @param {string|array} files Files in archive to extract.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const onlyArchive =
    (SevenZip.onlyArchive =
    SevenZip.only =
        function (filepath, dest, files, options = {}, override = false) {
            return when.promise(function (resolve, reject, progress) {
                options = Object.assign(options, {
                    files: files,
                });

                /**
                 * When a stdout is emitted, parse each line and search for a pattern.When
                 * the pattern is found, extract the file (or directory) name from it and
                 * pass it to an array. Finally returns this array.
                 */
                function onprogress(data) {
                    let entries = [];
                    data.split('\n').forEach(function (line) {
                        if (line.substr(0, 1) === '-') {
                            entries.push(
                                ReplaceNativeSeparator(
                                    line.substr(2, line.length)
                                )
                            );
                        }
                    });
                    return entries;
                }

                // Create a string that can be parsed by `run`.
                let command = 'e "' + filepath + '" -o"' + dest + '"';
                // Start the command
                return retry(
                    command,
                    options,
                    override,
                    progress,
                    onprogress,
                    resolve,
                    reject,
                    'OnlyArchive'
                );
            });
        });

/**
 * Renames files in archive.
 *
 * @param filepath {string} Path to the archive.
 * @param files {string} Files pairs to rename in archive.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const renameArchive =
    (SevenZip.renameArchive =
    SevenZip.rename =
        function (filepath, files, options, override = false) {
            return when.promise(function (resolve, reject, progress) {
                /**
                 * When a stdout is emitted, parse each line and search for a pattern.When
                 * the pattern is found, extract the file (or directory) name from it and
                 * pass it to an array. Finally returns this array.
                 */
                function onprogress(data) {
                    let entries = [];
                    data.split('\n').forEach(function (line) {
                        if (line.substr(0, 1) === 'U') {
                            entries.push(
                                ReplaceNativeSeparator(
                                    line.substr(2, line.length)
                                )
                            );
                        }
                    });
                    return entries;
                }

                // Convert array of files into a string if needed.
                files = Files(files);
                // Create a string that can be parsed by `run`.
                let command = 'rn "' + filepath + '" ' + files;
                // Start the command
                return retry(
                    command,
                    options,
                    override,
                    progress,
                    onprogress,
                    resolve,
                    reject,
                    'RenameArchive'
                );
            });
        });

/**
 * Test integrity of archive.
 *
 * @param filepath {string} Path to the archive.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const testArchive =
    (SevenZip.testArchive =
    SevenZip.test =
        function (filepath, options, override = false) {
            return when.promise(function (resolve, reject, progress) {
                /**
                 * When a stdout is emitted, parse each line and search for a pattern.When
                 * the pattern is found, extract the file (or directory) name from it and
                 * pass it to an array. Finally returns this array.
                 */
                function onprogress(data) {
                    let entries = [];
                    data.split('\n').forEach(function (line) {
                        if (line.substr(0, 1) === 'T') {
                            entries.push(
                                ReplaceNativeSeparator(
                                    line.substr(2, line.length)
                                )
                            );
                        }
                    });
                    return entries;
                }

                // Create a string that can be parsed by `run`.
                let command = 't "' + filepath + '"';
                // Start the command
                return retry(
                    command,
                    options,
                    override,
                    progress,
                    onprogress,
                    resolve,
                    reject,
                    'TestArchive'
                );
            });
        });

/**
 * Update content to an archive.
 *
 * @param filepath {string} Path to the archive.
 * @param files {string} Files to update.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const updateArchive =
    (SevenZip.updateArchive =
    SevenZip.update =
        function (filepath, files, options, override = false) {
            return when.promise(function (resolve, reject, progress) {
                /**
                 * When a stdout is emitted, parse each line and search for a pattern.When
                 * the pattern is found, extract the file (or directory) name from it and
                 * pass it to an array. Finally returns this array.
                 */
                function onprogress(data) {
                    let entries = [];
                    data.split('\n').forEach(function (line) {
                        if (line.substr(0, 1) === 'U') {
                            entries.push(
                                ReplaceNativeSeparator(
                                    line.substr(2, line.length)
                                )
                            );
                        }
                    });
                    return entries;
                }

                // Convert array of files into a string if needed.
                files = Files(files);
                // Create a string that can be parsed by `run`.
                let command = 'u "' + filepath + '" ' + files;
                // Start the command
                return retry(
                    command,
                    options,
                    override,
                    progress,
                    onprogress,
                    resolve,
                    reject,
                    'UpdateArchive'
                );
            });
        });

/**
 * Creates Windows self extracting archive, an Installation Package.
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
 *
 * @resolve {string} full filepath
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const createSfxWindows = (SevenZip.windowsSfx = function (
    name,
    files,
    destination,
    options,
    type
) {
    return createSfx(name, files, destination, options, type, 'win32', '.exe');
});

/**
 * Creates Linux self extracting archive.
 *
 * @param {String} name Application name.
 * @param {Array} files Files to add.
 * @param {String} destination Application root for the `SfxPackages` directory, will default to package root.
 * - All Sfx package archives are stored in the **created** `SfxPackages` directory.
 * - The `destination` directory must already exists.
 * @param {Object} options Object for 7-zip switch options.
 *
 * @resolve {string} full filepath
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const createSfxLinux = (SevenZip.linuxSfx = function (
    name,
    files,
    destination,
    options
) {
    return createSfx(
        name,
        files,
        destination,
        options,
        'console',
        'linux',
        '.elf'
    );
});

/**
 * Creates Apple macOS self extracting archive.
 *
 * @param {String} name Application name.
 * @param {Array} files Files to add.
 * @param {String} destination Application root for the `SfxPackages` directory, will default to package root.
 * - All Sfx package archives are stored in the **created** `SfxPackages` directory.
 * - The `destination` directory must already exists.
 * @param {Object} options Object for 7-zip switch options.
 *
 * @resolve {string} full filepath
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export const createSfxMac = (SevenZip.macSfx = function (
    name,
    files,
    destination,
    options
) {
    return createSfx(
        name,
        files,
        destination,
        options,
        'console',
        'darwin',
        '.pkg'
    );
});

function SevenZip() {}

export default SevenZip;
export const Zip = SevenZip;
