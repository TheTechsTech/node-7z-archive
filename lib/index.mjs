'use strict';

import _createArchive from './createArchive.mjs';
import _deleteArchive from './deleteArchive.mjs';
import _extractArchive from './extractArchive.mjs';
import _fullArchive from './fullArchive.mjs';
import _listArchive from './listArchive.mjs';
import _onlyArchive from './onlyArchive.mjs';
import _renameArchive from './renameArchive.mjs';
import _testArchive from './testArchive.mjs';
import _updateArchive from './updateArchive.mjs';
import createSfx from './createSfx.mjs';

class SevenZip {
  constructor() { }
}

export default SevenZip;
export const createArchive = SevenZip.createArchive = _createArchive;
export const deleteArchive = SevenZip.deleteArchive = _deleteArchive;
export const extractArchive = SevenZip.extractArchive = _extractArchive;
export const fullArchive = SevenZip.fullArchive = _fullArchive;
export const listArchive = SevenZip.listArchive = _listArchive;

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
export const onlyArchive = SevenZip.onlyArchive = _onlyArchive;
export const renameArchive = SevenZip.renameArchive = _renameArchive;
export const testArchive = SevenZip.testArchive = _testArchive;
export const updateArchive = SevenZip.updateArchive = _updateArchive;

export const createSfxWindows = SevenZip.windowsSfx = function (name, files, destination, options, type) {
  return createSfx(name, files, destination, options, type, 'win32', '.exe');
};

export const createSfxLinux = SevenZip.linuxSfx = function (name, files, destination, options) {
  return createSfx(name, files, destination, options, 'console', 'linux', '.elf');
};

export const createSfxMac = SevenZip.macSfx = function (name, files, destination, options) {
  return createSfx(name, files, destination, options, 'console', 'darwin', '.pkg');
};
