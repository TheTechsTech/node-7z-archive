/*global describe, it */
'use strict';
import chai from 'chai';
import fs from 'fs-extra';
import createSfx from '../../lib/createSfx.mjs';
const expect = chai.expect;

describe('Method: `createSfx`', function () {

  it('should return entries on progress and successfully', function (done) {
    createSfx('test', ['*.md'])
      .progress(function (entries) {
        expect(entries.length).to.be.at.least(1);
      })
      .then(function (data) {
        expect(data).to.exist;
        fs.removeSync(data);
        done();
      });
  });

  it('should return an error on 7z error', function (done) {
    createSfx('test.exe', '.tmp/test/nothere',
        '.tmp/test/', {
          '???': true
        })
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

});
