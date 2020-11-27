/*global describe, it */
'use strict';
import chai from 'chai';
import {
  createArchive
} from '../lib/index.mjs';
const expect = chai.expect;

describe('Method: `createArchive`', function () {

  it('should return an error on 7z error', function (done) {
    createArchive('.tmp/test/addnot.7z', '.tmp/test/nothere', {
        '???': true
      })
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return entries on progress', function (done) {
    createArchive('.tmp/test/add.zip', '*.md')
      .progress(function (entries) {
        expect(entries.length).to.be.at.least(1);
        done();
      });
  });

  it('should accept array as source', function (done) {
    let store = [];
    createArchive('.tmp/test/add.zip', ['*.md', '*.js'])
      .progress(function (entries) {
        entries.forEach(function (e) {
          store.push(e);
        });
      })
      .done(function () {
        expect(store.length).to.be.at.least(4);
        done();
      });
  });

});
