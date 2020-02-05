/**
 * @flow
 * @file Function to abbreviate a numberas a string in a locale-sensitive manner.
 * @author Box
 */

import IntlMessageFormat from 'intl-messageformat';
import { languages, numbers } from 'box-locale-data';

interface NumAbbrOptions {
    length: string;
    locale: string;
}

export function numAbbrWithLocale(localedata: object, num: number, locale: string, options?: NumAbbrOptions): string {
    if (!num) return '0';
    let { length } = options || {};
    length = length || 'short';
    let exponent: number = Math.floor(num).toString().length - 1;
    if (num < 0) {
        exponent -= 1; // take care of the negative sign
    }
    const formats = localedata[length];
    const digits: number = exponent >= formats.length ? exponent - formats.length + 3 : formats[exponent].digits;
    const count: number = Math.round(num / 10 ** (exponent - digits + 1));
    const template = new IntlMessageFormat(
        formats[exponent > formats.length ? formats.length - 1 : exponent].msg,
        locale,
    );
    return template.format({ count });
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
 * @param {*} num the number or numbers to abbreviate. (also accepts numbers in string form,
 * or an array of numbers).
 * @param {NumAbbrOptions=} options options governing how the output is generated
 * @return {string} the number in abbreviated form as a string, or '0' if there was
 * invalid input such as null instead of a number
 */
export default function(num: number, options?: NumAbbrOptions): string {
    if (!num) return '0';

    // languages contains info about the current locale
    const locale = languages.bcp47Tag || 'en-US';

    switch (typeof num) {
        case 'boolean':
            num = num ? 1 : 0;
            break;

        case 'string':
            num = parseInt(num, 10);
            if (Number.isNaN(num)) return '0';
            break;

        case 'object':
            return Array.isArray(num)
                ? num.map(n => {
                      return numAbbrWithLocale(numbers, n, locale, options);
                  })
                : '0';

        default:
            break;
    }

    return numAbbrWithLocale(numbers, num, locale, options);
}
