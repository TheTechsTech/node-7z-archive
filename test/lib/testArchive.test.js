/*global describe, it */
'use strict';
import chai from 'chai';
import {
  testArchive
} from '../../lib/index.js';
const expect = chai.expect;

describe('Method: `testArchive`', function () {

  it('should return an error on 7z error', function (done) {
    testArchive('test/nothere.7z')
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return entries on progress', function (done) {
    testArchive('test/zip.7z', {
      r: true
    })
      .progress(function (entries) {
        expect(entries.length).to.be.at.least(1);
      })
      .then(function () {
        done();
      });
  });

});
