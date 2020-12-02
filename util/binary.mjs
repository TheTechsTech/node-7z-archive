'use strict';

import {
  fileURLToPath
} from 'url';
import {
  dirname,
  join,
  sep
} from 'path';

const __filename = fileURLToPath(
  import.meta.url);
const __dirname = dirname(__filename);

export default function (override = false, binary = '7z') {
  let binaryPath = join(__dirname, '..', "binaries", (override == true ? process.platform + sep + 'other32' : process.platform));
  let binaryFilename = (process.platform == "win32") ? binary + '.exe' : binary;
  return {
    path: binaryPath,
    filename: binaryFilename,
    filepath: join(binaryPath, binaryFilename)
  }
};
