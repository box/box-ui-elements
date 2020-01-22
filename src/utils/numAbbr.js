/**
 * @flow
 * @file Function to abbreviate a numberas a string in a locale-sensitive manner.
 * @author Box
 */

import { formatNumber } from 'react-intl';

/**
 * Gets the number in abbreviated form in a locale-sensitive manner. This function
 * scales the number down to the smallest it can be, taking only up to 3 significant
 * digits, and rounding the rest. ie. 12345678 becomes "12M" in English.
 *
 * The abbreviation words/letters can have the length "short" or "long". If "short",
 * then this function uses an abbreviation of the bucket such as "12M". If "long",
 * then the name of the bucket is written out in full, such as "12 million".
 *
 * The locale can be given in the options, and when specified, the correct translation
 * of the bucket names are used. If not specified, the current locale is used.
 *
 * For locales that have complex plurals, such as Russian or Polish, this function
 * returns the correctly pluralized suffix/prefix to go along with the scaled number.
 *
 * @param {number} size the number to abbreviate
 * @param {Object} options options governing how the output is generated
 * @param {boolean} digital if true, calculate the sizes based on 1024 = K. If false, then 1000 = K. Default is non digital.
 * @return {string} size in abbreviated form
 */
export default function(size?: number, digital?: boolean, locale?: string): string {
    if (!size) return '0';
    const kilo: number = digital ? 1024 : 1000;
    const decimals: number = 2;
    const sizes: string[] = ['', 'K', 'M', 'B'];
    const exp: number = Math.floor(Math.log(size) / Math.log(kilo));
    return `${parseFloat((size / kilo ** exp).toFixed(decimals))} ${sizes[exp]}`;
}
