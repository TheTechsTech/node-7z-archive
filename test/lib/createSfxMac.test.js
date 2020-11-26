/*global describe, it */
'use strict';
const expect = require('chai').expect,
  fs = require('fs-extra'),
  Zip = require('../../lib'),
  createSfxMac = Zip.createSfxMac;

describe('Method: `Zip.createSfxMac`', function () {

  it('should return successfully on an MacOS Sfx build', function (done) {
    createSfxMac('test', '*.js', './test/')
      .then(function (data) {
        expect(data).to.exist;
        expect(fs.existsSync('./test/SfxPackages/test.pkg')).to.be.eql(true);
        fs.removeSync('./test/SfxPackages');
        done();
      })
      .catch(function (err) {
        console.error('No error should be displayed!');
        console.error(err);
        expect(err).to.exist;
        done();
      });
  });

});
