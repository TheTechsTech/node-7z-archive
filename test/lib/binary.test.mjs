/*global describe, it */
'use strict';
import chai from 'chai';
import binary from '../../util/esm/path.mjs';
const expect = chai.expect;

describe('Method: `binary` ESM', function () {
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

    it('should return an string from `object` with correct key { path: 7za } ', function (done) {
        let _7zPath = binary({ path: '7za' });
        expect(_7zPath).to.be.a('string');
        done();
    });

    it('should return an object from `object` with wrong key or no key', function (done) {
        let _7zPathWrong = binary({ noPath: '7za' });
        expect(_7zPathWrong).to.be.an('object');
        let _7zPathNo = binary('???');
        expect(_7zPathNo).to.be.an('object');
        done();
    });
});

describe('Method: `binary` with platform set to `darwin` ESM', function () {
    // save original process.platform
    before(function () {
        this.originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
        // redefine process.platform
        Object.defineProperty(process, 'platform', { value: 'darwin' });
    });
    // restore original process.platform
    after(function () { Object.defineProperty(process, 'platform', this.originalPlatform); });

    let _7zCmdMac = binary();

    it('should return an object', function (done) {
        expect(_7zCmdMac).to.be.an('object');
        done();
    });

    it('should return an object with key fields of `path, filename, filepath` and be string', function (done) {
        expect(_7zCmdMac).to.have.property('path');
        expect(_7zCmdMac).to.have.property('filename');
        expect(_7zCmdMac).to.have.property('filepath');
        expect(_7zCmdMac.filepath).to.be.a('string');
        done();
    });

    it('should return an string from `object` with correct key { path: 7za } ', function (done) {
        let _7zPathMac = binary({ path: '7za' });
        expect(_7zPathMac).to.be.a('string');
        done();
    });

    it('should return an object from `object` with wrong key or no key', function (done) {
        let _7zPathMacWrong = binary({ noPath: '7za' });
        expect(_7zPathMacWrong).to.be.an('object');
        let _7zPathMacNo = binary('???');
        expect(_7zPathMacNo).to.be.an('object');
        done();
    });
});
