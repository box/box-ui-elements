/**
 * 
 * @file Function to convert Int32Array to Base64 for SHA1 digest
 * @author Box
 */

/**
 * Converts hex to Base 64. Adapted from
 * https://stackoverflow.com/questions/23190056/hex-to-base64-converter-for-javascript.
 *
 * @param {string} str - Hex string to convert
 * @return {string}
 */
export default function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' ')));
}
//# sourceMappingURL=base64.js.map