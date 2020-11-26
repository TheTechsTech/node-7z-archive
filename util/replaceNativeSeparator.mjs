'use strict';
import { sep as nativeSeparator } from 'path';

/**
 * @param {string} path A path with the native directory separator.
 * @return {string} A path with / for directory separator.
 */
export default function (path) {
    let result = path, next;
    while ((next = result.replace(nativeSeparator, '/')) !== result) {
        result = next;
    }
    return result;
};
