'use strict';

import _Add from './add.mjs';
import _Delete from './delete.mjs';
import _Extract from './extract.mjs';
import _ExtractFull from './extractFull.mjs';
import _List from './list.mjs';
import _Test from './test.mjs';
import _Update from './update.mjs';
import _Binary from '../../util/esm/path.mjs';

class Zip {
    constructor() { }
}

Zip.delete = _Delete;

export default Zip;
export const add = Zip.add = _Add;
export { _Delete as delete };
export const extract = Zip.extract = _Extract;
export const extractFull = Zip.extractFull = _ExtractFull;
export const list = Zip.list = _List;
export const test = Zip.test = _Test;
export const update = Zip.update = _Update;
export const binary = Zip.binary = _Binary;
