/*global describe, it */
'use strict';
const expect = require('chai').expect,
  fs = require('fs-extra'),
  Zip = require('../../lib'),
  createSfxWindows = Zip.createSfxWindows;

describe('Method: `Zip.createSfxWindows`', function () {

  it('should return successfully on an Windows Sfx build', function (done) {
    createSfxWindows('test', ['*.js'], './test/')
      .then(function (data) {
        expect(data).to.exist;
        expect(fs.existsSync('./test/SfxPackages/test.exe')).to.be.eql(true);
        fs.removeSync('./test/SfxPackages');
        done();
      });
  });
});
