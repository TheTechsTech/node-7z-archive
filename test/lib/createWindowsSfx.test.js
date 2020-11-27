/*global describe, it */
'use strict';
import chai from 'chai';
import {
  createWindowsSfx
} from '../lib/index.mjs';
import fs from 'fs-extra';
const expect = chai.expect;

describe('Method: `Zip.createSfxWindows`', function () {

  it('should return successfully on an Windows Sfx build', function (done) {
    createWindowsSfx('test', ['*.js'], './test/')
      .then(function (data) {
        expect(data).to.exist;
        expect(fs.existsSync('./test/SfxPackages/test.exe')).to.be.eql(true);
        fs.removeSync('./test/SfxPackages');
        done();
      });
  });
});
