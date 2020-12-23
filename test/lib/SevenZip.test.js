/*global describe, it */
'use strict';
import chai from 'chai';
import SevenZip from '../../lib/index.js';
const expect = chai.expect;

describe('Class: `SevenZip`', function () {

  it('should instanced itself like a class', function () {
    const zip = new SevenZip();
    expect(zip).to.be.an.instanceof(SevenZip);
  });

  it('should respond to 7-Zip commands as methods', function () {
    expect(SevenZip).itself.to.respondTo('createArchive');
    expect(SevenZip).itself.to.respondTo('deleteArchive');
    expect(SevenZip).itself.to.respondTo('extractArchive');
    expect(SevenZip).itself.to.respondTo('fullArchive');
    expect(SevenZip).itself.to.respondTo('listArchive');
    expect(SevenZip).itself.to.respondTo('testArchive');
    expect(SevenZip).itself.to.respondTo('updateArchive');
  });

});
