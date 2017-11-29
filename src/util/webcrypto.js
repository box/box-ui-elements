/**
 * @flow
 * @file Wrapper to provide a consistent interface for the webcrypto API
 * @author Box
 */

/**
 * Returns the correct crypto library based on browser implementation
 * @returns {Object}
 */
function getCrypto() {
    return window.crypto || window.msCrypto || window.webkitCrypto;
}

/**
 * Returns a Promise of a digest generated from the
 * hash function and text given as parameters
 * @param {string} algorithm
 * @param {Uint8Array} buffer
 * @returns {Promise} Promise that resolves with an ArrayBuffer containing the digest result
 */
function digest(algorithm: string, buffer: Uint8Array) {
    const cryptoRef = getCrypto();
    // IE11 implements an early version of the SubtleCrypto interface which doesn't use Promises
    // See http://web-developer-articles.blogspot.com/2015/05/web-cryptography-api.html
    if (cryptoRef === window.msCrypto) {
        return new Promise((resolve, reject) => {
            const cryptoOperation = cryptoRef.subtle.digest({ name: algorithm }, buffer);

            cryptoOperation.oncomplete = function(event) {
                resolve(event.target.result);
            };

            cryptoOperation.onerror = function(error) {
                reject(error);
            };
        });
    }
    return cryptoRef.subtle.digest(algorithm, buffer);
}

/**
 * Given a buffer/byteArray fills it with random values
 * And returns the same array
 * @param {Uint8Array} buffer
 * @returns {Uint8Array}
 */
function getRandomValues(buffer: Uint8Array) {
    const cryptoRef = getCrypto();
    const copy = new Uint8Array(buffer);
    cryptoRef.getRandomValues(copy);

    return copy;
}

export { getCrypto, digest, getRandomValues };
