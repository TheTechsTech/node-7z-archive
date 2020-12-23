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

function SevenZip() { };

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
export const createArchive = SevenZip.createArchive = _createArchive;

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
export const deleteArchive = SevenZip.deleteArchive = _deleteArchive;

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
export const extractArchive = SevenZip.extractArchive = _extractArchive;

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
export const fullArchive = SevenZip.fullArchive = _fullArchive;

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
export const renameArchive = SevenZip.renameArchive = _renameArchive;

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
export const testArchive = SevenZip.testArchive = _testArchive;

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

export default SevenZip;

export const Zip = SevenZip;
