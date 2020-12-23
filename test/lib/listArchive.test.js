/*global describe, it */
'use strict';
import chai from 'chai';
import {
  listArchive
} from '../../lib/index.js';
const expect = chai.expect;


describe('Method: `listArchive`', function () {

  it('should test list progress', function (done) {
    let error;
    listArchive('test/zip.7z')
      .progress(function (entries) {
        try {
          expect(entries.length).to.be.at.least(1);
          entries.forEach(function (entry) {
            expect(entry.date).to.be.an.instanceof(Date);
            expect(entry.attr.length).to.eql(5);
            expect(entry.name).to.be.a('string');
            expect(entry.name).to.not.contain('\\');
          });
        } catch (e) {
          error = e;
        }
      })
      .then(function () {
        done(error)
      })
      .done();
  });

  it('should return an error on 7z error', function (done) {
    listArchive('test/nothere.7z')
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return an tech spec on fulfill', function (done) {
    listArchive('test/zip.7z', {
      r: true
    })
      .then(function (spec) {
        expect(spec).to.have.property('path');
        expect(spec).to.have.property('type');
        expect(spec).to.have.property('method');
        expect(spec).to.have.property('physicalSize');
        expect(spec).to.have.property('headersSize');
        done();
      });
  });

  ['zip.zip', 'zip.7z'].forEach(function (file) {
    it('should return valid entries on progress (' + file + ')', function (done) {
      let expectFailure;
      listArchive('test/' + file)
        .progress(function (entries) {
          try {
            expect(entries.length).to.be.at.least(1);
            entries.forEach(function (entry) {
              expect(entry.date).to.be.an.instanceof(Date);
              expect(entry.attr.length).to.eql(5);
              expect(entry.name).to.be.a('string');
              expect(entry.name).to.not.contain('\\');
            });
          } catch (e) {
            expectFailure = e;
          }
        })
        .then(function () {
          done(expectFailure);
        })
        .catch(function (listError) {
          done(listError || expectFailure);
        });
    });
  });

  it('should not ignore files with blank "Compressed" columns', function (done) {
    listArchive('test/blank-compressed.7z')
      .progress(function (files) {
        expect(files.length).to.be.eql(8);
        done();
      });
  });

  it('should not ignore read-only, hidden and system files', function () {
    let files = [];
    return listArchive('test/attr.7z').progress(function (chunk) {
      [].push.apply(files, chunk);
    }).then(function () {
      expect(files.length).to.be.eql(9);
    });
  });

});
