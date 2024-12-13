/**
 * Gets the size in words
 *
 * @param {number} value in bytes
 * @return {string} size in words
 */
export default function size(value?: number): string {
    if (!value) return '0 Byte';
    const kilo: number = 1024;
    const decimals: number = 2;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const exp: number = Math.floor(Math.log(value) / Math.log(kilo));
    return `${parseFloat((value / kilo ** exp).toFixed(decimals))} ${sizes[exp]}`;
}
