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

export default function (override = false) {
  let binaryPath = join(__dirname, '..' + sep + '..', "binaries", (override == true ? process.platform + sep + 'other32' : process.platform));
  let binaryFilename = (process.platform == "win32") ? '7z.exe' : '7z';
  return {
    path: binaryPath,
    filename: binaryFilename,
    filepath: join(binaryPath, binaryFilename)
  }
};
