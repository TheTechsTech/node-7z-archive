/*global describe, it */
'use strict';
const expect = require('chai').expect,
  fs = require('fs-extra'),
  Zip = require('../../lib'),
  createSfxLinux = Zip.createSfxLinux;

describe('Method: `Zip.createSfxLinux`', function () {

  it('should return successfully on an Linux Sfx build', function (done) {
    createSfxLinux('test', '*.js', './test/')
      .then(function (data) {
        expect(data).to.exist;
        expect(fs.existsSync('./test/SfxPackages/test.elf')).to.be.eql(true);
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
