/*global describe, it */
'use strict';
import chai from 'chai';
import Zip from '../../lib/esm/index.mjs';
const expect = chai.expect;

describe('Class: `Zip` ESM', function () {

    it('should instanced itself like a class', function () {
        const zip = new Zip();
        expect(zip).to.be.an.instanceof(Zip);
    });

    it('should respond to 7-Zip commands as methods', function () {
        expect(Zip).itself.to.respondTo('add');
        expect(Zip).itself.to.respondTo('delete');
        expect(Zip).itself.to.respondTo('extract');
        expect(Zip).itself.to.respondTo('extractFull');
        expect(Zip).itself.to.respondTo('list');
        expect(Zip).itself.to.respondTo('test');
        expect(Zip).itself.to.respondTo('update');
    });

});
