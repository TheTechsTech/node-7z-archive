'use strict';

import createArchive from './createArchive.mjs';
import deleteArchive from './deleteArchive.mjs';
import extractArchive from './extractArchive.mjs';
import fullArchive from './fullArchive.mjs';
import listArchive from './listArchive.mjs';
import testArchive from './testArchive.mjs';
import updateArchive from './updateArchive.mjs';
import createSfx from './createSfx.mjs';

class SevenZip {
  constructor() {}
}

export default SevenZip;
export const createArchive = SevenZip.createArchive = createArchive;
export const deleteArchive = SevenZip.deleteArchive = deleteArchive;
export const extractArchive = SevenZip.extractArchive = extractArchive;
export const fullArchive = SevenZip.fullArchive = fullArchive;
export const listArchive = SevenZip.listArchive = listArchive;
export const testArchive = SevenZip.testArchive = _TestArchive;
export const updateArchive = SevenZip.updateArchive = updateArchive;

export const windowsSfx = SevenZip.windowsSfx = function (name, files, destination, options, type) {
  return createSfx(name, files, destination, options, type, 'win32', '.exe');
};

export const linuxSfx = SevenZip.linuxSfx = function (name, files, destination, options) {
  return createSfx(name, files, destination, options, 'console', 'linux', '.elf');
};

export const macSfx = SevenZip.macSfx = function (name, files, destination, options) {
  return createSfx(name, files, destination, options, 'console', 'darwin', '.pkg');
};
