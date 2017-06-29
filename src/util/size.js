/**
 * @flow
 * @file Function to create size in words out of number
 * @author Box
 */

/**
 * Gets the size in words
 *
 * @param {number} size in bytes
 * @return {string} size in words
 */
export default function(size?: number): string {
    if (!size) return '0 Byte';
    const kilo: number = 1024;
    const decimals: number = 2;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const exp: number = Math.floor(Math.log(size) / Math.log(kilo));
    return `${parseFloat((size / kilo ** exp).toFixed(decimals))} ${sizes[exp]}`;
}
