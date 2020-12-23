'use strict';

import { isUndefined, isArray } from 'node-sys';

/**
 * Transform a list of files that can be an array or a string into a string
 * that can be passed to the `run` function as part of the `command` parameter.
 * @param  {string|array} files
 * @return {string}
 */
export default function (files) {

  if (isUndefined(files)) {
    return '';
  }

  let toProcess = '';
  if (isArray(files)) {
    files.forEach(function (f) {
      toProcess += '"' + f + '" ';
    });
    toProcess = toProcess.trim();
  } else {
    toProcess = '"' + files + '"';
  }

  return toProcess;
};
