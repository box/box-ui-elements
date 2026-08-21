import sha1 from 'js-sha1';

type WindowWithMsCrypto = Window & { msCrypto?: Crypto };

/** Returns the correct crypto library based on browser implementation. */
function getCrypto(): Crypto {
    return window.crypto || (window as WindowWithMsCrypto).msCrypto;
}

/**
 * Returns a Promise of a digest generated from the
 * hash function and text given as parameters
 *
 * @param {string} algorithm - the hash algorithm to use
 * @param {ArrayBuffer} buffer - the buffer to digest
 * @return {Promise} Promise - resolves with an ArrayBuffer containing the digest result
 */
function digest(algorithm: string, buffer: ArrayBuffer): Promise<ArrayBuffer> {
    const cryptoRef = getCrypto();

    if (cryptoRef !== (window as WindowWithMsCrypto).msCrypto) {
        return cryptoRef.subtle.digest(algorithm, buffer);
    }

    // IE11 implements an early version of the SubtleCrypto interface which doesn't use Promises
    // See http://web-developer-articles.blogspot.com/2015/05/web-cryptography-api.html
    return new Promise((resolve, reject) => {
        // Microsoft has dropped support for SHA-1 and so SHA-1 needs to be calculated differently
        if (algorithm === 'SHA-1') {
            try {
                const hashBuffer = (sha1 as unknown as { arrayBuffer: (buf: ArrayBuffer) => ArrayBuffer }).arrayBuffer(
                    buffer,
                );
                resolve(hashBuffer);
            } catch (e) {
                reject(e);
            }
        } else {
            const cryptoOperation = cryptoRef.subtle.digest({ name: algorithm }, buffer) as unknown as {
                oncomplete: (event: { target: { result: ArrayBuffer } }) => void;
                onerror: (reason?: unknown) => void;
            };

            cryptoOperation.oncomplete = event => {
                resolve(event.target.result);
            };
            cryptoOperation.onerror = reject;
        }
    });
}

/**
 * Given a buffer/byteArray fills it with random values and returns the same array
 */
function getRandomValues(buffer: Uint8Array): Uint8Array {
    const cryptoRef = getCrypto();
    const copy = new Uint8Array(buffer);
    cryptoRef.getRandomValues(copy);

    return copy;
}

export { getCrypto, digest, getRandomValues };
