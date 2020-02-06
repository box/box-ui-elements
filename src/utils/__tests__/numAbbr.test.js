import numAbbr, { numAbbrWithLocale } from '../numAbbr';

/**
 * load locale data manually that is not the current locale so that
 * we can use it for unit testing
 */
const germanLocaleData = require('@box/cldr-data/locale-data/de-DE.js').numbers;
const russianLocaleData = require('@box/cldr-data/locale-data/ru-RU.js').numbers;
const japaneseLocaleData = require('@box/cldr-data/locale-data/ja-JP.js').numbers;

describe('util/num', () => {
    test('should work in English 1', () => {
        expect(numAbbr(1)).toBe('1');
    });
    test('should work in English 1000', () => {
        expect(numAbbr(1000)).toBe('1K');
    });
    test('should work in English 10000', () => {
        expect(numAbbr(10000)).toBe('10K');
    });
    test('should work in English 100000', () => {
        expect(numAbbr(100000)).toBe('100K');
    });
    test('should work in English 1000000', () => {
        expect(numAbbr(1000000)).toBe('1M');
    });
    test('should work in English 10000000', () => {
        expect(numAbbr(10000000)).toBe('10M');
    });
    test('should work in English 1000000000', () => {
        expect(numAbbr(1000000000)).toBe('1B');
    });
    test('should work in English 1000000000000', () => {
        expect(numAbbr(1000000000000)).toBe('1T');
    });
    test('should work in English larger than max', () => {
        expect(numAbbr(1000000000000000000)).toBe('1,000,000T');
    });

    test('should work in English 1 long', () => {
        expect(numAbbr(1, { length: 'long' })).toBe('1');
    });
    test('should work in English 1000 long', () => {
        expect(numAbbr(1000, { length: 'long' })).toBe('1 thousand');
    });
    test('should work in English 10000 long', () => {
        expect(numAbbr(10000, { length: 'long' })).toBe('10 thousand');
    });
    test('should work in English 100000 long', () => {
        expect(numAbbr(100000, { length: 'long' })).toBe('100 thousand');
    });
    test('should work in English 1000000 long', () => {
        expect(numAbbr(1000000, { length: 'long' })).toBe('1 million');
    });
    test('should work in English 10000000 long', () => {
        expect(numAbbr(10000000, { length: 'long' })).toBe('10 million');
    });
    test('should work in English 1000000000 long', () => {
        expect(numAbbr(1000000000, { length: 'long' })).toBe('1 billion');
    });
    test('should work in English 1000000000000 long', () => {
        expect(numAbbr(1000000000000, { length: 'long' })).toBe('1 trillion');
    });
    test('should work in English larger than max long', () => {
        expect(numAbbr(1000000000000000000, { length: 'long' })).toBe('1,000,000 trillion');
    });

    test('should work in English 12345678 with rounding', () => {
        expect(numAbbr(12345678)).toBe('12M');
    });
    test('should work in English 87654321 with rounding', () => {
        expect(numAbbr(87654321)).toBe('88M');
    });

    test('should work when passing in a number as a string', () => {
        expect(numAbbr('3230000')).toBe('3M');
    });
    test('should not crap out when passing in a string that does not contain a number', () => {
        expect(numAbbr('asdf')).toBe('0');
    });
    test('should not crap out when passing in an empty string', () => {
        expect(numAbbr('')).toBe('0');
    });
    test('should not crap out when passing in a boolean false', () => {
        expect(numAbbr(false)).toBe('0');
    });
    test('should not crap out when passing in a boolean true', () => {
        expect(numAbbr(true)).toBe('1');
    });
    test('should not crap out when passing in a null', () => {
        expect(numAbbr(null)).toBe('0');
    });
    test('should not crap out when passing in undefined', () => {
        expect(numAbbr(undefined)).toBe('0');
    });
    test('should not crap out when passing in an object', () => {
        expect(numAbbr({ foo: 2, bar: 4 })).toBe('0');
    });
    test('should work when passing in a floating point number', () => {
        expect(numAbbr(24734.45674)).toBe('25K');
    });
    test('should work when passing in a small negative number', () => {
        expect(numAbbr(-24)).toBe('-24');
    });
    test('should abbreviate when passing in a medium negative number', () => {
        expect(numAbbr(-24567)).toBe('-25K');
    });
    test('should abbreviate when passing in a large negative number', () => {
        expect(numAbbr(-24567000000)).toBe('-25B');
    });
    test('should work with 0', () => {
        expect(numAbbr(0)).toBe('0');
    });
    test('should work when passing an array of numbers', () => {
        expect(numAbbr([34534, 333000000, 34])).toStrictEqual(['35K', '333M', '34']);
    });
    test('should work when passing an array of mixed types', () => {
        expect(numAbbr([34534, '333000000', 34])).toStrictEqual(['35K', '333M', '34']);
    });

    test('should work in German 1', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1, 'de-DE')).toBe('1');
    });
    test('should work in German 1000', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000, 'de-DE')).toBe('1.000');
    });
    test('should work in German 10000', () => {
        expect(numAbbrWithLocale(germanLocaleData, 10000, 'de-DE')).toBe('10.000');
    });
    test('should work in German 100000', () => {
        expect(numAbbrWithLocale(germanLocaleData, 100000, 'de-DE')).toBe('100.000');
    });
    test('should work in German 1000000', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000000, 'de-DE')).toBe('1 Mio.');
    });
    test('should work in German 10000000', () => {
        expect(numAbbrWithLocale(germanLocaleData, 10000000, 'de-DE')).toBe('10 Mio.');
    });
    test('should work in German 1000000000', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000000000, 'de-DE')).toBe('1 Mrd.');
    });
    test('should work in German 1000000000000', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000000000000, 'de-DE')).toBe('1 Bio.');
    });
    test('should work in German larger than max', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000000000000000000, 'de-DE')).toBe('1.000.000 Bio.');
    });

    test('should work in German 1 long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1, 'de-DE', { length: 'long' })).toBe('1');
    });
    test('should work in German 1000 long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000, 'de-DE', { length: 'long' })).toBe('1 Tausend');
    });
    test('should work in German 10000 long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 10000, 'de-DE', { length: 'long' })).toBe('10 Tausend');
    });
    test('should work in German 100000 long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 100000, 'de-DE', { length: 'long' })).toBe('100 Tausend');
    });
    test('should work in German 1000000 long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000000, 'de-DE', { length: 'long' })).toBe('1 Million');
    });
    test('should work in German 10000000 long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 10000000, 'de-DE', { length: 'long' })).toBe('10 Millionen');
    });
    test('should work in German 1000000000 long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000000000, 'de-DE', { length: 'long' })).toBe('1 Milliarde');
    });
    test('should work in German 1000000000000 long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000000000000, 'de-DE', { length: 'long' })).toBe('1 Billion');
    });
    test('should work in German larger than max long', () => {
        expect(numAbbrWithLocale(germanLocaleData, 1000000000000000000, 'de-DE', { length: 'long' })).toBe(
            '1.000.000 Billionen',
        );
    });

    test('should work in Russian 1', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1, 'ru-RU')).toBe('1');
    });
    test('should work in Russian 1000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000, 'ru-RU')).toBe('1 тыс.');
    });
    test('should work in Russian 10000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 10000, 'ru-RU')).toBe('10 тыс.');
    });
    test('should work in Russian 100000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 100000, 'ru-RU')).toBe('100 тыс.');
    });
    test('should work in Russian 1000000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000000, 'ru-RU')).toBe('1 млн');
    });
    test('should work in Russian 10000000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 10000000, 'ru-RU')).toBe('10 млн');
    });
    test('should work in Russian 1000000000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000000000, 'ru-RU')).toBe('1 млрд');
    });
    test('should work in Russian 1000000000000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000000000000, 'ru-RU')).toBe('1 трлн');
    });
    test('should work in Russian larger than max', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000000000000000000, 'ru-RU')).toBe('1 000 000 трлн');
    });

    test('should work in Russian 1 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1, 'ru-RU', { length: 'long' })).toBe('1');
    });
    test('should work in Russian 1000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000, 'ru-RU', { length: 'long' })).toBe('1 тысяча');
    });
    test('should work in Russian 2000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 2000, 'ru-RU', { length: 'long' })).toBe('2 тысячи');
    });
    test('should work in Russian 5000', () => {
        expect(numAbbrWithLocale(russianLocaleData, 5000, 'ru-RU', { length: 'long' })).toBe('5 тысяч');
    });
    test('should work in Russian 10000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 10000, 'ru-RU', { length: 'long' })).toBe('10 тысяч');
    });
    test('should work in Russian 100000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 100000, 'ru-RU', { length: 'long' })).toBe('100 тысяч');
    });
    test('should work in Russian 1000000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000000, 'ru-RU', { length: 'long' })).toBe('1 миллион');
    });
    test('should work in Russian 2000000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 2000000, 'ru-RU', { length: 'long' })).toBe('2 миллиона');
    });
    test('should work in Russian 5000000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 5000000, 'ru-RU', { length: 'long' })).toBe('5 миллионов');
    });
    test('should work in Russian 10000000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 10000000, 'ru-RU', { length: 'long' })).toBe('10 миллионов');
    });
    test('should work in Russian 1000000000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000000000, 'ru-RU', { length: 'long' })).toBe('1 миллиард');
    });
    test('should work in Russian 1000000000000 long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000000000000, 'ru-RU', { length: 'long' })).toBe('1 триллион');
    });
    test('should work in Russian larger than max long', () => {
        expect(numAbbrWithLocale(russianLocaleData, 1000000000000000000, 'ru-RU', { length: 'long' })).toBe(
            '1 000 000 триллионов',
        );
    });

    test('should work in Japanese 1', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1, 'ja-JP')).toBe('1');
    });
    test('should work in Japanese 1000', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000, 'ja-JP')).toBe('1,000');
    });
    test('should work in Japanese 10000', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 10000, 'ja-JP')).toBe('1万');
    });
    test('should work in Japanese 100000', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 100000, 'ja-JP')).toBe('10万');
    });
    test('should work in Japanese 1000000', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000000, 'ja-JP')).toBe('100万');
    });
    test('should work in Japanese 100000000', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 100000000, 'ja-JP')).toBe('1億');
    });
    test('should work in Japanese 1000000000', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000000000, 'ja-JP')).toBe('10億');
    });
    test('should work in Japanese 100000000000', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 100000000000, 'ja-JP')).toBe('1,000億');
    });
    test('should work in Japanese 1000000000000', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000000000000, 'ja-JP')).toBe('1兆');
    });
    test('should work in Japanese larger than max', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000000000000000000, 'ja-JP')).toBe('1,000,000兆');
    });

    // short and long are the same for Japanese
    test('should work in Japanese 1 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1, 'ja-JP')).toBe('1');
    });
    test('should work in Japanese 1000 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000, 'ja-JP', { length: 'long' })).toBe('1,000');
    });
    test('should work in Japanese 10000 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 10000, 'ja-JP', { length: 'long' })).toBe('1万');
    });
    test('should work in Japanese 100000 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 100000, 'ja-JP', { length: 'long' })).toBe('10万');
    });
    test('should work in Japanese 1000000 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000000, 'ja-JP', { length: 'long' })).toBe('100万');
    });
    test('should work in Japanese 100000000 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 100000000, 'ja-JP', { length: 'long' })).toBe('1億');
    });
    test('should work in Japanese 1000000000 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000000000, 'ja-JP', { length: 'long' })).toBe('10億');
    });
    test('should work in Japanese 100000000000 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 100000000000, 'ja-JP', { length: 'long' })).toBe('1,000億');
    });
    test('should work in Japanese 1000000000000 long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000000000000, 'ja-JP', { length: 'long' })).toBe('1兆');
    });
    test('should work in Japanese larger than max long', () => {
        expect(numAbbrWithLocale(japaneseLocaleData, 1000000000000000000, 'ja-JP', { length: 'long' })).toBe(
            '1,000,000兆',
        );
    });
});
