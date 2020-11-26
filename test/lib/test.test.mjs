/*global describe, it */
'use strict';
import chai from 'chai';
import test from '../../lib/esm/test.mjs';
const expect = chai.expect;

describe('Method: `test` ESM', function () {

    it('should return an error on 7z error', function (done) {
        test('test/nothere.7z')
            .catch(function (err) {
                expect(err).to.be.an.instanceof(Error);
                done();
            });
    });

    it('should return entries on progress', function (done) {
        test('test/zip.7z', { r: true })
            .progress(function (entries) {
                expect(entries.length).to.be.at.least(1);
            })
            .then(function () {
                done();
            });
    });

});
