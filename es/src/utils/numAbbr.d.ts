/**
 * @file Function to abbreviate a number as a string in a locale-sensitive manner.
 * @author Box
 */
import { NumbersData } from 'box-locale-data';
export declare enum Lengths {
    short = "short",
    long = "long"
}
export interface NumAbbrOptions {
    length?: Lengths;
    locale?: string;
    numbersData?: NumbersData;
}
/**
 * Gets the number in abbreviated form in a locale-sensitive manner. This function
 * scales the number down to the smallest it can be, taking only up to 4 significant
 * digits, and rounding the rest. ie. 12345678 becomes "12M" in English.
 *
 * The abbreviation words/letters can have the length "short" or "long", specified
 * with the "length" property in the options. If "short",
 * then this function uses an abbreviation of the bucket such as "12M". If "long",
 * then the name of the bucket is written out in full, such as "12 million".
 *
 * For locales that have complex plurals, such as Russian or Polish, this function
 * returns the correctly pluralized suffix/prefix to go along with the scaled number.
 */
declare function numAbbr(input: unknown, options?: NumAbbrOptions): string | string[];
export default numAbbr;
