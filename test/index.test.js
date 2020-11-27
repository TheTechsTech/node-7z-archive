/*global afterEach */
'use strict';
import fs from 'fs-extra';

// Remove the `.tmp/` directory after each test.
afterEach(function () {
  fs.removeSync('.tmp/');
});
