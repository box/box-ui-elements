/**
 * Converts an array buffer to Hex
 *
 * @param {Uint8Array} arrayBuffer The buffer to convert
 * @return {string} The hex converted value
 */
function bufferToHex(arrayBuffer: Uint8Array): string {
    return Array.from(arrayBuffer, byte =>
        // eslint-disable-next-line no-bitwise
        `0${(byte & 0xff).toString(16)}`.slice(-2),
    ).join('');
}

export { bufferToHex };
