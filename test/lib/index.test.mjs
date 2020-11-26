/*global describe, it */
'use strict';
import chai from 'chai';
import { add } from '../../lib/esm/index.mjs';

const expect = chai.expect;

describe('Method: `All ESM` from `index.mjs`', function () {

    it('should add with progress', function (done) {
        add('.tmp/test/add.zip', '*.md')
            .progress(function (entries) {
                expect(entries.length).to.be.at.least(1);
                done();
            });
    });
});
