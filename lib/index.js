'use strict';

const createSfx = require('./createSfx'),
  Zip = function () {};

module.exports = exports = Zip;
Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = exports;
exports.add = require('./add');
exports.delete = require('./delete');
exports.extract = require('./extract');
exports.extractFull = require('./extractFull');
exports.list = require('./list');
exports.test = require('./test');
exports.update = require('./update');
exports.binary = require('../util/path');

exports.createSfxWindows = function (name, files, destination, options, type) {
  return createSfx(name, files, destination, options, type, 'win32', '.exe');
};
exports.createSfxLinux = function (name, files, destination, options) {
  return createSfx(name, files, destination, options, 'console', 'linux', '.elf');
};
exports.createSfxMac = function (name, files, destination, options) {
  return createSfx(name, files, destination, options, 'console', 'darwin', '.pkg');
};
