/**
 * @flow
 * @file Function to abbreviate a numberas a string in a locale-sensitive manner.
 * @author Box
 */

import IntlMessageFormat from 'intl-messageformat';
import localedata from './localedata';

interface NumAbbrOptions {
    locale: string;
    length: string;
}

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
 * @param {number} num the number to abbreviate
 * @param {NumAbbrOptions=} options options governing how the output is generated
 * @return {string} the number in abbreviated form as a string
 */
export default function(num: number, options?: NumAbbrOptions): string {
    if (!num) return '0';
    let { locale, length } = options || {};
    locale = locale || "en";
    length = length || "short";
    const exponent: number = Math.floor(num).toString().length - 1;
    const formats = localedata[locale][length];
    const digits: number = (exponent >= formats.length) ? (exponent - formats.length + 3) : formats[exponent].digits;
    const count: number = Math.round(num / (10 ** (exponent - digits + 1)));
    const template = new IntlMessageFormat(formats[(exponent > formats.length) ? formats.length-1 : exponent].msg, locale);
    return template.format({count});
}
