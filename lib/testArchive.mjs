'use strict';

import when from 'when';
import ReplaceNativeSeparator from '../util/replaceNativeSeparator.mjs';
import Run from '../util/run.mjs';

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
export default function (filepath, options, override = false) {
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
          entries.push(ReplaceNativeSeparator(line.substr(2, line.length)));
        }
      });
      return entries;
    }

    // Create a string that can be parsed by `run`.
    let command = 't "' + filepath + '"';

    // Start the command
    Run('7z', command, options, override)
      .progress(function (data) {
        return progress(onprogress(data));
      })

      // When all is done resolve the Promise.
      .then(function (args) {
        return resolve(args);
      })

      // Catch the error and pass it to the reject function of the Promise.
      .catch(function () {
        console.error('TestArchive failed using `7z`, retying with `7za`.');
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

  });
};
