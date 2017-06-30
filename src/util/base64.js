/**
 * @flow
 * @file Function to convert Int32Array to Base64 for SHA1 digest
 * @author Box
 */

/**
 * Converts Int32Array to Base64. Adapted from https://jsperf.com/int32array-to-base64.
 *
 * @param {Int32Array} numArray - Int32Array to convert
 * @return {string}
 */
/* eslint-disable no-bitwise */
export default function(numArray: Int32Array): string {
    let bytes = '';

    for (let i = 0; i < numArray.length; i += 1) {
        const v = numArray[i];
        bytes += String.fromCharCode(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff);
    }

    return btoa(bytes);
}
