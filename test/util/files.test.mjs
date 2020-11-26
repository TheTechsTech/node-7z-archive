/*global describe, it */
'use strict';
import chai from 'chai';
import files from '../../util/esm/files.mjs';
const expect = chai.expect;

describe('Utility: `files` ESM', function () {

  it('should error on invalid files', function () {
    var r = files();
    expect(r).to.eql('');
  });

  it('should works with strings', function () {
    var r = files('hello test');
    expect(r).to.eql('"hello test"');
  });

  it('should works with arrays', function () {
    var r = files([ 'hello test', 'hello world' ]);
    expect(r).to.eql('"hello test" "hello world"');
  });

});
