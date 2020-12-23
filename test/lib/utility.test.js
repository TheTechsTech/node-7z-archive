/*global describe, it */
'use strict';

import chai from 'chai';
import { Binary, Files, ReplaceNativeSeparator, Run, Switches } from '../../lib/utility.js';
import { sep } from 'path';
const expect = chai.expect;

describe('Method: `Binary`', function () {
  let _7zCmd = Binary();
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
    let _7zPath = Binary(true);
    expect(_7zPath.path.includes('other32')).to.be.true;
    done();
  });

  it('should return an binary with `7za` included', function (done) {
    let _7zPath = Binary(true, '7za');
    expect(_7zPath.filename.includes('7za')).to.be.true;
    done();
  });
});

describe('Utility: `Files`', function () {
  it('should error on invalid files', function () {
    var r = Files();
    expect(r).to.eql('');
  });

  it('should works with strings', function () {
    var r = Files('hello test');
    expect(r).to.eql('"hello test"');
  });

  it('should works with arrays', function () {
    var r = Files(['hello test', 'hello world']);
    expect(r).to.eql('"hello test" "hello world"');
  });
});

describe('Utility: `ReplaceNativeSeparator`', function () {
  it('should replace the native directory separator (' + sep + ')' +
    ' with / and allows / in input',
    function (done) {
      [
        ['abc', 'abc'],
        ['å/Ö', 'å/Ö'],
        ['3' + sep + 'π' + sep + '1' + sep + '4.txt', '3/π/1/4.txt'],
        ['abc/def' + sep + 'g', 'abc/def/g'],
        ['directory' + sep + 'file', 'directory/file'],
        ['a' + sep + 'b' + sep + 'c' + sep + 'd.txt', 'a/b/c/d.txt'],
      ]
        .forEach(function (inputAndExpectedOutput) {
          var input = inputAndExpectedOutput[0];
          var expectedOutput = inputAndExpectedOutput[1];
          expect(ReplaceNativeSeparator(input)).to.eql(expectedOutput);
        });
      done();
    });
});

describe('Utility: `Run`', function () {
  it('should return an error with invalid command type', function (done) {
    Run(0).catch(function (err) {
      expect(err.message).to.eql('Command and Binary must be a string');
      done();
    });
  });

  it('should return an error on when 7z gets one', function (done) {
    Run('7z', "???").catch(function (err) {
      expect(err.message).to.eql('Unsupported command');
      done();
    });
  });

  it('should return an stdout on progress', function (done) {
    Run('7z', '', {
      h: true
    })
      .progress(function (data) {
        expect(data).to.be.a('string');
      })
      .then(function () {
        done();
      });
  });

  it('should correctly parse complex commands', function (done) {
    Run('7za', 'a ".tmp/test/archive.7z" "*.exe" "*.dll"', {
      m0: '=BCJ',
      m1: '=LZMA:d=21'
    })
      .then(function (res) {
        expect(res).to.contain('a');
        expect(res).to.contain('.tmp' + sep + 'test' + sep + 'archive.7z');
        expect(res).to.contain('*.exe');
        expect(res).to.contain('*.dll');
        expect(res).to.contain('-m0=BCJ');
        expect(res).to.contain('-m1=LZMA:d=21');
        expect(res).to.contain('-ssc');
        expect(res).to.contain('-y');
        done();
      });
  });

  it('should correctly parse complex commands with spaces', function (done) {
    Run('7za', 'a ".tmp/Folder A/Folder B\\archive.7z" "*.exe" "*.dll"', {
      m0: '=BCJ',
      m1: '=LZMA:d=21',
      p: 'My mhjls/\\c $^é5°',
    })
      .then(function (res) {
        expect(res).to.contain('a');
        /*jshint maxlen:false*/
        expect(res).to.contain('.tmp' + sep + 'Folder A' + sep + 'Folder B' + sep + 'archive.7z');
        expect(res).to.contain('*.exe');
        expect(res).to.contain('*.dll');
        expect(res).to.contain('-m0=BCJ');
        expect(res).to.contain('-m1=LZMA:d=21');
        expect(res).to.contain('-p"My mhjls/\\c $^é5°"');
        expect(res).to.contain('-ssc');
        expect(res).to.contain('-y');
        done();
      });
  });

  it('should handle error when the command could not be found', function (done) {
    Run('7zxxx', 'a ".tmp/test/archive.7z" "*.exe" "*.dll"').catch(function (err) {
      expect(err.message).to.contain('ENOENT');
      done();
    });
  });
});

describe('Utility: `Switches`', function () {
  it('should return default flags with no args', function () {
    expect(Switches({})).to.contain('-ssc');
    expect(Switches({})).to.contain('-y');
  });

  it('should return -ssc with flag { ssc: true }', function () {
    expect(Switches({
      ssc: true
    })).to.contain('-ssc');
    expect(Switches({
      ssc: true
    })).to.contain('-y');
  });

  it('should return -ssc- with flag { ssc: false }', function () {
    expect(Switches({
      ssc: false
    })).to.contain('-ssc-');
  });

  it('should return non default booleans when specified', function () {
    var r = Switches({
      so: true,
      spl: true,
      ssw: true,
      y: false
    });
    expect(r).to.contain('-so');
    expect(r).to.contain('-spl');
    expect(r).to.contain('-ssc');
    expect(r).to.contain('-ssw');
    expect(r).not.to.contain('-y');
  });

  it('should return complex values when needed', function () {
    var r = Switches({
      ssc: true,
      ssw: true,
      mx0: true
    });
    expect(r).to.contain('-ssc');
    expect(r).to.contain('-ssw');
    expect(r).to.contain('-mx0');
    expect(r).to.contain('-y');
  });

  it('should return complex values with spaces and quotes', function () {
    var r = Switches({
      ssc: true,
      ssw: true,
      m0: '=BCJ',
      m1: '=LZMA:d=21',
      p: 'My Super Pasw,àù£*',
      sfx: '7zSD.sfx',
    });
    expect(r).to.contain('-ssc');
    expect(r).to.contain('-ssw');
    expect(r).to.contain('-m0=BCJ');
    expect(r).to.contain('-m1=LZMA:d=21');
    expect(r).to.contain('-p"My Super Pasw,àù£*"');
    expect(r).to.contain('-y');
    expect(r).to.contain('-sfx7zSD.sfx');
  });

  it('should works with the `raw` switch', function () {
    var r = Switches({
      raw: ['-i!*.jpg', '-i!*.png'],
    });
    expect(r).to.contain('-i!*.jpg');
    expect(r).to.contain('-i!*.png');
  });
});
