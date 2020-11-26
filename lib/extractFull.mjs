'use strict';
import when from 'when';
import ReplaceNativeSeparator from '../../util/esm/replaceNativeSeparator.mjs';
import Run from '../../util/esm/run.mjs';

/**
 * Extract an archive with full paths.
 * @promise ExtractFull
 * @param {string} archive Path to the archive.
 * @param {string} dest Destination.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function (archive, dest, options) {
  return when.promise(function (resolve, reject, progress) {

    // Create a string that can be parsed by `run`.
    let command = '7za x "' + archive + '" -o"' + dest + '" ';

    // Start the command
    Run(command, options)

      // When a stdout is emitted, parse each line and search for a pattern. When
      // the pattern is found, extract the file (or directory) name from it and
      // pass it to an array. Finally returns this array.
      .progress(function (data) {
        let entries = [];
        data.split('\n').forEach(function (line) {
          if (line.substr(0, 1) === '-') {
            entries.push(ReplaceNativeSeparator(line.substr(2, line.length)));
          }
        });
        return progress(entries);
      })

      // When all is done resolve the Promise.
      .then(function (args) {
        return resolve(args);
      })

      // Catch the error and pass it to the reject function of the Promise.
      .catch(function (err) {
        return reject(err);
      });

  });
};
