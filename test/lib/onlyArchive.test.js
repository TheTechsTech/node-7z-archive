/*global describe, it */
'use strict';
import chai from 'chai';
import fs from 'fs-extra';
import {
  onlyArchive
} from '../../lib/index.mjs';
const expect = chai.expect;

describe('Method: `onlyArchive`', function () {

  it('should return an error on 7z error', function (done) {
    onlyArchive('test/nothere.7z', '.tmp/test')
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return an error on output duplicate', function (done) {
    onlyArchive('test/zip.7z', '.tmp/test', '', {
      o: '.tmp/test/duplicate'
    })
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return entries on progress', function (done) {
    onlyArchive('test/zip.7z', '.tmp/test', ['zip/file1.txt', 'zip/file2.txt'])
      .progress(function (entries) {
        expect(entries.length).to.be.at.least(1);
        done();
      });
  });

  it('should extract only on the selected files', function (done) {
    onlyArchive('test/zip.7z', '.tmp/test', ['zip/folder/file0.txt', 'zip/file2.txt', 'zip/file3.txt'])
      .then(function () {
        expect(fs.existsSync('.tmp/test/file0.txt')).to.be.eql(true);
        expect(fs.existsSync('.tmp/test/file1.txt')).to.be.eql(false);
        expect(fs.existsSync('.tmp/test/file2.txt')).to.be.eql(true);
        expect(fs.existsSync('.tmp/test/file3.txt')).to.be.eql(true);
        done();
      });
  });

});
