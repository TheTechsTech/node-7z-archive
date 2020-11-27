'use strict';

import _createArchive from './createArchive.mjs';
import _deleteArchive from './deleteArchive.mjs';
import _extractArchive from './extractArchive.mjs';
import _fullArchive from './fullArchive.mjs';
import _listArchive from './listArchive.mjs';
import _testArchive from './testArchive.mjs';
import _updateArchive from './updateArchive.mjs';
import createSfx from './createSfx.mjs';

class SevenZip {
  constructor() {}
}

export default SevenZip;
export const createArchive = SevenZip.createArchive = _createArchive;
export const deleteArchive = SevenZip.deleteArchive = _deleteArchive;
export const extractArchive = SevenZip.extractArchive = _extractArchive;
export const fullArchive = SevenZip.fullArchive = _fullArchive;
export const listArchive = SevenZip.listArchive = _listArchive;
export const testArchive = SevenZip.testArchive = _testArchive;
export const updateArchive = SevenZip.updateArchive = _updateArchive;

export const createWindowsSfx = SevenZip.windowsSfx = function (name, files, destination, options, type) {
  return createSfx(name, files, destination, options, type, 'win32', '.exe');
};

export const createLinuxSfx = SevenZip.linuxSfx = function (name, files, destination, options) {
  return createSfx(name, files, destination, options, 'console', 'linux', '.elf');
};

export const createMacSfx = SevenZip.macSfx = function (name, files, destination, options) {
  return createSfx(name, files, destination, options, 'console', 'darwin', '.pkg');
};
