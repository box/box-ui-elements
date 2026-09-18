/**
 * Converts hex to Base 64. Adapted from
 * https://stackoverflow.com/questions/23190056/hex-to-base64-converter-for-javascript.
 */
const hexToBase64 = (str: string): string =>
    btoa(
        String.fromCharCode.apply(
            null,
            str
                .replace(/\r|\n/g, '')
                .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
                .replace(/ +$/, '')
                .split(' ') as unknown as number[],
        ),
    );

export default hexToBase64;
