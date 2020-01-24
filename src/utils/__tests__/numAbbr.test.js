import numAbbr from '../numAbbr';

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

    test('should work in English 12345678 with rounding', () => {
        expect(numAbbr(12345678)).toBe('12M');
    });
    test('should work in English 87654321 with rounding', () => {
        expect(numAbbr(87654321)).toBe('88M');
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

    test('should work in German 1', () => {
        expect(numAbbr(1, { locale: 'de' })).toBe('1');
    });
    test('should work in German 1000', () => {
        expect(numAbbr(1000, { locale: 'de' })).toBe('1.000');
    });
    test('should work in German 10000', () => {
        expect(numAbbr(10000, { locale: 'de' })).toBe('10.000');
    });
    test('should work in German 100000', () => {
        expect(numAbbr(100000, { locale: 'de' })).toBe('100.000');
    });
    test('should work in German 1000000', () => {
        expect(numAbbr(1000000, { locale: 'de' })).toBe('1 Mio.');
    });
    test('should work in German 10000000', () => {
        expect(numAbbr(10000000, { locale: 'de' })).toBe('10 Mio.');
    });
    test('should work in German 1000000000', () => {
        expect(numAbbr(1000000000, { locale: 'de' })).toBe('1 Mrd.');
    });
    test('should work in German 1000000000000', () => {
        expect(numAbbr(1000000000000, { locale: 'de' })).toBe('1 Bio.');
    });
    test('should work in German larger than max', () => {
        expect(numAbbr(1000000000000000000, { locale: 'de' })).toBe('1.000.000 Bio.');
    });

    test('should work in German 1 long', () => {
        expect(numAbbr(1, { locale: 'de', length: 'long' })).toBe('1');
    });
    test('should work in German 1000 long', () => {
        expect(numAbbr(1000, { locale: 'de', length: 'long' })).toBe('1 Tausend');
    });
    test('should work in German 10000 long', () => {
        expect(numAbbr(10000, { locale: 'de', length: 'long' })).toBe('10 Tausend');
    });
    test('should work in German 100000 long', () => {
        expect(numAbbr(100000, { locale: 'de', length: 'long' })).toBe('100 Tausend');
    });
    test('should work in German 1000000 long', () => {
        expect(numAbbr(1000000, { locale: 'de', length: 'long' })).toBe('1 Million');
    });
    test('should work in German 10000000 long', () => {
        expect(numAbbr(10000000, { locale: 'de', length: 'long' })).toBe('10 Millionen');
    });
    test('should work in German 1000000000 long', () => {
        expect(numAbbr(1000000000, { locale: 'de', length: 'long' })).toBe('1 Milliarde');
    });
    test('should work in German 1000000000000 long', () => {
        expect(numAbbr(1000000000000, { locale: 'de', length: 'long' })).toBe('1 Billion');
    });
    test('should work in German larger than max long', () => {
        expect(numAbbr(1000000000000000000, { locale: 'de', length: 'long' })).toBe('1.000.000 Billionen');
    });

    test('should work in Russian 1', () => {
        expect(numAbbr(1, { locale: 'ru' })).toBe('1');
    });
    test('should work in Russian 1000', () => {
        expect(numAbbr(1000, { locale: 'ru' })).toBe('1 тыс.');
    });
    test('should work in Russian 10000', () => {
        expect(numAbbr(10000, { locale: 'ru' })).toBe('10 тыс.');
    });
    test('should work in Russian 100000', () => {
        expect(numAbbr(100000, { locale: 'ru' })).toBe('100 тыс.');
    });
    test('should work in Russian 1000000', () => {
        expect(numAbbr(1000000, { locale: 'ru' })).toBe('1 млн');
    });
    test('should work in Russian 10000000', () => {
        expect(numAbbr(10000000, { locale: 'ru' })).toBe('10 млн');
    });
    test('should work in Russian 1000000000', () => {
        expect(numAbbr(1000000000, { locale: 'ru' })).toBe('1 млрд');
    });
    test('should work in Russian 1000000000000', () => {
        expect(numAbbr(1000000000000, { locale: 'ru' })).toBe('1 трлн');
    });
    test('should work in Russian larger than max', () => {
        expect(numAbbr(1000000000000000000, { locale: 'ru' })).toBe('1 000 000 трлн');
    });

    test('should work in Russian 1 long', () => {
        expect(numAbbr(1, { locale: 'ru', length: 'long' })).toBe('1');
    });
    test('should work in Russian 1000 long', () => {
        expect(numAbbr(1000, { locale: 'ru', length: 'long' })).toBe('1 тысяча');
    });
    test('should work in Russian 2000', () => {
        expect(numAbbr(2000, { locale: 'ru', length: 'long' })).toBe('2 тысячи');
    });
    test('should work in Russian 5000', () => {
        expect(numAbbr(5000, { locale: 'ru', length: 'long' })).toBe('5 тысяч');
    });
    test('should work in Russian 10000 long', () => {
        expect(numAbbr(10000, { locale: 'ru', length: 'long' })).toBe('10 тысяч');
    });
    test('should work in Russian 100000 long', () => {
        expect(numAbbr(100000, { locale: 'ru', length: 'long' })).toBe('100 тысяч');
    });
    test('should work in Russian 1000000 long', () => {
        expect(numAbbr(1000000, { locale: 'ru', length: 'long' })).toBe('1 миллион');
    });
    test('should work in Russian 2000000 long', () => {
        expect(numAbbr(2000000, { locale: 'ru', length: 'long' })).toBe('2 миллиона');
    });
    test('should work in Russian 5000000 long', () => {
        expect(numAbbr(5000000, { locale: 'ru', length: 'long' })).toBe('5 миллионов');
    });
    test('should work in Russian 10000000 long', () => {
        expect(numAbbr(10000000, { locale: 'ru', length: 'long' })).toBe('10 миллионов');
    });
    test('should work in Russian 1000000000 long', () => {
        expect(numAbbr(1000000000, { locale: 'ru', length: 'long' })).toBe('1 миллиард');
    });
    test('should work in Russian 1000000000000 long', () => {
        expect(numAbbr(1000000000000, { locale: 'ru', length: 'long' })).toBe('1 триллион');
    });
    test('should work in Russian larger than max long', () => {
        expect(numAbbr(1000000000000000000, { locale: 'ru', length: 'long' })).toBe('1 000 000 триллионов');
    });
});
