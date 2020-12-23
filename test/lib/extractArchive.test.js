/*global describe, it */
'use strict';
import chai from 'chai';
import fs from 'fs-extra';
import {
  extractArchive
} from '../../lib/index.js';
const expect = chai.expect;

describe('Method: `extractArchive`', function () {

  it('should return an error on 7z error', function (done) {
    extractArchive('test/nothere.7z', '.tmp/test')
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return an error on output duplicate', function (done) {
    extractArchive('test/zip.7z', '.tmp/test', {
      o: '.tmp/test/duplicate'
    })
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return entries on progress', function (done) {
    extractArchive('test/zip.7z', '.tmp/test')
      .progress(function (entries) {
        expect(entries.length).to.be.at.least(1);
        done();
      });
  });

  it('should extract on the right path', function (done) {
    extractArchive('test/zip.7z', '.tmp/test')
      .then(function () {
        expect(fs.existsSync('.tmp/test/file0.txt')).to.be.eql(true);
        expect(fs.existsSync('.tmp/test/file1.txt')).to.be.eql(true);
        expect(fs.existsSync('.tmp/test/file2.txt')).to.be.eql(true);
        expect(fs.existsSync('.tmp/test/file3.txt')).to.be.eql(true);
        done();
      });
  });

});
