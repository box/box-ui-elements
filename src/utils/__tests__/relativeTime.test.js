import timeFromNow from '../relativeTime';

const WEEK_IN_MS = 6.048e8;
const DAY_IN_MS = 8.64e7;
const HOUR_IN_MS = 3.6e6;
const MIN_IN_MS = 6e4;
const SEC_IN_MS = 1e3;
const YEAR_IN_MS = 3.154e10;

describe('timeFromNow function', () => {
    const originalDateNow = Date.now;
    const fixedDate = 1629133900000; // Fixed timestamp for testing.
    beforeAll(() => {
        Date.now = jest.fn(() => fixedDate);
    });

    afterAll(() => {
        Date.now = originalDateNow;
    });

    it('should return correct value and unit for time difference greater than a year', () => {
        const ms = fixedDate + YEAR_IN_MS * 4;
        expect(timeFromNow(ms)).toEqual({ value: 4, unit: 'year' });
    });

    it('should return correct value and unit for time difference greater than a week', () => {
        const ms = fixedDate + WEEK_IN_MS * 2;
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'week' });
    });

    it('should return correct value and unit for time difference greater than a day', () => {
        const ms = fixedDate + DAY_IN_MS * 2;
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'day' });
    });

    it('should return correct value and unit for time difference greater than an hour', () => {
        const ms = fixedDate + HOUR_IN_MS * 2;
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'hour' });
    });

    it('should return correct value and unit for time difference greater than a minute', () => {
        const ms = fixedDate + MIN_IN_MS * 2;
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'minute' });
    });

    it('should return correct value and unit for time difference greater than a second', () => {
        const ms = fixedDate + SEC_IN_MS * 2;
        expect(timeFromNow(ms)).toEqual({ value: 2, unit: 'second' });
    });

    it('should return correct negative difference', () => {
        const ms = fixedDate - DAY_IN_MS * 2;
        expect(timeFromNow(ms)).toEqual({ value: -2, unit: 'day' });
    });
});
