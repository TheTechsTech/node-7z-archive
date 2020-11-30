/*global describe, it */
'use strict';
import chai from 'chai';
import fs from 'fs-extra';
import {
  renameArchive
} from '../../lib/index.mjs';
const expect = chai.expect;

describe('Method: `renameArchive`', function () {

  it('should return an error on 7z error', function (done) {
    renameArchive('.tmp/test/addnot.7z', '.tmp/test/nothere', {
        '???': true
      })
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return entries on progress', function (done) {
    fs.copySync('test/zip.zip', '.tmp/test/update.zip');
    renameArchive('.tmp/test/update.zip', ['CHANGELOG.md', 'TODO.doc'], {
        w: 'test'
      })
      .progress(function (entries) {
        expect(entries.length).to.be.at.least(1);
        done();
      });
  });

  it('should return on fulfillment', function (done) {
    fs.copySync('test/zip.zip', '.tmp/test/update.zip');
    renameArchive('.tmp/test/update.zip', ['./CONTRIBUTING.md', './ISSUES.txt'])
      .then(function () {
        done();
      });
  });

});
