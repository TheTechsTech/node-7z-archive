'use strict';

import Files from '../util/files.mjs';
import Run from '../util/run.mjs';

/**
 * Delete content from an archive.
 *
 * @param filepath {string} Path to the archive.
 * @param files {string|array} Files to remove.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param useBinary {string} binary to use.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export default function (filepath, files, options, useBinary = '7za', override = false) {
  return new Promise(function (resolve, reject) {

    // Convert array of files into a string if needed.
    files = Files(files);

    // Create a string that can be parsed by `run`.
    let command = useBinary + ' d "' + filepath + '" ' + files;

    // Start the command
    Run(command, options, useBinary, override)

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
