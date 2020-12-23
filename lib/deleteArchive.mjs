'use strict';

import { Files, Run } from './utility.mjs';

export default function (filepath, files, options, override = false) {
  return new Promise(function (resolve, reject) {

    // Convert array of files into a string if needed.
    files = Files(files);

    // Create a string that can be parsed by `run`.
    let command = 'd "' + filepath + '" ' + files;

    // Start the command
    Run('7z', command, options, override)

      // When all is done resolve the Promise.
      .then(function (args) {
        return resolve(args);
      })

      // Catch the error and pass it to the reject function of the Promise.
      .catch(function () {
        console.error('DeleteArchive failed using `7z`, retying with `7za`.');
        Run('7za', command, options, override)
          .then(function (args) {
            return resolve(args);
          })
          .catch(function (err) {
            return reject(err);
          });
      });
  });
};
