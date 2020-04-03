import sha1 from 'js-sha1';
/**
 * @flow
 * @file Wrapper to provide a consistent interface for the webcrypto API
 * @author Box
 */

/**
 * Returns the correct crypto library based on browser implementation
 *
 * @return {Object}
 */
function getCrypto(): Object {
    return window.crypto || window.msCrypto;
}

/**
 * Returns a Promise of a digest generated from the
 * hash function and text given as parameters
 *
 * @param {string} algorithm
 * @param {ArrayBuffer} buffer
 * @return {Promise} Promise - resolves with an ArrayBuffer containing the digest result
 */
function digest(algorithm: string, buffer: ArrayBuffer): Promise<ArrayBuffer> {
    const cryptoRef = getCrypto();

    if (cryptoRef !== window.msCrypto) {
        return cryptoRef.subtle.digest(algorithm, buffer);
    }

    // IE11 implements an early version of the SubtleCrypto interface which doesn't use Promises
    // See http://web-developer-articles.blogspot.com/2015/05/web-cryptography-api.html
    return new Promise((resolve, reject) => {
        // Microsoft has dropped support for SHA-1 and so SHA-1 needs to be calculated differently
        if (algorithm === 'SHA-1') {
            try {
                const hashBuffer = sha1.arrayBuffer(buffer);
                resolve(hashBuffer);
            } catch (e) {
                reject(e);
            }
        } else {
            const cryptoOperation = cryptoRef.subtle.digest({ name: algorithm }, buffer);

            cryptoOperation.oncomplete = event => {
                resolve(event.target.result);
            };
            cryptoOperation.onerror = reject;
        }
    });
}

/**
 * Given a buffer/byteArray fills it with random values and returns the same array
 *
 * @param {Uint8Array} buffer
 * @return {Uint8Array}
 */
function getRandomValues(buffer: Uint8Array): Uint8Array {
    const cryptoRef = getCrypto();
    const copy = new Uint8Array(buffer);
    cryptoRef.getRandomValues(copy);

    return copy;
}

export { getCrypto, digest, getRandomValues };
