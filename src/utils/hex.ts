/** Converts an array buffer to Hex */
const bufferToHex = (arrayBuffer: Uint8Array): string =>
    Array.from(arrayBuffer, byte =>
        // eslint-disable-next-line no-bitwise
        `0${(byte & 0xff).toString(16)}`.slice(-2),
    ).join('');

export { bufferToHex };
