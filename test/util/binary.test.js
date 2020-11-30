/*global describe, it */
'use strict';
import chai from 'chai';
import binary from '../../util/binary.mjs';
const expect = chai.expect;

describe('Method: `binary`', function () {
  let _7zCmd = binary();

  it('should return an object', function (done) {
    expect(_7zCmd).to.be.an('object');
    done();
  });

  it('should return an object with key fields of `path, filename, filepath` and be string', function (done) {
    expect(_7zCmd).to.have.property('path');
    expect(_7zCmd).to.have.property('filename');
    expect(_7zCmd).to.have.property('filepath');
    expect(_7zCmd.filepath).to.be.a('string');
    done();
  });

  it('should return an path with `other32` included', function (done) {
    let _7zPath = binary(true);
    expect(_7zPath.path.includes('other32')).to.be.true;
    done();
  });

  it('should return an binary with `7za` included', function (done) {
    let _7zPath = binary(true, '7za');
    expect(_7zPath.filename.includes('7za')).to.be.true;
    done();
  });

});
