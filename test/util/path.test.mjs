/*global describe, it */
'use strict';
import chai from 'chai';
import path from '../../util/esm/path.mjs';
const expect = chai.expect;

describe('Utility: `path` ESM', function () {

  it('should return default flags with no args', function (done) {
    var _7zCmd = path();
    expect(_7zCmd).to.be.an('object');
    done();
  });

});
